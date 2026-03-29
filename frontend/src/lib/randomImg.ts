const gifModules = import.meta.glob("/src/assets/gifs/*.gif", {
  eager: true,
  query: "?url",
  import: "default",
});

const gifList = Object.values(gifModules) as string[];

export function getRandomGif(): string | null {
  if (gifList.length === 0) return null;
  return gifList[Math.floor(Math.random() * gifList.length)];
}

export function getAllGifs(): string[] {
  return gifList;
}