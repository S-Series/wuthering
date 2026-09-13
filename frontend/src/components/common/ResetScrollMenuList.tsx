import { useCallback, useLayoutEffect, useRef } from "react";
import type { Ref } from "react";
import { components, type GroupBase, type MenuListProps } from "react-select";

function assignRef<T>(ref: Ref<T>, value: T | null) {
  if (!ref) return;

  if (typeof ref === "function") {
    ref(value);
    return;
  }

  ref.current = value;
}

export function ResetScrollMenuList<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(props: MenuListProps<Option, IsMulti, Group>) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const setInnerRef = useCallback(
    (node: HTMLDivElement | null) => {
      menuRef.current = node;
      assignRef(props.innerRef, node);
    },
    [props.innerRef],
  );

  // react-select replaces innerRef on updates; reset only when the menu opens.
  useLayoutEffect(() => {
    const node = menuRef.current;
    if (!node) return;
    node.scrollTop = 0;
    const frame = window.requestAnimationFrame(() => {
      node.scrollTop = 0;
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return <components.MenuList {...props} innerRef={setInnerRef} />;
}
