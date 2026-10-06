const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function loadApi(name, globals = {}, dependencies = {}) {
  const filename = path.join(__dirname, "../src/api", name + ".ts");
  const source = fs.readFileSync(filename, "utf8").replaceAll("import.meta.env", "({ BASE_URL: '/' })");
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
test("a single recognized stat survives a failed or unrecognized peer", () => {
  assert.equal(check(region("sub_1", "", false), region("sub_1", "ATK")).selectedStatId, "atk");
  assert.equal(check(region("sub_1", "HP"), region("sub_1", "unknown")).selectedSource, "backend");
});
test("conflicting stat types select the higher model confidence on a common scale", () => {
  const server = { ...region("sub_1", "ATK 9.4%"), tokens: [{ text: "ATK", confidence: 0.81 }, { text: "9.4%", confidence: 0.99 }] };
  const client = { ...region("sub_1", "DEF"), confidence: 90 };
  assert.equal(check(server, client).selectedStatId, "def");
  assert.equal(check(server, { ...client, confidence: 70 }).selectedStatId, "atk");
  assert.equal(check(server, { ...client, confidence: 81 }).selectedStatId, null);
  assert.equal(check(region("sub_1", "ATK"), client).selectedStatId, null);
});
test("raw PaddleOCR participates in arbitration and survives processed failure", () => {
  const raw = { ...region("sub_1", "DEF"), tokens: [{ text: "DEF", confidence: 0.95 }] };
  const server = { ...region("sub_1", "ATK"), tokens: [{ text: "ATK", confidence: 0.8 }], raw };
  const client = { ...region("sub_1", "HP"), confidence: 90 };
  const result = check(server, client);
  assert.equal(result.selectedStatId, "def");
  assert.equal(result.selectedSource, "backend_raw");
  assert.equal(check({ ...region("sub_1", "", false), raw }, region("sub_1", "", false)).selectedStatId, "def");
});
test("three-way conflicts with tied top confidence remain unresolved", () => {
  const server = { ...region("sub_1", "ATK"), tokens: [{ text: "ATK", confidence: 0.8 }],
    raw: { ...region("sub_1", "DEF"), tokens: [{ text: "DEF", confidence: 0.9 }] } };
  assert.equal(check(server, { ...region("sub_1", "HP"), confidence: 90 }).selectedStatId, null);
});
test("four-source majority beats a higher-confidence minority", () => {
  const server = { ...region("sub_1", "ATK"), tokens: [{ text: "ATK", confidence: 0.7 }],
    raw: { ...region("sub_1", "ATK"), tokens: [{ text: "ATK", confidence: 0.65 }] } };
  const result = crosscheckOcrRegions([server], [{ ...region("sub_1", "ATK"), confidence: 60 }],
    { rows: [{ index: 2, match: { id: "def", score: 0.99 } }], harmony: null }).find(item => item.id === "sub_1");
  assert.equal(result.selectedStatId, "atk");
  assert.equal(result.votes, 3);
});
test("two-to-two ties use the strongest confidence, not a confidence sum", () => {
  const server = { ...region("sub_1", "ATK"), tokens: [{ text: "ATK", confidence: 0.8 }],
    raw: { ...region("sub_1", "ATK"), tokens: [{ text: "ATK", confidence: 0.8 }] } };
  const result = crosscheckOcrRegions([server], [{ ...region("sub_1", "DEF"), confidence: 70 }],
    { rows: [{ index: 2, match: { id: "def", score: 0.95 } }], harmony: null }).find(item => item.id === "sub_1");
  assert.equal(result.selectedStatId, "def");
  assert.equal(result.votes, 2);
  assert.equal(result.selectedConfidence, 0.95);
});
test("an image-only result is retained and invalid image IDs are excluded", () => {
  const run = id => crosscheckOcrRegions([], [], { rows: [{ index: 2, match: { id, score: 0.9 } }], harmony: null })[4];
  assert.equal(run("atkPct").selectedStatId, "atk");
  assert.equal(run("dummy").selectedStatId, null);
  assert.equal(run("unknown").selectedStatId, null);
});

const actualMatch = loadApi("ocr.match", {}, {
  "@techstark/opencv-js/dist/opencv.js?url": { default: "/opencv.js" },
  "@/datas/harmonies": { harmony: {} },
});
const resolverDeps = {
  "./ocr.match": actualMatch,
  "@/datas/echos": { ECHO_CANDIDATES: { en: [{ echoId: "testEcho", text: "Test Echo" }] }, echoDict: { Cost1: {}, Cost3: { testEcho: { type: [] } }, Cost4: {} } },
  "@/datas/harmonies": { harmony: {} },
};
const { resolveBatchOcr } = loadApi("ocr.batch.resolve", {}, resolverDeps);
test("production resolver uses browser headers and keeps image-only stat kinds", () => {
  const result = resolveBatchOcr([], { rows: [{ index: 2, match: { id: "critDmg", score: 0.9 } }], harmony: null }, "en",
    [region("name", "Test Echo"), region("cost", "COST 3")]);
  assert.equal(result.echoId, "testEcho");
  assert.equal(result.cost, 3);
  assert.equal(result.echoStats[2][0], "critDmg");
  assert.equal(result.echoStats[2][1], 0);
});
test("production resolver uses majority stat kinds and validates numeric values separately", () => {
  const server = { ...region("sub_1", "ATK 9.4%"), raw: region("sub_1", "ATK 9.4%") };
  const result = resolveBatchOcr([server], { rows: [{ index: 2, match: { id: "def", score: 0.99 } }], harmony: null }, "en",
    [region("sub_1", "ATK 94%")]);
  assert.equal(result.echoStats[2][0], "atkPct");
  assert.equal(result.echoStats[2][1], 9.4);
});
test("production pipeline requests raw comparison and retains browser/vision after backend failure", async () => {
  let rawRequested = false, received;
  const { recognizeEchoImage } = loadApi("../components/features/Card/Echo/Ocr/echoOcr.helpers", {}, {
    "@/api/ocr.preprocess": { prepareOcrImage: async () => ({ file: {}, metadata: {} }) },
    "@/api/ocr.batch": { requestOcrBatch: async (_file, _meta, _lang, _signal, options) => { rawRequested = options.compareRaw; throw new Error("offline"); } },
    "@/api/ocr.browser": { recognizeBrowserOcr: async () => [region("sub_1", "ATK")] },
    "@/api/ocr.match": { matchOcrImages: async () => ({ rows: [{ index: 2, match: { id: "atk", score: 0.9 } }], harmony: null }) },
    "@/api/ocr.batch.resolve": { resolveBatchOcr: (server, images, lang, browser) => {
      received = { server, images, lang, browser };
      return { echoId: null, echoStats: [["atk", 0]] };
    } },
  });
  await recognizeEchoImage({}, "en", new AbortController().signal);
  assert.equal(rawRequested, true);
  assert.equal(received.server.length, 0);
  assert.equal(received.browser.length, 1);
  assert.equal(received.images.rows.length, 1);
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
