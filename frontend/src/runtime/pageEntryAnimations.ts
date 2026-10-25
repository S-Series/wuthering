const pageEntries = {
  home: [".banner-slot", ".summary-item", ".display-slot > h2", ".display-list-slot > .character-slot"],
  characters: [".characters-toolbar", ".characters-list > .character-slot", ".characters-empty"],
  card: [
    ".card-management-bar", ".card-contents-slot.header",
    ".main-item-slot.character", ".main-item-slot.weapon", ".main-item-slot.stats",
    ".main-item-slot.namecard", ".main-item-slot.echos", ".card-contents-slot.footer",
    ".card-stat-gauges", ".build-target-panel", ".card-detail-body > .title-area",
    ".card-detail-body .detail-area > [data-entry-group]",
    ".card-detail-body .weapon-area", ".card-detail-body .echo-area", ".card-detail-body .option-area",
  ],
  profile: [
    ".profile-login-hero", ".profile-info", ".profile-panel", ".profile-info-list-bottom",
    ".profile-info-field > .main-stand-image", ".profile-info-field .user-info",
    ".profile-info-field .game-info > h2", ".profile-display-list > .character-slot",
  ],
  board: [
    ".board-hero", ".board-toolbar", ".board-list-header", ".board-post-row", ".board-state", ".board-pagination",
    ".board-crud-header", ".board-editor-field", ".board-editor-actions", ".board-crud-state",
    ".board-detail-topbar", ".board-detail-panel", ".board-comments-section > header",
    ".board-comment-form", ".board-comment-login", ".board-comment-state", ".board-comment-item",
  ],
  dev: [
    ".dev-heading", ".dev-nav", ".dev-links > a", ".dev-analytics-toolbar", ".dev-analytics-state",
    ".dev-analytics-cards > article", ".dev-analytics-panel", ".dev-analytics-note",
    ".ocr-crop-test > header", ".crop-toolbar", ".crop-status", ".crop-error", ".crop-source", ".crop-bands > *", ".crop-atlas",
  ],
};

export function getPageEntrySelector(pathname: string): string {
  const page = pathname === "/" ? pageEntries.home
    : pathname.startsWith("/characters") ? pageEntries.characters
    : pathname.startsWith("/card") ? pageEntries.card
    : pathname.startsWith("/profile") ? pageEntries.profile
    : pathname.startsWith("/board") ? pageEntries.board
    : pathname.startsWith("/dev") ? pageEntries.dev
    : ["#main-container > *"];
  return [...page, "[data-entry]"].join(", ");
}

/** One entry per DOM node and page visit, including asynchronously loaded content.
 * Nothing is hidden while waiting for an observer. Finished/cancelled effects leave
 * no inline styles, and individual translate preserves existing hover transforms.
 */
export function installPageEntryAnimations(root: HTMLElement, pathname: string): () => void {
  const view = root.ownerDocument.defaultView;
  if (!view || !view.IntersectionObserver || !view.MutationObserver || typeof root.animate !== "function") return () => {};

  const selector = getPageEntrySelector(pathname);
  const isCard = pathname === "/card" || pathname.startsWith("/card/");
  const motion = view.matchMedia("(prefers-reduced-motion: reduce)");
  const tracked = new Set<HTMLElement>();
  const entered = new WeakSet<HTMLElement>();
  const active = new Map<HTMLElement, Animation>();
  let frame = 0;
  let disposed = false;

  const isVisible = (element: HTMLElement) => {
    const box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < view.innerHeight && box.right > 0 && box.left < view.innerWidth;
  };

  const enter = (elements: HTMLElement[]) => {
    let order = 0;
    const groups = new Map<string, number>();
    for (const element of elements) {
      if (entered.has(element) || !root.contains(element) || !isVisible(element)) continue;
      entered.add(element);
      intersection.unobserve(element);
      element.dataset.pageEntry = "done";
      if (motion.matches || element.contains(root.ownerDocument.activeElement)) continue;

      const opacity = view.getComputedStyle(element).opacity;
      // A transform on the gauge would change its fixed-position source popup's containing block.
      const fadeOnly = element.matches(".card-stat-gauges, [data-entry-motion='fade']");
      // Titles and their content share one topic.
      const group = element.dataset.entryGroup;
      const entryOrder = group ? groups.get(group) ?? order++ : order++;
      if (group) groups.set(group, entryOrder);
      const animation = element.animate(fadeOnly
        ? [{ opacity: 0 }, { opacity }]
        : [{ opacity: 0, translate: "0 14px" }, { opacity, translate: "0 0" }], {
        duration: 420,
        delay: isCard ? entryOrder * 40 : Math.min(entryOrder * 35, 210),
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards",
      });
      animation.id = "page-entry";
      element.dataset.pageEntry = "running";
      active.set(element, animation);
      const complete = () => {
        active.delete(element);
        if (tracked.has(element)) element.dataset.pageEntry = "done";
      };
      animation.onfinish = complete;
      animation.oncancel = complete;
    }
  };

  const intersection = new view.IntersectionObserver(entries => {
    enter(entries.filter(entry => entry.isIntersecting).map(entry => entry.target as HTMLElement));
  }, { threshold: 0.01 });

  const scan = () => {
    frame = 0;
    if (disposed) return;
    for (const element of tracked) {
      if (root.contains(element)) continue;
      intersection.unobserve(element);
      active.get(element)?.cancel();
      active.delete(element);
      tracked.delete(element);
      delete element.dataset.pageEntry;
    }
    const visible: HTMLElement[] = [];
    for (const element of root.querySelectorAll<HTMLElement>(selector)) {
      if (tracked.has(element) || entered.has(element) || element.closest("[data-entry-skip], [role='dialog'], [role='tooltip']")) continue;
      // Do not animate nested units twice; e.g. an OCR result inside its source panel.
      const ancestor = element.parentElement?.closest(selector);
      if (ancestor && root.contains(ancestor)) continue;
      tracked.add(element);
      element.dataset.pageEntry = "waiting";
      if (isVisible(element)) visible.push(element);
      else intersection.observe(element);
    }
    enter(visible);
  };

  const mutations = new view.MutationObserver(() => {
    if (!frame && !disposed) frame = view.requestAnimationFrame(scan);
  });
  mutations.observe(root, { childList: true, subtree: true });
  const finishInteraction = (event: Event) => {
    if (!(event.target instanceof Node)) return;
    for (const [element, animation] of active) {
      if (element.contains(event.target)) animation.finish();
    }
  };
  const updateMotion = () => {
    if (motion.matches) for (const animation of active.values()) animation.finish();
  };
  root.addEventListener("focusin", finishInteraction, true);
  root.addEventListener("pointerdown", finishInteraction, true);
  motion.addEventListener("change", updateMotion);
  scan();

  return () => {
    disposed = true;
    if (frame) view.cancelAnimationFrame(frame);
    intersection.disconnect();
    mutations.disconnect();
    root.removeEventListener("focusin", finishInteraction, true);
    root.removeEventListener("pointerdown", finishInteraction, true);
    motion.removeEventListener("change", updateMotion);
    for (const animation of active.values()) animation.cancel();
    active.clear();
    for (const element of tracked) delete element.dataset.pageEntry;
    tracked.clear();
  };
}
