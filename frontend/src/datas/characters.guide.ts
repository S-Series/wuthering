import type { CardDetailPartyKey } from "@/locales/locale.schema";
import type { EchoId } from "./echos";
import { weapon, type WeaponId } from "./weapon";
import type { CharacterId } from "./characterStats";
import { character } from "./characters";

type PartyGuide = {
  nameKey: CardDetailPartyKey;
  characters: CharacterId[];
}

export type SkillType =
  | "basic"
  | "skill"
  | "liberation"
  | "outro"
  | "forte";

export type GuideSkillOrder = [
  SkillType,
  SkillType,
  SkillType,
  SkillType,
  SkillType
];

export type characterGuide = {
  guideMainEcho: EchoId;
  guideWeapons: WeaponId[];
  guideParties: PartyGuide[];
  guideSkillOrder: GuideSkillOrder;
};

export const characterGuideData: Record<CharacterId, characterGuide> = {
  lucilla: {
    guideMainEcho: "Z05",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  lucy: {
    guideMainEcho: "Z05",
    guideWeapons: [
      weapon.pistol.pistol007.id,
      weapon.pistol.pistol005.id,
      weapon.pistol.pistol001.id,
    ],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  rebecca: {
    guideMainEcho: "Z05",
    guideWeapons: [
      weapon.pistol.pistol008.id,
      weapon.pistol.pistol005.id,
      weapon.pistol.pistol001.id,
    ],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  denia: {
    guideMainEcho: "Z05",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  hiyuki: {
    guideMainEcho: "Z06",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "liberation", "skill", "outro", "basic"],
  },
  sigrika: {
    guideMainEcho: "W89",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  luuk_herssen: {
    guideMainEcho: "R57",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  aemeath: {
    guideMainEcho: "Z04",
    guideWeapons: [
      weapon.sword.sword009.id,
      weapon.sword.sword002.id,
      weapon.sword.sword001.id,
    ],
    guideParties: [
      {
        nameKey: "harmonyBreak",
        characters: [character.lynae.id, character.mornye.id],
      },
      {
        nameKey: "fusionAnomaly",
        characters: [character.denia.id, character.chisa.id],
      },
      {
        nameKey: "budgetAlternatives",
        characters: [
          character.jianxin.id,
          character.verina.id,
          character.shorekeeper.id,
        ],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  mornye: {
    guideMainEcho: "R66",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  lynae: {
    guideMainEcho: "R65",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  chisa: {
    guideMainEcho: "Z03",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  buling: {
    guideMainEcho: "X78",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  qiuyuan: {
    guideMainEcho: "X79",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  galbrena: {
    guideMainEcho: "H56",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  iuno: {
    guideMainEcho: "W88",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  augusta: {
    guideMainEcho: "W87",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  phrolova: {
    guideMainEcho: "W93N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  lupa: {
    guideMainEcho: "W86",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  cartethyia: {
    guideMainEcho: "Z02",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  chiaccona: {
    guideMainEcho: "W85",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  zani: {
    guideMainEcho: "W71",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  cantarella: {
    guideMainEcho: "W83",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  rover_aero: {
    guideMainEcho: "Z02",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  brant: {
    guideMainEcho: "H82",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  phoebe: {
    guideMainEcho: "W71",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  roccia: {
    guideMainEcho: "H72N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  carlotta: {
    guideMainEcho: "W84",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  lumi: {
    guideMainEcho: "W75N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  camellya: {
    guideMainEcho: "H80N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  youhu: {
    guideMainEcho: "X78",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  shorekeeper: {
    guideMainEcho: "X78",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  xiangliyao: {
    guideMainEcho: "W75N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  zhezhi: {
    guideMainEcho: "N74N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  changli: {
    guideMainEcho: "W77N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  jinhsi: {
    guideMainEcho: "Z01",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  yinlin: {
    guideMainEcho: "W75N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  jiyan: {
    guideMainEcho: "H71N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  rover_havoc: {
    guideMainEcho: "H81",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  rover_spectro: {
    guideMainEcho: "H73N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  verina: {
    guideMainEcho: "X78",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  calcharo: {
    guideMainEcho: "W75N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  encore: {
    guideMainEcho: "W77N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  jianxin: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  lingyang: {
    guideMainEcho: "N74",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  sanhua: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  baizhi: {
    guideMainEcho: "X78",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  chixia: {
    guideMainEcho: "W77N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  mortefi: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  yuanwu: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  yangyang: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  aalto: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  taoqi: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
  danjin: {
    guideMainEcho: "H80N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "outro", "basic"],
  },
};

