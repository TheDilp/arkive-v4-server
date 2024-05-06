import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.VALKEY_URL,
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
