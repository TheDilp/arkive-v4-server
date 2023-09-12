import Elysia from "elysia";

import { db } from "../database/db";
import { InsertProjectSchema, ProjectListSchema, UpdateProjectSchema } from "../database/validation/projects";
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
            .select(["projects.id", "projects.title"])
            .where("owner_id", "=", body.data.owner_id)
            .execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: ProjectListSchema,
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
