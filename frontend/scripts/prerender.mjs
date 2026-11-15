import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = resolve(root, "dist");
// Vite transforms the same public React components used by the client. No browser,
// login, OCR service, environment secrets or user storage is read to produce HTML.
const server = await createServer({ root, server: { middlewareMode: true }, appType: "custom" });
try {
  const { renderPage, publicPaths, characterIds } = await server.ssrLoadModule("/src/seo/prerender.tsx");
  const template = await readFile(resolve(dist, "index.html"), "utf8");
  const config = JSON.parse(await readFile(resolve(root, "vercel.json"), "utf8"));
  const cardRoute = config.routes.find(route => route.dest === "/card.html" && route.src.startsWith("/card/("));
  if (!cardRoute || characterIds.some(id => !new RegExp(`^${cardRoute.src}$`).test(`/card/${id}`))) {
    throw new Error("vercel.json의 /card 캐릭터 경로 목록을 현재 character 데이터와 맞춰 주세요.");
  }
  const base = template
    .replace(/<title>[\s\S]*?<\/title>/g, "")
    .replace(/<meta\s+(?:name="(?:description|robots|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g, "")
    .replace(/<link\s+rel="canonical"[^>]*>/g, "");
  for (const path of [...publicPaths, "/app", "/private", "/404"]) {
    const { head, body } = renderPage(path);
    const destination = resolve(dist, path === "/" ? "index.html" : `${path.slice(1)}.html`);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, base.replace("</head>", `${head}\n</head>`).replace('<div id="root"></div>', () => `<div id="root">${body}</div>`));
  }
  console.log(`Pre-rendered ${publicPaths.length} public pages, application shells and 404 page.`);
} finally {
  await server.close();
}
