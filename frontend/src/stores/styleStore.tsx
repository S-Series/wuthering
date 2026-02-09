import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { StylesConfig, ThemeConfig, GroupBase } from "react-select";

export type SelectOption = { value: string; label: string };

export type SingleSelectStyles = StylesConfig<SelectOption, false, GroupBase<SelectOption>>;

export interface StyleStore {
  baseSelectStyles: SingleSelectStyles;

  selectTheme: ThemeConfig;

  getSelectStyles: (widthPct: number) => SingleSelectStyles;
}

const StyleContext = createContext<StyleStore | null>(null);

const UI_COLOR = ["#333366ff", "#0b0b44ff"];

export function StyleProvider({ children }: { children: ReactNode }) {
  const baseSelectStyles = useMemo<SingleSelectStyles>(
    () => ({
      container: (base) => ({
        ...base, width: "100%", minHeight: 0
      }),
      control: (base, state) => ({
        ...base,
        overflow: "visible",
        height: "100%",
        minHeight: "1px",
        border: "1px solid transparent",
        background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
      }),
      menu: (base) => ({
        ...base,
        zIndex: 9999,
        color: "white",
      }),
      option: (base) => ({
        ...base,
        background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
        color: "white",
      }),
      menuList: (base) => ({
        ...base,
        backgroundColor: UI_COLOR[1],
        borderRadius: "4px",
      }),
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      valueContainer: (base) => ({
        ...base,
        height: "100%",
      }),
      singleValue: (base) => ({
        ...base,
        overflow: "visible",
        display: "flex",
        alignItems: "center",
        color: "white",
        gap: 8,
      }),
    }),
    []
  );

  const selectTheme = useMemo<ThemeConfig>(
    () => (theme) => ({
      ...theme,
    }),
    []
  );

  const getSelectStyles = useMemo(() => {
    return (widthPct: number): SingleSelectStyles => {
      const clamped = Math.max(0, Math.min(100, widthPct));
      const width = `${clamped}%`;

      return {
        ...baseSelectStyles,

        container: (base) => ({
          ...base,
          width,
        }),

        control: (base, state) => {
          const common = baseSelectStyles.control ? baseSelectStyles.control(base, state) : base;
          return { ...common, width: "100%" }; // 컨테이너 안에서 꽉 채우기
        },
      };
    };
  }, [baseSelectStyles]);

  const value = useMemo<StyleStore>(
    () => ({
      baseSelectStyles,
      selectTheme,
      getSelectStyles,
    }),
    [baseSelectStyles, selectTheme, getSelectStyles]
  );

  return <StyleContext.Provider value={value}>{children}</StyleContext.Provider>;
}

export function useStyleStore() {
  const ctx = useContext(StyleContext);
  if (!ctx) throw new Error("useStyle must be used within <StyleProvider>");
  return ctx;
}
