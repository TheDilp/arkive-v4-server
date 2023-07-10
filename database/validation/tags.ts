import { Insertable, Updateable } from "kysely";
import { Tags } from "kysely-codegen";

export type InsertTagType = Insertable<Tags>;
export type UpdateTagType = Updateable<Tags>;

export type TagColumns = keyof Tags;
