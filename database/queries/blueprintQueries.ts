import { SelectExpression } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { MessageEnum } from "../../enums";
import { PermissionDecorationType } from "../../types/requestTypes";
import { GetRelatedEntityPermissionsAndRoles } from "../../utils/relationalQueryHelpers";
import { db } from "../db";
import { ReadBlueprintSchema } from "../validation";
import { checkEntityLevelPermission } from "./ownershipCheck";

type ReadBodyType = (typeof ReadBlueprintSchema)["static"];

export async function readBlueprint(body: ReadBodyType, params: { id: string }, permissions: PermissionDecorationType) {
  let query = db
    .selectFrom("blueprints")
    .$if(!body.fields?.length, (qb) => qb.selectAll())
    .$if(!!body.fields?.length, (qb) =>
      qb.clearSelect().select(body.fields.map((f) => `blueprints.${f}`) as SelectExpression<DB, "blueprints">[]),
    )
    .where("blueprints.id", "=", params.id)
    .$if(!!body?.relations?.blueprint_fields, (qb) =>
      qb.select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom("blueprint_fields")
            .whereRef("blueprint_fields.parent_id", "=", "blueprints.id")
            .select([
              "blueprint_fields.id",
              "blueprint_fields.title",
              "blueprint_fields.options",
              "blueprint_fields.field_type",
              "blueprint_fields.sort",
              "blueprint_fields.formula",
              "blueprint_fields.random_table_id",
              "blueprint_fields.blueprint_id",
              (eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom("blueprints")
                    .whereRef("blueprints.id", "=", "blueprint_fields.blueprint_id")
                    .select(["id", "title", "icon"]),
                ).as("blueprint"),
              (eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom("random_tables")
                    .whereRef("blueprint_fields.random_table_id", "=", "random_tables.id")
                    .select([
                      "id",
                      "title",
                      (ebb) =>
                        jsonArrayFrom(
                          ebb
                            .selectFrom("random_table_options")
                            .whereRef("random_tables.id", "=", "random_table_options.parent_id")
                            .select([
                              "id",
                              "title",
                              (ebbb) =>
                                jsonArrayFrom(
                                  ebbb
                                    .selectFrom("random_table_suboptions")
                                    .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id")
                                    .select(["id", "title"]),
                                ).as("random_table_suboptions"),
                            ]),
                        ).as("random_table_options"),
                    ]),
                ).as("random_table"),
              (eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom("calendars")
                    .whereRef("blueprint_fields.calendar_id", "=", "calendars.id")
                    .select([
                      "id",
                      "title",
                      "days",
                      (ebb) =>
                        jsonArrayFrom(
                          ebb
                            .selectFrom("months")
                            .whereRef("calendars.id", "=", "months.parent_id")
                            .select(["months.id", "months.title", "months.days"])
                            .orderBy("months.sort"),
                        ).as("months"),
                    ]),
                ).as("calendar"),
            ])
            .orderBy("sort"),
        ).as("blueprint_fields"),
      ),
    )
    .$if(!!body?.relations?.blueprint_instances, (qb) =>
      qb.select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom("blueprint_instances")
            .whereRef("blueprint_instances.parent_id", "=", "blueprints.id")
            .select(["blueprint_instances.id", "blueprint_instances.parent_id"]),
        ).as("blueprint_instances"),
      ),
    );

  if (permissions.is_project_owner) {
    query = query.leftJoin("entity_permissions", (join) => join.on("entity_permissions.related_id", "=", params.id));
  } else {
    query = checkEntityLevelPermission(query, permissions, "blueprints", params.id);
  }
  if (body.permissions) {
    query = GetRelatedEntityPermissionsAndRoles(query, permissions, "blueprints", params.id);
  }

  const data = await query.executeTakeFirstOrThrow();
  return { data, message: MessageEnum.success, ok: true, role_access: true };
}
