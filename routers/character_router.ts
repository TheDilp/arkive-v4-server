import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { checkEntityLevelPermission, getCharacterFamily, getHasEntityPermission, readCharacter } from "../database/queries";
import { InsertCharacterSchema, ListCharacterSchema, ReadCharacterSchema, UpdateCharacterSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { beforeRoleHandler, noRoleAccessErrorHandler } from "../handlers/roleHandler";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import {
  characterRelationFilter,
  characterResourceFilter,
  characterValueFilter,
  constructFilter,
  tagsRelationFilter,
} from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  CreateEntityPermissions,
  CreateTagRelations,
  GetRelatedEntityPermissionsAndRoles,
  GetRelationsForUpdating,
  TagQuery,
  UpdateCharacterRelationships,
  UpdateEntityPermissions,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";
import { getEntityWithOwnerId, groupCharacterResourceFiltersByField, groupRelationFiltersByField } from "../utils/transform";

export function character_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_project_owner: false,
      role_access: false,
      user_id: "",
      role_id: null,
      permission_id: null,
    } as PermissionDecorationType)
    .group("/characters", (server) =>
      server
        .post(
          "/create",
          async ({ body, permissions }) => {
            await db.transaction().execute(async (tx) => {
              const character = await tx
                .insertInto("characters")
                .values(getEntityWithOwnerId(body.data, permissions.user_id))
                .returning("id")
                .executeTakeFirstOrThrow();

              if (body?.relations) {
                if (body.relations?.images) {
                  const { images } = body.relations;
                  await tx
                    .insertInto("_charactersToimages")
                    .values(images.map((img) => ({ A: character.id, B: img.id })))
                    .execute();
                }
                if (body.relations?.character_fields?.length) {
                  await Promise.all(
                    body.relations.character_fields.map(async (field) => {
                      if (field?.value) {
                        await tx
                          .insertInto("character_value_fields")
                          .values({
                            character_field_id: field.id,
                            character_id: character.id,
                            value: JSON.stringify(field.value),
                          })
                          .execute();
                      }
                      if (field?.documents?.length) {
                        const { documents } = field;
                        await tx
                          .insertInto("character_documents_fields")
                          .values(
                            documents.map((doc) => ({
                              character_field_id: field.id,
                              character_id: character.id,
                              related_id: doc.related_id,
                            })),
                          )
                          .execute();
                        return;
                      }
                      if (field?.map_pins?.length) {
                        const { map_pins } = field;
                        await tx
                          .insertInto("character_locations_fields")
                          .values(
                            map_pins.map((map_pin) => ({
                              character_field_id: field.id,
                              character_id: character.id,
                              related_id: map_pin.related_id,
                            })),
                          )
                          .execute();
                        return;
                      }
                      if (field?.images?.length) {
                        const { images } = field;
                        await tx
                          .insertInto("character_images_fields")
                          .values(
                            images.map((image) => ({
                              character_field_id: field.id,
                              character_id: character.id,
                              related_id: image.related_id,
                            })),
                          )
                          .execute();
                        return;
                      }
                      if (field?.events?.length) {
                        const { events } = field;
                        await tx
                          .insertInto("character_events_fields")
                          .values(
                            events.map((image) => ({
                              character_field_id: field.id,
                              character_id: character.id,
                              related_id: image.related_id,
                            })),
                          )
                          .execute();
                        return;
                      }
                      if (field?.blueprint_instances?.length) {
                        const { blueprint_instances } = field;
                        await tx
                          .insertInto("character_blueprint_instance_fields")
                          .values(
                            blueprint_instances.map((instance) => ({
                              character_field_id: field.id,
                              character_id: character.id,
                              related_id: instance.related_id,
                            })),
                          )
                          .execute();
                        return;
                      }
                    }),
                  );
                }

                if (body.relations?.tags?.length) {
                  const { tags } = body.relations;
                  await CreateTagRelations({ tx, relationalTable: "_charactersTotags", id: character.id, tags });
                }
                if (body.relations?.documents?.length) {
                  const { documents } = body.relations;
                  await tx
                    .insertInto("_charactersTodocuments")
                    .values(
                      documents.map((doc) => ({
                        A: character.id,
                        B: doc.id,
                      })),
                    )
                    .execute();
                }
                if (body.relations?.related_from?.length) {
                  await tx
                    .insertInto("characters_relationships")
                    .values(
                      body.relations.related_from.map((item) => ({
                        character_a_id: item.id,
                        character_b_id: character.id,
                        relation_type_id: item.relation_type_id,
                      })),
                    )
                    .execute();
                }
                if (body.relations?.related_to?.length) {
                  await tx
                    .insertInto("characters_relationships")
                    .values(
                      body.relations.related_to.map((item) => ({
                        character_a_id: character.id,
                        character_b_id: item.id,
                        relation_type_id: item.relation_type_id,
                      })),
                    )
                    .execute();
                }
                if (body.relations?.related_other?.length) {
                  await tx
                    .insertInto("characters_relationships")
                    .values(
                      body.relations.related_other.map((item) => ({
                        character_a_id: character.id,
                        character_b_id: item.id,
                        relation_type_id: item.relation_type_id,
                      })),
                    )
                    .execute();
                }
                if (body.permissions?.length) {
                  await CreateEntityPermissions(tx, character.id, "character_permissions", body.permissions);
                }
              }
            });

            return { message: `Character ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          },
          {
            body: InsertCharacterSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "create_characters"),
          },
        )

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
              .where("characters.project_id", "=", body?.data?.project_id)
              .limit(body?.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
              .$if(!permissions.is_project_owner, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "characters");
              })
              .$if(!!body.permissions && !permissions.is_project_owner, (qb) =>
                GetRelatedEntityPermissionsAndRoles(qb, permissions, "characters"),
              )
              .$if(!!body.relationFilters?.and?.length || !!body.relationFilters?.or?.length, (qb) => {
                const { blueprint_instances, documents, map_pins, events, tags, value } = groupRelationFiltersByField(
                  body.relationFilters || {},
                );

                const {
                  documents: resourceDocuments,
                  maps: resourceMaps,
                  events: resourceEvents,
                  tags: resourceTags,
                  images,
                } = groupCharacterResourceFiltersByField(body.relationFilters || {});

                if (tags?.filters?.length || resourceTags?.filters?.length)
                  qb = tagsRelationFilter("characters", "_charactersTotags", qb, tags?.filters || resourceTags?.filters || []);
                if (resourceDocuments?.filters?.length)
                  qb = characterResourceFilter("_charactersTodocuments", qb, resourceDocuments?.filters || []);
                if (images?.filters?.length) qb = characterResourceFilter("_charactersToimages", qb, images?.filters || []);
                if (resourceEvents?.filters?.length)
                  qb = characterResourceFilter("event_characters", qb, resourceEvents?.filters || []);
                if (resourceMaps?.filters?.length) qb = characterResourceFilter("maps", qb, resourceMaps?.filters || []);
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
                if (body?.relations?.portrait) {
                  qb = qb.select((eb) =>
                    jsonObjectFrom(
                      eb
                        .selectFrom("images")
                        .whereRef("images.id", "=", "characters.portrait_id")
                        .select(["images.id", "images.title"]),
                    ).as("portrait"),
                  );
                }
                if (body?.relations?.tags) {
                  qb = qb.select((eb) => TagQuery(eb, "_charactersTotags", "characters"));
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
            beforeHandle: async (context) => beforeRoleHandler(context, "read_characters"),
          },
        )
        .post("/:id", async ({ params, body, permissions }) => readCharacter(body, params, false, permissions), {
          body: ReadCharacterSchema,
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "read_characters"),
        })
        .get("/family/:relation_type_id/:id/:count", async ({ params }) => getCharacterFamily(params, false), {
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "read_characters"),
        })
        .post(
          "/update/:id",
          async ({ params, body, permissions }) => {
            await db.transaction().execute(async (tx) => {
              const permissionCheck = await getHasEntityPermission("characters", params.id, permissions);

              if (permissionCheck) {
                let deletedTags: string[] | null = null;

                if (body.relations?.character_fields) {
                  body.relations.character_fields.forEach(async (field) => {
                    if (field.value || field.value === "") {
                      await tx
                        .insertInto("character_value_fields")
                        .values({
                          character_field_id: field.id,
                          character_id: params.id,
                          value: JSON.stringify(field.value),
                        })
                        .onConflict((oc) =>
                          oc
                            .columns(["character_field_id", "character_id"])
                            .doUpdateSet({ value: JSON.stringify(field.value) })
                            .where("character_value_fields.character_field_id", "=", field.id)
                            .where("character_value_fields.character_id", "=", params.id),
                        )
                        .execute();
                    } else if (field.id && !field?.value) {
                      await tx
                        .deleteFrom("character_value_fields")
                        .where("character_field_id", "=", field.id)
                        .where("character_id", "=", params.id)
                        .execute();
                    }

                    if (field.blueprint_instances) {
                      await tx
                        .deleteFrom("character_blueprint_instance_fields")
                        .where("character_id", "=", params.id)
                        .where("character_field_id", "=", field.id)
                        .execute();
                      if (field.blueprint_instances.length) {
                        await tx
                          .insertInto("character_blueprint_instance_fields")
                          .values(
                            (field.blueprint_instances || [])?.map((char) => ({
                              character_field_id: field.id,
                              character_id: params.id,
                              related_id: char.related_id,
                            })),
                          )
                          .onConflict((oc) => oc.doNothing())
                          .execute();
                      }
                    }
                    if (field.documents) {
                      await tx
                        .deleteFrom("character_documents_fields")
                        .where("character_id", "=", params.id)
                        .where("character_field_id", "=", field.id)
                        .execute();
                      if (field.documents.length) {
                        await tx
                          .insertInto("character_documents_fields")
                          .values(
                            field.documents.map((char) => ({
                              character_field_id: field.id,
                              character_id: params.id,
                              related_id: char.related_id,
                            })),
                          )
                          .onConflict((oc) => oc.doNothing())
                          .execute();
                      }
                    }

                    if (field.map_pins) {
                      await tx
                        .deleteFrom("character_locations_fields")
                        .where("character_id", "=", params.id)
                        .where("character_field_id", "=", field.id)
                        .execute();
                      if (field.map_pins?.length) {
                        await tx
                          .insertInto("character_locations_fields")
                          .values(
                            field.map_pins.map((mp) => ({
                              character_field_id: field.id,
                              character_id: params.id,
                              related_id: mp.related_id,
                            })),
                          )
                          .onConflict((oc) => oc.doNothing())
                          .execute();
                      }
                    }
                    if (field.images) {
                      await tx
                        .deleteFrom("character_images_fields")
                        .where("character_id", "=", params.id)
                        .where("character_field_id", "=", field.id)
                        .execute();
                      if (field.images?.length) {
                        await tx
                          .insertInto("character_images_fields")
                          .values(
                            field.images.map((img) => ({
                              character_field_id: field.id,
                              character_id: params.id,
                              related_id: img.related_id,
                            })),
                          )
                          .onConflict((oc) => oc.doNothing())
                          .execute();
                      }
                    }
                    if (field.events) {
                      await tx
                        .deleteFrom("character_events_fields")
                        .where("character_id", "=", params.id)
                        .where("character_field_id", "=", field.id)
                        .execute();
                      if (field.events?.length) {
                        await tx
                          .insertInto("character_events_fields")
                          .values(
                            field.events.map((event) => ({
                              character_field_id: field.id,
                              character_id: params.id,
                              related_id: event.related_id,
                            })),
                          )
                          .onConflict((oc) => oc.doNothing())
                          .execute();
                      }
                    }
                    if (field.random_table) {
                      await tx
                        .insertInto("character_random_table_fields")
                        .values({
                          character_field_id: field.id,
                          character_id: params.id,
                          related_id: field.random_table.related_id,
                          option_id: field.random_table.option_id,
                          suboption_id: field.random_table.suboption_id,
                        })
                        .onConflict((oc) => oc.doNothing())
                        .execute();
                    }
                    if (field.calendar) {
                      await tx
                        .insertInto("character_calendar_fields")
                        .values({
                          character_field_id: field.id,
                          character_id: params.id,
                          related_id: field.calendar.related_id,
                          start_day: field.calendar.start_day,
                          start_month_id: field.calendar.start_month_id,
                          start_year: field.calendar.start_year,
                          end_day: field.calendar.end_day,
                          end_month_id: field.calendar.end_month_id,
                          end_year: field.calendar.end_year,
                        })
                        .onConflict((oc) => oc.doNothing())
                        .execute();
                    }
                  });
                }

                if (body.relations?.tags) {
                  if (body.relations.tags.length) {
                    const tagsToDelete = await UpdateTagRelations({
                      relationalTable: "_charactersTotags",
                      id: params.id,
                      newTags: body.relations.tags,
                      tx,
                    });
                    if (tagsToDelete.length) {
                      deletedTags = tagsToDelete;
                    }
                  } else {
                    await tx.deleteFrom("_charactersTotags").where("A", "=", params.id).execute();
                    deletedTags = [];
                  }

                  if (deletedTags !== null) {
                    if (deletedTags?.length) {
                      const newTagIds = (body.relations?.tags || []).map((t) => t.id);
                      const templates = await tx
                        .selectFrom("_character_fields_templatesTotags")
                        .where("_character_fields_templatesTotags.B", "in", deletedTags)
                        .select([
                          (eb) =>
                            jsonArrayFrom(
                              eb
                                .selectFrom("character_fields_templates")
                                .select([
                                  (ebb) =>
                                    jsonArrayFrom(
                                      ebb
                                        .selectFrom("character_fields")
                                        .select(["id", "field_type"])
                                        .whereRef("character_fields.parent_id", "=", "character_fields_templates.id"),
                                    ).as("character_fields"),
                                  (ebb) =>
                                    jsonArrayFrom(
                                      ebb
                                        .selectFrom("tags")
                                        .leftJoin(
                                          "_character_fields_templatesTotags",
                                          "_character_fields_templatesTotags.A",
                                          "character_fields_templates.id",
                                        )
                                        .whereRef("_character_fields_templatesTotags.A", "=", "character_fields_templates.id")
                                        .select("_character_fields_templatesTotags.B as id"),
                                    ).as("tags"),
                                ]),
                            ).as("templates"),
                        ])

                        .where("_character_fields_templatesTotags.B", "in", deletedTags)
                        .execute();
                      const documentFields: { id: string; field_type: string }[] = [];
                      const mapPinFields: { id: string; field_type: string }[] = [];
                      const blueprintInstanceFields: { id: string; field_type: string }[] = [];
                      const imageFields: { id: string; field_type: string }[] = [];
                      // const randomTableFields = [];
                      // const calendarFields = [];
                      const valueFields: { id: string; field_type: string }[] = [];
                      templates
                        .flatMap((t) => t.templates)
                        .filter((temp) => !temp.tags.some((t) => t.id && newTagIds.includes(t.id)))
                        .flatMap((t) => t.character_fields)
                        .forEach((field) => {
                          if (field.field_type.includes("documents")) documentFields.push(field);
                          if (field.field_type.includes("location")) mapPinFields.push(field);
                          if (field.field_type.includes("blueprint")) blueprintInstanceFields.push(field);
                          if (field.field_type.includes("images")) imageFields.push(field);
                          valueFields.push(field);
                        });
                      if (documentFields.length) {
                        await tx
                          .deleteFrom("character_documents_fields")
                          .where(
                            "character_field_id",
                            "in",
                            documentFields.map((f) => f.id),
                          )
                          .where("character_documents_fields.character_id", "=", params.id)
                          .execute();
                      }
                      if (mapPinFields.length) {
                        await tx
                          .deleteFrom("character_locations_fields")
                          .where(
                            "character_field_id",
                            "in",
                            mapPinFields.map((f) => f.id),
                          )
                          .where("character_locations_fields.character_id", "=", params.id)
                          .execute();
                      }
                      if (blueprintInstanceFields.length) {
                        await tx
                          .deleteFrom("character_blueprint_instance_fields")
                          .where(
                            "character_field_id",
                            "in",
                            blueprintInstanceFields.map((f) => f.id),
                          )
                          .where("character_blueprint_instance_fields.character_id", "=", params.id)
                          .execute();
                      }
                      if (imageFields.length) {
                        await tx
                          .deleteFrom("character_images_fields")
                          .where(
                            "character_field_id",
                            "in",
                            imageFields.map((f) => f.id),
                          )
                          .where("character_images_fields.character_id", "=", params.id)
                          .execute();
                      }

                      if (valueFields.length) {
                        await tx
                          .deleteFrom("character_value_fields")
                          .where(
                            "character_field_id",
                            "in",
                            valueFields.map((f) => f.id),
                          )
                          .where("character_value_fields.character_id", "=", params.id)
                          .execute();
                      }
                    }
                    // if all tags are removed, remove all fields
                    else {
                      await Promise.all([
                        tx
                          .deleteFrom("character_documents_fields")
                          .where("character_documents_fields.character_id", "=", params.id)
                          .execute(),
                        tx
                          .deleteFrom("character_images_fields")
                          .where("character_images_fields.character_id", "=", params.id)
                          .execute(),
                        tx
                          .deleteFrom("character_blueprint_instance_fields")
                          .where("character_blueprint_instance_fields.character_id", "=", params.id)
                          .execute(),
                        tx
                          .deleteFrom("character_locations_fields")
                          .where("character_locations_fields.character_id", "=", params.id)
                          .execute(),
                        tx
                          .deleteFrom("character_value_fields")
                          .where("character_value_fields.character_id", "=", params.id)
                          .execute(),
                      ]);
                    }
                  }
                }

                if (body.relations?.related_to) {
                  UpdateCharacterRelationships({
                    tx,
                    id: params.id,
                    related: body.relations?.related_to,
                    relation_direction: "related_to",
                  });
                }
                if (body.relations?.related_other) {
                  UpdateCharacterRelationships({
                    tx,
                    id: params.id,
                    related: body.relations?.related_other,
                    relation_direction: "related_other",
                  });
                }
                if (body.relations?.related_from) {
                  UpdateCharacterRelationships({
                    tx,
                    id: params.id,
                    related: body.relations?.related_from,
                    relation_direction: "related_from",
                  });
                }
                if (body.relations?.documents) {
                  const existingDocuments = await tx
                    .selectFrom("_charactersTodocuments")
                    .select(["_charactersTodocuments.B"])
                    .where("_charactersTodocuments.A", "=", params.id)
                    .execute();
                  const existingIds = existingDocuments.map((field) => field.B);
                  const [idsToRemove, itemsToAdd] = GetRelationsForUpdating(existingIds, body.relations?.documents);
                  if (idsToRemove.length) {
                    await tx
                      .deleteFrom("_charactersTodocuments")
                      .where("_charactersTodocuments.B", "in", idsToRemove)
                      .execute();
                  }
                  if (itemsToAdd.length) {
                    await tx
                      .insertInto("_charactersTodocuments")
                      .values(
                        itemsToAdd.map((item) => ({
                          A: params.id,
                          B: item.id,
                        })),
                      )
                      .execute();
                  }
                }
                if (body?.permissions) {
                  await UpdateEntityPermissions(tx, params.id, "character_permissions", body.permissions);
                }
                if (body.data)
                  await tx.updateTable("characters").where("characters.id", "=", params.id).set(body.data).execute();
              } else {
                noRoleAccessErrorHandler();
              }
            });

            return { message: `Character ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
          },
          {
            body: UpdateCharacterSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "update_characters"),
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
            beforeHandle: async (context) => beforeRoleHandler(context, "update_characters"),
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
            beforeHandle: async (context) => beforeRoleHandler(context, "update_characters"),
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
            beforeHandle: async (context) => beforeRoleHandler(context, "delete_characters"),
          },
        ),
    );
}
