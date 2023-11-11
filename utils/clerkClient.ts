import * as clerkClient from "@clerk/clerk-sdk-node";

clerkClient.setClerkApiKey(process.env.CLERK_SECRET_KEY as string);
