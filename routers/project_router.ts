import Elysia from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import {
  InsertProjectSchema,
  ProjectListSchema,
  ReadProjectSchema,
  UpdateProjectSchema,
} from "../database/validation/projects";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";

export function project_router(app: Elysia) {
  return app.group("/projects", (server) =>
    server
      .post(
        "/create",
        async ({ body }) => {
          await db.insertInto("projects").values(body.data).execute();
          return { message: `Project ${MessageEnum.successfully_created}`, ok: true };
        },
        {
          body: InsertProjectSchema,
          response: ResponseSchema,
        },
      )
      .post(
        "/",
        async ({ body }) => {
          const data = await db
            .selectFrom("projects")
            .select(["projects.id", "projects.title", "projects.image_id"])
            .leftJoin("users", "users.id", "projects.owner_id")
            .where("users.auth_id", "=", body.data.auth_id)
            .execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ProjectListSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/:id",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("projects")
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "projects">[]))
            .$if(!!body?.relations?.character_relationship_types, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("character_relationship_types")
                    .select([
                      "character_relationship_types.id",
                      "character_relationship_types.title",
                      "character_relationship_types.ascendant_title",
                      "character_relationship_types.descendant_title",
                    ]),
                ).as("character_relationship_types"),
              ),
            )
            .select(["projects.id", "projects.title"])
            .where("id", "=", params.id)
            .executeTakeFirstOrThrow();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ReadProjectSchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.updateTable("projects").where("projects.id", "=", params.id).set(body.data).execute();
          return { message: `Project ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateProjectSchema,
          response: ResponseSchema,
        },
      )
      .delete("/:id", async ({ params }) => {
        await db.deleteFrom("projects").where("projects.id", "=", params.id).execute();
        return { message: `Project ${MessageEnum.successfully_deleted}`, ok: true };
      }),
  );
}
