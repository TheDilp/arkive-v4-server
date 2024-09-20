import { Cookie, StatusMap } from "elysia";
import { HTTPHeaders } from "elysia/types";

import { db } from "../database/db";
import { JWTGatewayResponse, JWTResponse } from "../types/entityTypes";
import { redisClient } from "./redisClient";

export async function getUserProjectFlags(user_id: string, project_id: string) {
  const redis = await redisClient;
  const redis_flags = await redis.get(`notification_flags_${user_id}`);
  let flags: Record<string, boolean> = {};
  if (redis_flags) {
    flags = JSON.parse(redis_flags || "{}");
  } else {
    const notification_flags = await db
      .selectFrom("user_project_feature_flags")
      .select(["user_project_feature_flags.feature_flags"])
      .leftJoin("users", "users.id", "user_project_feature_flags.user_id")
      .where("users.id", "=", user_id)
      .where("project_id", "=", project_id)
      .executeTakeFirst();
    if (notification_flags?.feature_flags) {
      await redis.set(`notification_flags_${user_id}`, JSON.stringify(notification_flags.feature_flags), { EX: 60 * 60 });
      flags = notification_flags.feature_flags as Record<string, boolean>;
    }
  }
  return flags;
}

export async function verifyJWT({
  refresh,
  access,
  set,
  module = null,
}: {
  module: "editor" | "dyce_vtt" | null;
  refresh: Cookie<string | undefined>;
  access: Cookie<string | undefined>;
  set: { headers: HTTPHeaders; status?: number | keyof StatusMap };
}) {
  const res = await fetch(`${process.env.AUTH_SERVICE_URL}/verify`, {
    method: "POST",
    // @ts-ignore
    headers: { "Content-Type": "application/json", module },
    body: JSON.stringify({
      access: access.value,
      refresh: refresh.value,
    }),
  });

  if (res.status >= 400) {
    // console.error(await res.text());
    set.status = 401;
    return { status: "unauthenticated" };
  }

  try {
    const cookie_data = (await res.json()) as JWTResponse;
    if (cookie_data.access !== "None" && cookie_data.refresh !== "None") {
      set.headers["set-cookie"] = getCookies(cookie_data.access, cookie_data.refresh);
      return {
        status: "authenticated",
        user_id: cookie_data.claims.user_id,
        project_id: cookie_data.claims.project_id,
        game_id: null,
        image_url: cookie_data.claims.image_url,
        is_email_confirmed: cookie_data.claims.is_email_confirmed,
        name: cookie_data.claims.name,
      };
    } else {
      throw Error("COOKIES ARE NONE");
    }
  } catch (error) {
    // console.error(error);
    // set.status = 401;
    throw new Error("UNAUTHORIZED");
  }
}

export async function verifyGatewayJWT({
  access,
  set,
}: {
  access: Cookie<string | undefined>;
  set: { headers: HTTPHeaders; status?: number | keyof StatusMap };
}) {
  const res = await fetch(`${process.env.AUTH_SERVICE_URL}/verify/gateway`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access: access.value,
    }),
  });

  if (res.status >= 400) {
    console.error(await res.text());
    set.status = 403;
    return { status: "not_allowed" };
  }

  try {
    const data = (await res.json()) as JWTGatewayResponse;
    const additional_cookie_params =
      process.env.NODE_ENV === "production" ? "domain=.thearkive.app; Secure; SameSite=None;" : "";
    set.headers["set-cookie"] = `access=${access}; HttpOnly; Path=/; ${additional_cookie_params} Expires=${getCookieExpiry(
      "access",
    )}`;
    return {
      status: "allowed",
      project_id: data.claims.project_id,
      access_id: data.claims.access_id,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "not_allowed",
    };
  }
}

export function getCookieExpiry(type: "access" | "refresh"): Date {
  const now = new Date();

  if (type === "access") {
    // Add 5 minutes for access token
    now.setMinutes(now.getMinutes() + 5);
  } else if (type === "refresh") {
    // Add 6 hours for refresh token
    now.setHours(now.getHours() + 6);
  }

  return now;
}

function getCookies(access: string, refresh: string) {
  const additional_cookie_params = process.env.NODE_ENV === "production" ? "domain=.thearkive.app; Secure; SameSite=None;" : "";
  if (access === "None" || refresh === "None") return [];
  return [
    `access=${access}; HttpOnly; Path=/; ${additional_cookie_params} Expires=${getCookieExpiry("access")}`,
    `refresh=${refresh}; HttpOnly; Path=/; ${additional_cookie_params} Expires=${getCookieExpiry("refresh")}`,
  ];
}
