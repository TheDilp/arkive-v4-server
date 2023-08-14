export function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getGenerationOffset(index: number, generationCount: number): number {
  const startOffset = -450 * (generationCount - 2);
  if (index === 0) return startOffset;

  return startOffset + 300 * index;
}

export function chooseRandomItems<T>(arr: T[], M: number): T[] {
  if (M > arr.length) {
    return [];
  }

  const randomItems: T[] = [];
  const remainingItems: T[] = [...arr];

  for (let i = 0; i < M; i++) {
    const randomIndex = Math.floor(Math.random() * remainingItems.length);
    const selectedItem = remainingItems.splice(randomIndex, 1)[0];
    randomItems.push(selectedItem);
  }

  return randomItems;
}
