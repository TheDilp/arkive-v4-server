import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import omit from "lodash.omit";

import { db } from "../database/db";
import { InsertDocumentTemplateSchema, ListDocumentTemplateSchema } from "../database/validation";
import { MessageEnum } from "../enums";
import { beforeRoleHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { getEntitiesWithOwnerId, getEntityWithOwnerId } from "../utils/transform";

export function document_template_router(app: Elysia) {
  return app
    .decorate("permissions", {
      is_project_owner: false,
      role_access: false,
      user_id: "",
      role_id: null,
      permission_id: null,
    } as PermissionDecorationType)
    .group("/document_templates", (server) =>
      server
        .post(
          "/create",
          async ({ body, permissions }) => {
            await db.transaction().execute(async (tx) => {
              const template = await tx
                .insertInto("document_templates")
                .values(getEntityWithOwnerId(body.data, permissions.user_id))
                .returning("id")
                .executeTakeFirst();

              if (body.relations.fields.length && template?.id) {
                await tx
                  .insertInto("document_template_fields")
                  .values(
                    body.relations.fields.map((f) =>
                      omit(
                        {
                          ...f.data,
                          parent_id: template.id,
                          derive_from: f.data.derive?.derive_from || null,
                          derive_formula: f.data.derive?.derive_formula || null,
                        },
                        "derive",
                      ),
                    ),
                  )
                  .execute();
              }
            });
            return { message: `Document template ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          },
          {
            body: InsertDocumentTemplateSchema,
            response: ResponseSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "create_documents"),
          },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            const data = await db
              .selectFrom("document_templates")
              .select([
                ...body.fields.map((f) => `document_templates.${f}`),
                (eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("document_template_fields")
                      .selectAll()
                      .whereRef("document_template_fields.parent_id", "=", "document_templates.id"),
                  ).as("fields"),
              ] as SelectExpression<DB, "document_templates">[])
              .limit(body.pagination?.limit || 10)
              .offset(body.pagination?.page || 0)
              .where("document_templates.project_id", "=", body.data.project_id)
              .execute();
            return { data, message: `Document template ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          },
          {
            body: ListDocumentTemplateSchema,
            response: ResponseWithDataSchema,
            beforeHandle: async (context) => beforeRoleHandler(context, "create_documents"),
          },
        ),
    );
}
