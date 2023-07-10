import { Insertable, Updateable } from "kysely";
import { Characters } from "kysely-codegen";

export type InsertCharacterType = Insertable<Characters>;
export type UpdateCharacterType = Updateable<Characters>;

export type CharacterColumns = keyof Characters;
