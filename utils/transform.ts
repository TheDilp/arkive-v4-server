export function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getGenerationOffset(index: number, generationCount: number): number {
  const startOffset = -450 * (generationCount - 2);
  if (index === 0) return startOffset;

  return startOffset + 300 * index;
}

type MainType = { id: string; title: string; suboptions?: { id: string; title: string }[] };
type SubType = { id: string; title: string };

export function chooseRandomItems(arr: (MainType & { suboptions?: SubType[] })[], M: number): (MainType | SubType)[] {
  if (M > arr.length) {
    return [];
  }

  const randomItems: (MainType | SubType)[] = [];

  for (let i = 0; i < M; i++) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const selectedItem = arr[randomIndex];
    if (selectedItem?.suboptions?.length) {
      const randomSubIndex = Math.floor(Math.random() * selectedItem.suboptions.length);
      const seletedSubItem = selectedItem.suboptions[randomSubIndex];
      randomItems.push({ id: seletedSubItem.id, title: `${selectedItem.title} - ${seletedSubItem.title}` });
    } else {
      randomItems.push({ id: selectedItem.id, title: selectedItem.title });
    }
  }

  return randomItems;
}
