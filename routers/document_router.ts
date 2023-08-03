import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { InsertDocumentType, UpdateDocumentSchema, UpdateDocumentType } from "../database/validation/documents";
import { RequestBodyType } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { TagQuery, UpdateTagRelations } from "../utils/relationalQueryHelpers";

export function document_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes

  server.post(
    "/create",
    async (req: FastifyRequest<{ Body: { data: InsertDocumentType; relations?: { tags?: { id: string } } } }>, rep) => {
      await db.insertInto("documents").values(req.body.data).execute();
      rep.send({ message: "Document successfully created.", ok: true });
    },
  );

  // #endregion create_routes

  // #region read_routes
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("documents")
      .where("documents.project_id", "=", req.body?.data?.project_id)
      .$if(!req.body.fields.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields.length, (qb) => qb.clearSelect().select(req.body.fields as SelectExpression<DB, "documents">[]))
      .$if(!!req.body?.filters?.and?.length || !!req.body?.filters?.or?.length, (qb) => {
        qb = constructFilter("documents", qb, req.body.filters);
        return qb;
      })
      .execute();
    rep.send({ data, message: "Success", ok: true });
  });
  server.post("/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: RequestBodyType }>, rep) => {
    const [data] = await db
      .selectFrom("documents")
      .$if(!req.body.fields?.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields?.length, (qb) => qb.clearSelect().select(req.body.fields as SelectExpression<DB, "documents">[]))
      .where("documents.id", "=", req.params.id)
      .$if(!!req.body?.relations, (qb) => {
        if (req.body?.relations?.tags) {
          qb = qb.select((eb) => TagQuery(eb, "_documentsTotags", "documents"));
        }

        return qb;
      })
      .execute();
    rep.send({ data, message: "Success", ok: true });
  });
  // #endregion read_routes

  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
        Body: { data: UpdateDocumentType; relations?: { tags?: { id: string }[] } };
      }>,
      rep,
    ) => {
      await db.transaction().execute(async (tx) => {
        if (req.body.data) {
          const parsedData = UpdateDocumentSchema.parse(req.body.data);

          await tx.updateTable("documents").where("documents.id", "=", req.params.id).set(parsedData).execute();
        }
        if (req.body.relations?.tags) {
          await UpdateTagRelations({
            relationalTable: "_documentsTotags",
            id: req.params.id,
            newTags: req.body.relations.tags,
            tx,
          });
        }
      });
      rep.send({ message: "Document successfully updated.", ok: true });
    },
  );
  // #endregion update_routes

  // #region delete_routes
  server.delete(
    "/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>,
      rep,
    ) => {
      await db.deleteFrom("documents").where("documents.id", "=", req.params.id).execute();
      rep.send({ message: "Document successfully deleted.", ok: true });
    },
  );
  // #endregion delete_routes

  done();
}
