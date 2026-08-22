import type { CharacterId } from "./characterStats";
import type { StatId } from "./stats";

export type CharacterConstell = 1 | 2 | 3 | 4 | 5 | 6;
export type CharacterConstellEffectScope =
  | "self"
  | "conditional"
  | "specific"
  | "team"
  | "fixed"
  | "unknown";

export interface CharacterConstellStatBonus {
  statId: StatId;
  value: number;
}

export interface CharacterConstellEffect {
  scope: CharacterConstellEffectScope;
  stats: readonly CharacterConstellStatBonus[];
  note?: string;
}

export type CharacterConstellStatTable = Partial<
  Record<CharacterConstell, readonly CharacterConstellEffect[]>
>;

const stat = (
  statId: StatId,
  value: number
): CharacterConstellStatBonus => ({ statId, value });

const self = (
  ...stats: CharacterConstellStatBonus[]
): CharacterConstellEffect => ({ scope: "self", stats });

const conditional = (
  note: string,
  ...stats: CharacterConstellStatBonus[]
): CharacterConstellEffect => ({ scope: "conditional", stats, note });

const specific = (
  note: string,
  ...stats: CharacterConstellStatBonus[]
): CharacterConstellEffect => ({ scope: "specific", stats, note });

const team = (
  note: string,
  ...stats: CharacterConstellStatBonus[]
): CharacterConstellEffect => ({ scope: "team", stats, note });

const fixed = (
  note: string,
  ...stats: CharacterConstellStatBonus[]
): CharacterConstellEffect => ({ scope: "fixed", stats, note });

const unknown = (note: string): CharacterConstellEffect => ({
  scope: "unknown",
  stats: [],
  note,
});

// Conditional and self-applicable team effects use their maximum stated value.
// Specific-attack, fixed-value, and unknown effects are kept as notes only.
export const characterConstellStats: Partial<
  Record<CharacterId, CharacterConstellStatTable>
> = {
  aalto: {
    2: [conditional("조건 충족 시 공격력 증가", stat("atkPct", 15))],
    5: [self(stat("aeroBns", 25))],
    6: [self(stat("critRate", 8))],
  },
  aemeath: {
    1: [
      specific(
        "Instant Response 중 특정 강공격에 적용",
        stat("critDmg", 300)
      ),
    ],
    3: [conditional("재구성된 패시브 효과", stat("critDmg", 60))],
    4: [team("본인 포함 파티 전속성 피해 증가", stat("typeBns", 20))],
    6: [
      fixed(
        "특정 피해의 치명 수치를 고정",
        stat("critRate", 80),
        stat("critDmg", 275)
      ),
    ],
  },
  augusta: {
    1: [
      conditional(
        "Crown of Wills 2스택 기준",
        stat("electroBns", 30),
        stat("critDmg", 30)
      ),
    ],
    2: [
      conditional("Crown 2스택 기준", stat("critRate", 40)),
      conditional(
        "치명률 100% 초과분 변환 최대치",
        stat("critDmg", 100)
      ),
    ],
    4: [team("본인 포함 파티 공격력 증가", stat("atkPct", 20))],
    6: [
      conditional(
        "Crown 4스택 확장분, 누적 총 Electro 60 / CR 80 / CD 60",
        stat("electroBns", 30),
        stat("critRate", 40),
        stat("critDmg", 30)
      ),
      conditional(
        "초과 치명률 변환 상한 확장분, 누적 최대 150",
        stat("critDmg", 50)
      ),
    ],
  },
  baizhi: {
    2: [self(stat("glacioBns", 15), stat("healBns", 15))],
    3: [self(stat("hpPct", 12))],
    6: [team("본인 포함 주변 파티 응결 피해 증가", stat("glacioBns", 12))],
  },
  brant: {
    2: [self(stat("critRate", 30))],
  },
  buling: {
    1: [
      specific("특정 공명 해방 공격에 적용", stat("critRate", 20)),
    ],
    4: [self(stat("healBns", 20))],
  },
  calcharo: {
    3: [self(stat("electroBns", 25))],
    4: [team("본인 포함 파티 전도 피해 증가", stat("electroBns", 20))],
  },
  camellya: {
    1: [self(stat("critDmg", 28))],
    3: [conditional("Budding Mode 중 적용", stat("atkPct", 58))],
  },
  cantarella: {
    4: [conditional("Mirage 상태에서 적용", stat("healBns", 25))],
  },
  carlotta: {
    1: [
      specific("특정 공격 인스턴스에 적용", stat("critRate", 12.5)),
    ],
  },
  cartethyia: {
    1: [
      conditional("Conviction 4단계 기준 최대치", stat("critDmg", 100)),
    ],
    4: [team("본인 포함 파티 전속성 피해 증가", stat("typeBns", 20))],
  },
  changli: {
    2: [self(stat("critRate", 25))],
    4: [team("본인 포함 파티 공격력 증가", stat("atkPct", 20))],
  },
  chisa: {
    1: [self(stat("atkPct", 30))],
    2: [team("본인 포함 파티 전속성 피해 증가", stat("typeBns", 50))],
  },
  chixia: {
    5: [self(stat("atkPct", 30))],
  },
  chiaccona: {
    1: [self(stat("atkPct", 35))],
    2: [team("본인 포함 파티 기류 피해 증가", stat("aeroBns", 40))],
  },
  danjin: {
    1: [conditional("최대 6스택 기준", stat("atkPct", 30))],
    4: [self(stat("critRate", 15))],
    5: [
      self(stat("havocBns", 15)),
      conditional("HP 60% 미만 추가분", stat("havocBns", 15)),
    ],
    6: [team("본인 포함 파티 공격력 증가", stat("atkPct", 20))],
  },
  denia: {
    1: [self(stat("critDmg", 30))],
    2: [
      conditional("Fusion Burst 모드의 해당 파티원에게 적용", stat("fusionBns", 50)),
    ],
    6: [
      conditional(
        "Entropy Shift 중 적용",
        stat("atkPct", 60),
        stat("fusionBns", 60)
      ),
    ],
  },
  encore: {
    1: [conditional("최대 4스택 기준", stat("fusionBns", 12))],
    4: [team("본인 포함 파티 융용 피해 증가", stat("fusionBns", 20))],
    6: [conditional("최대 6스택 기준", stat("atkPct", 30))],
  },
  galbrena: {
    1: [specific("특정 공격의 최대치", stat("critDmg", 80))],
    2: [
      conditional(
        "Burning Drive 공격력 보너스 순증분, 총 보너스 90%",
        stat("atkPct", 70)
      ),
    ],
    4: [team("본인 포함 파티 전속성 피해 증가", stat("typeBns", 20))],
  },
  hiyuki: {
    6: [
      conditional("Snow Rust 2스택에서 적용", stat("critDmg", 40)),
      specific(
        "Foreclaiming: Inward Vision / Blade Liberation에 적용",
        stat("critDmg", 500)
      ),
    ],
  },
  iuno: {
    1: [conditional("Lunar Cycle 중 적용", stat("atkPct", 40))],
  },
  jinhsi: {
    3: [conditional("최대 2스택 기준", stat("atkPct", 50))],
    4: [team("본인 포함 파티 전속성 피해 증가", stat("typeBns", 20))],
  },
  jiyan: {
    2: [self(stat("atkPct", 28))],
    3: [self(stat("critRate", 16), stat("critDmg", 32))],
    5: [conditional("최대 15스택 기준", stat("atkPct", 45))],
  },
  lingyang: {
    4: [team("본인 포함 파티 응결 피해 증가", stat("glacioBns", 20))],
  },
  lucilla: {
    1: [self(stat("critRate", 20))],
    4: [conditional("최대 3스택 기준", stat("atkPct", 30))],
  },
  lucy: {
    1: [self(stat("atkPct", 20))],
    3: [
      specific("특정 공명 해방 공격에 적용", stat("critDmg", 100)),
    ],
    4: [team("본인 포함 파티 전속성 피해 증가", stat("typeBns", 20))],
    6: [unknown("6돌 효과 수치 미확인")],
  },
  lumi: {
    6: [team("본인 포함 파티 공격력 증가", stat("atkPct", 20))],
  },
  lupa: {
    1: [self(stat("critRate", 20))],
    2: [team("본인 포함 파티 융용 피해 최대 2스택", stat("fusionBns", 40))],
  },
  lynae: {
    4: [self(stat("atkPct", 20))],
  },
  mornye: {
    2: [
      team(
        "Interfered Marker 대상 공격 시, 공명 효율 초과분 기준 최대치",
        stat("critDmg", 32)
      ),
    ],
  },
  mortefi: {
    3: [specific("Marcato에 적용", stat("critDmg", 30))],
    6: [team("본인 포함 파티 공격력 증가", stat("atkPct", 20))],
  },
  phoebe: {
    5: [self(stat("spectroBns", 12))],
    6: [self(stat("atkPct", 10))],
  },
  phrolova: {
    4: [team("본인 포함 파티 전속성 피해 증가", stat("typeBns", 20))],
    6: [
      conditional("Maestro 상태에서 본인이 온필드일 때 적용", stat("havocBns", 60)),
    ],
  },
  qingxiao: {
    1: [self(stat("critRate", 16))],
    3: [
      specific(
        "Resonance Liberation: Billows Beneath Heaven에 적용",
        stat("critDmg", 100)
      ),
    ],
    4: [
      conditional(
        "Tune Strain-Shifting을 건 공명자에게 8초간 적용",
        stat("atkPct", 20)
      ),
    ],
    6: [unknown("6돌 효과 수치 미확인")],
  },
  qiuyuan: {
    1: [self(stat("critRate", 20))],
    4: [self(stat("atkPct", 20))],
    6: [
      conditional(
        "Straw Cape in Drizzly Rain 사용 후 6초간 적용",
        stat("critDmg", 100)
      ),
    ],
  },
  rebecca: {
    2: [team("본인 포함 파티 전속성 피해 증가", stat("typeBns", 20))],
    4: [unknown("A Girl Gets What She Wants!의 Stat Bonus 종류 미확인, 증가량 60%")],
  },
  roccia: {
    2: [team("본인 포함 파티 인멸 피해 최대 스택", stat("havocBns", 40))],
    3: [self(stat("critRate", 10), stat("critDmg", 30))],
  },
  rover_aero: {
    3: [self(stat("aeroBns", 15))],
  },
  rover_havoc: {
    6: [conditional("Dark Surge 상태에서 적용", stat("critRate", 25))],
  },
  rover_spectro: {
    1: [self(stat("critRate", 15))],
    2: [self(stat("spectroBns", 20))],
    3: [self(stat("resonanceBns", 20))],
  },
  sanhua: {
    1: [self(stat("critRate", 15))],
    5: [specific("Forte Circuit: Ice Burst에 적용", stat("critDmg", 100))],
    6: [team("본인 포함 파티 공격력 최대 2스택", stat("atkPct", 20))],
  },
  sigrika: {
    4: [team("본인 포함 파티 공격력 증가", stat("atkPct", 20))],
  },
  suisui: {
    1: [unknown("Undulating Mist 보유 공명자의 조건부 공격력 수치 미확인")],
    2: [team("본인 포함 영역 내 파티 치명타 피해 증가", stat("critDmg", 50))],
    6: [
      specific(
        "Intro Skill: Tinkling Jade / Resonance Skill: Awakening Spring에 적용",
        stat("critDmg", 500)
      ),
    ],
  },
  taoqi: {
    2: [
      specific(
        "공명 해방에 적용",
        stat("critRate", 20),
        stat("critDmg", 20)
      ),
    ],
    4: [self(stat("defPct", 50))],
  },
  shorekeeper: {
    2: [team("본인 포함 Outer Stellarealm 내 파티 공격력 증가", stat("atkPct", 40))],
    4: [
      conditional(
        "Resonance Skill: Chaos Theory 사용 시 적용",
        stat("healBns", 70)
      ),
    ],
    6: [
      specific("Intro Skill: Discernment에 적용", stat("critDmg", 500)),
    ],
  },
  verina: {
    4: [team("본인 포함 파티 회절 피해 24초간 증가", stat("spectroBns", 15))],
  },
  xiangliyao: {
    2: [conditional("8초간 적용", stat("critDmg", 30))],
  },
  yangyang: {
    1: [conditional("Intro 사용 후 8초간 적용", stat("aeroBns", 15))],
    6: [team("본인 포함 파티 공격력 증가", stat("atkPct", 20))],
  },
  xuanling: {
    4: [team("본인 포함 파티 공격력 20초간 증가", stat("atkPct", 20))],
  },
  yinlin: {
    4: [team("Judgment Strike 적중 후 본인 포함 파티 공격력 증가", stat("atkPct", 20))],
  },
  youhu: {
    3: [self(stat("atkPct", 20))],
    5: [conditional("Intro 사용 후 14초간 적용", stat("critRate", 15))],
    6: [conditional("Sky Blue 최대 4스택 기준", stat("critDmg", 60))],
  },
  yuanwu: {
    6: [team("본인 포함 Thunder Wedge 범위 내 파티 방어력 증가", stat("defPct", 32))],
  },
  zani: {
    1: [conditional("14초간 적용", stat("spectroBns", 50))],
    2: [self(stat("critRate", 20))],
    4: [team("본인 포함 파티 공격력 30초간 증가", stat("atkPct", 20))],
  },
  zhezhi: {
    1: [conditional("27초간 적용", stat("critRate", 10))],
    3: [conditional("최대 3스택 기준", stat("atkPct", 45))],
    4: [team("본인 포함 파티 공격력 30초간 증가", stat("atkPct", 20))],
  },
};

// The Electro Rover is not a CharacterId in the current app yet.
export const pendingCharacterConstellStats: Record<
  string,
  CharacterConstellStatTable
> = {
  rover_electro: {
    5: [conditional("Apex Resonance 상태에서 적용", stat("critDmg", 20))],
  },
};

export const getCharacterConstellEffects = (
  characterId: CharacterId,
  constell: number
): CharacterConstellEffect[] => {
  const statTable = characterConstellStats[characterId];
  const activeConstell = Math.min(6, Math.max(0, Math.floor(constell)));

  if (!statTable || activeConstell === 0) return [];

  const effects: CharacterConstellEffect[] = [];

  for (let level = 1; level <= activeConstell; level += 1) {
    effects.push(...(statTable[level as CharacterConstell] ?? []));
  }

  return effects;
};

export const getCharacterConstellStatBonuses = (
  characterId: CharacterId,
  constell: number
): CharacterConstellStatBonus[] =>
  getCharacterConstellEffects(characterId, constell)
    .filter(
      (effect) =>
        effect.scope !== "specific" &&
        effect.scope !== "fixed" &&
        effect.scope !== "unknown"
    )
    .flatMap((effect) => effect.stats);
