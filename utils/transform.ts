export function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getGenerationOffset(index: number, generationCount: number): number {
  const startOffset = -450 * (generationCount - 2);
  if (index === 0) return startOffset;

  return startOffset + 300 * index;
}
