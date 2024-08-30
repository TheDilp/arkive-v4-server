import { Elysia } from "elysia";
import { SelectExpression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DB } from "kysely-codegen";

import { db } from "../database/db";
import { getNestedReadPermission } from "../database/queries";
import {
  InsertConversationSchema,
  ListConversationSchema,
  ReadConversationSchema,
  UpdateConversationSchema,
} from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { afterHandler } from "../handlers";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { GetRelationsForUpdating } from "../utils/relationalQueryHelpers";

export function conversation_router(app: Elysia) {
  return app
    .decorate("permissions", {
      user_id: "",
      project_id: null,
      is_project_owner: false,
      role_access: false,
      role_id: null,
      permission_id: null,
      all_permissions: {},
    } as PermissionDecorationType)
    .group("/conversations", (server) =>
      server
        .post(
          "/create",
          async ({ body, request }) => {
            await db.transaction().execute(async (tx) => {
              const conversation = await tx
                .insertInto("conversations")
                .values(body.data)
                .returning("id")
                .executeTakeFirstOrThrow();

              await tx
                .insertInto("_charactersToconversations")
                .values(body.relations.characters.map((char) => ({ A: char.id, B: conversation.id })))
                .execute();
            });
            afterHandler(
              body.data,
              "conversations",
              {
                user_id: request.headers.get("user-id") || "",
                project_id: request.headers.get("project-id") || "",
                image_url: request.headers.get("user-image-url") || "",
              },
              "create",
            );
            return { message: `Conversation ${MessageEnum.successfully_created}`, ok: true, role_access: true };
          },
          {
            body: InsertConversationSchema,
            response: ResponseSchema,
          },
        )
        .post(
          "/",
          async ({ body, permissions }) => {
            let query = db
              .selectFrom("conversations")
              .where("project_id", "=", body.data.project_id)
              .limit(body?.pagination?.limit || 10)
              .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
              .select(body.fields as SelectExpression<DB, "conversations">[]);

            if (!!body?.filters?.and?.length || !!body?.filters?.or?.length) {
              query = constructFilter("conversations", query, body.filters);
            }

            if (body?.relations) {
              if (body?.relations?.characters) {
                query = query.select((eb) => {
                  let char_subquery = eb
                    .selectFrom("_charactersToconversations")
                    .whereRef("conversations.id", "=", "_charactersToconversations.B")
                    .leftJoin("characters", "characters.id", "_charactersToconversations.A")
                    .select(["characters.id", "characters.full_name", "characters.portrait_id"]);

                    // @ts-ignore
                    char_subquery = getNestedReadPermission(
                      char_subquery,
                      permissions?.is_project_owner,
                      permissions?.user_id,
                      "_charactersToconversations.A",
                      "read_characters",
                      false,
                    );
                  return jsonArrayFrom(char_subquery).as("characters");
                });
              }
              if (body?.relations?.messages) {
                query = query.select((eb) =>
                  jsonArrayFrom(
                    eb
                      .selectFrom("messages")
                      .whereRef("messages.parent_id", "=", "conversations.id")
                      .select(["messages.id", "messages.content", "messages.sender_id"]),
                  ).as("messages"),
                );
              }
            }

            if (body.orderBy?.length) {
              query = constructOrdering(body.orderBy, query);
            }

            query = query
              .leftJoin("_charactersToconversations", "_charactersToconversations.B", "conversations.id")
              .where("_charactersToconversations.A", "=", body.data.character_id)
              .distinctOn("conversations.id");

            const data = await query.execute();

            return { data, message: MessageEnum.success, ok: true, role_access: true };
          },
          { body: ListConversationSchema, response: ResponseWithDataSchema },
        )
        .post(
          "/:id",
          async ({ params, body }) => {
            let query = db
              .selectFrom("conversations")
              .where("id", "=", params.id)
              .select(body.fields as SelectExpression<DB, "conversations">[])

              if(!!body?.relations)  {

                if (body?.relations?.characters) {
                  query = query.select((eb) =>
                    jsonArrayFrom(
                      eb
                        .selectFrom("_charactersToconversations")
                        .whereRef("conversations.id", "=", "_charactersToconversations.B")
                        .leftJoin("characters", "characters.id", "_charactersToconversations.A")
                        .select(["characters.id", "characters.full_name", "characters.portrait_id"]),
                    ).as("characters"),
                  );
                }
                if (body?.relations?.messages) {
                  query = query.select((eb) =>
                    jsonArrayFrom(
                      eb
                        .selectFrom("messages")
                        .whereRef("messages.parent_id", "=", "conversations.id")
                        .select(["messages.id", "messages.content", "messages.sender_id", "messages.type"])
                        .limit(5)
                        .orderBy("messages.created_at", "desc"),
                    ).as("messages"),
                  );
                }



              };
              .$if(!!body.orderBy?.length, (qb) => constructOrdering(body.orderBy, qb));
            const data = await query.executeTakeFirst();

            if (data) {
              const sortedMessages = [...(data.messages || [])].reverse();
              data.messages = sortedMessages;
              return { data, message: MessageEnum.success, ok: true, role_access: true };
            }
            return { data: {}, message: "Conversation not found.", ok: false, role_access: true };
          },
          { body: ReadConversationSchema, response: ResponseWithDataSchema },
        )
        .post(
          "/update/:id",
          async ({ params, body }) => {
            await db.transaction().execute(async (tx) => {
              await tx.updateTable("conversations").where("conversations.id", "=", params.id).set(body.data).execute();
              if (body.relations?.characters) {
                const existingCharactersInConversations = await tx
                  .selectFrom("_charactersToconversations")
                  .select(["A", "B"])
                  .where("B", "=", params.id)
                  .execute();
                const existingIds = existingCharactersInConversations.map((char) => char.A);
                const [idsToRemove, itemsToAdd] = GetRelationsForUpdating(existingIds, body.relations?.characters);

                if (idsToRemove.length) {
                  await tx.deleteFrom("_charactersToconversations").where("A", "in", idsToRemove).execute();
                }
                if (itemsToAdd.length) {
                  await tx
                    .insertInto("_charactersToconversations")
                    .values(
                      itemsToAdd.map((item) => ({
                        A: item.id,
                        B: params.id,
                      })),
                    )
                    .execute();
                }
              }
            });
            return { message: `Conversation ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
          },
          {
            body: UpdateConversationSchema,
            response: ResponseSchema,
          },
        )
        .delete(
          "/:id",
          async ({ params, request }) => {
            const data = await db
              .deleteFrom("conversations")
              .where("conversations.id", "=", params.id)
              .returning(["conversations.title", "conversations.project_id"])
              .executeTakeFirstOrThrow();

            const token = request.headers.get("authorization");
            if (token)
              afterHandler(
                data,
                "characters",
                {
                  user_id: request.headers.get("user-id") || "",
                  project_id: request.headers.get("project-id") || "",
                  image_url: request.headers.get("user-image-url") || "",
                },
                "create",
              );

            return { message: `Character ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
          },
          {
            response: ResponseSchema,
          },
        ),
    );
}
