import { useLayoutEffect, type RefObject } from "react";
import { installPageEntryAnimations } from "@/runtime/pageEntryAnimations";

export function usePageEntryAnimations(root: RefObject<HTMLElement | null>, pathname: string) {
  useLayoutEffect(() => {
    if (!root.current) return;
    return installPageEntryAnimations(root.current, pathname);
  }, [root, pathname]);
}
