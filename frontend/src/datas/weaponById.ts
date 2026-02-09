import { weapon } from "@/datas/weapon";
import type { WeaponData } from "@/runtime/character.runtime";

type AnyObj = Record<string, unknown>;

const isWeaponData = (v: unknown): v is WeaponData => {
  if (!v || typeof v !== "object") return false;
  const o = v as AnyObj;

  return (
    typeof o.id === "string" &&
    typeof o.en === "string" &&
    typeof o.kr === "string" &&
    typeof o.jp === "string"
  );
};

const listAllWeapons = (): WeaponData[] => {
  const out: WeaponData[] = [];

  const walk = (v: unknown) => {
    if (!v) return;

    if (Array.isArray(v)) {
      for (const x of v) walk(x);
      return;
    }

    if (typeof v === "object") {
      if (isWeaponData(v)) {
        out.push(v);
        return;
      }

      const obj = v as AnyObj;
      for (const k of Object.keys(obj)) walk(obj[k]);
    }
  };

  walk(weapon);
  return out;
};

const weaponMap = (() => {
  const m = new Map<string, WeaponData>();
  for (const w of listAllWeapons()) m.set(w.id, w);
  return m;
})();

export const weaponById = (id: string): WeaponData | null => {
  return weaponMap.get(id) ?? null;
};
