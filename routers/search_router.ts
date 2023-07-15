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
          data: {
            search_term: string;
          };
        };
      }>,
      rep,
    ) => {
      const { type } = req.params;
      const fields = ["id"];

      if (type === "characters") fields.push("first_name", "nickname", "last_name");
      if (type === "tags") fields.push("title", "color");
      else fields.push("title");

      const result = await db
        .selectFrom(type)
        .select(fields as SelectExpression<DB, SearchableEntities>[])
        .where("project_id", "=", req.params.project_id)
        .where((eb) =>
          type === "characters"
            ? eb.or([
                eb("first_name", "ilike", `%${req.body.data.search_term}%`),
                eb("nickname", "ilike", `%${req.body.data.search_term}%`),
                eb("last_name", "ilike", `%${req.body.data.search_term}%`),
              ])
            : eb("title", "ilike", `%${req.body.data.search_term}%`),
        )
        .execute();

      rep.send({
        data: result.map((item) => ({
          value: item.id,
          label: type === "characters" ? `${item.first_name} ${item?.last_name || ""}` : item?.title || "",
          color: type === "tags" ? item.color : "",
        })),
        message: "Success",
        ok: true,
      });
    },
  );

  done();
}
