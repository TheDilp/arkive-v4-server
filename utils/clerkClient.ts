import * as clerkClient from "@clerk/clerk-sdk-node";

//@ts-ignore
// eslint-disable-next-line import/namespace
clerkClient.setClerkApiKey(process.env.CLERK_SECRET_KEY as string);
