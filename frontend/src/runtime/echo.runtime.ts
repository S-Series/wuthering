import type { EchoId } from "@/datas/echos";
import type { HarmonyId } from "@/datas/harmonies";
import { type StatId } from "@/datas/stats";

export type EchoStatOption = {
  statId: StatId;
  statValue: number | -1;
};

export type EchoStatOptionSub = {
  statId: "hp" | "hpPct";
  statValue: number | -1;
};

export type EchoRuntime = {
  echoId: EchoId | null;
  setId: HarmonyId | null;
  cost: 4 | 3 | 1;

  mainOption: EchoStatOption;
  subOptions: [
    EchoStatOption,
    EchoStatOption,
    EchoStatOption,
    EchoStatOption,
    EchoStatOption
  ];
};

export const createEmptyEchoRuntime = (cost: 4 | 3 | 1): EchoRuntime => ({
  echoId: null,
  setId: null,
  cost,
  mainOption: {
    statId: "dummy",
    statValue: 0,
  },
  subOptions: [
    { statId: "dummy", statValue: 0 },
    { statId: "dummy", statValue: 0 },
    { statId: "dummy", statValue: 0 },
    { statId: "dummy", statValue: 0 },
    { statId: "dummy", statValue: 0 },
  ],
});
