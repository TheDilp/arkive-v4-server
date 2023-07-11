import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "fs";
import sharp from "sharp";

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
      const filesToSend = readdirSync(filePath);

      rep.code(200).send({ data: filesToSend });
    },
  );
  server.get(
    "/:project_id/:type/:name",
    async (req: FastifyRequest<{ Params: { project_id: string; type: string; name: string } }>, rep: FastifyReply) => {
      const { project_id, type, name } = req.params;
      const filePath = `./assets/${project_id}/${type}/${name}`;
      if (!existsSync(filePath)) {
        rep.code(404).send({ message: "There are no assets of the requested type for this project.", ok: false });
      }
      const image = readFileSync(filePath);
      rep.type("image/webp");
      rep.headers({
        "Cache-Control": "max-age=3600",
      });
      rep.send(image);
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
      Object.entries(files).forEach(async ([key, file]) => {
        const filePath = `./assets/${project_id}/${type}`;
        if (!existsSync(`./assets/${project_id}/${type}`)) {
          mkdirSync(`./assets/${project_id}/${type}`, { recursive: true });
        }
        createFile(file.data, filePath, key, rep);
        filesToSend.push(key);
      });
      rep.send({ data: filesToSend });
    },
  );

  done();
}
