import { Elysia } from "elysia";
import { SelectExpression, sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import merge from "lodash.merge";
import uniq from "lodash.uniq";
import uniqBy from "lodash.uniqby";

import { db } from "../database/db";
import {
  checkEntityLevelPermission,
  getHasEntityPermission,
  getNestedReadPermission,
  getRandomTableOptionRelatedData,
  readDocument,
} from "../database/queries";
import { DBKeys } from "../database/types";
import {
  AutolinkerSchema,
  DocumentTemplateEntityTypes,
  FromTemplateSchema,
  GenerateDocumentSchema,
  InsertDocumentSchema,
  ListDocumentSchema,
  MentionsInDocumentSchema,
  ReadDocumentSchema,
  UpdateDocumentSchema,
} from "../database/validation/documents";
import { DocumentTemplateEntities, DocumentTemplateFieldEntitiesWithRelated } from "../enums";
import { MessageEnum } from "../enums/requestEnums";
import { noRoleAccessErrorHandler } from "../handlers";
import { EntitiesWithPermissionCheck, MentionType } from "../types/entityTypes";
import {
  PermissionDecorationType,
  ResponseSchema,
  ResponseWithDataSchema,
  SearchableMentionEntities,
} from "../types/requestTypes";
import { constructFilter, tagsRelationFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateEntityPermissions,
  CreateTagRelations,
  GetRelatedEntityPermissionsAndRoles,
  TagQuery,
  UpdateEntityPermissions,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";
import { getAutomentionFields } from "../utils/requestUtils";
import {
  buildTSQueryString,
  clamp,
  findObjectsByType,
  getCharacterFullName,
  getEntityWithOwnerId,
  getRandomTemplateCount,
  groupRelationFiltersByField,
  insertSenderToMessage,
} from "../utils/utils";

function getDocumentTemplateEntityFields(entity: typeof DocumentTemplateEntityTypes.static) {
  if (entity === "characters") return ["full_name as title"] as SelectExpression<DB, "characters">[];
  return [`${entity}.title`];
}

export function document_router(app: Elysia) {
  return app.group("/documents", (server) =>
    server
      .decorate("permissions", {
        user_id: "",
        project_id: null,
        is_project_owner: false,
        role_access: false,
        role_id: null,
        permission_id: null,
        all_permissions: {},
      } as PermissionDecorationType)
      .post(
        "/create",
        async ({ body, permissions }) => {
          const id = await db.transaction().execute(async (tx) => {
            const document = await tx
              .insertInto("documents")
              .values(getEntityWithOwnerId(body.data, permissions.user_id))
              .returning("id")
              .executeTakeFirstOrThrow();

            if (body.relations?.tags?.length) {
              const { tags } = body.relations;
              await CreateTagRelations({ tx, relationalTable: "_documentsTotags", id: document.id, tags });
            }
            if (body.permissions?.length) {
              await CreateEntityPermissions(tx, document.id, body.permissions);
            }
            return document.id;
          });

          return { data: { id }, message: `Document ${MessageEnum.successfully_created}`, ok: true, role_access: true };
        },
        {
          body: InsertDocumentSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/create/template",
        async ({ body, permissions }) => {
          await db.transaction().execute(async (tx) => {
            const formatted = body.data;
            formatted.is_template = true;
            const document = await tx
              .insertInto("documents")
              .values(getEntityWithOwnerId(formatted, permissions.user_id))
              .returning("id")
              .executeTakeFirstOrThrow();

            if (body.relations?.template_fields) {
              for (let index = 0; index < body.relations.template_fields.length; index++) {
                const field = body.relations.template_fields[index];
                const template_field = {
                  key: field.key,
                  value: field.value,
                  formula: field.formula,
                  derive_from: field.derive_from,
                  derive_formula: field.derive_formula,
                  is_randomized: field.is_randomized,
                  entity_type: field.entity_type,
                  sort: field.sort,
                  random_count: field.random_count,
                  parent_id: document.id,
                  blueprint_id: field.blueprint_id || null,
                  map_id: field.map_id || null,
                  calendar_id: field.calendar_id || null,
                  dictionary_id: field.dictionary_id || null,
                  additional_data: field.additional_data || null,
                };
                const new_field = await tx
                  .insertInto("document_template_fields")
                  .values(template_field)
                  .returning("id")
                  .executeTakeFirst();

                if (DocumentTemplateFieldEntitiesWithRelated.includes(template_field.entity_type)) {
                  const related = body.relations.template_fields[index].related.filter((r) => !!r);
                  if (related.length && new_field) {
                    await tx
                      .insertInto(
                        `document_template_fields_${
                          template_field.entity_type as
                            | "characters"
                            | "blueprint_instances"
                            | "documents"
                            | "maps"
                            | "map_pins"
                            | "graphs"
                            | "events"
                            | "words"
                            | "random_tables"
                        }`,
                      )
                      .values(related.map((related_id) => ({ related_id, field_id: new_field.id })))
                      .execute();
                  }
                }
              }
            }
            if (body.relations?.tags?.length) {
              const { tags } = body.relations;
              await CreateTagRelations({ tx, relationalTable: "_documentsTotags", id: document.id, tags });
            }
          });

          return { data: { id: "" }, message: `Document ${MessageEnum.successfully_created}`, ok: true, role_access: true };
        },
        {
          body: InsertDocumentSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/create/from_template/:id",
        async ({ body, permissions }) => {
          let content = JSON.stringify(body.data.content);

          // needs to be sent by the frontend
          // so that manual entry fields are
          // present
          const template = body;
          if (template?.data) {
            await db.transaction().execute(async (tx) => {
              for (let index = 0; index < (template?.relations?.template_fields?.length || 0); index += 1) {
                const field = template?.relations?.template_fields?.[index];
                // Generate randomized fields
                if (
                  (field.is_randomized || field.entity_type === "random_tables") &&
                  DocumentTemplateEntities.includes(field.entity_type)
                ) {
                  const max = getRandomTemplateCount(field.random_count || "single");
                  const limit = clamp(field?.related?.length || 0, max - (field?.related?.length || 0), max);

                  if (field.entity_type === "random_tables" && field?.related?.[0]) {
                    let query = tx
                      .selectFrom("random_tables")
                      .select([
                        (eb) => {
                          let rto_query = eb
                            .selectFrom("random_table_options")
                            .select(["random_table_options.title"])
                            .whereRef("random_table_options.parent_id", "=", "random_tables.id")
                            .limit(limit);

                          // @ts-expect-error changing the original type causes ts to complain
                          rto_query = getRandomTableOptionRelatedData(rto_query);

                          return jsonArrayFrom(rto_query).as("random_table_options");
                        },
                      ])
                      .where("random_tables.id", "=", field?.related?.[0]);

                    const related = await query.executeTakeFirstOrThrow();

                    if (related && related.random_table_options.length > 0) {
                      const result_string = related.random_table_options.map((r) => r.title).join(", ");
                      content = content.replaceAll(`%{${field.key}}%`, result_string);
                    }
                  } else if (limit > 0) {
                    let query = tx
                      .selectFrom(field.entity_type as DBKeys)
                      .select(getDocumentTemplateEntityFields(field.entity_type) as ["title"])
                      .orderBy((ob) => ob.fn("random"))
                      .limit(limit);

                    if (field?.related?.length) {
                      // @ts-ignore
                      query = query.where(`${field.entity_type as DBKeys}.id`, "not in", field?.related);
                    }

                    if (field.entity_type === "blueprint_instances" && field.blueprint_id)
                      // @ts-ignore
                      query = query
                        .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
                        .where("blueprints.project_id", "=", permissions.project_id)
                        .where("parent_id", "=", field.blueprint_id);
                    else if (field.entity_type === "events" && field.calendar_id)
                      // @ts-ignore
                      query = query
                        .leftJoin("calendars", "calendars.id", "events.parent_id")
                        .where("calendars.project_id", "=", permissions.project_id)
                        .where("calendars.id", "=", field.calendar_id);
                    else if (field.entity_type === "map_pins" && field.map_id)
                      // @ts-ignore
                      query = query
                        .leftJoin("maps", "maps.id", "map_pins.parent_id")
                        .where("maps.project_id", "=", permissions.project_id)
                        .where("maps.id", "=", field.map_id)
                        .where("map_pins.title", "is not", null);
                    else if (field.entity_type === "words" && field.dictionary_id)
                      // @ts-ignore
                      query = query
                        .leftJoin("dictionaries", "dictionaries.id", "words.parent_id")
                        .where("dictionaries.project_id", "=", permissions.project_id)
                        .where("dictionaries.id", "=", field.dictionary_id);
                    else {
                      query = query.where("project_id", "=", permissions.project_id);
                    }

                    const result = await query.execute();

                    const preselectedResults = field?.related?.length
                      ? await tx
                          .selectFrom(field.entity_type as DBKeys)
                          .select(getDocumentTemplateEntityFields(field.entity_type) as ["title"])
                          .where("id", "in", field.related)
                          .execute()
                      : [];

                    if (result && result.length > 0) {
                      const result_string = result.map((r) => r.title).join(", ");
                      const preselected_result_string = preselectedResults.map((r) => r.title).join(", ");

                      content = content.replaceAll(
                        `%{${field.key}}%`,
                        `${preselected_result_string.length ? `${preselected_result_string}, ` : ""}${result_string}`,
                      );
                    }
                  }
                }

                // Generate non-randomized fields
                else if (!field.is_randomized) {
                  if (DocumentTemplateFieldEntitiesWithRelated.includes(field.entity_type) && field?.related?.length) {
                    let query = tx
                      .selectFrom(field.entity_type as DBKeys)
                      .select(getDocumentTemplateEntityFields(field.entity_type) as ["title"])
                      .where("id", "in", field.related);

                    const result = await query.execute();

                    if (result && result.length > 0) {
                      const result_string = result.map((r) => r.title).join(", ");
                      content = content.replaceAll(`%{${field.key}}%`, result_string);
                    }
                  } else if (DocumentTemplateFieldEntitiesWithRelated.includes(field.entity_type) && !!field.value) {
                    content = content.replaceAll(`%{${field.key}}%`, field.value);
                  }
                }
              }
            });

            try {
              const data = {
                title: body.data.title,
                content: JSON.parse(content),
                owner_id: permissions.user_id,
                project_id: permissions.project_id as string,
              };
              return { data, message: "Document successfully generated.", ok: true, role_access: true };
            } catch (error) {
              console.error("COULD NOT GENERATE TEMPLATE - ERROR: ", error);
              return { data: {}, message: "Document could not be generated.", ok: false, role_access: true };
            }
          }
          return { data: {}, message: "Document could not be generated.", ok: false, role_access: true };
        },
        {
          body: FromTemplateSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/",
        async ({ body, permissions }) => {
          let query = db
            .selectFrom("documents")
            .select(body.fields.map((f) => `documents.${f}`) as SelectExpression<DB, "documents">[])
            .distinctOn(
              body.orderBy?.length ? (["documents.id", ...body.orderBy.map((order) => order.field)] as any) : "documents.id",
            )
            .where("documents.project_id", "=", permissions?.project_id)
            .where("documents.deleted_at", body.arkived ? "is not" : "is", null)
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10));

          if (!!body?.filters?.and?.length || !!body?.filters?.or?.length) {
            query = constructFilter("documents", query, body.filters);
          }

          if (!!body.relationFilters?.and?.length || !!body.relationFilters?.or?.length) {
            const { tags } = groupRelationFiltersByField(body.relationFilters || {});

            if (tags?.filters?.length)
              query = tagsRelationFilter("documents", "_documentsTotags", query, tags?.filters || [], false);
          }

          if (body?.relations?.tags && permissions.all_permissions?.read_tags) {
            query = query.select((eb) =>
              TagQuery(eb, "_documentsTotags", "documents", permissions.is_project_owner, permissions.user_id),
            );
          }
          if (body.orderBy) {
            query = constructOrdering(body.orderBy, query);
          }
          if (body?.relations?.image) {
            query = query.select((eb) => {
              let image_query = eb
                .selectFrom("images")
                .select(["images.id", "images.title"])
                .whereRef("images.id", "=", "documents.image_id");
              image_query = getNestedReadPermission(
                image_query,
                permissions.is_project_owner,
                permissions.user_id,
                "documents.image_id",
                "read_assets",
              );

              return jsonObjectFrom(image_query).as("image");
            });
          }
          if (!permissions.is_project_owner) {
            query = checkEntityLevelPermission(query, permissions, "documents");
          }
          if (!!body.permissions && !permissions.is_project_owner) {
            query = GetRelatedEntityPermissionsAndRoles(query, permissions, "documents");
          }

          const data = await query.execute();
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ListDocumentSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post("/:id", async ({ params, body, permissions }) => readDocument(body, params, permissions, false), {
        body: ReadDocumentSchema,
        response: ResponseWithDataSchema,
      })
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
                  is_project_owner: permissions.is_project_owner,
                });
              }

              if (body.relations?.template_fields) {
                await tx
                  .deleteFrom("document_template_fields")
                  .where(
                    "id",
                    "in",
                    body.relations.template_fields.map((f) => f.id),
                  )
                  .execute();

                for (let index = 0; index < body.relations.template_fields.length; index++) {
                  const field = body.relations.template_fields[index];
                  const template_field = {
                    id: field.id,
                    key: field.key,
                    value: field.value,
                    formula: field.formula,
                    derive_from: field.derive_from,
                    derive_formula: field.derive_formula,
                    is_randomized: field.is_randomized,
                    entity_type: field.entity_type,
                    parent_id: params.id,
                    sort: field.sort,
                    random_count: field.random_count,
                    blueprint_id: field.blueprint_id || null,
                    map_id: field.map_id || null,
                    calendar_id: field.calendar_id || null,
                    dictionary_id: field.dictionary_id || null,
                    additional_data: field.additional_data || null,
                  };
                  const new_field = await tx
                    .insertInto("document_template_fields")
                    .values(template_field)
                    .returning("id")
                    .executeTakeFirst();

                  if (DocumentTemplateFieldEntitiesWithRelated.includes(template_field.entity_type)) {
                    const related = body.relations.template_fields[index].related.filter((r) => !!r);
                    if (related.length && new_field) {
                      await tx
                        .insertInto(
                          `document_template_fields_${
                            template_field.entity_type as
                              | "characters"
                              | "blueprint_instances"
                              | "documents"
                              | "maps"
                              | "map_pins"
                              | "graphs"
                              | "events"
                              | "words"
                              | "random_tables"
                          }`,
                        )
                        .values(related.map((related_id) => ({ related_id, field_id: new_field.id })))
                        .execute();
                    }
                  }
                }
              }
              if (body?.data?.content) {
                const mentions = findObjectsByType(body.data.content, "mentionAtom");
                const uniqueMentionIds = uniq(mentions.map((mention: MentionType) => mention?.attrs?.id).filter((id) => !!id));
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
                    await tx.deleteFrom("document_mentions").where("document_mentions.mention_id", "in", idsToDelete).execute();

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
                      .onConflict((oc) => oc.columns(["parent_document_id", "mention_id"]).doNothing())
                      .execute();
                } else {
                  await tx
                    .deleteFrom("document_mentions")
                    .where("document_mentions.parent_document_id", "=", params.id)
                    .execute();
                }
              }
              if (body?.permissions) {
                await UpdateEntityPermissions(tx, params.id, body.permissions);
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
        },
      )
      .post(
        "/generate_from/:type",
        async ({ params, body, permissions }) => {
          if (body.data.content) {
            const { id } = await db
              .insertInto("documents")
              .values(getEntityWithOwnerId(body.data, permissions.user_id))
              .returning("id")
              .executeTakeFirstOrThrow();
            return { data: { id }, message: `Document ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          }
          if (params.type === "conversations" && body.data.parent_id && permissions.project_id) {
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
                        projectId: permissions.project_id,
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
              .values({ title: body.data.title, project_id: permissions.project_id, content, owner_id: permissions.user_id })
              .returning("id")
              .executeTakeFirstOrThrow();
            return { data: { id }, message: `Document ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          }
          return { data: [], ok: false, message: "error", role_access: true };
        },
        {
          body: GenerateDocumentSchema,
          response: ResponseWithDataSchema,
        },
      )

      .post(
        "/automention",
        async ({ body, permissions }) => {
          const splitWords = uniq(`${body.data.text}`.split(" ")).filter(
            (word) => !!word && word.length > 1 && !["the", "a", "an", "and", "or", "of", "in", "out", "at"].includes(word),
          );
          const string = buildTSQueryString(splitWords);
          if (!string)
            return {
              data: [],
              ok: true,
              role_access: true,
              message: MessageEnum.success,
            };

          const formattedString = `(${string}) ${body.data.ignore ? `& ! '${body.data.ignore}'` : ""}`;
          const fields = getAutomentionFields(body.data.type);
          let query = db
            .selectFrom(body.data.type)
            // BPI fields need to be formatted in the getAutomentionFields fn due to using the blueprints icon
            // @ts-ignore
            .select(body.data.type === "blueprint_instances" ? fields : fields.map((f) => `${body.data.type}.${f}`));

          if (body.data.type === "map_pins") {
            query = query
              .leftJoin("maps", "maps.id", "map_pins.parent_id")
              .where("maps.project_id", "=", permissions.project_id);
          } else if (body.data.type === "words") {
            query = query
              .leftJoin("dictionaries", "dictionaries.id", "words.parent_id")
              .where("dictionaries.project_id", "=", permissions.project_id);
          } else if (body.data.type === "events") {
            query = query
              .leftJoin("calendars", "calendars.id", "events.parent_id")
              .where("calendars.project_id", "=", permissions.project_id);
          } else if (body.data.type === "blueprint_instances") {
            query = query
              .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
              .where("blueprints.project_id", "=", permissions.project_id);
            // BPI have permissions
            query = checkEntityLevelPermission(query, permissions, body.data.type as EntitiesWithPermissionCheck);
          }
          // If it is not one of these entities add project_id WHERE clause
          else {
            query = query.where("project_id", "=", permissions.project_id);
            query = checkEntityLevelPermission(query, permissions, body.data.type as EntitiesWithPermissionCheck);
          }

          if (body.data.type === "characters") {
            query = query.where(
              sql`to_tsvector('english', characters.full_name)`,
              "@@",
              sql<string>`to_tsquery(${sql.lit("english")}, ${formattedString})`,
            );
            const data = await query.execute();

            return { data, message: MessageEnum.success, ok: true, role_access: true };
          } else {
            const res = await query
              .where(
                sql`to_tsvector('english', ${sql.ref(`${body.data.type}.title`)})`,
                "@@",
                sql<string>`to_tsquery(${sql.lit("english")}, ${formattedString})`,
              )
              .execute();

            return { data: res, message: MessageEnum.success, ok: true, role_access: true };
          }
        },
        {
          body: AutolinkerSchema,
          response: ResponseWithDataSchema,
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
                .$if(!permissions.is_project_owner, (qb) => {
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
            .$if(!permissions.is_project_owner, (qb) => {
              return checkEntityLevelPermission(qb, permissions, "documents");
            })
            .execute();

          const edges = nodes.map((d) => ({ source_id: params.id, target_id: d.id }));

          return {
            data: { nodes, edges },
            message: MessageEnum.success,
            ok: true,
            role_access: true,
          };
        },
        {
          response: ResponseWithDataSchema,
        },
      )
      .get(
        "/mentions/:project_id",
        async ({ params, permissions }) => {
          const { project_id } = params;

          const nodes = await db
            .selectFrom("documents")
            .where("project_id", "=", project_id)
            .$if(!permissions.is_project_owner, (qb) => {
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
        },
      )
      .delete(
        "/arkive/:id",
        async ({ params, permissions }) => {
          const permissionCheck = await getHasEntityPermission("documents", params.id, permissions);

          if (permissionCheck) {
            await db
              .updateTable("documents")
              .where("documents.id", "=", params.id)
              .set({ deleted_at: new Date().toUTCString(), is_public: false })
              .execute();

            return { message: `Document ${MessageEnum.successfully_arkived}.`, ok: true, role_access: true };
          } else {
            noRoleAccessErrorHandler();
            return { message: "", ok: false, role_access: false };
          }
        },
        {
          response: ResponseSchema,
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
              .where("documents.deleted_at", "is not", null)
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
        },
      ),
  );
}
