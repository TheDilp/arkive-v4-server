import Elysia, { t } from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { BasicSearchSchema, ReadDocumentSchema } from "../database/validation";
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
      )
      .post(
        "/search/:project_id",
        async ({ params, body }) => {
          const { project_id } = params;
          const { search_term } = body.data;
          const charactersSearch = {
            name: "characters",
            request: db
              .selectFrom("characters")
              .select(["id", "full_name", "portrait_id"])
              .where("characters.full_name", "ilike", `%${search_term}%`)
              // .where("characters.is_public", "=", true)
              .where("project_id", "=", project_id)
              .limit(5),
          };
          const documentSearch = {
            name: "documents",
            request: db
              .selectFrom("documents")
              .select(["id", "title", "icon"])
              .where("documents.title", "ilike", `%${search_term}%`)
              .where("documents.is_public", "=", true)
              .where("project_id", "=", project_id)
              .limit(5),
          };

          const mapSearch = {
            name: "maps",
            request: db
              .selectFrom("maps")
              .select(["id", "title"])
              .where("maps.title", "ilike", `%${search_term}%`)
              .where("maps.is_public", "=", true)
              .where("project_id", "=", project_id)
              .limit(5),
          };

          const graphSearch = {
            name: "graphs",
            request: db
              .selectFrom("graphs")
              .where("graphs.title", "ilike", `%${search_term}%`)
              .where("project_id", "=", project_id)
              .select(["id", "title", "icon"])
              .limit(5),
          };

          const blueprintInstancesSearch = {
            name: "blueprint_instances",
            request: db
              .selectFrom("blueprint_instances")
              .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
              .where("blueprint_instances.title", "ilike", `%${search_term}%`)
              .where("blueprints.project_id", "=", project_id)
              .where("blueprint_instances.is_public", "=", true)
              .select([
                "blueprint_instances.id",
                "blueprint_instances.title",
                "blueprints.title as parent_title",
                "blueprint_instances.parent_id",
                "blueprints.icon",
              ])
              .limit(5),
          };

          const requests = [charactersSearch, documentSearch, mapSearch, graphSearch, blueprintInstancesSearch];
          const result = await Promise.all(
            requests.map(async (item) => ({
              name: item.name,
              result: await item.request.execute(),
            })),
          );
          return { data: result, ok: true, message: MessageEnum.success };
        },
        { body: BasicSearchSchema },
      );
  });
}
