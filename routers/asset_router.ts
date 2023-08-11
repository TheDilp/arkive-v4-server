import { PutObjectCommand } from "@aws-sdk/client-s3";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import sharp from "sharp";

import { db } from "../database/db";
import { s3Client } from "../utils/s3Client";

function createFile(data: any) {
  return sharp(data).toFormat("webp").toBuffer();
}

export function asset_router(server: FastifyInstance, _: any, done: any) {
  server.get(
    "/:project_id/:type",
    async (req: FastifyRequest<{ Params: { project_id: string; type: string } }>, rep: FastifyReply) => {
      const images = await db
        .selectFrom("images")
        .selectAll()
        .where("images.project_id", "=", req.params.project_id)
        .where("images.type", "=", req.params.type)
        .execute();
      rep.code(200).send({ data: images });
    },
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

  server.post(
    "/upload/:project_id/:type",
    async (
      req: FastifyRequest<{
        Params: { type: "images" | "maps"; project_id: string };
        Body: any[];
      }>,
      rep: FastifyReply,
    ) => {
      const files = req.body;
      const { type, project_id } = req.params;
      const filesToSend: string[] = [];

      const objectEntires = Object.entries(files);

      await Promise.all(
        objectEntires.map(async ([key, file]) => {
          const filePath = `assets/${project_id}/${type}`;

          const [image_id] = await db
            .insertInto("images")
            .values({ title: key, project_id: req.params.project_id })
            .returning("id")
            .execute();

          const fileBuffer = await createFile(file.data);
          const params = {
            Bucket: process.env.DO_SPACES_NAME as string,
            Key: `${filePath}/${image_id.id}.webp`,
            Body: fileBuffer,
            ACL: "public-read",
            ContentType: "image/webp",
          };

          await s3Client.send(new PutObjectCommand(params));
        }),
      );

      rep.send({ data: filesToSend });
    },
  );
  server.post(
    "/portrait/:character_id/:image_id",
    async (
      req: FastifyRequest<{
        Params: { project_id: string; character_id: string; image_id: string };
      }>,
      rep: FastifyReply,
    ) => {
      await db
        .updateTable("characters")
        .where("characters.id", "=", req.params.character_id)
        .set({ portrait_id: req.params.image_id })
        .execute();

      rep.send({ message: "Character portrait successfully updated.", ok: true });
    },
  );

  done();
}
