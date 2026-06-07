type ScrollLockSnapshot = {
  scrollX: number;
  scrollY: number;
  htmlOverflow: string;
  htmlOverscrollBehavior: string;
  bodyOverflow: string;
  bodyOverscrollBehavior: string;
  bodyPosition: string;
  bodyTop: string;
  bodyLeft: string;
  bodyRight: string;
  bodyWidth: string;
  bodyPaddingRight: string;
};

let lockCount = 0;
let snapshot: ScrollLockSnapshot | null = null;

export function lockDocumentScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  const html = document.documentElement;
  const body = document.body;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const scrollbarWidth = window.innerWidth - html.clientWidth;

  snapshot = {
    scrollX,
    scrollY,
    htmlOverflow: html.style.overflow,
    htmlOverscrollBehavior: html.style.overscrollBehavior,
    bodyOverflow: body.style.overflow,
    bodyOverscrollBehavior: body.style.overscrollBehavior,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyLeft: body.style.left,
    bodyRight: body.style.right,
    bodyWidth: body.style.width,
    bodyPaddingRight: body.style.paddingRight,
  };

  html.style.overflow = "hidden";
  html.style.overscrollBehavior = "none";
  body.style.overflow = "hidden";
  body.style.overscrollBehavior = "none";
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = `-${scrollX}px`;
  body.style.right = "0";
  body.style.width = "100%";

  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

export function unlockDocumentScroll() {
  if (lockCount === 0) return;

  lockCount -= 1;
  if (lockCount > 0 || !snapshot) return;

  const html = document.documentElement;
  const body = document.body;
  const previous = snapshot;

  html.style.overflow = previous.htmlOverflow;
  html.style.overscrollBehavior = previous.htmlOverscrollBehavior;
  body.style.overflow = previous.bodyOverflow;
  body.style.overscrollBehavior = previous.bodyOverscrollBehavior;
  body.style.position = previous.bodyPosition;
  body.style.top = previous.bodyTop;
  body.style.left = previous.bodyLeft;
  body.style.right = previous.bodyRight;
  body.style.width = previous.bodyWidth;
  body.style.paddingRight = previous.bodyPaddingRight;

  snapshot = null;
  window.scrollTo(previous.scrollX, previous.scrollY);
}
