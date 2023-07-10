import { Insertable } from "kysely";
import { Users } from "kysely-codegen";

export type InsertUserType = Insertable<Users>;
