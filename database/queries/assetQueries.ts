import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";

import { AssetType } from "../../types/entityTypes";
import { s3Client } from "../../utils/s3Utils";
import { getEntityWithOwnerId } from "../../utils/utils";
import { db } from "../db";

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

export async function UploadAssets({
  type,
  project_id,
  body,
  permissions,
}: {
  type: "images" | "map_images";
  project_id: string;
  body: {
    [x: string]: File;
  };
  permissions: { user_id: string };
}) {
  const objectEntries = Object.entries(body);
  const ids: string[] = [];
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
    ids.push(image_id);
  }
  return ids;
}
