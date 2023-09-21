import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Elysia, { t } from "elysia";
import { SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import sharp from "sharp";

import { db } from "../database/db";
import { UpdateImageSchema } from "../database/validation";
import { MessageEnum } from "../enums/requestEnums";
import { RequestBodySchema, ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { constructOrdering } from "../utils/orderByConstructor";
import { s3Client } from "../utils/s3Client";

async function createFile(data: Blob) {
  const buff = await data.arrayBuffer();
  const sharpData = sharp(buff);
  return sharpData.toFormat("webp").toBuffer();
}

export function asset_router(app: Elysia) {
  return app.group("/assets", (server) =>
    server
      .post(
        "/:project_id/:type",
        async ({ params, body }) => {
          const data = await db
            .selectFrom("images")
            .selectAll()
            .where("images.project_id", "=", params.project_id)
            .where("images.type", "=", params.type)
            .limit(body?.pagination?.limit || 10)
            .offset((body?.pagination?.page ?? 0) * (body?.pagination?.limit || 10))
            .$if(!body.fields?.length, (qb) => qb.selectAll())
            .$if(!!body.fields?.length, (qb) => qb.clearSelect().select(body.fields as SelectExpression<DB, "images">[]))
            .$if(!!body.orderBy?.length, (qb) => {
              qb = constructOrdering(body.orderBy, qb);
              return qb;
            })
            .execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          body: RequestBodySchema,
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/upload/:project_id/:type",
        async ({ params, body }) => {
          const { type, project_id } = params;

          const objectEntries = Object.entries(body);
          for (let index = 0; index < objectEntries.length; index++) {
            const [, file] = objectEntries[index];
            const buffer = await createFile(file);
            const { id: image_id } = await db
              .insertInto("images")
              .values({ title: file.name, project_id })
              .returning("id")
              .executeTakeFirstOrThrow();
            const filePath = `assets/${project_id}/${type}`;

            const command = new PutObjectCommand({
              Bucket: process.env.DO_SPACES_NAME as string,
              Key: `${filePath}/${image_id}.webp`,
              Body: buffer,
              ACL: "public-read",
              ContentType: "image/webp",
            });
            const url = await getSignedUrl(s3Client, command, { expiresIn: 600 });
            await fetch(url, {
              headers: {
                "Content-Type": "image/webp",
                "Cache-Control": "3600",
                "x-amz-acl": "public-read",
              },
              method: "PUT",
              body: buffer,
            });
          }

          return { message: MessageEnum.success, ok: true };
        },
        {
          body: t.Record(t.String(), t.File()),
          response: ResponseSchema,
        },
      )
      .post(
        "/portrait/:character_id/:image_id",
        async ({ params }) => {
          await db
            .updateTable("characters")
            .where("characters.id", "=", params.character_id)
            .set({ portrait_id: params.image_id })
            .execute();

          return { message: `Character portrait ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          response: ResponseSchema,
        },
      )
      .post(
        "/update/:id",
        async ({ params, body }) => {
          await db.updateTable("images").where("id", "=", params.id).set(body.data).execute();
          return { message: `Image ${MessageEnum.successfully_updated}`, ok: true };
        },
        {
          body: UpdateImageSchema,
          response: ResponseSchema,
        },
      ),
  );

  // server.get(
  //   "/:project_id/:type/:id",
  //   async (req: FastifyRequest<{ Params: { project_id: string; type: string; id: string } }>, rep: FastifyReply) => {
  //     const { project_id, type, id } = req.params;

  //     const image = await db.selectFrom("images").selectAll().where("images.id", "=", id).executeTakeFirstOrThrow();

  //     const filePath = `./assets/${project_id}/${type}/${image.title}`;
  //     if (!existsSync(filePath)) {
  //       rep.code(404).send({ message: "There are no assets of the requested type for this project.", ok: false });
  //     }

  //     const imageData = readFileSync(filePath);

  //     rep.type("image/webp");
  //     rep.headers({
  //       "Cache-Control": "max-age=3600",
  //     });
  //     rep.send(imageData);
  //   },
  // );
}
