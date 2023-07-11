import { FastifyInstance, FastifyRequest } from "fastify";

import { db } from "../database/db";
import { InsertProjectType, UpdateProjectSchema, UpdateProjectType } from "../database/validation/projects";
import { RequestBodyType } from "../types/requestTypes";

export function project_router(server: FastifyInstance, _: any, done: any) {
  // #region create_routes
  server.post("/create", async (req: FastifyRequest<{ Body: { data: InsertProjectType } }>, rep) => {
    await db.insertInto("projects").values(req.body.data).execute();
    rep.send({ message: "Project successfully created.", ok: true });
  });
  // #endregion create_routes
  // #region read_routes
  server.post("/", async (req: FastifyRequest<{ Body: RequestBodyType }>, rep) => {
    if (req.body.data?.owner_id) {
      const data = await db
        .selectFrom("projects")
        .select(["projects.id", "projects.title"])
        .where("owner_id", "=", req.body.data.owner_id)
        .execute();
      rep.send({ data, message: "Success", ok: true });
    }
    rep.send({ data: [], message: "No projects found.", ok: false });
  });
  // #endregion read_routes
  // #region update_routes
  server.post(
    "/update/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
        Body: { data: UpdateProjectType };
      }>,
      rep,
    ) => {
      const data = UpdateProjectSchema.parse(req.body.data);
      await db.updateTable("projects").where("projects.id", "=", req.params.id).set(data).execute();
      rep.send({ message: "Project successfully updated.", ok: true });
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
      await db.deleteFrom("projects").where("projects.id", "=", req.params.id).execute();
      rep.send({ message: "Project successfully deleted.", ok: true });
    },
  );
  // #endregion delete_routes

  done();
}
