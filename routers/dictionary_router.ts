import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InserDictionaryType, InsertDictionarySchema } from "../database/validation/dictionaries";
import { RequestBodyType } from "../types/requestTypes";
import { constructOrdering } from "../utils/orderByConstructor";
import { TagQuery } from "../utils/relationalQueryHelpers";

export function dictionary_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes
  server.post("/create", async (req: FastifyRequest<{ Body: { data: InserDictionaryType } }>, rep) => {
    const parsedData = InsertDictionarySchema.parse(req.body.data);
    await db.insertInto("dictionaries").values(parsedData).execute();
    rep.send({ ok: true, message: "Success" });
  });
  // #endregion create_routes
  // #region read_routes
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("dictionaries")
      .limit(req.body?.pagination?.limit || 10)
      .offset((req.body?.pagination?.page ?? 0) * (req.body?.pagination?.limit || 10))
      .$if(!req.body.fields?.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields?.length, (qb) =>
        qb.clearSelect().select(req.body.fields as SelectExpression<DB, "dictionaries">[]),
      )
      .$if(!!req.body.orderBy?.length, (qb) => {
        qb = constructOrdering(req.body.orderBy, qb);
        return qb;
      })
      .$if(!!req.body.relations, (qb) => {
        if (req.body.relations?.words) {
          qb = qb.select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("words")
                .select(["words.id", "words.title", "words.translation"])
                .whereRef("words.parent_id", "=", "dictionaries.id"),
            ).as("words"),
          );
        }
        if (req.body?.relations?.tags) {
          qb = qb.select((eb) => TagQuery(eb, "_dictionariesTotags", "dictionaries"));
        }
        return qb;
      })
      .where("project_id", "=", req.body.data.project_id)
      .execute();

    rep.send({ data, message: "Success", ok: true });
  });
  // #endregion read_routes
  // #region update_routes
  // #endregion update_routes
  // #region delete_routes
  server.post("/delete/:id", async (req: FastifyRequest<{ Params: { id: string } }>, rep) => {
    await db.deleteFrom("dictionaries").where("id", "=", req.params.id).execute();
    rep.send({ ok: true, message: "Success" });
  });
  // #endregion delete_routes

  done();
}
