import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertFilterSchema, ListFilterSchema, ReadFilterSchema } from "../database/validation/filters";
import { MessageEnum } from "../enums";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";

export function filter_router(app: Elysia) {
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
    .group("/filters", (server) =>
      server
        .post(
          "/create",
          async ({ body, permissions }) => {
            if (permissions.project_id) {
              await db
                .insertInto("filters")
                .values({ ...body.data, project_id: permissions.project_id, owner_id: permissions.user_id })
                .execute();
            }

            return { role_access: true, message: "Success", ok: true };
          },
          {
            body: InsertFilterSchema,
            response: ResponseSchema,
          },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            let query = db
              .selectFrom("filters")
              .where("owner_id", "=", permissions.user_id)
              .select(body.fields as SelectExpression<DB, "filters">[])
              .limit(body.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10));

            const data = await query.execute();
            return { data, message: "Success", ok: true, role_access: true };
          },
          {
            body: ListFilterSchema,
            response: ResponseWithDataSchema,
          },
        )
        .post(
          "/:id",
          async ({ params, body }) => {
            let query = db
              .selectFrom("filters")
              .where("filters.id", "=", params.id)
              .select(body.fields.map((f) => `filters.${f}`) as SelectExpression<DB, "filters">[]);

            const data = await query.executeTakeFirst();

            return { data, role_access: true, message: `Filter ${MessageEnum.successfully_created}`, ok: true };
          },
          {
            body: ReadFilterSchema,
            response: ResponseWithDataSchema,
          },
        )
        .delete(
          "/:id",
          async ({ params, permissions }) => {
            await db.deleteFrom("filters").where("id", "=", params.id).where("owner_id", "=", permissions.user_id).execute();

            return { role_access: true, message: `Filter ${MessageEnum.successfully_deleted}`, ok: true };
          },
          {
            response: ResponseSchema,
          },
        ),
    );
}
