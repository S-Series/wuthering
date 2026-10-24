import { locale } from "@/locales/locale";
import { actionTooltip, critScoreTooltipLines, enumTooltip, formatInfoStat, gameTooltip, imageTooltip, tooltipCopy, type TooltipContent, type TooltipContext } from "./tooltipContent";

export type TooltipTarget = { element: HTMLElement; content: TooltipContent };
const ignored = '.site-tooltip, [role="tooltip"], .card-stat-gauge, .card-guide-overlay, [data-tooltip-skip]';
const targets = '[data-info-kind], [data-tooltip], [title], button, a[href], input:not([type="hidden"]), textarea, select, [role="button"], [role="combobox"], img, .lang-select, .image-picker-slot';
const clean = (value: string | null | undefined) => value?.replace(/\s+/g, " ").trim() ?? "";
const usefulAlt = (value: string) => !/^(?:icon|image|title|default|stat icon|echo icon|weapon icon|character image|rank icon|element icon|weapon type icon|attack type icon|stat type icon)$/i.test(value);

function labelFor(element: HTMLElement) {
  const labelledBy = element.getAttribute("aria-labelledby")?.split(/\s+/).map(id => document.getElementById(id)?.textContent ?? "").join(" ");
  const inputLabel = element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement
    ? Array.from(element.labels ?? []).map(label => label.textContent).join(" ") : "";
  // Never read an input's value: account details and typed text do not belong in a tooltip.
  return clean(element.getAttribute("aria-label") || labelledBy || inputLabel || element.getAttribute("placeholder") || element.getAttribute("title") ||
    (element.matches("input, textarea, select") ? "" : element.textContent));
}

function contentFor(element: HTMLElement, context: TooltipContext): TooltipContent | null {
  const { lang } = context;
  const copy = tooltipCopy(lang);
  const kind = element.dataset.infoKind;
  const id = element.dataset.infoId ?? "";
  if (kind === "score") return {
    title: id === "cv" ? "Critical Value · Cv." : "Total Value · Tv.",
    description: id === "cv" ? copy.cv : copy.tv,
    lines: id === "tv" && element.dataset.scoreScope === "build" && context.critRateBudget
      ? critScoreTooltipLines(context.critRateBudget, lang) : undefined,
  };
  if (kind) {
    const info = gameTooltip(kind, id, context);
    if (info) {
      const value = element.dataset.infoValue;
      if (kind === "stat" && value !== undefined && Number.isFinite(Number(value))) {
        info.title += ` · ${formatInfoStat(id, Number(value))}`;
      }
      return info;
    }
  }
  if (element.matches(".image-picker-slot")) return { title: locale(lang).card.image1, description: copy.image };
  if (element.matches(".lang-select")) return { title: "Language · 언어", description: copy.language };
  if (element.matches(".navbar-theme-toggle, .sidebar-theme-toggle-slot")) return { title: "Theme · 테마", description: copy.theme };
  if (element.matches(".sidebar-toggle-btn, .sidebar-close-btn")) return { title: locale(lang).navbar.menu, description: copy.menu };
  if (element.matches(".sidebar-cloud-sync-slot")) return actionTooltip(locale(lang).card.cloudSync, context);
  if (element instanceof HTMLAnchorElement) {
    const path = element.getAttribute("href");
    const nav = locale(lang).navbar;
    const routes: Record<string, TooltipContent> = {
      "/": { title: nav.title, description: copy.home },
      "/characters": { title: nav.characters, description: copy.characters },
      "/card": { title: nav.generator, description: copy.card },
      "/profile": { title: "Profile · 프로필", description: copy.profile },
      "/board": { title: nav.board, description: copy.board },
    };
    if (path && Object.hasOwn(routes, path)) return routes[path];
  }

  const ownTitle = clean(element.getAttribute("title"));
  if (ownTitle) {
    const info = enumTooltip(ownTitle, lang);
    if (info) return info;
  }
  if (element instanceof HTMLImageElement) {
    const info = imageTooltip(element.getAttribute("src") ?? "", context);
    if (info) return info;
    const enumId = element.getAttribute("src")?.match(/\/ico\/(?:element|weapon_type)\/([^/.]+)\./)?.[1];
    if (enumId) {
      const entry = enumTooltip(enumId, lang);
      if (entry) return { title: entry.title };
    }
    const rank = element.getAttribute("src")?.match(/\/ico\/rank\/([^/.]+)\./)?.[1];
    if (rank) return { title: rank, description: copy.rank };
    return ownTitle ? { title: ownTitle } : null;
  }
  const label = clean(element.dataset.tooltip) || labelFor(element) || clean(element.querySelector("img")?.alt);
  if (!label || !usefulAlt(label)) return null;
  const content = actionTooltip(label, context);
  content.description = element.dataset.tooltipDescription || content.description;
  if (element instanceof HTMLSelectElement || element.getAttribute("role") === "combobox" || element.dataset.infoControl === "select") content.description ??= copy.select;
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) content.description ??= copy.input;
  if (/^(?:×|✕|닫기|close)$/i.test(label)) content.description ??= copy.close;
  if (element.matches(":disabled, [aria-disabled='true']")) content.lines = [copy.unavailable];
  return content;
}

/** Walk from the hovered child to its control, so icon-only and nested controls work alike. */
export function resolveTooltipTarget(origin: Element, context: TooltipContext): TooltipTarget | null {
  if (origin.closest(ignored)) return null;
  // An annotated row represents the whole stat/entity, including its icon and number.
  const annotated = origin.closest<HTMLElement>("[data-info-kind]");
  // A small set/stat/rank icon inside a larger entity still has its own meaning.
  if (origin instanceof HTMLImageElement && annotated && !["stat", "skill", "score"].includes(annotated.dataset.infoKind ?? "") && /\/ico\/(?:stats|harmony|rank|element|weapon_type)\//.test(origin.getAttribute("src") ?? "")) {
    const content = contentFor(origin, context);
    if (content) return { element: origin, content };
  }
  const language = origin.closest<HTMLElement>(".lang-select");
  const imagePicker = origin.closest<HTMLElement>(".image-picker-slot");
  for (const element of [annotated, language, imagePicker]) {
    if (!element || element.closest(ignored)) continue;
    const content = contentFor(element, context);
    if (content) return { element, content };
  }
  let candidate = origin.closest<HTMLElement>(targets);
  while (candidate && candidate !== document.body) {
    if (candidate instanceof HTMLElement && !candidate.closest(ignored) && candidate.tagName !== "IFRAME") {
      const content = contentFor(candidate, context);
      if (content) return { element: candidate, content };
    }
    candidate = candidate.parentElement?.closest<HTMLElement>(targets) ?? null;
  }
  return null;
}
