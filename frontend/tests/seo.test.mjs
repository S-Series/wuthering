import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer, loadEnv } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = path => readFileSync(resolve(root, path), "utf8");
const config = JSON.parse(read("vercel.json"));
const server = await createServer({ root, server: { middlewareMode: true }, appType: "custom" });
const { getPageMetadata, publicPages } = await server.ssrLoadModule("/src/seo/pages.ts");
const { characterIds } = await server.ssrLoadModule("/src/seo/prerender.tsx");
const { imageAsset } = await server.ssrLoadModule("/src/utils/imageAsset.ts");
await server.close();

// Check the ordered hosting rules against the actual build output, including the
// filesystem boundary. This is a local configuration check, not a Vercel deploy.
function route(path) {
  for (const rule of config.routes) {
    if (rule.handle === "filesystem") {
      if (existsSync(resolve(root, `dist${path}`)) && /\.[^/]+$/.test(path)) return { status: 200, dest: path };
      continue;
    }
    const match = new RegExp(`^${rule.src}$`).exec(path);
    if (match) return { status: rule.status ?? 200, dest: rule.dest, location: rule.headers?.Location?.replace(/\$(\d+)/g, (_, index) => match[Number(index)]) };
  }
  throw new Error(`No rule for ${path}`);
}

test("Lily and Lullaby use the same CDN as existing characters and weapons", () => {
  const names = ["ico.webp", "stand.png", "art.png", ...Array.from({ length: 6 }, (_, i) => `C${i + 1}.png`)];
  const base = loadEnv(server.config.mode, server.config.envDir).VITE_IMAGE_BASE;
  for (const path of [...names.map(name => `character/lily/${name}`), "weapon/pistol/ico009.png"]) {
    assert.equal(imageAsset(path, "?v=1"), `${base}/${path}?v=1`);
    assert.equal(route(`/${path}`).status, 404);
  }
});

test("public HTML contains distinct metadata and readable content before JavaScript", () => {
  const titles = new Set();
  for (const [path, page] of Object.entries(publicPages)) {
    const html = read(path === "/" ? "dist/index.html" : `dist${path}.html`);
    assert.equal((html.match(/<title>/g) ?? []).length, 1, path);
    assert.ok(html.includes(`<title>${page.title}</title>`), path);
    assert.ok(html.includes(`rel="canonical" href="https://wuwa.dev${path}"`), path);
    assert.ok(html.includes(`property="og:url" content="https://wuwa.dev${path}"`), path);
    assert.match(html, /<meta name="robots" content="index, follow"/);
    assert.equal((html.match(/name="description"/g) ?? []).length, 1);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, path);
    assert.match(html, /<a[^>]+href="\/card"/);
    assert.match(html, /<script[^>]+type="module"[^>]+src="\/assets\//);
    assert.equal(titles.has(page.title), false);
    titles.add(page.title);
    assert.equal(route(path).status, 200);
    assert.ok(existsSync(resolve(root, `dist${route(path).dest}`)));
  }
  assert.match(read("dist/guide.html"), /OCR이 실패하거나 수치가 다를 때/);
  assert.match(read("dist/guide/scoring.html"), /52\.5 ÷ 30/);
});

test("sitemap contains exactly the intended static public pages", () => {
  const paths = [...read("public/sitemap.xml").matchAll(/<loc>https:\/\/wuwa\.dev([^<]*)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(paths.sort(), Object.keys(publicPages).sort());
  assert.match(read("public/robots.txt"), /Sitemap: https:\/\/wuwa\.dev\/sitemap.xml/);
});

test("known editor URLs work; missing routes and unknown characters are 404", () => {
  for (const id of characterIds) {
    assert.deepEqual(route(`/card/${id}`), { status: 200, dest: "/card.html", location: undefined });
    assert.equal(getPageMetadata(`/card/${id}`).canonical, "/card");
  }
  for (const path of ["/not-a-page", "/guide/missing", "/card/not_a_character", "/dev/missing", "/characters/missing"]) {
    assert.equal(route(path).status, 404, path);
    assert.equal(getPageMetadata(path).noindex, true, path);
  }
  assert.equal(getPageMetadata("/card/not_a_character").noindex, true);
  assert.match(read("dist/404.html"), /name="robots" content="noindex, follow"/);
});

test("app routes, assets, private tools and canonical URL redirects are preserved", () => {
  for (const path of ["/characters", "/board", "/board/post-123"]) {
    assert.equal(route(path).dest, "/app.html", path);
    assert.equal(getPageMetadata(path).noindex, false);
  }
  for (const path of ["/profile", "/board/write", "/board/post-123/edit", "/dev", "/dev/ocr", "/dev/analystic", "/dev/test", "/test", "/debug"]) {
    assert.equal(route(path).dest, "/private.html", path);
    assert.equal(getPageMetadata(path).noindex, true);
  }
  assert.match(read("dist/private.html"), /name="robots" content="noindex, follow"/);
  assert.match(read("dist/app.html"), /name="robots" content="index, follow"/);
  for (const path of ["/robots.txt", "/sitemap.xml", "/preview.jpg", "/favicon.png"]) assert.equal(route(path).status, 200);
  for (const path of Object.keys(publicPages)) {
    if (path !== "/") {
      const redirect = route(`${path}.html`);
      assert.equal(redirect.status, 308);
      assert.equal(redirect.location, path);
      assert.equal(route(`${path}/`).dest, route(path).dest);
    }
  }
  // Built JS/CSS paths are real files; unknown assets must not serve the SPA.
  for (const asset of read("dist/index.html").matchAll(/(?:src|href)="(\/assets\/[^"?]+)"/g)) {
    assert.equal(route(asset[1]).status, 200);
    assert.ok(existsSync(resolve(root, `dist${asset[1]}`)));
  }
  assert.equal(route("/assets/missing.js").status, 404);
  assert.equal(getPageMetadata("/guide/").canonical, "/guide");
});
