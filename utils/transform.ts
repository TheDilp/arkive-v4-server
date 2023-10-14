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

export function getSingularEntityType(type: string) {
  if (type === "alter_names") return "alter name";
  if (type === "character_fields") return "character field";
  if (type === "character_fields_templates") return "character field template";
  if (type === "map_layers") return "map layer";
  if (type === "map_pins") return "map pin";
  if (type === "random_table_options") return "random table option";
  if (type === "random_tables") return "random table";
  if (type === "dictionaries") return "dictionary";
  return type.slice(0, type.length - 1);
}
