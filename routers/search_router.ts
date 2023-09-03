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
      if (type === "boards") {
        const graphs = await db
          .selectFrom("boards")
          .select(["id", "title"])
          .where("title", "ilike", `%${req.body.data.search_term.toLowerCase()}%`)
          .where("project_id", "=", req.params.project_id)
          .limit(req.body.limit || 10)
          .execute();

        rep.send({
          data: graphs,
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
  server.post(
    "/:project_id",
    async (req: FastifyRequest<{ Params: { project_id: string }; Body: { data: { search_term: string } } }>, rep) => {
      const { project_id } = req.params;
      const { search_term } = req.body.data;

      const charactersSearch = {
        name: "characters",
        request: db
          .selectFrom("characters")
          .select(["id", "first_name", "last_name", "portrait_id"])
          .where((eb) =>
            eb.or([
              eb("characters.first_name", "ilike", `%${search_term}%`),
              eb("characters.last_name", "ilike", `%${search_term}%`),
            ]),
          )
          .where("project_id", "=", project_id)
          .limit(5),
      };
      const documentSearch = {
        name: "documents",
        request: db
          .selectFrom("documents")
          .select(["id", "title", "icon"])
          .where("documents.title", "ilike", `%${search_term}%`)
          .where("project_id", "=", project_id)
          .limit(5),
      };
      const alterNameSearch = {
        name: "alter_names",
        request: db
          .selectFrom("alter_names")
          .select(["id", "title", "parent_id"])
          .select(["id as alterId", "alter_names.title", "parent_id"])
          .where("title", "ilike", `%${req.body.data.search_term.toLowerCase()}%`)
          .where("project_id", "=", project_id)
          .limit(5),
      };
      const mapSearch = {
        name: "maps",
        request: db
          .selectFrom("maps")
          .select(["id", "title"])
          .where("maps.title", "ilike", `%${search_term}%`)
          .where("project_id", "=", project_id)
          .limit(5),
      };
      const mapPinSearch = {
        name: "map_pins",
        request: db
          .selectFrom("map_pins")
          .leftJoin("maps", "maps.id", "map_pins.parent_id")
          .select(["map_pins.id", "map_pins.icon", "map_pins.parent_id"])
          .where("map_pins.title", "ilike", `%${search_term}%`)
          .where("maps.project_id", "=", project_id)
          .limit(5),
      };
      const characterMapPinSearch = {
        name: "character_map_pins",
        request: db
          .selectFrom("map_pins")
          .leftJoin("maps", "maps.id", "map_pins.parent_id")
          .where("maps.project_id", "=", project_id)
          .where("map_pins.character_id", "is not", null)
          .leftJoin("characters", "characters.id", "map_pins.character_id")
          .where((eb) =>
            eb.or([
              eb("characters.first_name", "ilike", `%${search_term}%`),
              eb("characters.last_name", "ilike", `%${search_term}%`),
            ]),
          )
          .select([
            "map_pins.id",
            "map_pins.icon",
            "map_pins.parent_id",
            "characters.first_name",
            "characters.last_name",
            "characters.portrait_id",
          ])
          .limit(5),
      };
      const graphSearch = {
        name: "boards",
        request: db
          .selectFrom("boards")
          .where("boards.title", "ilike", `%${search_term}%`)
          .where("project_id", "=", project_id)
          .select(["id", "title", "icon"])
          .limit(5),
      };
      const nodeSearch = {
        name: "nodes",
        request: db
          .selectFrom("nodes")
          .where("label", "ilike", `%${search_term}%`)
          .leftJoin("boards", "boards.id", "nodes.parent_id")
          .where("boards.project_id", "=", project_id)
          .select(["nodes.id", "nodes.parent_id"])
          .limit(5),
      };
      const edgeSearch = {
        name: "edges",
        request: db
          .selectFrom("edges")
          .where("label", "ilike", `%${search_term}%`)
          .leftJoin("boards", "boards.id", "edges.parent_id")
          .where("boards.project_id", "=", project_id)
          .select(["edges.id", "edges.parent_id"])
          .limit(5),
      };

      const requests = [
        charactersSearch,
        documentSearch,
        alterNameSearch,
        mapSearch,
        characterMapPinSearch,
        mapPinSearch,
        graphSearch,
        nodeSearch,
        edgeSearch,
      ];
      const result = await Promise.all(
        requests.map(async (item) => ({
          name: item.name,
          result: await item.request.execute(),
        })),
      );

      rep.send({ data: result, ok: true, message: "Success" });
    },
  );
  // server.post(
  //   "/:project_id/:type/tags",
  //   async (
  //     req: FastifyRequest<{ Params: { project_id: string; type: string }; Body: { tag_ids: string[]; fields: string[] } }>,
  //     rep,
  //   ) => {
  //     const { type } = req.params;
  //     const { tag_ids = [] } = req.body;
  //     if (tag_ids.length) {
  //       if (type === "characters") {
  //         const filteredCharacters = await db
  //           .selectFrom("_charactersTotags")
  //           .where("_charactersTotags.B", "in", tag_ids)
  //           .leftJoin("characters", "characters.id", "_charactersTotags.A")
  //           .$if(!req.body.fields?.length, (qb) => qb.selectAll())
  //           .$if(!!req.body.fields?.length, (qb) =>
  //             qb.clearSelect().select(req.body.fields as SelectExpression<DB, "characters">[]),
  //           )
  //           .execute();
  //       }
  //     }
  //   },
  // );

  done();
}
