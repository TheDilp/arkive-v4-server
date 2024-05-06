import { MentionTypeEnum } from "../enums";
import { baseURLS } from "../enums/baseEnums";
import { HeadingType, MentionAtomType, ParagraphType } from "../types/documentContentTypes";
import { AssetType, AvailableEntityType, AvailableSubEntityType, MentionType } from "../types/entityTypes";
import { RequestBodyFiltersType, RequestFilterType } from "../types/requestTypes";

export function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getXCoordinate(index: number, generation: number, previousOffset: number = 0): number {
  if (index % 2 === 0) {
    return (index / 2) * 150 + 150 + generation * 150 + previousOffset;
  } else {
    return (Math.floor(index / 2) * 150 + 150 + generation * 150 + previousOffset) * -1;
  }
}

type MainType = { id: string; title: string; suboptions?: { id: string; title: string }[] };

export type GroupedQueryFilter = RequestFilterType & { type: "AND" | "OR" };
export interface GroupedQueries {
  [key: string]: {
    filters: GroupedQueryFilter[];
  };
}

export function chooseRandomItems(arr: MainType[], M: number): { id: string; subitem_id?: string; title: string }[] {
  if (M > arr.length) {
    return [];
  }

  const randomItems: { id: string; subitem_id?: string; title: string }[] = [];

  for (let i = 0; i < M; i++) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const selectedItem = arr.splice(randomIndex, 1)[0];
    if (selectedItem?.suboptions?.length) {
      const randomSubIndex = Math.floor(Math.random() * selectedItem.suboptions.length);
      const seletedSubItem = selectedItem.suboptions.splice(randomSubIndex)[0];
      randomItems.push({
        id: selectedItem.id,
        subitem_id: seletedSubItem.id,
        title: `${selectedItem.title} - ${seletedSubItem.title}`,
      });
    } else {
      randomItems.push({ id: selectedItem.id, title: selectedItem.title });
    }
  }

  return randomItems;
}

export function getCharacterFullName(first_name: string, nickname?: string | null, last_name?: string | null): string {
  return `${first_name.trim()}${nickname ? ` ${nickname?.trim()}` : ""}${last_name ? ` ${last_name?.trim()}` : ""}`;
}

export function areArraysEqual(a: string[], b: string[]) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function getSentenceCase(field: string) {
  const result = field.replaceAll("_", " ").replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function getSingularEntityType(type: string): string {
  if (type === "alter_names") return "alter name";
  if (type === "character_fields") return "character field";
  if (type === "character_fields_templates") return "character field template";
  if (type === "map_layers") return "map layer";
  if (type === "map_pins") return "map pin";
  if (type === "random_table_options") return "random table option";
  if (type === "random_tables") return "random table";
  if (type === "dictionaries") return "dictionary";
  return type
    .slice(0, type.length - 1)
    .replaceAll("_", " ")
    .replace(/([A-Z])/g, " $1");
}

export function insertSenderToMessage(content: { type: string; content: any }, mention: any) {
  if (content?.type === "paragraph" && Array.isArray(content?.content)) {
    content?.content?.unshift(mention, {
      text: ": ",
      type: "text",
    });
    return;
  } else {
    if (Array.isArray(content?.content) && content?.content?.length) {
      for (let index = 0; index < content.content.length; index++) {
        const node = content.content[index];
        if (node?.type === "paragraph") {
          node?.content?.unshift(mention, {
            text: ": ",
            type: "text",
          });
          return;
        } else {
          insertSenderToMessage(node?.content, mention);
        }
      }
    }
  }
}

export function findObjectsByType(obj: Record<string, any>, targetType: string): MentionType[] {
  let foundObjects: MentionType[] = [];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === "object" && value !== null) {
        if (value.type === targetType && value?.attrs?.name && MentionTypeEnum.includes(value?.attrs?.name)) {
          foundObjects.push(value);
        } else {
          foundObjects = foundObjects.concat(findObjectsByType(value, targetType));
        }
      }
    }
  }

  return foundObjects;
}

export function getImageURL(project_id: string, type: AssetType, image_id?: string | null, isGraphImage?: boolean): string {
  if (!image_id) return "";
  return `https://${process.env.DO_SPACES_NAME}.${
    isGraphImage ? process.env.DO_SPACES_ENDPOINT : process.env.DO_SPACES_CDN_ENDPOINT
  }/assets/${project_id}/${type}/${image_id}.webp`;
}

export function createEntityURL(project_id: string, type: string, id: string): string {
  return `${baseURLS.basePublicServer}/${project_id}/${type}/${id}`;
}
export function getIconUrlFromIconEnum(icon: string, color?: string) {
  const iconComponents = icon.split(":");
  return `https://api.iconify.design/${iconComponents[0]}/${iconComponents[1]}.svg${
    color ? `?color=${color.replace("#", "%23")}` : ""
  }`;
}

export function getDefaultEntityIcon(type: AvailableEntityType | AvailableSubEntityType) {
  if (type === "characters") return "ph:user";
  if (type === "documents") return "ph:files-fill";
  if (type === "maps") return "ph:map-trifold";
  if (type === "graphs") return "ph:graph-light";
  if (type === "calendars") return "ph:calendar-blank-light";
  if (type === "dictionaries") return "ph:book-bookmark-light";
  if (type === "nodes") return "ph:graph-light";
  if (type === "edges") return "ph:graph-light";
  if (type === "random_tables") return "game-icons:perspective-dice-six-faces-random";
  if (type === "character_fields_templates") return "ph:textbox";
  if (type === "events") return "ph:flag";
  if (type === "blueprints" || type === "blueprint_instances") return "ph:compass-tool";

  return "";
}

export function groupFiltersByField(queryStructure: RequestBodyFiltersType): GroupedQueries {
  const groupedQueries: GroupedQueries = {};

  for (const groupKey of ["and", "or"]) {
    // @ts-ignore
    const group = queryStructure[groupKey];
    if (group) {
      for (const query of group) {
        const { field, ...rest } = query;
        if (!groupedQueries[field]) {
          groupedQueries[field] = {
            filters: [],
          };
        }

        const newFilter = rest;
        newFilter.type = groupKey.toUpperCase() as "AND" | "OR";
        groupedQueries[field].filters.push(newFilter);
      }
    }
  }

  return groupedQueries;
}
export function groupRelationFiltersByField(queryStructure: RequestBodyFiltersType): GroupedQueries {
  const groupedQueries: GroupedQueries = {};

  for (const groupKey of ["and", "or"]) {
    // @ts-ignore
    const group = queryStructure[groupKey];
    if (group) {
      for (const query of group) {
        const { field, ...rest } = query;
        if (!groupedQueries[field]) {
          groupedQueries[field] = {
            filters: [],
          };
        }
        if (rest?.relationalData?.character_field_id || rest?.relationalData?.blueprint_field_id) {
          const newFilter = rest;
          newFilter.type = groupKey.toUpperCase() as "AND" | "OR";
          groupedQueries[field].filters.push(newFilter);
        }
      }
    }
  }

  return groupedQueries;
}

export function groupCharacterResourceFiltersByField(queryStructure: RequestBodyFiltersType): GroupedQueries {
  const groupedQueries: GroupedQueries = {};

  for (const groupKey of ["and", "or"]) {
    // @ts-ignore
    const group = queryStructure[groupKey];
    if (group) {
      for (const query of group) {
        const { field, ...rest } = query;
        if (!groupedQueries[field]) {
          groupedQueries[field] = {
            filters: [],
          };
        }
        if (!rest?.relationalData?.character_field_id) {
          const newFilter = rest;
          newFilter.type = groupKey.toUpperCase() as "AND" | "OR";
          groupedQueries[field].filters.push(newFilter);
        }
      }
    }
  }

  return groupedQueries;
}

export function groupByBlueprintFieldId(data: GroupedQueryFilter[]): Record<string, GroupedQueryFilter[]> {
  const grouped: Record<string, GroupedQueryFilter[]> = {};

  data.forEach((obj) => {
    if (obj.relationalData) {
      const { blueprint_field_id } = obj.relationalData;
      if (!blueprint_field_id) return;
      if (grouped[blueprint_field_id]) {
        grouped[blueprint_field_id].push(obj);
      } else {
        grouped[blueprint_field_id] = [obj];
      }
    }
  });

  return grouped;
}
export function groupByCharacterFieldId(data: GroupedQueryFilter[]): Record<string, GroupedQueryFilter[]> {
  const grouped: Record<string, GroupedQueryFilter[]> = {};

  data.forEach((obj) => {
    if (obj.relationalData) {
      const { character_field_id } = obj.relationalData;
      if (!character_field_id) return;
      if (grouped[character_field_id]) {
        grouped[character_field_id].push(obj);
      } else {
        grouped[character_field_id] = [obj];
      }
    }
  });

  return grouped;
}

export function groupByCharacterResourceId(data: GroupedQueryFilter[]): Record<string, GroupedQueryFilter[]> {
  const grouped: Record<string, GroupedQueryFilter[]> = {};

  data.forEach((obj) => {
    if (obj?.id) {
      const { id } = obj;
      if (!id) return;
      if (grouped[id]) {
        grouped[id].push(obj);
      } else {
        grouped[id] = [obj];
      }
    }
  });

  return grouped;
}

export function groupCharacterFields(originalItems: any[]): any[] {
  const groupedItems: Record<string, any> = {};

  originalItems.forEach((item) => {
    const { id, characters, blueprint_instances, events, images, documents, map_pins } = item;

    if (!groupedItems[id]) {
      groupedItems[id] = { id, characters: [], blueprint_instances: [], events: [], images: [], documents: [], map_pins: [] };
    }

    groupedItems[id].characters.push(...(characters || []));
    groupedItems[id].blueprint_instances.push(...(blueprint_instances || []));
    groupedItems[id].events.push(...(events || []));
    groupedItems[id].documents.push(...(documents || []));
    groupedItems[id].images.push(...(images || []));
    groupedItems[id].map_pins.push(...(map_pins || []));
  });

  return Object.values(groupedItems);
}

export function getEntityWithOwnerId<T>(entity: T, owner_id: string): T & { owner_id: string } {
  // @ts-ignore
  entity.owner_id = owner_id;
  return entity as T & { owner_id: string };
}

export function getEntitiesWithOwnerId<T>(entities: T[], owner_id: string): (T & { owner_id: string })[] {
  for (let index = 0; index < entities.length; index += 1) {
    // @ts-ignore
    entities[index].owner_id = owner_id;
  }
  return entities as (T & { owner_id: string })[];
}

export function buildTSQueryString(searchTerms: string[]): string {
  const sanitizedSearchTerms = searchTerms.map((term) => term.replace(/[^\w\s_"]+/g, ""));

  const tsQuery = sanitizedSearchTerms.join(" | ");

  return tsQuery;
}

export function extractMentionContent(mention: MentionAtomType) {
  if (mention.attrs?.projectId) {
    let link = `https://thearkive.app/public/${mention.attrs.projectId}/${mention.attrs.name}/${mention.attrs.id}`;
    const text = `[${mention?.attrs?.label}](${link})`;
    return text;
  }
  return mention.attrs.label;
}

export function extractParagraphContent(paragraph: ParagraphType) {
  if (paragraph?.content) {
    const text = paragraph?.content
      .filter((obj) => obj?.type !== "image")
      .map((obj) => {
        if ("text" in obj) return obj.text;
        // if ("attrs" in obj && "alt" in obj.attrs) return "";
        if ("attrs" in obj && "label" in obj.attrs) {
          return extractMentionContent(obj as MentionAtomType);
        }
      })
      .join("");
    return `${text}`;
  }
  return "";
}
export function extractHeadingContent(heading: HeadingType) {
  const text = heading?.content?.map((obj) => obj?.text).join(" ");
  return `${text}\n`;
}

export function extractDocumentText(content: any) {
  if (!content) return false;
  const text: string[] = [];
  let len = 0;
  Object.entries(content).forEach(([key, value]) => {
    if (len >= 250) {
      return;
    }

    if (key === "content") {
      if (Array.isArray(value)) {
        value.forEach((obj) => {
          if (len >= 250) {
            return;
          }
          if (obj?.type === "heading") {
            const heading = extractHeadingContent(obj);
            len += heading.length;
            text.push(heading);
          } else if (obj?.type === "paragraph") {
            const paragraph = extractParagraphContent(obj);
            text.push(paragraph);
            len += paragraph.length;
          }
        });
      }
    }
  });

  const finalText = text.join("");
  if (finalText.length >= 250) {
    // eslint-disable-next-line prettier/prettier, quotes
    return finalText.slice(0, 246).replaceAll('"', "'").concat("...");
  }
  return finalText;
}
