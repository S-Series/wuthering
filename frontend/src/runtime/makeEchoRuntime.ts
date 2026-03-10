import { echoDict } from "@/datas/echos";
import { createEmptyEchoRuntime, type EchoRuntime } from "@/runtime/echo.runtime";

type CostKey = "Cost4" | "Cost3" | "Cost1";

const costFromKey = (k: CostKey): 4 | 3 | 1 => {
  if (k === "Cost4") return 4;
  if (k === "Cost3") return 3;
  return 1;
};

export const makeEchoRuntime = (echoId: string): EchoRuntime => {
  const keys: CostKey[] = ["Cost4", "Cost3", "Cost1"];

  for (const k of keys) {
    const bucket = echoDict[k] as Record<string, any> | undefined;
    const leaf = bucket?.[echoId];
    if (!leaf) continue;

    const cost = costFromKey(k);
    const rt = createEmptyEchoRuntime(cost);

    rt.echoId = echoId;
    rt.setId = Array.isArray(leaf.type) ? (leaf.type[0] ?? "") : "";

    return rt;
  }

  const fallback = createEmptyEchoRuntime(1);
  fallback.echoId = echoId;
  fallback.setId = null;
  return fallback;
};
