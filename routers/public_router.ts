import Elysia, { t } from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { ReadDocumentSchema } from "../database/validation";
import { NoPublicAccess } from "../enums";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";

export function public_router(app: Elysia) {
  return app.group("/public", (server) => {
    return server
      .post(
        "/projects/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("projects")
            .where("id", "=", params.id)
            .$if(!body?.fields?.length, (qb) => qb.selectAll())
            .$if(!!body?.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "projects">[]))
            .executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadDocumentSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/documents/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("documents")
            .where("id", "=", params.id)
            .$if(!body?.fields?.length, (qb) => qb.selectAll())
            .$if(!!body?.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "documents">[]))
            .executeTakeFirstOrThrow();
          if (data.is_public) return { data, message: MessageEnum.success, ok: true };
          else throw new NoPublicAccess("NO_PUBLIC_ACCESS");
        },
        {
          body: ReadDocumentSchema,
          response: t.Union([ResponseWithDataSchema, ResponseSchema]),
        },
      );
  });
}
