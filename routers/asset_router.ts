import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StreamingBlobPayloadOutputTypes } from "@smithy/types";
import Elysia, { t } from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import sharp from "sharp";

import { db } from "../database/db";
import { checkEntityLevelPermission, getHasEntityPermission } from "../database/queries";
import { UpdateImageSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { beforeRoleHandler, noRoleAccessErrorHandler } from "../handlers";
import { AssetType } from "../types/entityTypes";
import { PermissionDecorationType, RequestBodySchema, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructFilter } from "../utils/filterConstructor";
import { constructOrdering } from "../utils/orderByConstructor";
import { GetRelatedEntityPermissionsAndRoles, UpdateEntityPermissions } from "../utils/relationalQueryHelpers";
import { s3Client } from "../utils/s3Utils";
import { getEntityWithOwnerId } from "../utils/transform";

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
          const data = await db
            .selectFrom("images")
            .selectAll()
            .where("images.project_id", "=", params.project_id)
            .where("images.type", "=", params.type as AssetType)
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .$if(!!body?.filters?.and?.length || !!body?.filters?.or?.length, (qb) => {
              qb = constructFilter("images", qb, body.filters);
              return qb;
            })
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) =>
              qb.clearSelect().select(body.fields.map((f) => `images.${f}`) as SelectExpression<DB, "images">[]),
            )
            .$if(!permissions.is_project_owner, (qb) => {
              return checkEntityLevelPermission(qb, permissions, "images");
            })
            .$if(!!body.permissions && !permissions.is_project_owner, (qb) =>
              GetRelatedEntityPermissionsAndRoles(qb, permissions, "images"),
            )
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .execute();
          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: RequestBodySchema,
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

          const data = await query.executeTakeFirstOrThrow();

          return { data, message: MessageEnum.success, ok: true, role_access: true };
        },
        {
          body: RequestBodySchema,
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
              CacheControl: "max-age=3600",
            });
            const url = await getSignedUrl(s3Client, command, { expiresIn: 600 });
            await fetch(url, {
              headers: {
                "Content-Type": "image/webp",
                "Cache-Control": "max-age=3600",
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
              await tx.updateTable("images").where("id", "=", params.id).set(body.data).execute();
              if (body?.permissions) {
                await UpdateEntityPermissions(tx, params.id, body.permissions);
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
      .get(
        "/download/:project_id/:type/:id",
        async ({ params }) => {
          const { project_id, type, id } = params;
          const filePath = `assets/${project_id}/${type}`;
          const bucketParams = {
            Bucket: process.env.DO_SPACES_NAME as string,
            Key: `${filePath}/${id}.webp`,
          };

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

          try {
            const response = await s3Client.send(new GetObjectCommand(bucketParams));
            const data = await streamToString(response.Body);

            return { data, message: MessageEnum.success, ok: true, role_access: true };
          } catch (err) {
            throw new Error("Error downloading file.");
          }
        },
        {
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
