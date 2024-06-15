import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StreamingBlobPayloadOutputTypes } from "@smithy/types";
import Elysia, { t } from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import sharp from "sharp";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission } from "../database/queries";
import { DownloadAssetsSchema, ListAssetsSchema, ReadAssetsSchema, UpdateImageSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { beforeRoleHandler, noRoleAccessErrorHandler } from "../handlers";
import { AssetType } from "../types/entityTypes";
import { PermissionDecorationType, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter, tagsRelationFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import {
  GetRelatedEntityPermissionsAndRoles,
  TagQuery,
  UpdateEntityPermissions,
  UpdateTagRelations,
} from "../utils/relationalQueryHelpers";
import { s3Client } from "../utils/s3Utils";
import { getEntityWithOwnerId, groupRelationFiltersByField } from "../utils/utils";

async function createFile(data: Blob) {
  const buff = await data.arrayBuffer();

  // @ts-ignore
  if (data.name.endsWith(".gif")) {
    const sharpData = sharp(buff, { pages: -1 });
    return sharpData.toFormat("webp").toBuffer();
  }
  const sharpData = sharp(buff);
  return sharpData.toFormat("webp").toBuffer();
}

// Function to turn the file's body into a string.
const streamToString = (stream: StreamingBlobPayloadOutputTypes | undefined) => {
  const chunks: Buffer[] = [];
  if (!stream) return chunks;
  return new Promise((resolve, reject) => {
    // @ts-ignore
    stream.on("data", (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    // @ts-ignore
    stream.on("error", (err) => reject(err));
    // @ts-ignore
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
  });
};

export function asset_router(app: Elysia) {
  return app.group("/assets", (server) =>
    server
      .decorate("permissions", {
        is_project_owner: false,
        role_access: false,
        user_id: "",
        role_id: null,
        permission_id: null,
      } as PermissionDecorationType)
      .post(
        "/:project_id/:type",
        async ({ params, body, permissions }) => {
          let query = db
            .selectFrom("images")
            .where("images.project_id", "=", params.project_id)
            .where("images.type", "=", params.type as AssetType)
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10));

          if (!!body?.filters?.and?.length || !!body?.filters?.or?.length) {
            query = constructFilter("images", query, body.filters);
          }
          if (body.fields?.length) {
            query = query.select(body.fields.map((f) => `images.${f}`) as SelectExpression<DB, "images">[]);
          }

          if (!permissions.is_project_owner) {
            query = checkEntityLevelPermission(query, permissions, "images");
          }
          if (!!body.permissions && !permissions.is_project_owner) {
            query = GetRelatedEntityPermissionsAndRoles(query, permissions, "images");
          }
          if (body.orderBy?.length) {
            query = constructOrdering(body.orderBy, query);
          }

          if (body?.relations?.tags) {
            query = query.select((eb) =>
              TagQuery(eb, "image_tags", "images", permissions.is_project_owner, permissions.user_id),
            );
          }

          const { tags } = groupRelationFiltersByField(body.relationFilters || {});

          if (tags?.filters?.length) query = tagsRelationFilter("images", "image_tags", query, tags?.filters || [], false);

          const data = await query.execute();
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ListAssetsSchema,
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "read_assets"),
        },
      )
      .post(
        "/:project_id/:type/:id",
        async ({ params, body, permissions }) => {
          let query = db
            .selectFrom("images")
            .where("images.id", "=", params.id)
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) =>
              qb.clearSelect().select(body.fields.map((f) => `images.${f}`) as SelectExpression<DB, "images">[]),
            );

          if (permissions.is_project_owner) {
            query = query.leftJoin("entity_permissions", (join) => join.on("entity_permissions.related_id", "=", params.id));
          } else {
            query = checkEntityLevelPermission(query, permissions, "images", params.id);
          }
          if (body.permissions) {
            query = GetRelatedEntityPermissionsAndRoles(query, permissions, "images", params.id);
          }

          if (body?.relations?.tags) {
            query = query.select((eb) =>
              TagQuery(eb, "image_tags", "images", permissions.is_project_owner, permissions.user_id),
            );
          }

          const data = await query.executeTakeFirstOrThrow();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: ReadAssetsSchema,
          response: ResponseWithDataSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "read_assets"),
        },
      )
      .post(
        "/upload/:project_id/:type",
        async ({ params, body, permissions }) => {
          const { type, project_id } = params;

          const objectEntries = Object.entries(body);
          for (let index = 0; index < objectEntries.length; index++) {
            const [, file] = objectEntries[index];
            const buffer = await createFile(file);
            const { id: image_id } = await db
              .insertInto("images")
              .values(getEntityWithOwnerId({ title: file.name, project_id, type: type as AssetType }, permissions.user_id))
              .returning("id")
              .executeTakeFirstOrThrow();
            const filePath = `assets/${project_id}/${type}`;

            const command = new PutObjectCommand({
              Bucket: process.env.DO_SPACES_NAME as string,
              Key: `${filePath}/${image_id}.webp`,
              Body: buffer,
              ACL: "public-read",
              ContentType: "image/webp",
              CacheControl: "max-age=600",
            });
            const url = await getSignedUrl(s3Client, command, { expiresIn: 600 });
            await fetch(url, {
              headers: {
                "Content-Type": "image/webp",
                "Cache-Control": "max-age=600",
                "x-amz-acl": "public-read",
              },
              method: "PUT",
              body: buffer,
            });
          }

          return { message: "Image(s) uploaded successfully.", ok: true, role_access: true };
        },
        {
          body: t.Record(t.String(), t.File({ maxSize: "100m" })),
          response: ResponseSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "create_assets"),
        },
      )
      .post(
        "/update/:id",
        async ({ params, body, permissions }) => {
          const permissionCheck = await getHasEntityPermission("images", params.id, permissions);
          if (permissionCheck) {
            await db.transaction().execute(async (tx) => {
              let update_data: Record<string, any> = {};
              if ("data" in body) {
                if (body.data.title) {
                  update_data.title = body.data.title;
                }
                if (body.data.owner_id) {
                  update_data.owner_id = body.data.owner_id;
                }
              } else {
                if (body.title) {
                  update_data.title = body.title;
                }
                if (body.owner_id) {
                  update_data.owner_id = body.owner_id;
                }
                if (body.file) {
                  const image_data = await tx
                    .selectFrom("images")
                    .where("images.id", "=", params.id)
                    .select(["id", "project_id", "type"])
                    .executeTakeFirst();

                  if (image_data) {
                    try {
                      const filePath = `assets/${image_data.project_id}/${image_data.type}`;
                      await s3Client.send(
                        new DeleteObjectCommand({
                          Bucket: process.env.DO_SPACES_NAME as string,
                          Key: `${filePath}/${params.id}.webp`,
                        }),
                      );
                      const buffer = await createFile(body.file as File);

                      const command = new PutObjectCommand({
                        Bucket: process.env.DO_SPACES_NAME as string,
                        Key: `${filePath}/${params.id}.webp`,
                        Body: buffer,
                        ACL: "public-read",
                        ContentType: "image/webp",
                        CacheControl: "max-age=600",
                      });
                      const url = await getSignedUrl(s3Client, command, { expiresIn: 600 });
                      await fetch(url, {
                        headers: {
                          "Content-Type": "image/webp",
                          "Cache-Control": "max-age=600",
                          "x-amz-acl": "public-read",
                        },
                        method: "PUT",
                        body: buffer,
                      });

                      fetch("https://api.digitalocean.com/v2/cdn/endpoints/2d4f9376-7445-4c59-b4fd-58e758acd06d/cache", {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${process.env.DO_CDN_PURGE_ACCESS_KEY}`,
                        },
                        body: JSON.stringify({
                          files: ["*"],
                        }),
                      });
                    } catch (error) {
                      return { message: "Could not delete image.", ok: false, role_access: true };
                    }
                  }
                }
              }

              await tx.updateTable("images").where("id", "=", params.id).set(update_data).execute();
              if ("permissions" in body && body?.permissions) {
                await UpdateEntityPermissions(tx, params.id, body.permissions);
              }

              if ("relations" in body && body.relations?.tags) {
                await UpdateTagRelations({
                  relationalTable: "image_tags",
                  id: params.id,
                  newTags: body.relations.tags,
                  tx,
                  is_project_owner: permissions.is_project_owner,
                });
              }
            });
            return { message: `Image ${MessageEnum.successfully_updated}`, ok: true, role_access: true };
          } else {
            noRoleAccessErrorHandler();
            return { message: "", ok: false, role_access: false };
          }
        },
        {
          body: UpdateImageSchema,
          response: ResponseSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "update_assets"),
        },
      )
      .post(
        "/download/:project_id/:type",
        async ({ body, params }) => {
          const { project_id, type } = params;
          const filePath = `assets/${project_id}/${type}`;
          const responseFiles = [];
          for (let index = 0; index < body.data.length; index++) {
            const bucketParams = {
              Bucket: process.env.DO_SPACES_NAME as string,
              Key: `${filePath}/${body.data[index].id}.webp`,
            };
            try {
              const response = await s3Client.send(new GetObjectCommand(bucketParams));
              const data = await streamToString(response.Body);

              responseFiles.push(data);
            } catch (err) {
              console.error(err);
              responseFiles.push(null);
            }
          }
          return { data: responseFiles, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: DownloadAssetsSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "read_assets"),
        },
      )
      .delete(
        "/:project_id/:type/:id",
        async ({ params, permissions }) => {
          const permissionCheck = await getHasEntityPermission("images", params.id, permissions);
          if (permissionCheck) {
            const filePath = `assets/${params.project_id}/${params.type}`;

            try {
              await s3Client.send(
                new DeleteObjectCommand({
                  Bucket: process.env.DO_SPACES_NAME as string,
                  Key: `${filePath}/${params.id}.webp`,
                }),
              );
              await db.deleteFrom("images").where("id", "=", params.id).execute();
              return { message: `Image ${MessageEnum.successfully_deleted}`, ok: true, role_access: true };
            } catch (error) {
              return { message: "Could not delete image.", ok: false, role_access: true };
            }
          } else {
            noRoleAccessErrorHandler();
            return { message: "", ok: false, role_access: false };
          }
        },
        {
          response: ResponseSchema,
          beforeHandle: async (context) => beforeRoleHandler(context, "delete_assets"),
        },
      ),
  );
}
