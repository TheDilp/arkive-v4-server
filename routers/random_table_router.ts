import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression, SelectQueryBuilder } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { EntitiesWithChildren } from "../database/types";
import {
  InsertRandomTableOptionSchema,
  InsertRandomTableOptionType,
  InsertRandomTableSchema,
  InsertRandomTableType,
  UpdateRandomTableSchema,
  UpdateRandomTableType,
} from "../database/validation/random_tables";
import { RequestBodyType } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrderBy } from "../utils/orderByConstructor";
import { GetBreadcrumbs, GetEntityChildren } from "../utils/relationalQueryHelpers";

export function random_table_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes

  server.post(
    "/create",
    async (
      req: FastifyRequest<{
        Body: { data: InsertRandomTableType; relations: { random_table_options?: InsertRandomTableOptionType[] } };
      }>,
      rep,
    ) => {
      const { data } = req.body;

      await db.transaction().execute(async (tx) => {
        const parsedData = InsertRandomTableSchema.parse(data);
        const random_table = await tx.insertInto("random_tables").values(parsedData).returning("id").executeTakeFirstOrThrow();

        if (req.body?.relations) {
          if (req.body.relations?.random_table_options) {
            const { random_table_options } = req.body.relations;
            const parsedOptions = InsertRandomTableOptionSchema.array().parse(
              random_table_options.map((opt) => ({ ...opt, parent_id: random_table.id })),
            );
            await tx.insertInto("random_table_options").values(parsedOptions).execute();
          }
        }
      });
      rep.send({ message: "Random table successfully created.", ok: true });
    },
  );

  // #endregion create_routes
  // #region read_routes
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    const data = await db
      .selectFrom("random_tables")
      .$if(!req.body.fields?.length, (qb) => qb.selectAll())
      .$if(!!req.body.fields?.length, (qb) =>
        qb.clearSelect().select(req.body.fields as SelectExpression<DB, "random_tables">[]),
      )
      .$if(!!req.body?.filters?.and?.length || !!req.body?.filters?.or?.length, (qb) => {
        qb = constructFilter("random_tables", qb, req.body.filters);
        return qb;
      })
      .limit(req.body?.pagination?.limit || 10)
      .offset((req.body?.pagination?.page ?? 0) * (req.body?.pagination?.limit || 10))
      .$if(!!req.body.orderBy, (qb) => constructOrderBy(qb, req.body.orderBy?.field as string, req.body.orderBy?.sort))
      .execute();
    rep.send({ data, message: "Success", ok: true });
  });

  server.post("/:id", async (req: FastifyRequest<{ Params: { id: string }; Body: RequestBodyType }>, rep) => {
    const data = await db

      .selectFrom("random_tables")
      .where("random_tables.id", "=", req.params.id)
      .$if(!!req.body?.relations?.children, (qb) =>
        GetEntityChildren(qb as SelectQueryBuilder<DB, EntitiesWithChildren, {}>, "random_tables"),
      )
      .$if(!!req.body?.relations?.random_table_options, (qb) =>
        qb.select((eb) =>
          jsonArrayFrom(
            eb
              .selectFrom("random_table_options")
              .whereRef("random_table_options.parent_id", "=", "random_tables.id")
              .select([
                "random_table_options.id",
                "random_table_options.title",
                "random_table_options.description",
                "random_table_options.icon",
                "random_table_options.icon_color",
              ]),
          ).as("random_table_options"),
        ),
      )

      .select([
        "random_tables.id",
        "random_tables.title",
        "random_tables.icon",
        "random_tables.is_folder",
        "random_tables.is_public",
        "random_tables.parent_id",
        "random_tables.description",
      ])
      .executeTakeFirstOrThrow();

    if (req.body?.relations?.parents) {
      const parents = await GetBreadcrumbs({ db, id: req.params.id, table_name: "random_tables" });
      rep.send({ data: { ...data, parents }, message: "Success.", ok: true });
    }

    rep.send({ data, message: "Success.", ok: true });
  });
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
