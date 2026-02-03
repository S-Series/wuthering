import { FixedStats, type Stat, type StatId } from "@/datas/stats";

export type EchoStatOption = {
  statId: StatId;
  statValue: number | -1;
};

export type EchoRuntime = {
  echoId: string;
  setId: string;
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
  setId: "",
  cost,
  mainOption: {
    statId: "dummy",
    statValue: -1,
  },
  subOptions: [
    { statId: "dummy", statValue: -1 },
    { statId: "dummy", statValue: -1 },
    { statId: "dummy", statValue: -1 },
    { statId: "dummy", statValue: -1 },
    { statId: "dummy", statValue: -1 },
  ],
});
