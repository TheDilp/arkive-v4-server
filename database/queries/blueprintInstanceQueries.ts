import { AliasedRawBuilder, AliasedSelectQueryBuilder, ExpressionBuilder, SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { MessageEnum } from "../../enums";
import { PermissionDecorationType } from "../../types/requestTypes";
import {
  CreateEntityPermissions,
  CreateTagRelations,
  GetRelatedEntityPermissionsAndRoles,
  TagQuery,
} from "../../utils/relationalQueryHelpers";
import { getEntityWithOwnerId } from "../../utils/utils";
import { db } from "../db";
import { InsertBlueprintInstanceSchema, ReadBlueprintInstanceSchema } from "../validation";
import { checkEntityLevelPermission, getNestedReadPermission } from "./ownershipCheck";

type ReadBodyType = (typeof ReadBlueprintInstanceSchema)["static"];
type InsertBodyType = (typeof InsertBlueprintInstanceSchema)["static"];

export async function readBlueprintInstance(body: ReadBodyType, params: { id: string }, permissions: PermissionDecorationType) {
  let query = db
    .selectFrom("blueprint_instances")
    .distinctOn(
      body.orderBy?.length
        ? (["blueprint_instances.id", ...body.orderBy.map((order) => order.field)] as any)
        : "blueprint_instances.id",
    )
    .where("blueprint_instances.id", "=", params.id)
    .select(body.fields.map((f) => `blueprint_instances.${f}`) as SelectExpression<DB, "blueprint_instances">[])

    .select([
      (eb) =>
        jsonObjectFrom(
          eb
            .selectFrom("blueprints")
            .whereRef("blueprints.id", "=", "blueprint_instances.parent_id")
            .select(["blueprints.title", "blueprints.title_name", "blueprints.icon"]),
        ).as("blueprint"),

      (eb) => {
        const bp_fields_select: (
          | string
          | ((ebb: ExpressionBuilder<DB, any>) => AliasedSelectQueryBuilder<any, any> | AliasedRawBuilder<any, any>)
        )[] = [
          "blueprint_fields.id",
          "blueprint_fields.field_type",
          "blueprint_fields.sort",
          (ebb) =>
            ebb
              .selectFrom("blueprint_instance_value")
              .whereRef("blueprint_instance_value.blueprint_field_id", "=", "blueprint_fields.id")
              .where("blueprint_instance_value.blueprint_instance_id", "=", params.id)
              .select(["value"])
              .as("value"),
        ];

        if (permissions.all_permissions?.read_random_tables) {
          bp_fields_select.push(
            (ebb) => {
              let random_table_query = ebb
                .selectFrom("random_tables")
                .whereRef("random_tables.id", "=", "blueprint_fields.random_table_id")
                .select(["random_tables.id", "random_tables.title"]);

              random_table_query = getNestedReadPermission(
                random_table_query,
                permissions.is_project_owner,
                permissions.user_id,
                "blueprint_fields.random_table_id",
                "read_random_tables",
              );

              return jsonObjectFrom(random_table_query).as("random_table_data");
            },
            (ebb) => {
              let random_table_query = ebb
                .selectFrom("blueprint_instance_random_tables")
                .whereRef("blueprint_instance_random_tables.blueprint_field_id", "=", "blueprint_fields.id")
                .where("blueprint_instance_random_tables.blueprint_instance_id", "=", params.id)
                .select(["blueprint_instance_random_tables.related_id", "option_id"]);
              random_table_query = getNestedReadPermission(
                random_table_query,
                permissions.is_project_owner,
                permissions.user_id,
                "blueprint_fields.random_table_id",
                "read_random_tables",
              );

              return jsonObjectFrom(random_table_query).as("random_table");
            },
          );
        }

        if (permissions.all_permissions?.read_characters) {
          bp_fields_select.push((ebb) => {
            let character_query = ebb
              .selectFrom("blueprint_instance_characters")
              .whereRef("blueprint_instance_characters.blueprint_field_id", "=", "blueprint_fields.id")
              .where("blueprint_instance_characters.blueprint_instance_id", "=", params.id)
              .select([
                "blueprint_instance_characters.related_id",
                "blueprint_instance_characters.sort",
                (ebbb) =>
                  jsonObjectFrom(
                    ebbb
                      .selectFrom("characters")
                      .whereRef("blueprint_instance_characters.related_id", "=", "characters.id")
                      .select(["characters.id", "characters.full_name", "characters.portrait_id"]),
                  ).as("character"),
              ]);

            character_query = getNestedReadPermission(
              character_query,
              permissions.is_project_owner,
              permissions.user_id,
              "blueprint_instance_characters.related_id",
              "read_characters",
            );

            return jsonArrayFrom(character_query).as("characters");
          });
        }
        if (permissions.all_permissions?.read_blueprint_instances) {
          bp_fields_select.push((ebb) => {
            let bpi_query = ebb
              .selectFrom("blueprint_instance_blueprint_instances")
              .whereRef("blueprint_instance_blueprint_instances.blueprint_field_id", "=", "blueprint_fields.id")
              .where("blueprint_instance_blueprint_instances.blueprint_instance_id", "=", params.id)
              .select([
                "blueprint_instance_blueprint_instances.related_id",
                "blueprint_instance_blueprint_instances.sort",
                (ebbb) =>
                  jsonObjectFrom(
                    ebbb
                      .selectFrom("blueprint_instances")
                      .whereRef("blueprint_instance_blueprint_instances.related_id", "=", "blueprint_instances.id")
                      .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
                      .select([
                        "blueprint_instances.id",
                        "blueprint_instances.title",
                        "blueprints.icon as icon",
                        "blueprint_instances.parent_id",
                      ]),
                  ).as("blueprint_instance"),
              ]);

            bpi_query = getNestedReadPermission(
              bpi_query,
              permissions.is_project_owner,
              permissions.user_id,
              "blueprint_instance_blueprint_instances.related_id",
              "read_blueprint_instances",
            );

            return jsonArrayFrom(bpi_query).as("blueprint_instances");
          });
        }
        if (permissions.all_permissions?.read_documents) {
          bp_fields_select.push((ebb) => {
            let document_query = ebb
              .selectFrom("blueprint_instance_documents")
              .whereRef("blueprint_instance_documents.blueprint_field_id", "=", "blueprint_fields.id")
              .where("blueprint_instance_documents.blueprint_instance_id", "=", params.id)
              .select([
                "blueprint_instance_documents.related_id",
                "blueprint_instance_documents.sort",
                (ebbb) =>
                  jsonObjectFrom(
                    ebbb
                      .selectFrom("documents")
                      .whereRef("blueprint_instance_documents.related_id", "=", "documents.id")
                      .select(["documents.id", "documents.title", "documents.icon"]),
                  ).as("document"),
              ]);

            document_query = getNestedReadPermission(
              document_query,
              permissions.is_project_owner,
              permissions.user_id,
              "blueprint_instance_documents.related_id",
              "read_documents",
            );

            return jsonArrayFrom(document_query).as("documents");
          });
        }
        if (permissions.all_permissions?.read_map_pins) {
          bp_fields_select.push((ebb) => {
            let map_pin_query = ebb
              .selectFrom("blueprint_instance_map_pins")
              .whereRef("blueprint_instance_map_pins.blueprint_field_id", "=", "blueprint_fields.id")
              .where("blueprint_instance_map_pins.blueprint_instance_id", "=", params.id)
              .select([
                "blueprint_instance_map_pins.related_id",
                "blueprint_instance_map_pins.sort",
                (ebbb) =>
                  jsonObjectFrom(
                    ebbb
                      .selectFrom("map_pins")
                      .whereRef("blueprint_instance_map_pins.related_id", "=", "map_pins.id")
                      .select(["map_pins.id", "map_pins.title", "map_pins.icon", "map_pins.parent_id"]),
                  ).as("map_pin"),
              ]);

            map_pin_query = getNestedReadPermission(
              map_pin_query,
              permissions.is_project_owner,
              permissions.user_id,
              "blueprint_instance_map_pins.related_id",
              "read_map_pins",
            );

            return jsonArrayFrom(map_pin_query).as("map_pins");
          });
        }
        if (permissions.all_permissions?.read_calendars) {
          bp_fields_select.push((ebb) => {
            let calendar_query = ebb
              .selectFrom("blueprint_instance_calendars")
              .whereRef("blueprint_instance_calendars.blueprint_field_id", "=", "blueprint_fields.id")
              .where("blueprint_instance_calendars.blueprint_instance_id", "=", params.id)
              .select([
                "blueprint_instance_calendars.related_id",
                "start_day",
                "start_month_id",
                "start_year",
                "end_day",
                "end_month_id",
                "end_year",
              ]);

            calendar_query = getNestedReadPermission(
              calendar_query,
              permissions.is_project_owner,
              permissions.user_id,
              "blueprint_instance_calendars.related_id",
              "read_calendars",
            );

            return jsonObjectFrom(calendar_query).as("calendar");
          });
        }
        if (permissions.all_permissions?.read_events) {
          bp_fields_select.push((ebb) => {
            let event_query = ebb
              .selectFrom("blueprint_instance_events")
              .whereRef("blueprint_instance_events.blueprint_field_id", "=", "blueprint_fields.id")
              .where("blueprint_instance_events.blueprint_instance_id", "=", params.id)
              .select([
                "blueprint_instance_events.related_id",
                "blueprint_instance_events.sort",
                (ebbb) =>
                  jsonObjectFrom(
                    ebbb
                      .selectFrom("events")
                      .whereRef("blueprint_instance_events.related_id", "=", "events.id")
                      .select(["events.id", "events.title", "events.parent_id"]),
                  ).as("event"),
              ]);

            event_query = getNestedReadPermission(
              event_query,
              permissions.is_project_owner,
              permissions.user_id,
              "blueprint_instance_events.related_id",
              "read_events",
            );

            return jsonArrayFrom(event_query).as("events");
          });
        }
        if (permissions.all_permissions?.read_assets) {
          bp_fields_select.push((ebb) => {
            let image_query = ebb
              .selectFrom("blueprint_instance_images")
              .whereRef("blueprint_instance_images.blueprint_field_id", "=", "blueprint_fields.id")
              .where("blueprint_instance_images.blueprint_instance_id", "=", params.id)
              .select([
                "blueprint_instance_images.related_id",
                "blueprint_instance_images.sort",
                (ebbb) =>
                  jsonObjectFrom(
                    ebbb
                      .selectFrom("images")
                      .whereRef("blueprint_instance_images.related_id", "=", "images.id")
                      .select(["id", "title"]),
                  ).as("image"),
              ]);
            image_query = getNestedReadPermission(
              image_query,
              permissions.is_project_owner,
              permissions.user_id,
              "blueprint_instance_images.related_id",
              "read_assets",
            );
            return jsonArrayFrom(image_query).as("images");
          });
        }

        return jsonArrayFrom(
          eb
            .selectFrom("blueprint_fields")
            .whereRef("blueprint_fields.parent_id", "=", "blueprint_instances.parent_id")
            // @ts-ignore
            .select(bp_fields_select),
        ).as("blueprint_fields");
      },
    ]);

  if (body?.relations?.tags && permissions.all_permissions?.read_tags) {
    query = query.select((eb) =>
      TagQuery(eb, "_blueprint_instancesTotags", "blueprint_instances", permissions.is_project_owner, permissions.user_id),
    );
  }

  if (permissions.is_project_owner) {
    query = query.leftJoin("entity_permissions", (join) => join.on("entity_permissions.related_id", "=", params.id));
  } else {
    query = checkEntityLevelPermission(query, permissions, "blueprint_instances", params.id);
  }
  if (body.permissions) {
    query = GetRelatedEntityPermissionsAndRoles(query, permissions, "blueprint_instances", params.id);
  }

  const data = await query.executeTakeFirstOrThrow();

  return { data, message: MessageEnum.success, ok: true, role_access: true };
}

export async function createBlueprintInstance(body: InsertBodyType, permissions: PermissionDecorationType) {
  const id = await db.transaction().execute(async (tx) => {
    const newInstance = await tx
      .insertInto("blueprint_instances")
      .values(getEntityWithOwnerId(body.data, permissions.user_id))
      .returning("id")
      .executeTakeFirstOrThrow();
    if (body.relations?.blueprint_fields?.length) {
      await Promise.all(
        body.relations.blueprint_fields.map(async (field) => {
          if (field?.characters?.length) {
            const { characters } = field;
            await tx
              .insertInto("blueprint_instance_characters")
              .values(
                characters.map((char) => ({
                  blueprint_field_id: field.id,
                  blueprint_instance_id: newInstance.id,
                  related_id: char.related_id,
                  sort: char.sort,
                })),
              )
              .execute();
            return;
          }
          if (field?.blueprint_instances?.length) {
            const { blueprint_instances } = field;
            await tx
              .insertInto("blueprint_instance_blueprint_instances")
              .values(
                blueprint_instances.map((bpi) => ({
                  blueprint_field_id: field.id,
                  blueprint_instance_id: newInstance.id,
                  related_id: bpi.related_id,
                  sort: bpi.sort,
                })),
              )
              .execute();
            return;
          }
          if (field?.documents?.length) {
            const { documents } = field;
            await tx
              .insertInto("blueprint_instance_documents")
              .values(
                documents.map((doc) => ({
                  blueprint_field_id: field.id,
                  blueprint_instance_id: newInstance.id,
                  related_id: doc.related_id,
                  sort: doc.sort,
                })),
              )
              .execute();
            return;
          }
          if (field?.map_pins?.length) {
            const { map_pins } = field;
            await tx
              .insertInto("blueprint_instance_map_pins")
              .values(
                map_pins.map((map_pin) => ({
                  blueprint_field_id: field.id,
                  blueprint_instance_id: newInstance.id,
                  related_id: map_pin.related_id,
                  sort: map_pin.sort,
                })),
              )
              .execute();
            return;
          }
          if (field.images?.length) {
            const { images } = field;
            await tx
              .insertInto("blueprint_instance_images")
              .values(
                images.map((image) => ({
                  blueprint_field_id: field.id,
                  blueprint_instance_id: newInstance.id,
                  related_id: image.related_id,
                  sort: image.sort,
                })),
              )
              .execute();
            return;
          }
          if (field?.random_table) {
            const { random_table } = field;
            await tx
              .insertInto("blueprint_instance_random_tables")
              .values({
                blueprint_field_id: field.id,
                blueprint_instance_id: newInstance.id,
                related_id: random_table.related_id,
                option_id: random_table?.option_id,
              })
              .execute();
            return;
          }
          if (field?.calendar) {
            await tx
              .insertInto("blueprint_instance_calendars")
              .values({
                blueprint_field_id: field.id,
                blueprint_instance_id: newInstance.id,
                related_id: field.calendar.related_id,
                start_day: field.calendar?.start_day,
                start_month_id: field.calendar?.start_month_id,
                start_year: field.calendar?.start_year,
                end_day: field.calendar?.end_day,
                end_month_id: field.calendar?.end_month_id,
                end_year: field.calendar?.end_year,
              })
              .execute();
          }
          if (field?.value || typeof field?.value === "boolean") {
            await tx
              .insertInto("blueprint_instance_value")
              .values({
                blueprint_field_id: field.id,
                blueprint_instance_id: newInstance.id,
                value: JSON.stringify(field.value),
              })
              .execute();
          }
        }),
      );
    }
    if (body.relations?.tags?.length) {
      await CreateTagRelations({
        tx,
        relationalTable: "_blueprint_instancesTotags",
        id: newInstance.id,
        tags: body.relations.tags,
      });
    }
    if (body.permissions?.length) {
      await CreateEntityPermissions(tx, newInstance.id, body.permissions);
    }
    return newInstance.id;
  });
  const data = await db
    .selectFrom("blueprints")
    .select(["project_id"])
    .where("id", "=", body.data.parent_id)
    .executeTakeFirstOrThrow();

  return {
    data: { id, project_id: data.project_id, title: body.data.title },
    message: `Blueprint instance ${MessageEnum.successfully_created}`,
    ok: true,
    role_access: true,
  };
}
