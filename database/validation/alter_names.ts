import { Insertable } from "kysely";
import { AlterNames } from "kysely-codegen";
import { z } from "zod";

export type InsertAlterNamesType = Insertable<AlterNames>;

export const InsertAlterNamesSchema = z.object({
  project_id: z.string(),
  title: z.string(),
  parent_id: z.string(),
});
