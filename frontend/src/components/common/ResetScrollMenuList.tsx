import { useCallback } from "react";
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
  const setInnerRef = useCallback(
    (node: HTMLDivElement | null) => {
      assignRef(props.innerRef, node);

      if (!node) return;

      node.scrollTop = 0;
      window.requestAnimationFrame(() => {
        node.scrollTop = 0;
      });
    },
    [props.innerRef],
  );

  return <components.MenuList {...props} innerRef={setInnerRef} />;
}
