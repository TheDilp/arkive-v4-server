import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertGatewayConfiguration, ListGatewayConfigurationSchema } from "../database/validation/gateway_configurations";
import { MessageEnum } from "../enums";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { getEntityWithOwnerId } from "../utils/utils";

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
          const data = await db
            .selectFrom("gateway_configurations")
            .select(body.fields as SelectExpression<DB, "gateway_configurations">[])
            .where("project_id", "=", body.data.project_id)
            .execute();

          return { data, ok: true, message: MessageEnum.success, role_access: true };
        },
        { body: ListGatewayConfigurationSchema, response: ResponseWithDataSchema },
      ),
  );
}
