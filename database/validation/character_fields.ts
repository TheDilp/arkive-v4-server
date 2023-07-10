import { Insertable } from "kysely";
import { _CharacterFieldsTocharacterFieldsTemplates, CharacterFields } from "kysely-codegen";

export type InsertCharacterFieldsType = Insertable<CharacterFields>;
export type InsertCharacterFieldsToTemplatesType = Insertable<_CharacterFieldsTocharacterFieldsTemplates>;
