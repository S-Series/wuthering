import type { HarmonyId } from "@/datas/echos";
import { type StatId } from "@/datas/stats";

export type EchoStatOption = {
  statId: StatId;
  statValue: number | -1;
};

export type EchoStatOptionSUb = {
  statId: "hp" | "hpPct";
  statValue: number | -1;
};

export type EchoRuntime = {
  echoId: string;
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
  echoId: "",
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
