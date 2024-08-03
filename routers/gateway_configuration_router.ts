import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { getHasEntityPermission } from "../database/queries";
import {
  InsertGatewayConfiguration,
  ListGatewayConfigurationSchema,
  UpdateGatewayConfiguration,
} from "../database/validation/gateway_configurations";
import { MessageEnum } from "../enums";
import { noRoleAccessErrorHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { getEntityWithOwnerId } from "../utils/utils";

const relatedEntities = [
  "gateway_configuration_characters" as const,
  "gateway_configuration_blueprint_instances" as const,
  "gateway_configuration_documents" as const,
  "gateway_configuration_maps" as const,
  "gateway_configuration_map_pins" as const,
  "gateway_configuration_events" as const,
  "gateway_configuration_images" as const,
  "gateway_configuration_random_tables" as const,
];

export function gateway_configuration_router(app: Elysia) {
  return app.group("/gateway_configurations", (server) =>
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
          await db.transaction().execute(async (tx) => {
            const config = await tx
              .insertInto("gateway_configurations")
              .values(getEntityWithOwnerId(body.data, permissions.user_id))
              .returning("id")
              .executeTakeFirst();

            const requests = [];
            if (config?.id) {
              if (body.relations.characters.length) {
                requests.push(
                  tx
                    .insertInto("gateway_configuration_characters")
                    .values(body.relations.characters.map((related_id) => ({ related_id, parent_id: config.id })))
                    .execute(),
                );
              }
              if (body.relations.blueprint_instances.length) {
                requests.push(
                  tx
                    .insertInto("gateway_configuration_blueprint_instances")
                    .values(body.relations.blueprint_instances.map((related_id) => ({ related_id, parent_id: config.id })))
                    .execute(),
                );
              }
              if (body.relations.documents.length) {
                requests.push(
                  tx
                    .insertInto("gateway_configuration_documents")
                    .values(body.relations.documents.map((related_id) => ({ related_id, parent_id: config.id })))
                    .execute(),
                );
              }
              if (body.relations.maps.length) {
                requests.push(
                  tx
                    .insertInto("gateway_configuration_maps")
                    .values(body.relations.maps.map((related_id) => ({ related_id, parent_id: config.id })))
                    .execute(),
                );
              }
              if (body.relations.map_pins.length) {
                requests.push(
                  tx
                    .insertInto("gateway_configuration_map_pins")
                    .values(body.relations.map_pins.map((related_id) => ({ related_id, parent_id: config.id })))
                    .execute(),
                );
              }
              if (body.relations.events.length) {
                requests.push(
                  tx
                    .insertInto("gateway_configuration_events")
                    .values(body.relations.events.map((related_id) => ({ related_id, parent_id: config.id })))
                    .execute(),
                );
              }
              if (body.relations.images.length) {
                requests.push(
                  tx
                    .insertInto("gateway_configuration_images")
                    .values(body.relations.images.map((related_id) => ({ related_id, parent_id: config.id })))
                    .execute(),
                );
              }
              if (body.relations.random_tables.length) {
                requests.push(
                  tx
                    .insertInto("gateway_configuration_random_tables")
                    .values(body.relations.random_tables.map((related_id) => ({ related_id, parent_id: config.id })))
                    .execute(),
                );
              }

              await Promise.all(requests);
            }
          });

          return { ok: true, role_access: true, message: `Gateway configuration ${MessageEnum.successfully_created}` };
        },
        {
          body: InsertGatewayConfiguration,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          let query = db
            .selectFrom("gateway_configurations")
            .select(body.fields as SelectExpression<DB, "gateway_configurations">[])
            .where("project_id", "=", body.data.project_id);

          if (body.relations?.entities) {
            for (let index = 0; index < relatedEntities.length; index++) {
              query = query.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom(relatedEntities[index])
                    .select([`${relatedEntities[index]}.related_id`])
                    .whereRef(`${relatedEntities[index]}.parent_id`, "=", "gateway_configurations.id"),
                ).as(relatedEntities[index].replace("gateway_configuration_", "")),
              );
            }
          }
          const data = await query.execute();

          return { data, ok: true, message: MessageEnum.success, role_access: true };
        },
        { body: ListGatewayConfigurationSchema, response: ResponseWithDataSchema },
      )
      .post(
        "/update/:id",
        async ({ params, body, permissions }) => {
          const permissionCheck = await getHasEntityPermission("gateway_configurations", params.id, permissions);
          if (permissionCheck) {
            await db.transaction().execute(async (tx) => {
              const config = await tx.updateTable("gateway_configurations").set(body.data).returning("id").executeTakeFirst();

              const deleteRequests = [];
              const requests = [];
              if (config?.id) {
                if (body.relations.characters.length) {
                  deleteRequests.push(
                    tx.deleteFrom("gateway_configuration_characters").where("parent_id", "=", params.id).execute(),
                  );

                  requests.push(
                    tx
                      .insertInto("gateway_configuration_characters")
                      .values(body.relations.characters.map((related_id) => ({ related_id, parent_id: config.id })))
                      .execute(),
                  );
                }
                if (body.relations.blueprint_instances.length) {
                  deleteRequests.push(
                    tx.deleteFrom("gateway_configuration_blueprint_instances").where("parent_id", "=", params.id).execute(),
                  );
                  requests.push(
                    tx
                      .insertInto("gateway_configuration_blueprint_instances")
                      .values(body.relations.blueprint_instances.map((related_id) => ({ related_id, parent_id: config.id })))
                      .execute(),
                  );
                }
                if (body.relations.documents.length) {
                  deleteRequests.push(
                    tx.deleteFrom("gateway_configuration_documents").where("parent_id", "=", params.id).execute(),
                  );
                  requests.push(
                    tx
                      .insertInto("gateway_configuration_documents")
                      .values(body.relations.documents.map((related_id) => ({ related_id, parent_id: config.id })))
                      .execute(),
                  );
                }
                if (body.relations.maps.length) {
                  deleteRequests.push(tx.deleteFrom("gateway_configuration_maps").where("parent_id", "=", params.id).execute());
                  requests.push(
                    tx
                      .insertInto("gateway_configuration_maps")
                      .values(body.relations.maps.map((related_id) => ({ related_id, parent_id: config.id })))
                      .execute(),
                  );
                }
                if (body.relations.map_pins.length) {
                  deleteRequests.push(
                    tx.deleteFrom("gateway_configuration_map_pins").where("parent_id", "=", params.id).execute(),
                  );
                  requests.push(
                    tx
                      .insertInto("gateway_configuration_map_pins")
                      .values(body.relations.map_pins.map((related_id) => ({ related_id, parent_id: config.id })))
                      .execute(),
                  );
                }
                if (body.relations.events.length) {
                  deleteRequests.push(
                    tx.deleteFrom("gateway_configuration_events").where("parent_id", "=", params.id).execute(),
                  );
                  requests.push(
                    tx
                      .insertInto("gateway_configuration_events")
                      .values(body.relations.events.map((related_id) => ({ related_id, parent_id: config.id })))
                      .execute(),
                  );
                }
                if (body.relations.images.length) {
                  deleteRequests.push(
                    tx.deleteFrom("gateway_configuration_images").where("parent_id", "=", params.id).execute(),
                  );
                  requests.push(
                    tx
                      .insertInto("gateway_configuration_images")
                      .values(body.relations.images.map((related_id) => ({ related_id, parent_id: config.id })))
                      .execute(),
                  );
                }
                if (body.relations.random_tables.length) {
                  deleteRequests.push(
                    tx.deleteFrom("gateway_configuration_random_tables").where("parent_id", "=", params.id).execute(),
                  );
                  requests.push(
                    tx
                      .insertInto("gateway_configuration_random_tables")
                      .values(body.relations.random_tables.map((related_id) => ({ related_id, parent_id: config.id })))
                      .execute(),
                  );
                }

                await Promise.all(deleteRequests);
                await Promise.all(requests);
              } else {
                noRoleAccessErrorHandler();
                return { message: "", ok: false, role_access: false };
              }
            });
          }

          return { ok: true, role_access: true, message: `Gateway configuration ${MessageEnum.successfully_created}` };
        },
        {
          body: UpdateGatewayConfiguration,
          response: ResponseSchema,
        },
      ),
  );
}
