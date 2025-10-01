import { useCallback, useMemo } from "react";

export function useStyleHelper(sizeValue = 1) {
  const setSlotStyle = useCallback(
    ({ w = null, h = null, x = 0, y = 0 }) => ({
      position: "absolute",
      width: w === null ? "100%" : `calc(${w}px * ${sizeValue})`,
      height: h === null ? "100%" : `calc(${h}px * ${sizeValue})`,
      top: `calc(${y}px * ${sizeValue})`,
      left: `calc(${x}px * ${sizeValue})`,
    }),
    [sizeValue]
  );
  const setCenterPos = useCallback(
    ({ x = 0, y = 0, w = null, h = null }) => ({
      position: "relative",
      width: w === null ? "100%" : `calc(${w}px * ${sizeValue})`,
      height: h === null ? "100%" : `calc(${h}px * ${sizeValue})`,
      top: "50%",
      left: "50%",
      transform: `translate(-50% - ${x * sizeValue}, -50% - ${y * sizeValue})`
    })
  );

  return {
    setSlotStyle,
  };
}
