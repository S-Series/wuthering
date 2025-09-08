import { useCallback, useMemo } from "react";

export function useStyleHelper(sizeValue = 1) {
  const setSlotStyle = useCallback(
    ({ w = null, h = null, x = 0, y = 0 }) => ({
      position: "absolute",
      width: w == null ? "100%" : `calc(${w}px * ${sizeValue})`,
      height: h == null ? "100%" : `calc(${h}px * ${sizeValue})`,
      top: `calc(${y}px * ${sizeValue})`,
      left: `calc(${x}px * ${sizeValue})`,
    }),
    [sizeValue]
  );


  return {
    setSlotStyle,
  };
}
