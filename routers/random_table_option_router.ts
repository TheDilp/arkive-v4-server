import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import {
  InsertRandomTableOptionSchema,
  InsertRandomTableOptionType,
  UpdateRandomTableSchema,
  UpdateRandomTableType,
} from "../database/validation/random_tables";
import { RequestBodyType } from "../types/requestTypes";
import { chooseRandomItems } from "../utils/transform";

export function random_table_option_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes

  server.post(
    "/create",
    async (
      req: FastifyRequest<{
        Body: { data: InsertRandomTableOptionType[] };
      }>,
      rep,
    ) => {
      const { data } = req.body;
      const parsedData = InsertRandomTableOptionSchema.array().parse(data);

      await db.insertInto("random_table_options").values(parsedData).execute();

      rep.send({ message: "Random table options successfully created.", ok: true });
    },
  );

  // #endregion create_routes
  // #region read_routes
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("random_table_options")
      .$if(!req.body.fields?.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields?.length, (qb) =>
        qb.clearSelect().select(req.body.fields as SelectExpression<DB, "random_table_options">[]),
      )
      .where("random_table_options.parent_id", "=", req.body.data.parent_id)
      .execute();
    rep.send({ data, message: "Success", ok: true });
  });

  server.post("/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: RequestBodyType }>, rep) => {
    const data = await db

      .selectFrom("random_table_options")
      .where("random_table_options.id", "=", req.params.id)

      .select([
        "random_table_options.id",
        "random_table_options.title",
        "random_table_options.description",
        "random_table_options.icon",
        "random_table_options.parent_id",
      ])
      .executeTakeFirstOrThrow();

    rep.send({ data, message: "Success.", ok: true });
  });

  server.post(
    "/random/:table_id",
    async (req: FastifyRequest<{ Params: { table_id: string }; Body: { data: { count: number } } }>, rep) => {
      const options = await db
        .selectFrom("random_table_options")
        .select(["random_table_options.id", "random_table_options.title"])
        .where("random_table_options.parent_id", "=", req.params.table_id)
        .execute();

      if (req.body.data.count > options.length) {
        rep.send({ message: "More items requested than there are available.", ok: false });
      }

      const data = chooseRandomItems(options, req.body.data.count);
      rep.send({ data, message: "Success.", ok: true });
    },
  );
  // #endregion read_routes
  // #region update_routes
  server.post(
    "/update/:id",
    async (req: FastifyRequest<{ Params: { id: string }; Body: { data: UpdateRandomTableType } }>, rep) => {
      const parsedData = UpdateRandomTableSchema.parse(req.body.data);
      await db.updateTable("tags").where("id", "=", req.params.id).set(parsedData).execute();

      rep.send({ message: "Tags successfully updated.", ok: true });
    },
  );
  //   // #endregion update_routes
  //   // #region delete_routes
  //   server.delete("/delete/:id", async (req: FastifyRequest<{ Params: { id: string } }>, rep) => {
  //     await db.deleteFrom("tags").where("id", "=", req.params.id).execute();
  //     rep.send({ message: "Tag successfully deleted.", ok: true });
  //   });
  // #endregion delete_routes

  done();
}
