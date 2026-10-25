const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../src/runtime/pageEntryAnimations.ts'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
class Node {}
const exportsObject = {};
vm.runInNewContext(code, { exports: exportsObject, Node });
const { installPageEntryAnimations, getPageEntrySelector } = exportsObject;

function harness(reduced = false) {
  let intersection, mutation;
  let nextFrame = 0;
  const frames = new Map();
  const media = { matches: reduced, addEventListener: (_, callback) => { media.change = callback; }, removeEventListener: () => { media.change = null; } };
  const view = {
    innerWidth: 1200, innerHeight: 800,
    matchMedia: () => media,
    getComputedStyle: element => ({ opacity: element.opacity ?? '1' }),
    requestAnimationFrame: callback => { const id = ++nextFrame; frames.set(id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    IntersectionObserver: class {
      observed = new Set();
      constructor(callback) { this.callback = callback; intersection = this; }
      observe(element) { this.observed.add(element); }
      unobserve(element) { this.observed.delete(element); }
      disconnect() { this.disconnected = true; this.observed.clear(); }
    },
    MutationObserver: class {
      constructor(callback) { this.callback = callback; mutation = this; }
      observe() {}
      disconnect() { this.disconnected = true; }
    },
  };
  class Element extends Node {
    dataset = {};
    animations = [];
    listeners = new Map();
    attached = true;
    top = 0;
    width = 100;
    height = 100;
    selected = true;
    constructor(parent) { super(); this.parentElement = parent; }
    closest(selector) {
      if (selector.includes('[data-entry-skip]')) return this.skip ? this : null;
      return this.selected ? this : this.parentElement?.closest(selector) ?? null;
    }
    matches(selector) { return selector.includes('card-stat-gauges') && this.gauge; }
    contains(node) {
      if (!node?.attached) return false;
      for (let current = node; current; current = current.parentElement) if (current === this) return true;
      return false;
    }
    getBoundingClientRect() { return { width: this.width, height: this.height, top: this.top, bottom: this.top + this.height, left: 0, right: this.width }; }
    addEventListener(name, callback) { this.listeners.set(name, callback); }
    removeEventListener(name) { this.listeners.delete(name); }
    animate(keyframes, options) {
      const animation = {
        keyframes, options, playState: 'running',
        pause() { this.playState = 'paused'; },
        play() { this.playState = 'running'; },
        finish() { this.playState = 'finished'; this.finished = true; this.onfinish?.(); },
        cancel() { this.playState = 'idle'; this.cancelled = true; this.oncancel?.(); },
      };
      this.animations.push(animation);
      return animation;
    }
  }
  const root = new Element(null);
  root.selected = false;
  root.ownerDocument = { defaultView: view, activeElement: null };
  root.candidates = [];
  root.querySelectorAll = () => root.candidates;
  return {
    root, media, frames,
    element: (options = {}, parent = root) => {
      const element = Object.assign(new Element(parent), options);
      root.candidates.push(element);
      return element;
    },
    flushMutations: () => {
      mutation.callback();
      for (const [id, callback] of frames) { frames.delete(id); callback(); }
    },
    intersect: (...elements) => intersection.callback(elements.map(target => ({ target, isIntersecting: true }))),
    observers: () => ({ intersection, mutation }),
  };
}

test('visible entries stagger once; reorders and text updates do not restart existing cards', () => {
  const app = harness();
  const nodes = Array.from({ length: 12 }, () => app.element());
  const cleanup = installPageEntryAnimations(app.root, '/characters');
  assert.equal(nodes[0].animations[0].options.delay, 0);
  assert.ok(nodes[1].animations[0].options.delay > 0);
  assert.ok(nodes.at(-1).animations[0].options.delay <= 210, 'large lists cannot accumulate long delays');
  assert.equal(nodes[0].animations[0].keyframes[0].transform, undefined, 'hover scale is preserved');
  app.root.candidates.reverse();
  app.flushMutations();
  assert.ok(nodes.every(node => node.animations.length === 1));
  nodes[0].animations[0].finish();
  assert.equal(nodes[0].dataset.pageEntry, 'done');
  cleanup();
  assert.ok(nodes.every(node => node.dataset.pageEntry === undefined));
});

test('scrolling and asynchronous fetches reveal newly visible content without nested double effects', () => {
  const app = harness();
  const below = app.element({ top: 1200 });
  const parent = app.element();
  const child = app.element({}, parent);
  const skipped = app.element({ skip: true });
  const cleanup = installPageEntryAnimations(app.root, '/board');
  assert.equal(below.animations.length, 0);
  assert.equal(below.dataset.pageEntry, 'waiting');
  assert.equal(child.animations.length, 0);
  assert.equal(skipped.animations.length, 0);
  below.top = 600;
  app.intersect(below);
  assert.equal(below.animations.length, 1);
  app.intersect(below);
  assert.equal(below.animations.length, 1);
  const fetched = app.element();
  app.flushMutations();
  assert.equal(fetched.animations.length, 1);
  cleanup();
});

test('reduced motion and changes to that preference keep all content readable immediately', () => {
  const app = harness(true);
  const visible = app.element();
  const cleanup = installPageEntryAnimations(app.root, '/profile');
  assert.equal(visible.animations.length, 0);
  assert.equal(visible.dataset.pageEntry, 'done');
  app.media.matches = false;
  const next = app.element();
  app.flushMutations();
  assert.equal(next.animations.length, 1);
  app.media.matches = true;
  app.media.change();
  assert.equal(next.animations[0].finished, true);
  cleanup();
});

test('interaction finishes motion immediately and fixed-position stat tooltips retain their coordinates', () => {
  const app = harness();
  const panel = app.element({ gauge: true });
  const input = app.element({}, panel);
  const cleanup = installPageEntryAnimations(app.root, '/card/aemeath');
  assert.equal(panel.animations[0].keyframes[0].translate, undefined);
  app.root.listeners.get('focusin')({ target: input });
  assert.equal(panel.animations[0].finished, true);
  cleanup();
});

test('route cleanup cancels observers, queued work and effects; removed nodes are released', () => {
  const app = harness();
  const visible = app.element();
  const below = app.element({ top: 1200 });
  const cleanup = installPageEntryAnimations(app.root, '/');
  visible.attached = false;
  app.root.candidates = [below];
  app.flushMutations();
  assert.equal(visible.animations[0].cancelled, true);
  assert.equal(visible.dataset.pageEntry, undefined);
  app.observers().mutation.callback();
  assert.equal(app.frames.size, 1);
  cleanup();
  assert.equal(app.frames.size, 0);
  assert.equal(app.observers().intersection.disconnected, true);
  assert.equal(app.observers().mutation.disconnected, true);
  assert.equal(app.root.listeners.size, 0);
  assert.equal(below.dataset.pageEntry, undefined);
});

test('all public pages and developer tools have scoped entry units', () => {
  for (const [route, selector] of [
    ['/', '.summary-item'], ['/characters', '.character-slot'], ['/card/aemeath', '.card-contents'],
    ['/profile', '.profile-panel'], ['/board/123', '.board-detail-panel'], ['/board/write', '.board-editor-field'],
    ['/dev/ocr', '.crop-source'], ['/dev/analystic', '.dev-analytics-panel'],
  ]) assert.ok(getPageEntrySelector(route).includes(selector), route);
});

test('calculator topics enter individually, with headings and content synchronized', () => {
  const app = harness();
  const units = Array.from({ length: 9 }, () => app.element());
  units[2].dataset.entryGroup = 'party';
  units[3].dataset.entryGroup = 'party';
  const cleanup = installPageEntryAnimations(app.root, '/card/aemeath');
  const animation = index => units[index].animations[0];
  assert.equal(animation(0).options.delay, 0);
  assert.equal(animation(1).options.delay, 40);
  assert.equal(animation(2).options.delay, 80);
  assert.equal(animation(3).options.delay, 80, 'topic heading and content start together');
  assert.equal(animation(4).options.delay, 120);
  assert.equal(animation(0).options.duration, 420);
  assert.ok(animation(1).options.delay < animation(0).options.duration, 'the next topic starts before the previous one finishes');
  const selector = getPageEntrySelector('/card');
  assert.ok(selector.includes('.main-item-slot.weapon'));
  assert.ok(selector.includes('.card-detail-body .option-area'));
  assert.equal(selector.split(', ').includes('.card-contents'), false, 'the whole preview must not suppress individual topics');
  assert.equal(selector.includes('.card-detail-guide-target'), false, 'recommendation headings animate as separate topics');
  cleanup();
});

test('calculator sections found by later scrolls start a fresh stagger without waiting for earlier animations', () => {
  const app = harness();
  const first = app.element();
  const below = app.element({ top: 1200 });
  const cleanup = installPageEntryAnimations(app.root, '/card');
  below.top = 600;
  app.intersect(below);
  assert.equal(below.animations[0].playState, 'running');
  assert.equal(below.animations[0].options.delay, 0);
  assert.equal(first.animations[0].finished, undefined);
  const asyncSection = app.element();
  app.flushMutations();
  assert.equal(asyncSection.animations[0].playState, 'running');
  assert.equal(asyncSection.animations[0].options.delay, 0);
  cleanup();
});
