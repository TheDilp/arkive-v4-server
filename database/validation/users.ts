import { Insertable } from "kysely";
import { Users } from "kysely-codegen";
import { z } from "zod";

export type InsertUserType = Insertable<Users>;

export const InsertUserSchema = z.object({});
