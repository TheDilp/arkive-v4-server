import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { SearchableEntities } from "../types/requestTypes";

export function search_router(server: FastifyInstance, _: any, done: any) {
  server.post(
    "/:project_id/:type",
    async (
      req: FastifyRequest<{
        Params: { type: SearchableEntities; project_id: string };
        Body: {
          search_term: string;
          fields: SelectExpression<DB, SearchableEntities>[];
        };
      }>,
      rep,
    ) => {
      const formattedSearchTerm = req.body.search_term.replace(" ", " & ").toLowerCase();
      const result = await db
        .selectFrom(req.params.type)
        .select(req.body.fields?.length ? req.body.fields : "id")
        .where("project_id", "=", req.params.project_id)
        .where("tsvector_column", "@@", `${formattedSearchTerm}:*`)
        .execute();

      rep.send(result);
    },
  );

  done();
}
