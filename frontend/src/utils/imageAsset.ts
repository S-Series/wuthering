const imageBase = import.meta.env.VITE_IMAGE_BASE;

export function imageAsset(path: string, query = ""): string {
  return `${imageBase}/${path}${query}`;
}
