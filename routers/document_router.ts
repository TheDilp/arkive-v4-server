import Elysia from "elysia";
import { SelectExpression, SelectQueryBuilder, sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import merge from "lodash.merge";
import uniq from "lodash.uniq";
import uniqBy from "lodash.uniqby";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission } from "../database/queries";
import { EntitiesWithChildren } from "../database/types";
import {
  AutolinkerSchema,
  FromTemplateSchema,
  GenerateDocumentSchema,
  InsertDocumentSchema,
  ListDocumentSchema,
  MentionsInDocumentSchema,
  ReadDocumentSchema,
  UpdateDocumentSchema,
} from "../database/validation/documents";
import { MessageEnum } from "../enums/requestEnums";
import { beforeRoleHandler, noRoleAccessErrorHandler } from "../handlers";
import { EntitiesWithPermissionCheck, MentionType } from "../types/entityTypes";
import {
  PermissionDecorationType,
  ResponseSchema,
  ResponseWithDataSchema,
  SearchableMentionEntities,
} from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateEntityPermissions,
  CreateTagRelations,
  GetEntityChildren,
  GetParents,
  GetRelationsForUpdating,
  TagQuery,
  UpdateEntityPermissions,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";
import {
  findObjectsByType,
  getCharacterFullName,
  getEntitiesWithOwnerId,
  getEntityWithOwnerId,
  insertSenderToMessage,
} from "../utils/transform";

function getAutoLinkerFields(
  type: "characters" | "documents" | "blueprint_instances" | "maps" | "map_pins" | "graphs" | "words",
) {
  if (type === "characters") return ["id", "full_name as title", "portrait_id as image_id"] as const;
  if (type === "blueprint_instances")
    return ["blueprint_instances.id", "blueprint_instances.title", "blueprint_instances.parent_id", "blueprints.icon"] as const;
  if (type === "maps" || type === "graphs") return ["id", "title"] as const;
  if (type === "words") return ["id", "title", "parent_id"] as const;
  return ["id", "title", "image_id"] as const;
}

export function document_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_owner: false,
      role_access: false,
      user_id: "",
      role_id: null,
      permission_id: null,
    } as PermissionDecorationType)
    .group("/documents", (server) =>
      server
        .post(
          "/create",
          async ({ body }) => {
            await db.transaction().execute(async (tx) => {
              const document = await tx.insertInto("documents").values(body.data).returning("id").executeTakeFirstOrThrow();

              if (body.relations?.alter_names?.length) {
                const { alter_names } = body.relations;
                await tx
                  .insertInto("alter_names")
                  .values(
                    alter_names.map((alter_name) => ({
                      title: alter_name.title,
                      project_id: body.data.project_id,
                      parent_id: document.id,
                    })),
                  )
                  .execute();
              }
              if (body.relations?.tags?.length) {
                const { tags } = body.relations;
                await CreateTagRelations({ tx, relationalTable: "_documentsTotags", id: document.id, tags });
              }
              if (body.permissions?.length) {
                await CreateEntityPermissions(tx, document.id, "document_permissions", body.permissions);
              }
            });

            return { message: `Document ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          },
          {
            body: InsertDocumentSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "create_documents"),
          },
        )
        .post(
          "/create/template",
          async ({ body }) => {
            await db.transaction().execute(async (tx) => {
              const formatted = body.data;
              formatted.is_template = true;
              const document = await tx.insertInto("documents").values(formatted).returning("id").executeTakeFirstOrThrow();

              if (body.relations?.alter_names?.length) {
                const { alter_names } = body.relations;
                await tx
                  .insertInto("alter_names")
                  .values(
                    alter_names.map((alter_name) => ({
                      title: alter_name.title,
                      project_id: body.data.project_id,
                      parent_id: document.id,
                    })),
                  )
                  .execute();
              }
              if (body.relations?.tags?.length) {
                const { tags } = body.relations;
                await CreateTagRelations({ tx, relationalTable: "_documentsTotags", id: document.id, tags });
              }
            });

            return { message: `Document ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          },
          {
            body: InsertDocumentSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "create_documents"),
          },
        )
        .post(
          "/create/from_template/:id",
          async ({ params, body, permissions }) => {
            await db.transaction().execute(async (tx) => {
              const document = await tx
                .selectFrom("documents")
                .select([
                  "title",
                  "content",
                  "icon",
                  "image_id",
                  "dice_color",
                  "project_id",
                  (eb) =>
                    jsonArrayFrom(
                      eb.selectFrom("_documentsTotags").where("A", "=", params.id).select(["_documentsTotags.B"]),
                    ).as("tags"),
                ])
                .where("id", "=", params.id)
                .executeTakeFirstOrThrow();

              const newDocuments = [];

              for (let index = 0; index < body.data.count; index++) {
                newDocuments.push({
                  title: body.data?.titles?.[index] || document.title,
                  content: document.content as any,
                  icon: document.icon,
                  image_id: document.image_id,
                  dice_color: document.dice_color,
                  project_id: document.project_id,
                });
              }

              const createdDocuments = await tx
                .insertInto("documents")
                .values(getEntitiesWithOwnerId(newDocuments, permissions.user_id))
                .returning("id")
                .execute();

              if (document.tags.length) {
                const newDocToTags = document.tags.flatMap((t) => createdDocuments.map((cd) => ({ A: cd.id, B: t.B })));
                await tx.insertInto("_documentsTotags").values(newDocToTags).execute();
              }
            });

            return { message: `Document ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          },
          {
            body: FromTemplateSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "create_documents"),
          },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            const data = await db
              .selectFrom("documents")
              .where("documents.project_id", "=", body?.data?.project_id)
              .limit(body?.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
              .$if(!permissions.is_owner, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "documents");
              })
              .$if(!body?.fields?.length, (qb) => qb.selectAll())
              .$if(!!body?.fields?.length, (qb) =>
                qb.clearSelect().select(body.fields.map((f) => `documents.${f}`) as SelectExpression<DB, "documents">[]),
              )
              .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
                qb = constructFilter("documents", qb, body.filters);
                return qb;
              })
              .$if(!!body.relations?.tags, (qb) => {
                if (body?.relations?.tags) {
                  return qb.select((eb) => TagQuery(eb, "_documentsTotags", "documents"));
                }
                return qb;
              })
              .$if(!!body.orderBy, (qb) => constructOrdering(body.orderBy, qb))

              .execute();
            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ListDocumentSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_documents"),
          },
        )
        .post(
          "/:id",
          async ({ params, body, permissions }) => {
            const data = await db
              .selectFrom("documents")
              .$if(!body.fields?.length, (qb) => qb.selectAll())
              .$if(!!body.fields?.length, (qb) =>
                qb.clearSelect().select(body.fields.map((f) => `documents.${f}`) as SelectExpression<DB, "documents">[]),
              )
              .$if(!permissions.is_owner, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "documents", params.id);
              })
              .where("documents.id", "=", params.id)
              .$if(!!body?.relations, (qb) => {
                if (body?.relations?.tags) {
                  qb = qb.select((eb) => TagQuery(eb, "_documentsTotags", "documents"));
                }
                if (body?.relations?.alter_names) {
                  qb = qb.select((eb) => {
                    return jsonArrayFrom(
                      eb
                        .selectFrom("alter_names")
                        .select(["alter_names.id", "alter_names.title"])
                        .where("parent_id", "=", params.id),
                    ).as("alter_names");
                  });
                }

                return qb;
              })
              .$if(!!body.permissions, (qb) => {
                qb = qb.select([
                  (eb) =>
                    jsonArrayFrom(
                      eb
                        .selectFrom("document_permissions")
                        .leftJoin("permissions", "permissions.id", "document_permissions.permission_id")
                        .select([
                          "document_permissions.id",
                          "document_permissions.permission_id",
                          "document_permissions.related_id",
                          "document_permissions.role_id",
                          "document_permissions.user_id",
                          "permissions.code",
                        ])
                        .where("related_id", "=", params.id),
                    ).as("permissions"),
                ]);
                return qb;
              })
              .$if(!!body?.relations?.children, (qb) =>
                GetEntityChildren(qb as SelectQueryBuilder<DB, EntitiesWithChildren, {}>, "documents"),
              )
              .executeTakeFirstOrThrow();

            if (body?.relations?.parents) {
              const parents = await GetParents({ db, id: params.id, table_name: "documents" });
              data.parents = parents;
              return { data, message: MessageEnum.success, ok: true, role_access: true };
            }
            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: ReadDocumentSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_documents"),
          },
        )
        .post(
          "/update/:id",
          async ({ params, body, permissions }) => {
            const permissionCheck = await getHasEntityPermission("documents", params.id, permissions);
            if (permissionCheck) {
              await db.transaction().execute(async (tx) => {
                if (body.data) await tx.updateTable("documents").where("documents.id", "=", params.id).set(body.data).execute();
                if (body.relations?.tags) {
                  await UpdateTagRelations({
                    relationalTable: "_documentsTotags",
                    id: params.id,
                    newTags: body.relations.tags,
                    tx,
                  });
                }
                if (body.relations?.alter_names) {
                  const existingAlterNames = await tx
                    .selectFrom("alter_names")
                    .select(["id", "title"])
                    .where("parent_id", "=", params.id)
                    .execute();

                  const existingIds = existingAlterNames.map((field) => field.id);

                  const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
                    existingIds,
                    body.relations?.alter_names,
                  );
                  if (idsToRemove.length) {
                    await tx.deleteFrom("alter_names").where("id", "in", idsToRemove).execute();
                  }
                  if (itemsToAdd.length) {
                    await tx
                      .insertInto("alter_names")
                      .values(
                        itemsToAdd.map((item) => ({
                          project_id: item.project_id,
                          parent_id: params.id,
                          title: item.title,
                        })),
                      )
                      .execute();
                  }
                  if (itemsToUpdate.length) {
                    await Promise.all(
                      itemsToUpdate.map(async (item) =>
                        tx
                          .updateTable("alter_names")
                          .where("parent_id", "=", params.id)
                          .where("id", "=", item.id)
                          .set({ title: item.title })
                          .execute(),
                      ),
                    );
                  }
                }
                if (body?.data?.content) {
                  const mentions = findObjectsByType(body.data.content, "mentionAtom");
                  const uniqueMentionIds = uniq(
                    mentions.map((mention: MentionType) => mention?.attrs?.id).filter((id) => !!id),
                  );
                  if (uniqueMentionIds.length) {
                    const existingMentions = await tx
                      .selectFrom("document_mentions")
                      .where("document_mentions.parent_document_id", "=", params.id)
                      .select(["document_mentions.mention_id"])
                      .execute();

                    const existingMentionIds = existingMentions.map((item) => item.mention_id);

                    const idsToDelete = existingMentionIds.filter((id) => !uniqueMentionIds.includes(id));
                    const mentionsToInsert = uniqBy(
                      mentions.filter((m) => uniqueMentionIds.includes(m.attrs.id)),
                      "attrs.id",
                    );

                    if (idsToDelete.length)
                      await tx
                        .deleteFrom("document_mentions")
                        .where("document_mentions.mention_id", "in", idsToDelete)
                        .execute();

                    if (mentionsToInsert.length)
                      await tx
                        .insertInto("document_mentions")
                        .values(
                          mentionsToInsert.map((mention) => ({
                            parent_document_id: params.id,
                            mention_id: mention.attrs.id,
                            mention_type: mention.attrs.name,
                          })),
                        )
                        .execute();
                  } else {
                    await tx
                      .deleteFrom("document_mentions")
                      .where("document_mentions.parent_document_id", "=", params.id)
                      .execute();
                  }
                }
                if (body?.permissions) {
                  await UpdateEntityPermissions(tx, params.id, "document_permissions", body.permissions);
                }
              });
              return { message: `Document ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
            } else {
              noRoleAccessErrorHandler();
              return { message: "", ok: false, role_access: false };
            }
          },
          {
            body: UpdateDocumentSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "update_documents"),
          },
        )
        .post(
          "/generate/:type",
          async ({ params, body, permissions }) => {
            if (body.data.content) {
              const { id } = await db
                .insertInto("documents")
                .values(getEntityWithOwnerId(body.data, permissions.user_id))
                .returning("id")
                .executeTakeFirstOrThrow();
              return { data: { id }, message: `Document ${MessageEnum.successfully_created}`, ok: true, role_access: true };
            }
            if (params.type === "conversations" && body.data.parent_id) {
              const messages = await db
                .selectFrom("messages")
                .leftJoin("characters", "characters.id", "messages.sender_id")
                .where("parent_id", "=", body.data.parent_id)
                .select(["content", "sender_id", "characters.first_name", "characters.last_name"])
                .execute();
              const mergedContent = merge(
                messages
                  .flatMap((msg) => {
                    // @ts-ignore
                    const c = msg.content?.content;
                    if (msg.sender_id && msg.first_name && c) {
                      insertSenderToMessage(msg?.content as any, {
                        type: "mentionAtom",
                        attrs: {
                          id: msg.sender_id,
                          name: "characters",
                          label: getCharacterFullName(msg.first_name, undefined, msg.last_name),
                          alterId: null,
                          projectId: body.data.project_id,
                        },
                      });
                    }

                    return c;
                  })

                  .filter((content) => !!content),
              );
              const content = JSON.stringify({ type: "doc", content: mergedContent });

              const { id } = await db
                .insertInto("documents")
                .values({ title: body.data.title, project_id: body.data.project_id, content, owner_id: permissions.user_id })
                .returning("id")
                .executeTakeFirstOrThrow();
              return { data: { id }, message: `Document ${MessageEnum.successfully_created}`, ok: true, role_access: true };
            }
            return { data: [], ok: false, message: "error", role_access: true };
          },
          {
            body: GenerateDocumentSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "create_documents"),
          },
        )
        .post(
          "/autolink",
          async ({ body, permissions }) => {
            const splitWords = uniq(`${body.data.text}`.split(" ")).filter(
              (word) => !!word && word.length > 1 && !["the", "a", "an", "and", "or", "of", "in", "out", "at"].includes(word),
            );

            const string = splitWords.join(" | ");

            const formattedString = `(${string}) ${body.data.ignore ? `& ! '${body.data.ignore}'` : ""}`;
            const fields = getAutoLinkerFields(body.data.type);
            const res = await db
              .selectFrom(body.data.type)
              .$if(body.data.type === "map_pins", (qb) => {
                if (body.data.type === "map_pins") {
                  qb.leftJoin("maps", "maps.id", "map_pins.parent_id")
                    .clearWhere()
                    .where("maps.project_id", "=", body.data.project_id);
                }
                return qb;
              })
              .$if(body.data.type === "blueprint_instances", (qb) => {
                if (body.data.type === "blueprint_instances") {
                  // @ts-ignore
                  qb = qb
                    .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
                    .clearWhere()
                    .where("blueprints.project_id", "=", body.data.project_id);
                }
                return qb;
              })
              .$if(body.data.type === "words", (qb) => {
                if (body.data.type === "words") {
                  qb.leftJoin("dictionaries", "dictionaries.id", "words.parent_id")
                    .clearWhere()
                    .where("dictionaries.project_id", "=", body.data.project_id);
                }
                return qb;
              })
              .$if(!["blueprint_instances", "words", "map_pins"].includes(body.data.type), (qb) => {
                qb = qb.where("project_id", "=", body.data.project_id);
                return checkEntityLevelPermission(qb, permissions, body.data.type as EntitiesWithPermissionCheck);
              })
              .where("ts", "@@", sql<string>`to_tsquery(${sql.lit("english")}, ${formattedString})`)
              // @ts-ignore
              .select(fields.map((f) => `${body.data.type}.${f}`))
              .execute();

            return { data: res, message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: AutolinkerSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "update_documents"),
          },
        )
        .post(
          "/mentions_in_document",
          async ({ body, permissions }) => {
            const res = await Promise.all(
              Object.entries(body.data.mentions).map(async ([type, mentions]) =>
                db
                  .selectFrom(type as SearchableMentionEntities)
                  .select(
                    // @ts-ignore
                    type === "characters"
                      ? ["characters.id", "full_name as title", "portrait_id as image_id"]
                      : [`${type as EntitiesWithPermissionCheck}.id`, "title"],
                  )
                  .where(
                    // @ts-ignore
                    `${type}.id`,
                    "in",
                    mentions.map((m) => m.id),
                  )
                  .$if(!permissions.is_owner, (qb) => {
                    return checkEntityLevelPermission(qb, permissions, type as EntitiesWithPermissionCheck);
                  })
                  .execute(),
              ),
            );
            return { data: Object.values(res).flatMap((m) => m), message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: MentionsInDocumentSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_documents"),
          },
        )
        .get(
          "/mentioned_in/:id",
          async ({ params, permissions }) => {
            const nodes = await db
              .selectFrom("document_mentions")
              .distinctOn("document_mentions.parent_document_id")
              .leftJoin("documents", "documents.id", "document_mentions.parent_document_id")
              .select(["documents.id", "documents.title", "documents.icon"])
              .where("mention_id", "=", params.id)
              .$if(!permissions.is_owner, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "documents");
              })
              .execute();

            const edges = nodes.map((d) => ({ source_id: d.id, target_id: params.id }));

            return {
              data: { nodes, edges },
              message: MessageEnum.success,
              ok: true,
              role_access: true,
            };
          },
          {
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_documents"),
          },
        )
        .get(
          "/mentions/:project_id",
          async ({ params, permissions }) => {
            const { project_id } = params;

            const nodes = await db
              .selectFrom("documents")
              .where("project_id", "=", project_id)
              .$if(!permissions.is_owner, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "documents");
              })

              .select(["documents.id", "documents.title", "documents.icon"])
              .execute();
            const nodeIds = nodes.map((n) => n.id);

            const edges = await db
              .selectFrom("document_mentions")
              .select(["document_mentions.parent_document_id as source_id", "document_mentions.mention_id as target_id"])
              .where("document_mentions.parent_document_id", "in", nodeIds)
              .where("document_mentions.mention_id", "in", nodeIds)
              .execute();

            return {
              data: { nodes, edges },
              message: MessageEnum.success,
              ok: true,
              role_access: true,
            };
          },
          {
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "read_documents"),
          },
        )
        .delete(
          "/:id",
          async ({ params, permissions }) => {
            const permissionCheck = await getHasEntityPermission("documents", params.id, permissions);
            if (permissionCheck) {
              const data = await db
                .deleteFrom("documents")
                .where("documents.id", "=", params.id)
                .returning(["id", "title", "project_id"])
                .executeTakeFirstOrThrow();

              return { data, message: `Document ${MessageEnum.successfully_deleted}.`, ok: true, role_access: true };
            } else {
              noRoleAccessErrorHandler();
              return { data: {}, message: "", ok: false, role_access: false };
            }
          },
          {
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "delete_documents"),
          },
        ),
    );
}
