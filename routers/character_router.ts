import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import {
  checkEntityLevelPermission,
  createCharacter,
  getCharacterFamily,
  getHasEntityPermission,
  getNestedReadPermission,
  readCharacter,
  updateCharacter,
} from "../database/queries";
import { InsertCharacterSchema, ListCharacterSchema, ReadCharacterSchema, UpdateCharacterSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { noRoleAccessErrorHandler } from "../handlers/roleHandler";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import {
  characterRelationFilter,
  characterResourceFilter,
  characterValueFilter,
  constructFilter,
  tagsRelationFilter,
} from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { GetRelatedEntityPermissionsAndRoles, TagQuery } from "../utils/relationalQueryHelpers";
import { groupCharacterResourceFiltersByField, groupRelationFiltersByField } from "../utils/utils";

export function character_router(app: Elysia) {
  return app
    .decorate("permissions", {
      user_id: "",
      project_id: null,
      is_project_owner: false,
      role_access: false,
      role_id: null,
      permission_id: null,
      all_permissions: {},
    } as PermissionDecorationType)
    .group("/characters", (server) =>
      server
        .post("/create", createCharacter, {
          body: InsertCharacterSchema,
          response: ResponseWithDataSchema,
        })

        .post(
          "/",
          async ({ body, permissions }) => {
            const result = db
              .selectFrom("characters")
              .select(body.fields.map((field) => `characters.${field}`) as SelectExpression<DB, "characters">[])
              .distinctOn(
                body.orderBy?.length
                  ? (["characters.id", ...body.orderBy.map((order) => order.field)] as any)
                  : "characters.id",
              )
              .where("characters.project_id", "=", permissions?.project_id)
              .where("characters.deleted_at", body.arkived ? "is not" : "is", null)
              .limit(body?.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
              .$if(!permissions.is_project_owner, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "characters");
              })
              .$if(!!body.permissions && !permissions.is_project_owner, (qb) =>
                GetRelatedEntityPermissionsAndRoles(qb, permissions, "characters"),
              )
              .$if(!!body.relationFilters?.and?.length || !!body.relationFilters?.or?.length, (qb) => {
                const { characters, blueprint_instances, documents, map_pins, events, tags, value } =
                  groupRelationFiltersByField(body.relationFilters || { and: [], or: [] });

                const {
                  documents: resourceDocuments,
                  maps: resourceMaps,
                  events: resourceEvents,
                  tags: resourceTags,
                  images,
                } = groupCharacterResourceFiltersByField(body.relationFilters || { and: [], or: [] });
                if (tags?.filters?.length || resourceTags?.filters?.length)
                  qb = tagsRelationFilter(
                    "characters",
                    "_charactersTotags",
                    qb,
                    tags?.filters || resourceTags?.filters || [],
                    body?.relations?.is_favorite || false,
                  );
                if (resourceDocuments?.filters?.length)
                  qb = characterResourceFilter("_charactersTodocuments", qb, resourceDocuments?.filters || []);
                if (images?.filters?.length) qb = characterResourceFilter("_charactersToimages", qb, images?.filters || []);
                if (resourceEvents?.filters?.length)
                  qb = characterResourceFilter("event_characters", qb, resourceEvents?.filters || []);
                if (resourceMaps?.filters?.length) qb = characterResourceFilter("maps", qb, resourceMaps?.filters || []);
                if (characters?.filters?.length)
                  qb = characterRelationFilter("character_characters_fields", qb, characters?.filters || []);
                if (documents?.filters?.length)
                  qb = characterRelationFilter("character_documents_fields", qb, documents?.filters || []);
                if (map_pins?.filters?.length)
                  qb = characterRelationFilter("character_locations_fields", qb, map_pins?.filters || []);
                if (blueprint_instances?.filters?.length)
                  qb = characterRelationFilter("character_blueprint_instance_fields", qb, blueprint_instances?.filters || []);
                if (events?.filters?.length) qb = characterRelationFilter("character_events_fields", qb, events?.filters || []);
                if (value?.filters?.length) qb = characterValueFilter(qb, value.filters);

                return qb;
              })
              .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
                qb = constructFilter("characters", qb, body.filters);
                return qb;
              })
              .$if(!!body.orderBy?.length, (qb) => constructOrdering(body.orderBy, qb))
              .$if(!!body?.relations, (qb) => {
                if (body?.relations?.is_favorite) {
                  qb = qb
                    .leftJoin("favorite_characters", (join) =>
                      join.on((jb) =>
                        jb.and([
                          jb("favorite_characters.user_id", "=", permissions.user_id),
                          jb("favorite_characters.character_id", "=", jb.ref("characters.id")),
                        ]),
                      ),
                    )
                    .select(["is_favorite"]);
                }
                if (body?.relations?.portrait) {
                  qb = qb.select((eb) => {
                    let portrait_query = eb
                      .selectFrom("images")
                      .whereRef("images.id", "=", "characters.portrait_id")
                      .select(["images.id", "images.title"]);

                    if (!permissions.is_project_owner) {
                      portrait_query = getNestedReadPermission(
                        portrait_query,
                        permissions.is_project_owner,
                        permissions.user_id,
                        "characters.portrait_id",
                        "read_assets",
                      );
                    }
                    return jsonObjectFrom(portrait_query).as("portrait");
                  });
                }

                if (body?.relations?.tags) {
                  qb = qb.select((eb) =>
                    TagQuery(eb, "_charactersTotags", "characters", permissions.is_project_owner, permissions.user_id),
                  );
                }
                return qb;
              });
            const data = await result.execute();

            return {
              data,
              message: MessageEnum.success,
              ok: true,
              role_access: true,
            };
          },
          {
            body: ListCharacterSchema,
            response: ResponseWithDataSchema,
          },
        )
        .post("/:id", async ({ params, body, permissions }) => readCharacter(body, params, permissions, false), {
          body: ReadCharacterSchema,
          response: ResponseWithDataSchema,
        })
        .get(
          "/family/:relation_type_id/:id/:count",
          async ({ params, permissions }) => {
            return getCharacterFamily(params, permissions, false);
          },
          {
            response: ResponseWithDataSchema,
          },
        )
        .post(
          "/update/:id",
          async ({ params, body, permissions }) => {
            await db.transaction().execute(async (tx) => {
              // Seperate permission check out of the update function itself
              // since the gateway routes do not need to check them
              const permissionCheck = await getHasEntityPermission("characters", params.id, permissions);

              if (permissionCheck) {
                await updateCharacter({ tx, permissions, body, params });
              } else {
                noRoleAccessErrorHandler();
              }
            });

            return { message: `Character ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
          },
          {
            body: UpdateCharacterSchema,
            response: ResponseSchema,
          },
        )
        .post(
          "/resource/add/:id",
          async ({ params, body }) => {
            await db.transaction().execute(async (tx) => {
              if (body?.relations?.documents) {
                const existingDocumentIds = (
                  await tx.selectFrom("_charactersTodocuments").select(["B"]).where("A", "=", params.id).execute()
                ).map((item) => item.B);
                const filteredRequestIds = body.relations.documents
                  .map((doc) => doc.id)
                  .filter((id) => !existingDocumentIds.includes(id));

                if (filteredRequestIds.length) {
                  await tx
                    .insertInto("_charactersTodocuments")
                    .values(filteredRequestIds.map((id) => ({ A: params.id, B: id })))
                    .execute();
                }
              }
              if (body?.relations?.images) {
                const existingImageIds = (
                  await tx.selectFrom("_charactersToimages").select(["B"]).where("A", "=", params.id).execute()
                ).map((item) => item.B);
                const filteredRequestIds = body.relations.images
                  .map((image) => image.id)
                  .filter((id) => !existingImageIds.includes(id));

                if (filteredRequestIds.length) {
                  await tx
                    .insertInto("_charactersToimages")
                    .values(filteredRequestIds.map((id) => ({ A: params.id, B: id })))
                    .execute();
                }
              }
              if (body?.relations?.tags) {
                const existingTagIds = (
                  await tx.selectFrom("_charactersTotags").select(["B"]).where("A", "=", params.id).execute()
                ).map((item) => item.B);
                const filteredRequestIds = body.relations.tags
                  .map((tag) => tag.id)
                  .filter((id) => !existingTagIds.includes(id));
                if (filteredRequestIds.length) {
                  await tx
                    .insertInto("_charactersTotags")
                    .values(filteredRequestIds.map((id) => ({ A: params.id, B: id })))
                    .execute();
                }
              }
            });
            return { message: MessageEnum.success, ok: true, role_access: true };
          },
          {
            body: UpdateCharacterSchema,
            response: ResponseSchema,
          },
        )
        .post(
          "/remove/:id",
          async ({ params, body }) => {
            await db.transaction().execute(async (tx) => {
              if (body?.relations?.documents) {
                await tx
                  .deleteFrom("_charactersTodocuments")
                  .where("A", "=", params.id)
                  .where(
                    "B",
                    "in",
                    body.relations.documents.map((d) => d.id),
                  )
                  .execute();
              }
              if (body?.relations?.images) {
                await tx
                  .deleteFrom("_charactersToimages")
                  .where("A", "=", params.id)
                  .where(
                    "B",
                    "in",
                    body.relations.images.map((d) => d.id),
                  )
                  .execute();
              }
              if (body?.relations?.tags) {
                await tx
                  .deleteFrom("_charactersTotags")
                  .where("A", "=", params.id)
                  .where(
                    "B",
                    "in",
                    body.relations.tags.map((d) => d.id),
                  )
                  .execute();
              }
            });
            return {
              message: MessageEnum.success,
              ok: true,
              role_access: true,
            };
          },
          {
            body: UpdateCharacterSchema,
            response: ResponseSchema,
          },
        )
        .delete(
          "/arkive/:id",
          async ({ params, permissions }) => {
            const permissionCheck = await getHasEntityPermission("characters", params.id, permissions);

            if (permissionCheck) {
              await db
                .updateTable("characters")
                .where("characters.id", "=", params.id)
                .set({ deleted_at: new Date().toUTCString(), is_public: false })
                .execute();

              return { message: `Character ${MessageEnum.successfully_arkived}.`, ok: true, role_access: true };
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
            const permissionCheck = await getHasEntityPermission("characters", params.id, permissions);

            if (permissionCheck) {
              const data = await db
                .deleteFrom("characters")
                .where("characters.id", "=", params.id)
                .where("characters.deleted_at", "is not", null)
                .returning(["id", "full_name as title", "project_id", "portrait_id as image_id"])
                .executeTakeFirstOrThrow();

              return {
                data,
                message: `Character ${MessageEnum.successfully_deleted}.`,
                ok: true,
                role_access: true,
              };
            } else {
              noRoleAccessErrorHandler();
              return {
                data: {},
                message: "Error",
                ok: true,
                role_access: false,
              };
            }
          },
          {
            response: ResponseWithDataSchema,
          },
        ),
    );
}
