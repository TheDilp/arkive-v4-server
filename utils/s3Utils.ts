import { DeleteObjectsCommand, ListObjectsV2Command, S3 } from "@aws-sdk/client-s3";

export const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY as string,
    secretAccessKey: process.env.DO_SPACES_SECRET as string,
  },
});

// delete all files in a folder on s3
export async function deleteFolder(location: string) {
  const bucket = process.env.DO_SPACES_NAME;
  let count = 0; // number of files deleted
  async function recursiveDelete(token?: string) {
    // get the files
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: location,
      ContinuationToken: token,
    });
    let list = await s3Client.send(listCommand);
    if (list.KeyCount) {
      // if items to delete
      // delete the files
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: (list?.Contents || []).map((item) => ({ Key: item.Key })),
          Quiet: false,
        },
      });
      let deleted = await s3Client.send(deleteCommand);
      count += deleted.Deleted?.length || 0;
      // log any errors deleting files
      if (deleted.Errors) {
        deleted.Errors.map((error) => console.log(`${error.Key} could not be deleted - ${error.Code}`));
      }
    }
    // repeat if more files to delete
    if (list.NextContinuationToken) {
      recursiveDelete(list.NextContinuationToken);
    }
    // return total deleted count when finished
    return `${count} files deleted.`;
  }

  if (bucket) return recursiveDelete();
}
