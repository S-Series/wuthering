import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { useCharacter } from "@/stores/characterDataStore";
import { getCritRateBudget } from "@/runtime/critRateScore.helpers";
import { resolveTooltipTarget, type TooltipTarget } from "./tooltipTarget";
import "./SiteTooltipLayer.css";

export default function SiteTooltipLayer() {
  const { lang } = useAppStore();
  const { characterId, characterData, characterFinalStat } = useCharacter();
  const location = useLocation();
  const id = useId();
  const context = useMemo(() => ({
    lang, characterId, chain: characterData.constell[0], refinement: characterData.constell[1], weaponId: characterData.weaponId,
    critRateBudget: characterFinalStat ? getCritRateBudget(characterFinalStat.critRate, characterData.echoDataIndex.slice(0, 5).map(index => characterData.echoData[index])) : undefined,
  }), [lang, characterId, characterData, characterFinalStat]);
  const [active, setActive] = useState<TooltipTarget | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let pending: HTMLElement | null = null;
    let opened: HTMLElement | null = null;
    let savedTitle: string | null = null;
    let addedLabel = false;
    let labelObserver: MutationObserver | undefined;
    const clearTimer = () => { clearTimeout(timer); timer = undefined; };
    const hide = () => {
      clearTimer();
      labelObserver?.disconnect();
      labelObserver = undefined;
      pending = null;
      if (opened) {
        const descriptions = opened.getAttribute("aria-describedby")?.split(/\s+/).filter(value => value !== id);
        if (descriptions?.length) opened.setAttribute("aria-describedby", descriptions.join(" "));
        else opened.removeAttribute("aria-describedby");
        if (savedTitle !== null) opened.setAttribute("title", savedTitle);
        if (addedLabel) opened.removeAttribute("aria-label");
      }
      savedTitle = null;
      addedLabel = false;
      opened = null;
      setActive(null);
    };
    const show = (origin: EventTarget | null, immediate: boolean) => {
      if (!(origin instanceof Element) || origin.closest(".site-tooltip")) return;
      const target = resolveTooltipTarget(origin, context);
      if (!target) { hide(); return; }
      if (target.element === pending || target.element === opened) return;
      hide();
      pending = target.element;
      const open = () => {
        if (!target.element.isConnected) return;
        // A toggle may update its accessible label between focus and this timer.
        const latest = resolveTooltipTarget(target.element, context);
        if (!latest) return;
        opened = target.element;
        savedTitle = opened.getAttribute("title");
        if (savedTitle !== null) {
          // A title can also be the only accessible name of an icon-only control.
          if (!opened.hasAttribute("aria-label") && !opened.hasAttribute("aria-labelledby") && !opened.textContent?.trim()) {
            opened.setAttribute("aria-label", latest.content.title);
            addedLabel = true;
          }
          opened.removeAttribute("title");
        }
        opened.setAttribute("aria-describedby", [opened.getAttribute("aria-describedby"), id].filter(Boolean).join(" "));
        setActive(latest);
        labelObserver = new MutationObserver(() => {
          if (!opened?.isConnected) { hide(); return; }
          const updated = resolveTooltipTarget(opened, context);
          if (updated) setActive(updated);
        });
        labelObserver.observe(opened, { attributes: true, attributeFilter: ["aria-label", "aria-pressed", "data-tooltip", "data-tooltip-description"] });
      };
      timer = setTimeout(open, immediate ? 0 : 260);
    };
    const over = (event: PointerEvent) => { if (event.pointerType !== "touch" && event.buttons === 0) show(event.target, false); };
    const out = (event: PointerEvent) => {
      const next = event.relatedTarget;
      if (next instanceof Element && (next.closest(".site-tooltip") || (pending ?? opened)?.contains(next))) return;
      clearTimer();
      timer = setTimeout(hide, 140); // Allow the pointer to enter and read the popup.
    };
    const focus = (event: FocusEvent) => show(event.target, true);
    const blur = (event: FocusEvent) => { if (!(event.relatedTarget instanceof Node) || !opened?.contains(event.relatedTarget)) hide(); };
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") hide(); };
    const panelEnter = (event: PointerEvent) => { if (event.target instanceof Element && event.target.closest(".site-tooltip")) clearTimer(); };
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    document.addEventListener("pointerover", panelEnter);
    document.addEventListener("focusin", focus);
    document.addEventListener("focusout", blur);
    document.addEventListener("pointerdown", hide, true);
    document.addEventListener("dragstart", hide, true);
    document.addEventListener("keydown", key, true);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      hide();
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("pointerover", panelEnter);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("focusout", blur);
      document.removeEventListener("pointerdown", hide, true);
      document.removeEventListener("dragstart", hide, true);
      document.removeEventListener("keydown", key, true);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [context, id, location.key]);

  useLayoutEffect(() => {
    if (!active || !panel.current) return;
    const anchor = active.element.getBoundingClientRect();
    const box = panel.current.getBoundingClientRect();
    const gap = 8;
    const left = Math.max(gap, Math.min(anchor.left, window.innerWidth - box.width - gap));
    const below = anchor.bottom + gap;
    const top = below + box.height <= window.innerHeight - gap ? below : Math.max(gap, anchor.top - box.height - gap);
    setPosition({ left, top });
  }, [active]);

  if (!active) return null;
  return createPortal(
    <div ref={panel} id={id} className={`site-tooltip ${lang}-font`} role="tooltip" style={position}>
      <strong>{active.content.title}</strong>
      {active.content.description && <p>{active.content.description}</p>}
      {!!active.content.lines?.length && <ul>{active.content.lines.map((line, index) => <li key={index}>{line}</li>)}</ul>}
    </div>, document.body,
  );
}
