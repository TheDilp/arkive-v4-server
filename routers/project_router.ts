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
            .union(
              db
                .selectFrom("projects")
                .leftJoin("_project_members", "projects.id", "_project_members.A")
                .select(["projects.id", "projects.title", "projects.image_id"])
                .where("_project_members.B", "=", (eb) =>
                  eb.selectFrom("users").select("id").where("users.auth_id", "=", body.data.auth_id),
                ),
            )
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
            .$if(!!body?.relations?.event_groups, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("event_groups")
                    .select(["event_groups.id", "event_groups.title"])
                    .where("project_id", "=", params.id),
                ).as("event_groups"),
              ),
            )
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
                    ])
                    .where("project_id", "=", params.id),
                ).as("character_relationship_types"),
              ),
            )
            .$if(!!body?.relations?.map_pin_types, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("map_pin_types")
                    .select([
                      "map_pin_types.id",
                      "map_pin_types.title",
                      "map_pin_types.default_icon",
                      "map_pin_types.default_icon_color",
                    ])
                    .where("project_id", "=", params.id),
                ).as("map_pin_types"),
              ),
            )
            .$if(!!body?.relations?.members, (qb) =>
              qb.select((eb) =>
                jsonArrayFrom(
                  eb
                    .selectFrom("users")
                    .leftJoin("_project_members", "_project_members.B", "users.id")
                    .where("_project_members.A", "=", params.id)
                    .select(["users.id", "users.email", "users.nickname", "users.image"])
                    .orderBy("nickname", "asc"),
                ).as("members"),
              ),
            )
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
      .get("/:id/dashboard", async ({ params }) => {
        const requests = [
          {
            name: "characters",
            request: db
              .selectFrom("characters")
              .select(["id", "full_name as title", "portrait_id"])
              .where("project_id", "=", params.id)
              .limit(5)
              .orderBy("updated_at desc")
              .execute(),
          },
          {
            name: "documents",
            request: db
              .selectFrom("documents")
              .select(["id", "title", "icon"])
              .where("project_id", "=", params.id)
              .orderBy("updated_at desc")
              .limit(5)
              .execute(),
          },

          {
            name: "blueprint_instances",
            request: db
              .selectFrom("blueprint_instances")
              .select(["blueprint_instances.id", "blueprint_instances.title", "blueprint_instances.parent_id"])
              .leftJoin("blueprints", "blueprints.id", "blueprint_instances.parent_id")
              .where("blueprints.project_id", "=", params.id)
              .orderBy("blueprint_instances.updated_at desc")
              .limit(5)
              .execute(),
          },
          {
            name: "maps",
            request: db
              .selectFrom("maps")
              .select(["id", "title", "icon"])
              .orderBy("updated_at desc")
              .where("project_id", "=", params.id)
              .limit(5)
              .execute(),
          },
          {
            name: "graphs",
            request: db
              .selectFrom("graphs")
              .select(["id", "title"])
              .where("graphs.project_id", "=", params.id)
              .orderBy("updated_at desc")
              .limit(5)
              .execute(),
          },
          {
            name: "calendars",
            request: db
              .selectFrom("calendars")
              .select(["id", "title"])
              .where("calendars.project_id", "=", params.id)
              .orderBy("updated_at desc")
              .limit(5)
              .execute(),
          },
          {
            name: "events",
            request: db
              .selectFrom("events")
              .select(["events.id", "events.title", "events.parent_id"])
              .leftJoin("calendars", "calendars.id", "events.parent_id")
              .where("calendars.project_id", "=", params.id)
              .orderBy("events.updated_at desc")
              .limit(5)
              .execute(),
          },

          {
            name: "dictionaries",
            request: db
              .selectFrom("dictionaries")
              .select(["id", "title"])
              .where("dictionaries.project_id", "=", params.id)
              .orderBy("updated_at desc")
              .limit(5)
              .execute(),
          },
        ];

        const data = await Promise.all(
          requests.map(async (item) => ({
            name: item.name,
            result: await item.request,
          })),
        );

        return { data, message: MessageEnum.success, ok: true };
      })
      .delete("/:id", async ({ params }) => {
        await db.deleteFrom("projects").where("projects.id", "=", params.id).execute();
        return { message: `Project ${MessageEnum.successfully_deleted}`, ok: true };
      }),
  );
}
