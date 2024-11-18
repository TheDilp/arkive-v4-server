import { randomUUID } from "crypto";
import { ElkNode, LayoutOptions } from "elkjs";
import Elk from "elkjs/lib/elk-api";
import { SelectExpression, sql, Transaction } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB, Edges } from "kysely-codegen";
import omit from "lodash.omit";
import uniqBy from "lodash.uniqby";

import { MessageEnum } from "../../enums";
import { PermissionDecorationType, ResponseWithDataSchema } from "../../types/requestTypes";
import {
  CreateEntityPermissions,
  CreateTagRelations,
  GetRelatedEntityPermissionsAndRoles,
  GetRelationsForUpdating,
  TagQuery,
  UpdateCharacterRelationships,
  UpdateEntityPermissions,
  UpdateTagRelations,
} from "../../utils/relationalQueryHelpers";
import { closestDivisibleBy50, getEntityWithOwnerId, groupCharacterFields } from "../../utils/utils";
import { db } from "../db";
import { InsertCharacterSchema, ReadCharacterSchema, UpdateCharacterSchema } from "../validation";
import { checkEntityLevelPermission, getNestedReadPermission } from ".";

type ReadBodyType = (typeof ReadCharacterSchema)["static"];
type CreateBodyType = (typeof InsertCharacterSchema)["static"];
type UpdateBodyType = (typeof UpdateCharacterSchema)["static"];

export async function createCharacter({
  body,
  permissions,
}: {
  body: CreateBodyType;
  permissions: { user_id: string; is_project_owner: boolean };
}) {
  const id = await db.transaction().execute(async (tx) => {
    const character = await tx
      .insertInto("characters")
      .values(getEntityWithOwnerId(body.data, permissions.user_id))
      .returning("id")
      .executeTakeFirstOrThrow();
    if (body?.relations) {
      if (typeof body.relations?.is_favorite === "boolean") {
        await tx
          .insertInto("favorite_characters")
          .values({
            user_id: permissions.user_id,
            is_favorite: body.relations.is_favorite,
            character_id: character.id,
          })
          .onConflict((oc) => oc.columns(["user_id", "character_id"]).doUpdateSet({ is_favorite: body.relations?.is_favorite }))
          .execute();
      }

      if (body.relations?.images) {
        const { images } = body.relations;
        await tx
          .insertInto("_charactersToimages")
          .values(images.map((img) => ({ A: character.id, B: img.id })))
          .execute();
      }
      if (body.relations?.character_fields?.length) {
        await Promise.all(
          body.relations.character_fields.map((field) => {
            if (field?.value) {
              return tx
                .insertInto("character_value_fields")
                .values({
                  character_field_id: field.id,
                  character_id: character.id,
                  value: JSON.stringify(field.value),
                })
                .execute();
            }
            if (field?.characters?.length) {
              const { characters } = field;
              return tx
                .insertInto("character_characters_fields")
                .values(
                  characters.map((doc) => ({
                    character_field_id: field.id,
                    character_id: character.id,
                    related_id: doc.related_id,
                    sort: doc.sort,
                  })),
                )
                .execute();
            }
            if (field?.documents?.length) {
              const { documents } = field;
              return tx
                .insertInto("character_documents_fields")
                .values(
                  documents.map((doc) => ({
                    character_field_id: field.id,
                    character_id: character.id,
                    related_id: doc.related_id,
                    sort: doc.sort,
                  })),
                )
                .execute();
            }
            if (field?.map_pins?.length) {
              const { map_pins } = field;
              return tx
                .insertInto("character_locations_fields")
                .values(
                  map_pins.map((map_pin) => ({
                    character_field_id: field.id,
                    character_id: character.id,
                    related_id: map_pin.related_id,
                    sort: map_pin.sort,
                  })),
                )
                .execute();
            }
            if (field?.images?.length) {
              const { images } = field;
              return tx
                .insertInto("character_images_fields")
                .values(
                  images.map((image) => ({
                    character_field_id: field.id,
                    character_id: character.id,
                    related_id: image.related_id,
                    sort: image.sort,
                  })),
                )
                .execute();
            }
            if (field?.events?.length) {
              const { events } = field;
              return tx
                .insertInto("character_events_fields")
                .values(
                  events.map((image) => ({
                    character_field_id: field.id,
                    character_id: character.id,
                    related_id: image.related_id,
                    sort: image.sort,
                  })),
                )
                .execute();
            }
            if (field?.blueprint_instances?.length) {
              const { blueprint_instances } = field;
              return tx
                .insertInto("character_blueprint_instance_fields")
                .values(
                  blueprint_instances.map((instance) => ({
                    character_field_id: field.id,
                    character_id: character.id,
                    related_id: instance.related_id,
                    sort: instance.sort,
                  })),
                )
                .execute();
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
        await CreateEntityPermissions(tx, character.id, body.permissions);
      }
    }
    return character.id;
  });

  return { data: { id }, message: `Character ${MessageEnum.successfully_created}`, ok: true, role_access: true };
}

export async function readCharacter(
  body: ReadBodyType,
  params: { id: string },
  permissions: PermissionDecorationType,
  isPublic: boolean,
): Promise<(typeof ResponseWithDataSchema)["static"]> {
  let query = db
    .selectFrom("characters")
    .select(body.fields.map((f) => `characters.${f}`) as SelectExpression<DB, "characters">[])
    .where("characters.id", "=", params.id)
    .$if(!!body.relations, (qb) => {
      if (body?.relations?.is_favorite) {
        qb = qb
          .leftJoin("favorite_characters", (join) =>
            join.on((jb) => jb.and([jb("character_id", "=", params.id), jb("user_id", "=", permissions?.user_id)])),
          )
          .select(["is_favorite"]);
      }
      if (body?.relations?.character_fields) {
        qb = qb.select([
          (eb) => {
            let characters_query = eb
              .selectFrom("character_characters_fields")
              .where("character_characters_fields.character_id", "=", params.id)
              .select([
                "character_field_id as id",
                "character_characters_fields.related_id",
                "character_characters_fields.sort",
                (ebb) =>
                  jsonArrayFrom(
                    ebb
                      .selectFrom("characters")
                      .whereRef("characters.id", "=", "character_characters_fields.related_id")
                      .select(["characters.id", "characters.full_name", "characters.portrait_id"])
                      .$if(isPublic, (eb) => {
                        eb = eb.where("characters.is_public", "=", true);
                        return eb;
                      })
                      .$if(!permissions?.is_project_owner && !isPublic, (qb) => {
                        return checkEntityLevelPermission(qb, permissions, "characters", params.id);
                      }),
                  ).as("characters"),
              ]);

            characters_query = getNestedReadPermission(
              characters_query,
              permissions?.is_project_owner,
              permissions?.user_id,
              "character_characters_fields.related_id",
              "read_characters",
              isPublic,
            );

            return jsonArrayFrom(characters_query).as("field_characters");
          },
          (eb) => {
            let documents_query = eb
              .selectFrom("character_documents_fields")
              .where("character_documents_fields.character_id", "=", params.id)
              .select([
                "character_field_id as id",
                "character_documents_fields.related_id",
                "character_documents_fields.sort",
                (ebb) =>
                  jsonArrayFrom(
                    ebb
                      .selectFrom("documents")
                      .whereRef("documents.id", "=", "character_documents_fields.related_id")
                      .select(["documents.id", "documents.title", "documents.icon", "documents.image_id"])
                      .$if(isPublic, (eb) => {
                        eb = eb.where("documents.is_public", "=", true);
                        return eb;
                      })
                      .$if(!permissions?.is_project_owner && !isPublic, (qb) => {
                        return checkEntityLevelPermission(qb, permissions, "documents", params.id);
                      }),
                  ).as("documents"),
              ]);

            documents_query = getNestedReadPermission(
              documents_query,
              permissions?.is_project_owner,
              permissions?.user_id,
              "character_documents_fields.related_id",
              "read_documents",
              isPublic,
            );

            return jsonArrayFrom(documents_query).as("field_documents");
          },
          (eb) => {
            let image_query = eb
              .selectFrom("character_images_fields")
              .where("character_images_fields.character_id", "=", params.id)
              .select([
                "character_field_id as id",
                "character_images_fields.related_id",
                "character_images_fields.sort",

                (ebb) =>
                  jsonArrayFrom(
                    ebb
                      .selectFrom("images")
                      .whereRef("images.id", "=", "character_images_fields.related_id")
                      .select(["id", "title"])
                      .$if(isPublic, (eb) => {
                        eb = eb.where("is_public", "=", true);
                        return eb;
                      }),
                  ).as("images"),
              ]);

            image_query = getNestedReadPermission(
              image_query,
              permissions?.is_project_owner,
              permissions?.user_id,
              "character_images_fields.related_id",
              "read_assets",
              isPublic,
            );

            return jsonArrayFrom(image_query).as("field_images");
          },
          (eb) => {
            let event_query = eb
              .selectFrom("character_events_fields")
              .where("character_events_fields.character_id", "=", params.id)
              .select([
                "character_field_id as id",
                "character_events_fields.related_id",
                "character_events_fields.sort",
                (ebb) =>
                  jsonArrayFrom(
                    ebb
                      .selectFrom("events")
                      .whereRef("events.id", "=", "character_events_fields.related_id")
                      .select(["id", "title", "parent_id"])
                      .$if(isPublic, (eb) => {
                        eb = eb.where("is_public", "=", true);
                        return eb;
                      }),
                  ).as("events"),
              ]);

            event_query = getNestedReadPermission(
              event_query,
              permissions?.is_project_owner,
              permissions?.user_id,
              "character_events_fields.related_id",
              "read_events",
              isPublic,
            );

            return jsonArrayFrom(event_query).as("field_events");
          },
          (eb) => {
            let map_pin_query = eb
              .selectFrom("character_locations_fields")
              .where("character_locations_fields.character_id", "=", params.id)
              .select([
                "character_field_id as id",
                "character_locations_fields.related_id",
                "character_locations_fields.sort",
                (ebb) =>
                  jsonArrayFrom(
                    ebb
                      .selectFrom("map_pins")
                      .whereRef("map_pins.id", "=", "character_locations_fields.related_id")
                      .select(["id", "title", "icon", "parent_id", "image_id"])
                      .$if(isPublic, (eb) => {
                        eb = eb.where("is_public", "=", true);
                        return eb;
                      }),
                  ).as("map_pins"),
              ]);

            map_pin_query = getNestedReadPermission(
              map_pin_query,
              permissions?.is_project_owner,
              permissions?.user_id,
              "character_locations_fields.related_id",
              "read_map_pins",
              isPublic,
            );

            return jsonArrayFrom(map_pin_query).as("field_locations");
          },
          (eb) => {
            let bpi_query = eb
              .selectFrom("character_blueprint_instance_fields")
              .where("character_blueprint_instance_fields.character_id", "=", params.id)
              .select([
                "character_field_id as id",
                "character_blueprint_instance_fields.related_id",
                "character_blueprint_instance_fields.sort",
                (ebb) =>
                  jsonArrayFrom(
                    ebb
                      .selectFrom("blueprint_instances")
                      .whereRef("blueprint_instances.id", "=", "character_blueprint_instance_fields.related_id")
                      .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
                      .select([
                        "blueprint_instances.id",
                        "blueprint_instances.title",
                        "blueprint_instances.parent_id",
                        "blueprints.icon",
                      ])
                      .$if(isPublic, (eb) => {
                        eb = eb.where("is_public", "=", true);
                        return eb;
                      }),
                  ).as("blueprint_instances"),
              ]);

            bpi_query = getNestedReadPermission(
              bpi_query,
              permissions?.is_project_owner,
              permissions?.user_id,
              "character_blueprint_instance_fields.related_id",
              "read_blueprint_instances",
              isPublic,
            );

            return jsonArrayFrom(bpi_query).as("field_blueprint_instances");
          },
          (ebb) => {
            let random_table_query = ebb
              .selectFrom("character_random_table_fields")
              .where("character_random_table_fields.character_id", "=", params.id)
              .select(["character_field_id as id", "character_random_table_fields.related_id", "option_id"]);

            random_table_query = getNestedReadPermission(
              random_table_query,
              permissions?.is_project_owner,
              permissions?.user_id,
              "character_random_table_fields.related_id",
              "read_random_tables",
              isPublic,
            );

            return jsonArrayFrom(random_table_query).as("field_random_tables");
          },
          (ebb) => {
            let calendar_query = ebb
              .selectFrom("character_calendar_fields")
              .where("character_calendar_fields.character_id", "=", params.id)
              .select([
                "character_field_id as id",
                "character_calendar_fields.related_id",
                "character_calendar_fields.start_day",
                "character_calendar_fields.start_month_id",
                "character_calendar_fields.start_year",
                "character_calendar_fields.end_day",
                "character_calendar_fields.end_month_id",
                "character_calendar_fields.end_year",
              ]);

            calendar_query = getNestedReadPermission(
              calendar_query,
              permissions?.is_project_owner,
              permissions?.user_id,
              "character_calendar_fields.related_id",
              "read_calendars",
              isPublic,
            );

            return jsonArrayFrom(calendar_query).as("field_calendars");
          },
          (eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("character_value_fields")
                .whereRef("character_value_fields.character_id", "=", "characters.id")
                .select(["character_field_id as id", "value"]),
            ).as("field_values"),
        ]);
      }
      if (body?.relations?.relationships) {
        qb = qb.select((eb) =>
          jsonArrayFrom(
            eb
              .selectFrom("characters_relationships")
              .select(["character_a_id as id"])
              .where("character_a_id", "=", params.id)
              .leftJoin("characters", "characters.id", "character_b_id")
              .leftJoin(
                "character_relationship_types",
                "character_relationship_types.id",
                "characters_relationships.relation_type_id",
              )
              .where("character_relationship_types.ascendant_title", "is not", null)
              .select([
                "character_b_id as id",
                "characters.full_name",
                "characters_relationships.relation_type_id",
                "characters_relationships.id as character_relationship_id",
                "character_relationship_types.ascendant_title as relation_title",
                "character_relationship_types.title as relation_type_title",
                (ebb) => {
                  let portrait_query = ebb
                    .selectFrom("images")
                    .whereRef("images.id", "=", "characters.portrait_id")
                    .select(["images.id", "images.title"]);

                  if (!permissions.is_project_owner)
                    // @ts-ignore
                    portrait_query = getNestedReadPermission(
                      portrait_query,
                      permissions?.is_project_owner,
                      permissions?.user_id,
                      "characters.portrait_id",
                      "read_assets",
                      isPublic,
                    );

                  return jsonObjectFrom(portrait_query).as("portrait");
                },
              ])
              .$if(isPublic, (eb) => eb.where("characters.is_public", "=", true))
              .$if(!permissions?.is_project_owner && !isPublic, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "characters", params.id);
              }),
          ).as("related_to"),
        );
        qb = qb.select((eb) =>
          jsonArrayFrom(
            eb
              .selectFrom("characters_relationships")
              .select(["character_b_id as id"])
              .where("character_b_id", "=", params.id)
              .leftJoin("characters", "characters.id", "character_a_id")
              .leftJoin(
                "character_relationship_types",
                "character_relationship_types.id",
                "characters_relationships.relation_type_id",
              )
              .where("character_relationship_types.ascendant_title", "is not", null)
              .$if(isPublic, (eb) => eb.where("characters.is_public", "=", true))
              .$if(!permissions?.is_project_owner && !isPublic, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "characters", params.id);
              })
              .select([
                "character_a_id as id",
                "characters.full_name",
                "characters_relationships.relation_type_id",
                "characters_relationships.id as character_relationship_id",
                "character_relationship_types.descendant_title as relation_title",
                (ebb) => {
                  let portrait_query = ebb
                    .selectFrom("images")
                    .whereRef("images.id", "=", "characters.portrait_id")
                    .select(["images.id", "images.title"]);

                  if (!permissions.is_project_owner)
                    // @ts-ignore
                    portrait_query = getNestedReadPermission(
                      portrait_query,
                      permissions?.is_project_owner,
                      permissions?.user_id,
                      "characters.portrait_id",
                      "read_assets",
                      isPublic,
                    );

                  return jsonObjectFrom(portrait_query).as("portrait");
                },
              ]),
          ).as("related_from"),
        );

        qb = qb.select((eb) =>
          jsonArrayFrom(
            eb
              .selectFrom("characters_relationships")
              .leftJoin(
                "character_relationship_types",
                "character_relationship_types.id",
                "characters_relationships.relation_type_id",
              )
              .where("characters_relationships.character_a_id", "=", params.id)
              .where("character_relationship_types.descendant_title", "is", null)
              .$if(isPublic, (eb) => eb.where("characters.is_public", "=", true))
              .leftJoin("characters", "characters.id", "character_b_id")
              .$if(!permissions?.is_project_owner && !isPublic, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "characters", params.id);
              })
              .select([
                "character_b_id as id",
                "characters.full_name",
                "characters_relationships.relation_type_id",
                "characters_relationships.id as character_relationship_id",
                "character_relationship_types.descendant_title as relation_title",
                "character_relationship_types.title as relation_type_title",
                (ebb) => {
                  let portrait_query = ebb
                    .selectFrom("images")
                    .whereRef("images.id", "=", "characters.portrait_id")
                    .select(["images.id", "images.title"]);

                  if (!permissions.is_project_owner)
                    // @ts-ignore
                    portrait_query = getNestedReadPermission(
                      portrait_query,
                      permissions?.is_project_owner,
                      permissions?.user_id,
                      "characters.portrait_id",
                      "read_assets",
                      isPublic,
                    );

                  return jsonObjectFrom(portrait_query).as("portrait");
                },
              ]),
          ).as("related_other_a"),
        );
        qb = qb.select((eb) =>
          jsonArrayFrom(
            eb
              .selectFrom("characters_relationships")
              .leftJoin(
                "character_relationship_types",
                "character_relationship_types.id",
                "characters_relationships.relation_type_id",
              )
              .where("characters_relationships.character_b_id", "=", params.id)
              .where("character_relationship_types.descendant_title", "is", null)
              .$if(isPublic, (eb) => eb.where("characters.is_public", "=", true))
              .leftJoin("characters", "characters.id", "character_a_id")
              .$if(!permissions?.is_project_owner && !isPublic, (qb) => {
                return checkEntityLevelPermission(qb, permissions, "characters", params.id);
              })
              .select([
                "character_a_id as id",
                "characters.full_name",
                "characters_relationships.relation_type_id",
                "characters_relationships.id as character_relationship_id",
                "character_relationship_types.descendant_title as relation_title",
                "character_relationship_types.title as relation_type_title",
                (ebb) => {
                  let portrait_query = ebb
                    .selectFrom("images")
                    .whereRef("images.id", "=", "characters.portrait_id")
                    .select(["images.id", "images.title"]);

                  if (!permissions.is_project_owner)
                    // @ts-ignore
                    portrait_query = getNestedReadPermission(
                      portrait_query,
                      permissions?.is_project_owner,
                      permissions?.user_id,
                      "characters.portrait_id",
                      "read_assets",
                      isPublic,
                    );

                  return jsonObjectFrom(portrait_query).as("portrait");
                },
              ]),
          ).as("related_other_b"),
        );
      }
      if (body?.relations?.character_relationship_types) {
        qb = qb.select((eb) =>
          jsonArrayFrom(
            eb
              .selectFrom("characters_relationships")
              .distinctOn("relation_type_id")
              .where((wb) => wb.or([wb("character_a_id", "=", params.id), wb("character_b_id", "=", params.id)]))
              .leftJoin(
                "character_relationship_types as related_to",
                "related_to.id",
                "characters_relationships.relation_type_id",
              )
              .leftJoin(
                "character_relationship_types as related_from",
                "related_from.id",
                "characters_relationships.relation_type_id",
              )
              .select([
                "characters_relationships.relation_type_id as id",
                "related_from.title as related_from_title",
                "related_to.title as related_to_title",
                "related_from.ascendant_title as related_from_ascendant_title",
                "related_to.ascendant_title as related_to_ascendant_title",
              ]),
          ).as("character_relationship_types"),
        );
      }
      if (body?.relations?.tags) {
        qb = qb.select((eb) =>
          TagQuery(eb, "_charactersTotags", "characters", permissions?.is_project_owner, permissions?.user_id),
        );
      }
      if (body?.relations?.portrait) {
        qb = qb.select((eb) => {
          let portrait_query = eb
            .selectFrom("images")
            .whereRef("images.id", "=", "characters.portrait_id")
            .select(["images.id", "images.title"]);

          if (!permissions.is_project_owner)
            portrait_query = getNestedReadPermission(
              portrait_query,
              permissions?.is_project_owner,
              permissions?.user_id,
              "characters.portrait_id",
              "read_assets",
              isPublic,
            );

          return jsonObjectFrom(portrait_query).as("portrait");
        });
      }
      if (body?.relations?.images) {
        qb = qb.select((eb) => {
          let image_query = eb
            .selectFrom("_charactersToimages")
            .where("_charactersToimages.A", "=", params.id)
            .leftJoin("images", "images.id", "_charactersToimages.B")
            .select(["images.id", "images.title", "images.is_public"])
            .orderBy("title")
            .$if(isPublic, (eb) => {
              eb = eb.where("images.is_public", "=", true);
              return eb;
            });

          // @ts-ignore
          image_query = getNestedReadPermission(
            image_query,
            permissions?.is_project_owner,
            permissions?.user_id,
            "images.id",
            "read_assets",
            isPublic,
          );

          return jsonArrayFrom(image_query).as("images");
        });
      }
      if (body?.relations?.locations) {
        qb = qb.select((eb) => {
          let map_pin_query = eb
            .selectFrom("map_pins")
            .select(["map_pins.id as map_pin_id"])
            .whereRef("map_pins.character_id", "=", "characters.id")
            .$if(isPublic, (eb) => {
              eb = eb.where("map_pins.is_public", "=", true);

              return eb;
            })
            .leftJoin("maps", "maps.id", "map_pins.parent_id")
            .select(["maps.id", "maps.title", "maps.image_id"]);

          // @ts-ignore
          map_pin_query = getNestedReadPermission(
            map_pin_query,
            permissions?.is_project_owner,
            permissions?.user_id,
            "map_pins.id",
            "read_map_pins",
            isPublic,
          );

          return jsonArrayFrom(map_pin_query).as("locations");
        });
      }
      if (body?.relations?.documents) {
        qb = qb.select((eb) => {
          let document_query = eb
            .selectFrom("_charactersTodocuments")
            .where("_charactersTodocuments.A", "=", params.id)
            .leftJoin("documents", "_charactersTodocuments.B", "documents.id")
            .where("documents.is_folder", "is not", true)
            .where("documents.is_template", "is not", true)
            .$if(!permissions?.is_project_owner && !isPublic, (qb) => {
              return checkEntityLevelPermission(qb, permissions, "documents", params.id);
            })
            .$if(isPublic, (eb) => {
              eb = eb.where("documents.is_public", "=", true);
              return eb;
            })
            .select(["documents.id", "documents.icon", "documents.is_public", "documents.title", "documents.image_id"])
            .orderBy("title");

          // @ts-ignore
          document_query = getNestedReadPermission(
            document_query,
            permissions?.is_project_owner,
            permissions?.user_id,
            "documents.id",
            "read_documents",
            isPublic,
          );

          return jsonArrayFrom(document_query).as("documents");
        });
      }
      if (body?.relations?.events) {
        qb = qb.select((eb) => {
          let event_query = eb
            .selectFrom("event_characters")
            .where("event_characters.related_id", "=", params.id)
            .leftJoin("events", "events.id", "event_characters.event_id")
            .$if(isPublic, (eb) => {
              eb = eb.where("events.is_public", "=", true);
              return eb;
            })
            .select(["events.id", "events.is_public", "events.title", "events.image_id", "events.parent_id"])
            .orderBy("start_year");

          // @ts-ignore
          event_query = getNestedReadPermission(
            event_query,
            permissions?.is_project_owner,
            permissions?.user_id,
            "events.id",
            "read_events",
            isPublic,
          );

          return jsonArrayFrom(event_query).as("events");
        });
      }

      return qb;
    });

  if (!isPublic) {
    if (permissions?.is_project_owner) {
      query = query.leftJoin("entity_permissions", (join) => join.on("entity_permissions.related_id", "=", params.id));
    } else {
      query = checkEntityLevelPermission(query, permissions, "characters", params.id);
    }
    if (!!body.permissions && !isPublic) {
      query = GetRelatedEntityPermissionsAndRoles(query, permissions, "characters", params.id);
    }
  }

  let data = await query.executeTakeFirstOrThrow();
  // If fetching direct relationships return only unique relationships
  if (data?.related_other_a || data?.related_other_b) {
    data.related_other = uniqBy((data.related_other_a || []).concat(data.related_other_b || []), "id");
    // @ts-ignore
    data = omit(data, ["related_other_a", "related_other_b"]);
  }
  const {
    field_characters,
    field_documents,
    field_images,
    field_locations,
    field_blueprint_instances,
    field_calendars,
    field_events,
    field_random_tables,
    field_values,
    ...rest
  } = data;
  rest.character_fields = groupCharacterFields([
    ...(field_characters || []).map(
      (d: {
        id: string;
        related_id: string;
        characters: { character: { id: string; full_name: string; portrait_id: string | null } }[];
      }) => ({
        id: d.id,
        characters: (d?.characters || []).map((character) => ({ related_id: d.related_id, character })),
      }),
    ),
    ...(field_documents || [])
      .map(
        (d: {
          id: string;
          related_id: string;
          documents: { document: { id: string; title: string; icon: string | null } }[];
        }) => ({
          id: d.id,
          documents: (d?.documents || []).map((document) => ({ related_id: d.related_id, document })),
        }),
      )
      .filter((item: { documents: any[] }) => item.documents.length),
    ...(field_images || [])
      .map(
        (d: { id: string; related_id: string; images: { image: { id: string; title: string; icon: string | null } }[] }) => ({
          id: d.id,
          images: d.images.map((image) => ({
            related_id: d.related_id,
            image,
          })),
        }),
      )
      .filter((item: { images: any[] }) => item.images.length),

    ...(field_locations || [])
      .map(
        (d: {
          id: string;
          related_id: string;
          map_pins: { map_pin: { id: string; title: string; icon: string | null } }[];
        }) => ({
          id: d.id,
          map_pins: d.map_pins.map((map_pin) => ({
            related_id: d.related_id,
            map_pin,
          })),
        }),
      )
      .filter((item: { map_pins: any[] }) => item.map_pins.length),

    ...(field_events || [])
      .map((d: { id: string; related_id: string; events: { event: { id: string; title: string; parent_id: string } }[] }) => ({
        id: d.id,
        events: d.events.map((event) => ({
          related_id: d.related_id,
          event,
        })),
      }))
      .filter((item: { events: any[] }) => item.events.length),

    ...(field_blueprint_instances || [])
      .map(
        (d: {
          id: string;
          related_id: string;
          blueprint_instances: { blueprint_instance: { id: string; title: string; icon: string | null } }[];
        }) => ({
          id: d.id,
          blueprint_instances: d.blueprint_instances.map((blueprint_instance) => ({
            related_id: d.related_id,
            blueprint_instance,
          })),
        }),
      )
      .filter((item: { blueprint_instances: any[] }) => item.blueprint_instances.length),
    ...(field_calendars || []).map(
      (d: {
        id: string;
        related_id: string;
        start_day?: number;
        start_month_id?: string;
        start_year?: number;
        end_day?: number;
        end_month_id?: string;
        end_year?: number;
      }) => ({
        id: d.id,
        calendar: {
          related_id: d.related_id,
          start_day: d.start_day,
          start_month_id: d.start_month_id,
          start_year: d.start_year,
          end_day: d.end_day,
          end_month_id: d.end_month_id,
          end_year: d.end_year,
        },
      }),
    ),
    ...(field_random_tables || []).map((d: { id: string; related_id: string; option_id?: string }) => ({
      id: d.id,
      random_table: {
        related_id: d.related_id,
        option_id: d.option_id,
      },
    })),
  ]);
  rest.character_fields.push(...(field_values || []));
  if (isPublic) {
    if (data?.is_public)
      return {
        data: rest,
        message: MessageEnum.success,
        ok: true,

        role_access: true,
      };
    return {
      data: { is_public: false },
      message: MessageEnum.success,
      ok: true,

      role_access: true,
    };
  }

  return { data: rest, message: MessageEnum.success, ok: true, role_access: true };
}

export async function updateCharacter({
  params,
  body,
  tx,
  permissions,
}: {
  tx: Transaction<any>;
  params: { id: string };
  body: UpdateBodyType;
  permissions: { user_id: string | undefined; is_project_owner: boolean };
}) {
  let deletedTags: string[] | null = null;

  if (typeof body.relations?.is_favorite === "boolean" && !!permissions.user_id) {
    await tx
      .insertInto("favorite_characters")
      .values({ user_id: permissions.user_id, is_favorite: body.relations.is_favorite, character_id: params.id })
      .onConflict((oc) => oc.columns(["user_id", "character_id"]).doUpdateSet({ is_favorite: body.relations?.is_favorite }))
      .execute();
  }

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

      if (field.characters) {
        await tx
          .deleteFrom("character_characters_fields")
          .where("character_id", "=", params.id)
          .where("character_field_id", "=", field.id)
          .execute();
        if (field.characters.length) {
          await tx
            .insertInto("character_characters_fields")
            .values(
              (field.characters || [])?.map((char) => ({
                character_field_id: field.id,
                character_id: params.id,
                related_id: char.related_id,
                sort: char.sort,
              })),
            )
            .onConflict((oc) => oc.doNothing())
            .execute();
        }
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
                sort: char.sort,
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
                sort: char.sort,
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
                sort: mp.sort,
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
                sort: img.sort,
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
                sort: event.sort,
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
          })
          .onConflict((oc) =>
            oc
              .columns(["character_field_id", "character_id", "related_id"])
              .doUpdateSet({ option_id: field.random_table?.option_id }),
          )
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
          .onConflict((oc) =>
            oc
              .columns(["character_field_id", "character_id", "related_id"])

              .doUpdateSet({
                start_day: field.calendar?.start_day,
                start_month_id: field.calendar?.start_month_id,
                start_year: field.calendar?.start_year,
                end_day: field.calendar?.end_day,
                end_month_id: field.calendar?.end_month_id,
                end_year: field.calendar?.end_year,
              }),
          )

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
        is_project_owner: permissions.is_project_owner,
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
          tx.deleteFrom("character_images_fields").where("character_images_fields.character_id", "=", params.id).execute(),
          tx
            .deleteFrom("character_blueprint_instance_fields")
            .where("character_blueprint_instance_fields.character_id", "=", params.id)
            .execute(),
          tx
            .deleteFrom("character_locations_fields")
            .where("character_locations_fields.character_id", "=", params.id)
            .execute(),
          tx.deleteFrom("character_value_fields").where("character_value_fields.character_id", "=", params.id).execute(),
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
      await tx.deleteFrom("_charactersTodocuments").where("_charactersTodocuments.B", "in", idsToRemove).execute();
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
    await UpdateEntityPermissions(tx, params.id, body.permissions);
  }
  if (body.data && Object.keys(body.data).length > 0)
    await tx.updateTable("characters").where("characters.id", "=", params.id).set(body.data).execute();
}
type FormattedNodeType = {
  id: string;
  character_id: string;
  label: string | null;
  width: number;
  height: number;
  image_id: string | never[];
  is_locked: boolean;
  x: number;
  y: number;
};
type FormattedEdgeType = Pick<Omit<Edges, "id">, "source_id" | "target_id"> & { id: string };

const layoutOptions: LayoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "100",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  // "elk.layered.layering.strategy": "NETWORK_SIMPLEX",
  // "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
  "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
  "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
  "elk.layered.crossingMinimization.forceNodeModelOrder": "false",
  // "elk.layered.crossingMinimization.greedySwitch.type": "ONE_SIDED",
};

const elk = new Elk({
  defaultLayoutOptions: layoutOptions,
  // eslint-disable-next-line no-undef
  workerFactory: () => new Worker("elkjs/lib/elk-worker.min.js"),
});

async function layoutFamilyTree(nodes: FormattedNodeType[], edges: FormattedEdgeType[]): Promise<FormattedNodeType[]> {
  // Convert your nodes and edges to the ELK graph structure
  const elkGraph: ElkNode = {
    id: "root",
    children: nodes.map((n) => ({
      ...n,
      targetPosition: "top",
      sourcePosition: "bottom",
    })),
    edges: edges.map((edge) => {
      return {
        id: edge.id,
        sources: [edge.source_id],
        targets: [edge.target_id],
      };
    }),
  };

  // Perform the layout computation
  const result = await elk.layout(elkGraph);

  return (result.children || [])?.map((node) => {
    const [x, y] = closestDivisibleBy50(node.x || 0, node.y || 0);

    return { ...node, x, y };
  }) as FormattedNodeType[];
}

export async function getCharacterFamily(
  params: { id: string; relation_type_id: string; count: string },
  permissions: PermissionDecorationType,
  isPublic?: boolean,
) {
  const { id, relation_type_id, count } = params;

  const relationType = await db
    .selectFrom("character_relationship_types")
    .where("character_relationship_types.id", "=", relation_type_id)
    .select([
      "character_relationship_types.id",
      "character_relationship_types.title",
      "character_relationship_types.ascendant_title",
      "character_relationship_types.descendant_title",
    ])
    .executeTakeFirstOrThrow();

  const isDirect = !relationType.ascendant_title && !relationType.descendant_title;
  const targetArrow = isDirect ? "none" : "triangle";
  const curveStyle = isDirect ? "straight" : "taxi";

  // If it is not a hierarchical relationship
  if (isDirect) {
    let a_query = db
      .selectFrom("characters_relationships")
      .leftJoin("characters", "characters.id", "characters_relationships.character_b_id")
      .leftJoin("entity_permissions", "entity_permissions.related_id", "character_a_id")
      .select([
        "characters.id",
        "characters.full_name",
        "characters.portrait_id",
        "characters.project_id",
        "characters.is_public",
      ])
      .where((wb) =>
        wb.and([
          wb("character_a_id", "=", id),
          wb("relation_type_id", "=", relation_type_id),
          wb.or([
            wb("characters.owner_id", "=", permissions?.user_id),
            wb.and([
              wb("entity_permissions.user_id", "=", permissions?.user_id),
              wb("entity_permissions.permission_id", "=", permissions?.permission_id),
              wb("entity_permissions.related_id", "=", wb.ref("character_b_id")),
            ]),
            wb("entity_permissions.role_id", "=", permissions?.role_id),
          ]),
        ]),
      )
      .$if(!!isPublic, (qb) => {
        if (isPublic) qb = qb.where("characters.is_public", "=", isPublic);

        return qb;
      });
    let b_query = db
      .selectFrom("characters_relationships")
      .leftJoin("characters", "characters.id", "characters_relationships.character_a_id")
      .leftJoin("entity_permissions", "entity_permissions.related_id", "character_b_id")
      .select(["characters.id", "characters.full_name", "portrait_id", "project_id", "characters.is_public"])
      .where((wb) =>
        wb.and([
          wb("character_b_id", "=", id),
          wb("relation_type_id", "=", relation_type_id),
          wb.or([
            wb("characters.owner_id", "=", permissions?.permission_id),
            wb.and([
              wb("entity_permissions.user_id", "=", permissions?.user_id),
              wb("entity_permissions.permission_id", "=", permissions?.permission_id),
              wb("entity_permissions.related_id", "=", wb.ref("character_a_id")),
            ]),
            wb("entity_permissions.role_id", "=", permissions?.role_id),
          ]),
        ]),
      )
      .$if(!!isPublic, (qb) => {
        if (isPublic) qb = qb.where("characters.is_public", "=", isPublic);

        return qb;
      });

    let char_query = db
      .selectFrom("characters")
      .where("characters.id", "=", id)
      .$if(!!isPublic, (qb) => {
        if (isPublic) qb = qb.where("characters.is_public", "=", isPublic);

        return qb;
      })
      .select(["characters.id", "characters.full_name", "portrait_id", "project_id", "characters.is_public"]);

    char_query = getNestedReadPermission(
      char_query,
      permissions?.is_project_owner,
      permissions?.user_id,
      "characters.id",
      "read_characters",
      isPublic,
    );

    const targets = await a_query.union(b_query).union(char_query).execute();

    const nodes = targets.map((target) => ({
      id: target.id,
      character_id: target.id,
      label: target.full_name,
      width: 50,
      height: 50,
      image_id: target.portrait_id ?? [],
      is_locked: false,
    }));

    const edges = targets
      .filter((t) => t.id !== params.id && (isPublic ? t.is_public : true))
      .map((target) => {
        return {
          id: randomUUID(),
          source_id: params.id,
          target_id: target.id,
          target_arrow_shape: targetArrow,
          curve_style: curveStyle,
          taxi_direction: "downward",
        };
      });
    return { data: { edges, nodes }, ok: true, message: MessageEnum.success, role_access: true };
  }

  const baseCharacterRelationships = await sql<{
    character_a_id: string;
    character_b_id: string;
    depth: number;
  }>`
  WITH RECURSIVE
  related_characters (character_a_id, character_b_id, depth) AS (
    SELECT
      character_a_id,
      character_b_id,
      1
    FROM
      characters_relationships
    WHERE
      (character_a_id = ${id} OR character_b_id = ${id}) AND relation_type_id = ${relation_type_id}
    UNION
    SELECT
      cr.character_a_id,
      cr.character_b_id,
      depth + 1
    FROM
      characters_relationships cr
      INNER JOIN related_characters rc ON cr.character_a_id = rc.character_b_id
      OR cr.character_b_id = rc.character_a_id
    WHERE
      cr.relation_type_id = ${relation_type_id}
        AND
      depth < ${Number(count || 1) - (Number(count) <= 2 ? 0 : 1)}

  )
SELECT
  *
FROM
  related_characters;
  `.execute(db);

  const ids = Array.from(new Set(baseCharacterRelationships.rows.flatMap((r) => [r.character_a_id, r.character_b_id])));
  if (ids.length === 0) {
    return { data: { nodes: [], edges: [] }, ok: true, message: MessageEnum.success, role_access: true };
  }
  const mainCharacters = await db
    .selectFrom("characters")
    .select(["characters.id", "characters.portrait_id", "characters.full_name", "characters.is_public"])
    .leftJoin("entity_permissions", "entity_permissions.related_id", "characters.id")
    .where((wb) =>
      wb.and([
        wb("characters.id", "in", ids),
        wb.or([
          wb("characters.owner_id", "=", permissions?.user_id),
          wb.and([
            wb("entity_permissions.user_id", "=", permissions?.user_id),
            wb("entity_permissions.permission_id", "=", permissions?.permission_id),
            wb("entity_permissions.related_id", "=", wb.ref("characters.id")),
          ]),
          wb("entity_permissions.role_id", "=", permissions?.role_id),
        ]),
      ]),
    )
    .$if(!!isPublic, (qb) => {
      if (isPublic) qb.where("characters.is_public", "=", isPublic);

      return qb;
    })
    .execute();

  const additionalChars =
    Number(count) <= 2
      ? []
      : await db
          .selectFrom("characters")
          .leftJoin("entity_permissions", "entity_permissions.related_id", "characters.id")
          .leftJoin("characters_relationships", "character_b_id", "characters.id")
          .where((wb) =>
            wb.and([
              wb("character_a_id", "in", ids),
              wb("characters.id", "not in", ids),
              wb("relation_type_id", "=", relation_type_id),
              wb.or([
                wb("characters.owner_id", "=", permissions?.user_id),
                wb.and([
                  wb("entity_permissions.user_id", "=", permissions?.user_id),
                  wb("entity_permissions.permission_id", "=", permissions?.permission_id),
                  wb("entity_permissions.related_id", "=", wb.ref("character_a_id")),
                ]),
                wb("entity_permissions.role_id", "=", permissions?.role_id),
              ]),
            ]),
          )
          .$if(!!isPublic, (qb) => {
            if (isPublic) qb.where("characters.is_public", "=", isPublic);

            return qb;
          })
          .select(["characters.id", "portrait_id", "full_name", "character_a_id", "characters.is_public"])
          .execute();
  const additionalCharsChildren = await db
    .selectFrom("characters")
    .leftJoin("characters_relationships", "character_a_id", "characters.id")
    .leftJoin("entity_permissions", "entity_permissions.related_id", "characters.id")
    .where((wb) =>
      wb.and([
        wb("character_b_id", "in", ids),
        wb("characters.id", "not in", ids),
        wb("relation_type_id", "=", relation_type_id),
        wb.or([
          wb("characters.owner_id", "=", permissions?.user_id),
          wb.and([
            wb("entity_permissions.user_id", "=", permissions?.user_id),
            wb("entity_permissions.permission_id", "=", permissions?.permission_id),
            wb("entity_permissions.related_id", "=", wb.ref("character_b_id")),
          ]),
          wb("entity_permissions.role_id", "=", permissions?.role_id),
        ]),
      ]),
    )
    .$if(!!isPublic, (qb) => {
      if (isPublic) qb.where("characters.is_public", "=", isPublic);

      return qb;
    })
    .select(["characters.id", "characters.portrait_id", "characters.full_name", "character_b_id", "characters.is_public"])
    .execute();

  const permittedCharacters = [...mainCharacters, ...additionalChars, ...additionalCharsChildren];
  const permittedIds = permittedCharacters.map((c) => c.id);

  const withParents = permittedCharacters
    .filter((char) => (isPublic ? char.is_public : true))
    .map((char) => {
      const parents = Array.from(
        new Set(
          baseCharacterRelationships.rows
            .filter((r) => r.character_a_id === char.id)
            .map((p) => p.character_b_id)
            .concat(additionalChars.filter((c) => c.character_a_id === char.id).map((c) => c.id as string)),
        ),
      );
      const children = Array.from(
        new Set(
          baseCharacterRelationships.rows
            .filter((r) => r.character_b_id === char.id)
            .map((p) => p.character_a_id)
            .concat(additionalCharsChildren.filter((c) => c.character_b_id === char.id).map((c) => c.id as string)),
        ),
      );
      return { ...char, parents, children };
    });

  const uniqueChars = uniqBy(withParents, "id");

  const nodes: FormattedNodeType[] = uniqueChars.map((c) => ({
    id: c.id,
    character_id: c.id,
    label: c.full_name,
    width: 50,
    height: 50,
    image_id: c.portrait_id ?? [],
    is_locked: false,
    x: 0,
    y: 0,
  }));

  const edges = uniqueChars.flatMap((c) => {
    const base = [];
    const existingParents: string[] = [];
    const existingChildren: string[] = [];
    if ("parents" in c && c?.parents.length) {
      const filteredParents = isPublic
        ? c.parents.filter((parent_id) => uniqueChars.some((char) => char.id === parent_id))
        : c.parents;
      if (filteredParents.length) {
        for (let index = 0; index < filteredParents.length; index++) {
          if (
            permittedIds.includes(c.parents[index]) &&
            permittedIds.includes(c.id) &&
            !existingParents.includes(`${c.parents[index]}-${c.id}`)
          ) {
            existingParents.push(`${c.parents[index]}-${c.id}`);
            base.push({
              id: randomUUID(),
              source_id: c.parents[index],
              target_id: c.id,
              target_arrow_shape: targetArrow,
              curve_style: curveStyle,
              taxi_direction: "downward",
            });
          }
        }
      }
    }

    if ("children" in c && c?.children.length) {
      const filteredChildren = isPublic
        ? c.children.filter((child_id) => uniqueChars.some((char) => char.id === child_id))
        : c.children;

      for (let index = 0; index < filteredChildren.length; index++) {
        if (
          permittedIds.includes(c.children[index]) &&
          permittedIds.includes(c.id) &&
          !existingChildren.includes(`${c.id}${c.children[index]}`)
        ) {
          existingChildren.push(`${c.id}${c.children[index]}`);

          base.push({
            id: randomUUID(),
            source_id: c.id,
            target_id: c.children[index],
            target_arrow_shape: targetArrow,
            curve_style: curveStyle,
            taxi_direction: "downward",
          });
        }
      }
    }
    return base;
  });

  const layoutNodes = await layoutFamilyTree(nodes || [], edges || []);
  return {
    data: {
      nodes: layoutNodes,
      edges,
    },
    ok: true,
    message: MessageEnum.success,
    role_access: true,
  };
}
