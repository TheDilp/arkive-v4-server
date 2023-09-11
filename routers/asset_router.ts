import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

import Elysia, { t } from "elysia";
import { db } from "../database/db";
import { MessageEnum } from "../enums/requestEnums";
import { ResponseSchema, ResponseWithDataSchema } from "../types/requestTypes";
import { s3Client } from "../utils/s3Client";

async function createFile(data: Blob) {
  const buff = await data.arrayBuffer();
  const sharpData = sharp(buff);
  const metadata = await sharpData.metadata();
  console.log(metadata);
  return sharpData.toFormat("webp").toBuffer();
}

export function asset_router(app: Elysia) {
  return app.group("/assets", (server) =>
    server
      .get(
        "/:project_id/:type",
        async ({ params }) => {
          const data = await db
            .selectFrom("images")
            .selectAll()
            .where("images.project_id", "=", params.project_id)
            .where("images.type", "=", params.type)
            .execute();
          return { data, message: MessageEnum.success, ok: true };
        },
        {
          response: ResponseWithDataSchema,
        },
      )
      .post(
        "/upload/:project_id/:type",
        async ({ params, body }) => {
          const { type, project_id } = params;
          const filesToSend: string[] = [];

          const objectEntires = Object.entries(body);

          await Promise.all(
            objectEntires.map(async ([key, file]) => {
              const filePath = `assets/${project_id}/${type}`;

              const { id: image_id } = await db
                .insertInto("images")
                .values({ title: key, project_id })
                .returning("id")
                .executeTakeFirstOrThrow();

              const fileBuffer = await createFile(file);
              const params = {
                Bucket: process.env.DO_SPACES_NAME as string,
                Key: `${filePath}/${image_id}.webp`,
                Body: fileBuffer,
                ACL: "public-read",
                ContentType: "image/webp",
              };
              console.log(params);
              await s3Client.send(new PutObjectCommand(params));
            }),
          );
          return { data: [], message: MessageEnum.success, ok: true };
        },
        {
          body: t.Record(t.String(), t.File({ type: ["image"] })),
          beforeHandle: (ctx) => {
            console.log(typeof ctx.body, ctx.body);
          },
          response: ResponseWithDataSchema,
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
