const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function loadApi(name, globals = {}, dependencies = {}) {
  const filename = path.join(__dirname, "../src/api", name + ".ts");
  const source = fs.readFileSync(filename, "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports, console, Blob, AbortController, DOMException, URL, clearTimeout,
    window: { setTimeout, clearTimeout }, location: { href: "http://localhost/" },
    require: id => {
      if (id in dependencies) return dependencies[id];
      if (id.startsWith("./")) return loadApi(id.slice(2), globals, dependencies);
      if (id === "fast-fuzzy") return require(id);
      if (id === "@/datas/stats") {
        const statsCode = ts.transpileModule(fs.readFileSync(path.join(__dirname, "../src/datas/stats.ts"), "utf8"), {
          compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
        }).outputText;
        const statsExports = {};
        vm.runInNewContext(statsCode, { exports: statsExports });
        return statsExports;
      }
      throw new Error("Unexpected dependency: " + id);
    },
    ...globals,
  }, { filename });
  return exports;
}
const { crosscheckOcrRegions } = loadApi("ocr.crosscheck");
const region = (id, text, success = true) => ({ id, success, texts: [text] });
const check = (server, client) => crosscheckOcrRegions([server], [client]).find(item => item.id === server.id);

test("spacing, full-width digits, and decimal commas do not cause false conflicts", () => {
  const result = check(region("sub_1", "크리티컬 피해 13.8%"), region("sub_1", "크리티컬피해 １３,８ %"));
  assert.equal(result.status, "agree");
});
test("numeric and percent differences are diagnostic and do not reject a matching stat kind", () => {
  for (const text of ["크리티컬 피해 13.8", "크리티컬 피해 138%", "크리티컬 피해 12.6%"]) {
    const result = check(region("sub_1", "크리티컬 피해 13.8%"), region("sub_1", text));
    assert.equal(result.status, "agree");
    assert.equal(result.textAgreement, true);
    assert.equal(result.valueAgreement, false);
  }
});
test("stat kinds are recognized without numbers and through label aliases", () => {
  const result = check(region("sub_1", "Critical Damage 13.8%"), region("sub_1", "Crit. DMG"));
  assert.equal(result.status, "agree");
  assert.equal(result.browserStatId, "critDmg");
  assert.equal(result.valueAgreement, null);
  assert.equal(check(region("sub_1", "공명 효율 10%"), region("sub_1", "Energy Regen")).status, "agree");
  assert.equal(check(region("sub_1", "Skill DMG Bonus 10.1%"), region("sub_1", "Resonance Skill DMG Bonus")).browserStatId, "skillBns");
  assert.equal(check(region("sub_1", "크리티컬 피해 13.8%"), region("sub_1", "크리티컬 피혜")).status, "agree");
});
test("unknown labels are not confirmed even if their text and numbers are identical", () => {
  assert.equal(check(region("sub_1", "unknown 10%"), region("sub_1", "unknown 10%")).status, "partial");
});
test("matching numbers with conflicting labels are not confirmed", () => {
  const result = check(region("sub_1", "공격력 9.4%"), region("sub_1", "방어력 9.4%"));
  assert.equal(result.status, "conflict");
  assert.equal(result.valueAgreement, true);
});
test("empty or failed results never confirm each other", () => {
  assert.equal(check(region("sub_1", ""), region("sub_1", "")).status, "missing");
  assert.equal(check(region("sub_1", "공격력 9.4%"), region("sub_1", "", false)).status, "partial");
  assert.equal(check(region("sub_1", "9.4%"), region("sub_1", "9.4%")).status, "partial");
});
test("COST uses valid cost values and regions are matched by id, not position", () => {
  assert.equal(check(region("cost", "COST 3"), region("cost", "３")).status, "agree");
  assert.equal(check(region("cost", "COST 3"), region("cost", "COST 4")).status, "conflict");
  assert.equal(check(region("cost", "COST 2"), region("cost", "COST 2")).status, "partial");
  const result = crosscheckOcrRegions([region("cost", "COST 3"), region("sub_1", "HP 320")], [region("sub_1", "HP 320"), region("cost", "3")]);
  assert.equal(result.find(item => item.id === "sub_1").status, "agree");
});

const metadata = { width: 232, bands: Array.from({ length: 9 }, (_, i) => ({ index: i - 2, top: i * 30, bottom: (i + 1) * 30 })) };
function imageGlobals(crops = [], closed = []) {
  return {
    createImageBitmap: async () => ({ close() { closed.push(true); } }),
    OffscreenCanvas: class {
      getContext() { return { fillRect() {}, drawImage(...args) { crops.push(args.slice(1, 5)); } }; }
      async convertToBlob() { return new Blob(["image"]); }
    },
  };
}
test("shared OCR regions retain the full row width and release the bitmap", async () => {
  const crops = [], closed = [];
  const { createOcrRegionImages } = loadApi("ocr.regions", imageGlobals(crops, closed));
  const images = await createOcrRegionImages({}, metadata, new AbortController().signal);
  assert.equal(images.length, 9);
  assert.ok(crops.every(crop => crop[0] === 16 && crop[2] === 200));
  assert.equal(closed.length, 1);
});
test("browser OCR uses a different engine, runs nine full rows, and terminates it", async () => {
  let recognized = 0, terminated = 0, selectedLanguage = "";
  const worker = {
    setParameters: async () => {},
    recognize: async () => { recognized++; return { data: { text: "HP 320\n", confidence: 91 } }; },
    terminate: async () => { terminated++; },
  };
  const { recognizeBrowserOcr } = loadApi("ocr.browser", imageGlobals(), {
    "tesseract.js/dist/worker.min.js?url": { default: "/worker.js" },
    "tesseract.js": { createWorker: async lang => { selectedLanguage = lang; return worker; }, OEM: { LSTM_ONLY: 1 }, PSM: { SINGLE_LINE: "7" } },
  });
  const emitted = [];
  const results = await recognizeBrowserOcr({}, metadata, "kr", new AbortController().signal, { onRegion: item => emitted.push(item) });
  assert.equal(selectedLanguage, "kor+eng");
  assert.equal(recognized, 9);
  assert.equal(emitted.length, 9);
  assert.equal(results[0].confidence, 91);
  assert.equal(terminated, 1);
});
test("cancellation interrupts browser recognition and terminates the worker", async () => {
  const controller = new AbortController();
  let terminated = 0;
  const worker = {
    setParameters: async () => {},
    recognize: () => { controller.abort(); return new Promise(() => {}); },
    terminate: async () => { terminated++; },
  };
  const { recognizeBrowserOcr } = loadApi("ocr.browser", imageGlobals(), {
    "tesseract.js/dist/worker.min.js?url": { default: "/worker.js" },
    "tesseract.js": { createWorker: async () => worker, OEM: { LSTM_ONLY: 1 }, PSM: { SINGLE_LINE: "7" } },
  });
  await assert.rejects(recognizeBrowserOcr({}, metadata, "en", controller.signal));
  assert.equal(terminated, 1);
});

test("a failed browser row does not discard the remaining results", async () => {
  let index = 0;
  const worker = {
    setParameters: async () => {},
    recognize: async () => {
      if (index++ === 3) throw new Error("Unreadable row");
      return { data: { text: "ATK 150", confidence: 90 } };
    },
    terminate: async () => {},
  };
  const { recognizeBrowserOcr } = loadApi("ocr.browser", imageGlobals(), {
    "tesseract.js/dist/worker.min.js?url": { default: "/worker.js" },
    "tesseract.js": { createWorker: async () => worker, OEM: { LSTM_ONLY: 1 }, PSM: { SINGLE_LINE: "7" } },
  });
  const results = await recognizeBrowserOcr({}, metadata, "en", new AbortController().signal);
  assert.equal(results.length, 9);
  assert.equal(results[3].success, false);
  assert.equal(results[4].success, true);
});
test("a worker that initializes after cancellation is disposed", async () => {
  const controller = new AbortController();
  let resolveWorker, terminated = 0;
  const pending = new Promise(resolve => { resolveWorker = resolve; });
  const { recognizeBrowserOcr } = loadApi("ocr.browser", imageGlobals(), {
    "tesseract.js/dist/worker.min.js?url": { default: "/worker.js" },
    "tesseract.js": { createWorker: () => { controller.abort(); return pending; }, OEM: { LSTM_ONLY: 1 }, PSM: { SINGLE_LINE: "7" } },
  });
  await assert.rejects(recognizeBrowserOcr({}, metadata, "en", controller.signal));
  resolveWorker({ terminate: async () => { terminated++; } });
  await Promise.resolve();
  assert.equal(terminated, 1);
});
