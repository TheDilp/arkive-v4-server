import * as stytch from "stytch";

export const authClient = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID as string,
  secret: process.env.STYTCH_SECRET as string,
});
