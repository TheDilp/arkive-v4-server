import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { existsSync, mkdirSync, readFileSync } from "fs";
import sharp from "sharp";

import { db } from "../database/db";

function createFile(data: any, filePath: string, name: string, rep: FastifyReply) {
  sharp(data)
    .toFormat("webp")
    .toFile(`${filePath}/${name}`, (err) => {
      if (err) {
        console.error(err);
        rep.code(400).send({ message: "There was an error saving this image.", ok: false });
      }
    });
}

export function asset_router(server: FastifyInstance, _: any, done: any) {
  server.get(
    "/:project_id/:type",
    async (req: FastifyRequest<{ Params: { project_id: string; type: string } }>, rep: FastifyReply) => {
      const { project_id, type } = req.params;

      const filePath = `./assets/${project_id}/${type}`;
      if (!existsSync(filePath)) {
        rep.code(404).send({ message: "There are no assets of the requested type for this project.", ok: false });
      }

      const images = await db.selectFrom("images").selectAll().where("images.project_id", "=", req.params.project_id).execute();
      rep.code(200).send({ data: images });
    },
  );
  server.get(
    "/:project_id/:type/:id",
    async (req: FastifyRequest<{ Params: { project_id: string; type: string; id: string } }>, rep: FastifyReply) => {
      const { project_id, type, id } = req.params;

      const image = await db.selectFrom("images").selectAll().where("images.id", "=", id).executeTakeFirstOrThrow();

      const filePath = `./assets/${project_id}/${type}/${image.title}`;
      if (!existsSync(filePath)) {
        rep.code(404).send({ message: "There are no assets of the requested type for this project.", ok: false });
      }
      const imageData = readFileSync(filePath);
      rep.type("image/webp");
      rep.headers({
        "Cache-Control": "max-age=3600",
      });
      rep.send(imageData);
    },
  );

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
          const filePath = `./assets/${project_id}/${type}`;
          if (!existsSync(`./assets/${project_id}/${type}`)) {
            mkdirSync(`./assets/${project_id}/${type}`, { recursive: true });
          }
          createFile(file.data, filePath, key, rep);
          filesToSend.push(key);

          await db.insertInto("images").values({ title: key, project_id: req.params.project_id }).execute();
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
