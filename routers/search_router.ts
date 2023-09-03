import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { SearchableEntities, SearchableMentionEntities } from "../types/requestTypes";

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

      if (type === "characters") fields.push("first_name", "nickname", "last_name", "portrait_id");
      else if (type === "tags") fields.push("title", "color");
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
          image: type === "characters" ? item.portrait_id || "" : "",
        })),
        message: "Success",
        ok: true,
      });
    },
  );
  server.post(
    "/:project_id/:type/mentions",
    async (
      req: FastifyRequest<{
        Params: { type: SearchableMentionEntities; project_id: string };
        Body: {
          data: {
            search_term: string;
          };
          limit: number;
        };
      }>,
      rep,
    ) => {
      const { type } = req.params;
      const fields = ["id"];

      if (type === "characters") fields.push("first_name", "nickname", "last_name", "portrait_id");
      else fields.push("title");

      if (type === "documents") {
        const documents = await db
          .selectFrom("documents")
          .select(["id", "title"])
          .where("title", "ilike", `%${req.body.data.search_term.toLowerCase()}%`)
          .where("project_id", "=", req.params.project_id)
          .limit(req.body.limit || 10)
          .execute();
        const alter_names = await db
          .selectFrom("alter_names")
          .select(["id as alterId", "title", "parent_id"])
          .where("title", "ilike", `%${req.body.data.search_term.toLowerCase()}%`)
          .where("project_id", "=", req.params.project_id)
          .limit(req.body.limit || 10)
          .execute();

        const combinedResult = [...documents, ...alter_names];
        rep.send({
          data: combinedResult,
          message: "Success",
          ok: true,
        });
      }

      if (type === "maps") {
        const maps = await db
          .selectFrom("maps")
          .select(["id", "title"])
          .where("title", "ilike", `%${req.body.data.search_term.toLowerCase()}%`)
          .where("project_id", "=", req.params.project_id)
          .limit(req.body.limit || 10)
          .execute();

        rep.send({
          data: maps,
          message: "Success",
          ok: true,
        });
      }

      // result = await db
      //   .selectFrom(type)
      //   .select(fields as SelectExpression<DB, SearchableEntities>[])
      //   .where("project_id", "=", req.params.project_id)
      //   .where((eb) =>
      //     type === "characters"
      //       ? eb.or([
      //           eb("first_name", "ilike", `%${req.body.data.search_term}%`),
      //           eb("nickname", "ilike", `%${req.body.data.search_term}%`),
      //           eb("last_name", "ilike", `%${req.body.data.search_term}%`),
      //         ])
      //       : eb("title", "ilike", `%${req.body.data.search_term}%`),
      //   )

      //   .execute();
      // rep.send({
      //   data: result.map((item) => ({
      //     value: item.id,
      //     label: type === "characters" ? `${item.first_name} ${item?.last_name || ""}` : item?.title || "",
      //     color: type === "tags" ? item.color : "",
      //     image: type === "characters" ? item.portrait_id || "" : "",
      //   })),
      //   message: "Success",
      //   ok: true,
      // });
    },
  );

  done();
}
