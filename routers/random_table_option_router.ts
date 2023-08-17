import { FastifyInstance, FastifyRequest } from "fastify";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";
import groupBy from "lodash.groupby";

import { db } from "../database/db";
import {
  InsertRandomTableOptionSchema,
  InsertRandomTableOptionType,
  InsertRandomTableSuboptionType,
  UpdateRandomTableOptionSchema,
  UpdateRandomTableSubOptionSchema,
  UpdateRandomTableType,
} from "../database/validation/random_tables";
import { RequestBodyType } from "../types/requestTypes";
import { GetRelationsForUpdating } from "../utils/relationalQueryHelpers";
import { chooseRandomItems } from "../utils/transform";

export function random_table_option_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes

  server.post(
    "/create",
    async (
      req: FastifyRequest<{
        Body: { data: InsertRandomTableOptionType[]; relations: { suboptions: InsertRandomTableSuboptionType[] } };
      }>,
      rep,
    ) => {
      const { data } = req.body;
      const parsedData = InsertRandomTableOptionSchema.array().parse(data);

      await db.transaction().execute(async (tx) => {
        await tx.insertInto("random_table_options").values(parsedData).execute();

        if (req.body?.relations?.suboptions?.length) {
          const { suboptions } = req.body.relations;
          for (let index = 0; index < suboptions.length; index += 1) {
            const suboption = suboptions[index];
            await tx.insertInto("random_table_suboptions").values(suboption).execute();
          }
        }
      });

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
      .$if(!!req.body.relations?.suboptions, (qb) =>
        qb.select((eb) =>
          jsonArrayFrom(
            eb
              .selectFrom("random_table_suboptions")
              .select(["random_table_suboptions.id", "random_table_suboptions.title", "random_table_suboptions.description"])
              .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id"),
          ).as("suboptions"),
        ),
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
      .$if(!!req.body.relations?.suboptions, (qb) =>
        qb.select((eb) =>
          jsonArrayFrom(
            eb
              .selectFrom("random_table_suboptions")
              .selectAll()
              .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id"),
          ).as("suboptions"),
        ),
      )
      .executeTakeFirstOrThrow();

    rep.send({ data, message: "Success.", ok: true });
  });

  // Generate random options

  server.post(
    "/random/:table_id",
    async (req: FastifyRequest<{ Params: { table_id: string }; Body: { data: { count: number } } }>, rep) => {
      const options = await db
        .selectFrom("random_table_options")
        .select([
          "random_table_options.id",
          "random_table_options.title",
          (eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("random_table_suboptions")
                .select(["random_table_suboptions.id", "random_table_suboptions.title"])
                .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id"),
            ).as("suboptions"),
        ])
        .where("random_table_options.parent_id", "=", req.params.table_id)
        .execute();
      if (req.body.data.count > options.length) {
        rep.send({ message: "More items requested than there are available.", ok: false });
      }

      const data = chooseRandomItems(options, req.body.data.count);
      rep.send({ data, message: "Success.", ok: true });
    },
  );

  // Generate random options for multiple tables

  server.post(
    "/random/many",
    async (
      req: FastifyRequest<{ Params: { table_id: string }; Body: { data: { table_id: string; count: number }[] } }>,
      rep,
    ) => {
      const tableIdsToFetch = req.body.data.map((table) => table.table_id);
      const tables = await db
        .selectFrom("random_table_options")
        .select([
          "id",
          "title",
          "parent_id",
          (eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("random_table_suboptions")
                .select(["random_table_suboptions.id", "random_table_suboptions.title"])
                .whereRef("random_table_suboptions.parent_id", "=", "random_table_options.id"),
            ).as("suboptions"),
        ])
        .where("random_table_options.parent_id", "in", tableIdsToFetch)
        .execute();
      const groupedOptions = groupBy(tables, "parent_id");

      const data = [];
      for (let i = 0; i < tableIdsToFetch.length; i++) {
        const currentTableId = tableIdsToFetch[i];
        const options = groupedOptions[currentTableId];
        const chosenOptions = chooseRandomItems(options, req.body.data[i].count ?? 1);
        data.push({
          random_table_id: currentTableId,
          random_table: chosenOptions,
        });
      }

      rep.send({ data, message: "Success.", ok: true });
    },
  );
  // #endregion read_routes
  // #region update_routes

  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
        Body: { data: UpdateRandomTableType; relations: { suboptions: InsertRandomTableSuboptionType[] } };
      }>,
      rep,
    ) => {
      await db.transaction().execute(async (tx) => {
        const parsedData = UpdateRandomTableOptionSchema.parse(req.body.data);
        await tx.updateTable("random_table_options").where("id", "=", req.params.id).set(parsedData).execute();

        if (req.body?.relations?.suboptions?.length) {
          const existingIds = await tx
            .selectFrom("random_table_suboptions")
            .select(["id"])
            .where("parent_id", "=", req.params.id)
            .execute();

          const [idsToRemove, itemsToAdd, itemsToUpdate] = GetRelationsForUpdating(
            existingIds.map((item) => item.id),
            req.body.relations.suboptions,
          );

          if (idsToRemove.length) {
            await tx.deleteFrom("random_table_suboptions").where("id", "in", idsToRemove).execute();
          }
          if (itemsToAdd.length) {
            await tx
              .insertInto("random_table_suboptions")
              .values(
                itemsToAdd.map((item) => ({
                  parent_id: req.params.id,
                  title: item.title,
                  description: item?.description,
                })),
              )
              .execute();
          }
          if (itemsToUpdate.length) {
            await Promise.all(
              itemsToUpdate.map(async (item) => {
                const parsedSuboptionData = UpdateRandomTableSubOptionSchema.parse(item);
                await tx
                  .updateTable("random_table_suboptions")
                  .where("parent_id", "=", req.params.id)
                  .where("id", "=", item.id)
                  .set(parsedSuboptionData)
                  .execute();
              }),
            );
          }
        }
      });

      rep.send({ message: "Random table option successfully updated.", ok: true });
    },
  );
  // #endregion update_routes
  // #region delete_routes
  //   server.delete("/delete/:id", async (req: FastifyRequest<{ Params: { id: string } }>, rep) => {
  //     await db.deleteFrom("tags").where("id", "=", req.params.id).execute();
  //     rep.send({ message: "Tag successfully deleted.", ok: true });
  //   });
  // #endregion delete_routes

  done();
}
