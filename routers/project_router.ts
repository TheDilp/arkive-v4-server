import { FastifyInstance, FastifyRequest } from "fastify";

import { db } from "../database/db";
import {
  InsertProjectSchema,
  InsertProjectType,
  ProjectistSchema,
  UpdateProjectSchema,
  UpdateProjectType,
} from "../database/validation/projects";
import { RequestBodyType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import Elysia from "elysia";
import { MessageEnum } from "../enums/requestEnums";

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
          body: ProjectistSchema,
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
