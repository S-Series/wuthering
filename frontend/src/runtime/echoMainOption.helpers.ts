import type { CharacterMeta } from "@/datas/characters.meta";
import type { StatId } from "@/datas/stats";
import type { EchoRuntime } from "./echo.runtime";

export function isValidEchoMainOption(meta: CharacterMeta, cost: 1 | 3 | 4, statId: StatId): boolean {
  if (cost === 4) return meta.cost4MainStats.includes(statId);
  if (cost === 3) return meta.cost3MainStats.includes(statId);
  return statId === `${meta.statType}Pct`;
}

export function countInvalidEquippedMainOptions(echoes: EchoRuntime[], order: number[], meta: CharacterMeta): number {
  return order.slice(0, 5).filter(index => {
    const echo = echoes[index];
    return echo && !isValidEchoMainOption(meta, echo.cost, echo.mainOption.statId);
  }).length;
}
