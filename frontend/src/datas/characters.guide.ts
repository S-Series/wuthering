import type { EchoId } from "./echos";
import { weapon, type WeaponId } from "./weapon";
import type { CharacterId } from "./characterStats";

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
  guideSkillOrder: GuideSkillOrder;
};

export const characterGuideData: Record<CharacterId, characterGuide> = {
  jingran: {
    guideMainEcho: "R71",
    guideWeapons: [
      weapon.broadblade.broadblade009.id,
      weapon.broadblade.broadblade005.id,
      weapon.broadblade.broadblade003.id,
    ],
    guideSkillOrder: ["forte", "liberation", "skill", "basic", "outro"],
  },
  qingxiao: {
    guideMainEcho: "X81",
    guideWeapons: [
      weapon.sword.sword012.id,
      weapon.sword.sword004.id,
      weapon.sword.sword001.id,
    ],
    guideSkillOrder: ["forte", "liberation", "outro", "basic", "skill"],
  },
  suisui: {
    guideMainEcho: "R71",
    guideWeapons: [
      weapon.rectifier.rectifier011.id,
      weapon.rectifier.rectifier102.id,
    ],
    guideSkillOrder: ["liberation", "skill", "forte", "outro", "basic"],
  },
  xuanling: {
    guideMainEcho: "N91",
    guideWeapons: [weapon.sword.sword011.id, weapon.sword.sword001.id],
    guideSkillOrder: ["liberation", "forte", "skill", "basic", "outro"],
  },
  lucilla: {
    guideMainEcho: "Z06",
    guideWeapons: [
      weapon.rectifier.rectifier010.id,
      weapon.rectifier.rectifier007.id,
      weapon.rectifier.rectifier002.id,
    ],
    guideSkillOrder: ["liberation", "skill", "forte", "outro", "basic"],
  },
  lucy: {
    guideMainEcho: "X80",
    guideWeapons: [
      weapon.pistol.pistol007.id,
      weapon.pistol.pistol005.id,
      weapon.pistol.pistol001.id,
    ],
    guideSkillOrder: ["liberation", "basic", "forte", "skill", "outro"],
  },
  rebecca: {
    guideMainEcho: "X80",
    guideWeapons: [
      weapon.pistol.pistol008.id,
      weapon.pistol.pistol005.id,
      weapon.pistol.pistol001.id,
    ],
    guideSkillOrder: ["forte", "liberation", "basic", "outro", "skill"],
  },
  denia: {
    guideMainEcho: "Z05",
    guideWeapons: [
      weapon.rectifier.rectifier009.id,
      weapon.rectifier.rectifier007.id,
      weapon.rectifier.rectifier002.id,
    ],
    guideSkillOrder: ["liberation", "forte", "skill", "basic", "outro"],
  },
  hiyuki: {
    guideMainEcho: "Z06",
    guideWeapons: [
      weapon.sword.sword010.id,
      weapon.sword.sword002.id,
      weapon.sword.sword001.id,
    ],
    guideSkillOrder: ["liberation", "basic", "forte", "skill", "outro"],
  },
  sigrika: {
    guideMainEcho: "W89",
    guideWeapons: [
      weapon.gauntlet.gauntlet008.id,
      weapon.sword.sword003.id,
      weapon.sword.sword002.id,
    ],
    guideSkillOrder: ["forte", "liberation", "basic", "outro", "skill"],
  },
  luuk_herssen: {
    guideMainEcho: "R57",
    guideWeapons: [weapon.gauntlet.gauntlet007.id, weapon.sword.sword001.id],
    guideSkillOrder: ["skill", "liberation", "basic", "forte", "outro"],
  },
  aemeath: {
    guideMainEcho: "Z04",
    guideWeapons: [
      weapon.sword.sword009.id,
      weapon.sword.sword002.id,
      weapon.sword.sword001.id,
    ],
    guideSkillOrder: ["liberation", "forte", "skill", "basic", "outro"],
  },
  mornye: {
    guideMainEcho: "R66",
    guideWeapons: [
      weapon.broadblade.broadblade008.id,
      weapon.broadblade.broadblade101.id,
    ],
    guideSkillOrder: ["liberation", "forte", "skill", "basic", "outro"],
  },
  lynae: {
    guideMainEcho: "R65",
    guideWeapons: [
      weapon.pistol.pistol006.id,
      weapon.pistol.pistol005.id,
      weapon.pistol.pistol001.id,
    ],
    guideSkillOrder: ["forte", "liberation", "basic", "skill", "outro"],
  },
  chisa: {
    guideMainEcho: "Z03",
    guideWeapons: [
      weapon.broadblade.broadblade007.id,
      weapon.broadblade.broadblade006.id,
    ],
    guideSkillOrder: ["forte", "liberation", "basic", "skill", "outro"],
  },
  buling: {
    guideMainEcho: "X78",
    guideWeapons: [
      weapon.rectifier.rectifier102.id,
      weapon.rectifier.rectifier104.id,
    ],
    guideSkillOrder: ["forte", "basic", "skill", "outro", "liberation"],
  },
  qiuyuan: {
    guideMainEcho: "X79",
    guideWeapons: [weapon.sword.sword007.id, weapon.sword.sword001.id],
    guideSkillOrder: ["forte", "liberation", "outro", "skill", "basic"],
  },
  galbrena: {
    guideMainEcho: "H56",
    guideWeapons: [
      weapon.pistol.pistol004.id,
      weapon.pistol.pistol005.id,
      weapon.pistol.pistol001.id,
    ],
    guideSkillOrder: ["forte", "liberation", "basic", "skill", "outro"],
  },
  iuno: {
    guideMainEcho: "W88",
    guideWeapons: [
      weapon.gauntlet.gauntlet005.id,
      weapon.gauntlet.gauntlet002.id,
      weapon.gauntlet.gauntlet006.id,
    ],
    guideSkillOrder: ["forte", "liberation", "outro", "skill", "basic"],
  },
  augusta: {
    guideMainEcho: "W87",
    guideWeapons: [
      weapon.broadblade.broadblade005.id,
      weapon.broadblade.broadblade006.id,
    ],
    guideSkillOrder: ["liberation", "forte", "basic", "skill", "outro"],
  },
  phrolova: {
    guideMainEcho: "W93N",
    guideWeapons: [
      weapon.rectifier.rectifier007.id,
      weapon.rectifier.rectifier002.id,
    ],
    guideSkillOrder: ["liberation", "basic", "forte", "outro", "skill"],
  },
  lupa: {
    guideMainEcho: "W86",
    guideWeapons: [
      weapon.broadblade.broadblade004.id,
      weapon.broadblade.broadblade006.id,
      weapon.broadblade.broadblade001.id,
    ],
    guideSkillOrder: ["liberation", "outro", "forte", "basic", "skill"],
  },
  cartethyia: {
    guideMainEcho: "Z02",
    guideWeapons: [weapon.sword.sword006.id],
    guideSkillOrder: ["forte", "liberation", "basic", "skill", "outro"],
  },
  chiaccona: {
    guideMainEcho: "W85",
    guideWeapons: [
      weapon.pistol.pistol003.id,
      weapon.pistol.pistol107.id,
      weapon.pistol.pistol101.id,
    ],
    guideSkillOrder: ["liberation", "basic", "forte", "outro", "skill"],
  },
  zani: {
    guideMainEcho: "W71",
    guideWeapons: [
      weapon.gauntlet.gauntlet004.id,
      weapon.gauntlet.gauntlet003.id,
      weapon.gauntlet.gauntlet002.id,
    ],
    guideSkillOrder: ["forte", "liberation", "skill", "outro", "basic"],
  },
  cantarella: {
    guideMainEcho: "W83",
    guideWeapons: [
      weapon.rectifier.rectifier006.id,
      weapon.rectifier.rectifier007.id,
      weapon.rectifier.rectifier002.id,
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "basic", "outro"],
  },
  rover_aero: {
    guideMainEcho: "Z02",
    guideWeapons: [weapon.sword.sword005.id],
    guideSkillOrder: ["forte", "liberation", "skill", "outro", "basic"],
  },
  brant: {
    guideMainEcho: "H82",
    guideWeapons: [weapon.sword.sword004.id, weapon.sword.sword102.id],
    guideSkillOrder: ["forte", "basic", "liberation", "outro", "skill"],
  },
  phoebe: {
    guideMainEcho: "W71",
    guideWeapons: [
      weapon.rectifier.rectifier005.id,
      weapon.rectifier.rectifier007.id,
      weapon.rectifier.rectifier002.id,
    ],
    guideSkillOrder: ["forte", "liberation", "skill", "outro", "basic"],
  },
  roccia: {
    guideMainEcho: "H72N",
    guideWeapons: [
      weapon.gauntlet.gauntlet003.id,
      weapon.gauntlet.gauntlet006.id,
      weapon.gauntlet.gauntlet105.id,
    ],
    guideSkillOrder: ["forte", "liberation", "skill", "outro", "basic"],
  },
  carlotta: {
    guideMainEcho: "W84",
    guideWeapons: [
      weapon.pistol.pistol002.id,
      weapon.pistol.pistol001.id,
      weapon.pistol.pistol005.id,
    ],
    guideSkillOrder: ["liberation", "skill", "forte", "outro", "basic"],
  },
  lumi: {
    guideMainEcho: "W75N",
    guideWeapons: [weapon.broadblade.broadblade101.id],
    guideSkillOrder: ["forte", "liberation", "skill", "outro", "basic"],
  },
  camellya: {
    guideMainEcho: "H80N",
    guideWeapons: [weapon.sword.sword003.id, weapon.sword.sword001.id],
    guideSkillOrder: ["skill", "forte", "liberation", "outro", "basic"],
  },
  youhu: {
    guideMainEcho: "X78",
    guideWeapons: [weapon.gauntlet.gauntlet101.id],
    guideSkillOrder: ["skill", "forte", "liberation", "basic", "outro"],
  },
  shorekeeper: {
    guideMainEcho: "X78",
    guideWeapons: [
      weapon.rectifier.rectifier004.id,
      weapon.rectifier.rectifier102.id,
    ],
    guideSkillOrder: ["outro", "skill", "basic", "forte", "liberation"],
  },
  xiangliyao: {
    guideMainEcho: "W75N",
    guideWeapons: [
      weapon.gauntlet.gauntlet002.id,
      weapon.gauntlet.gauntlet006.id,
    ],
    guideSkillOrder: ["liberation", "forte", "outro", "skill", "basic"],
  },
  zhezhi: {
    guideMainEcho: "N74N",
    guideWeapons: [
      weapon.rectifier.rectifier003.id,
      weapon.rectifier.rectifier002.id,
    ],
    guideSkillOrder: ["liberation", "forte", "basic", "skill", "outro"],
  },
  changli: {
    guideMainEcho: "W77N",
    guideWeapons: [],
    guideSkillOrder: ["skill", "forte", "liberation", "basic", "outro"],
  },
  jinhsi: {
    guideMainEcho: "Z01",
    guideWeapons: [
      weapon.broadblade.broadblade003.id,
      weapon.broadblade.broadblade006.id,
      weapon.broadblade.broadblade001.id,
    ],
    guideSkillOrder: ["forte", "liberation", "skill", "outro", "basic"],
  },
  yinlin: {
    guideMainEcho: "W75N",
    guideWeapons: [
      weapon.rectifier.rectifier002.id,
      weapon.rectifier.rectifier001.id,
      weapon.rectifier.rectifier107.id,
    ],
    guideSkillOrder: ["forte", "liberation", "skill", "basic", "outro"],
  },
  jiyan: {
    guideMainEcho: "H71N",
    guideWeapons: [
      weapon.broadblade.broadblade002.id,
      weapon.broadblade.broadblade001.id,
      weapon.broadblade.broadblade105.id,
    ],
    guideSkillOrder: ["liberation", "forte", "skill", "outro", "basic"],
  },
  rover_havoc: {
    guideMainEcho: "H81",
    guideWeapons: [weapon.sword.sword001.id],
    guideSkillOrder: ["liberation", "forte", "skill", "basic", "outro"],
  },
  rover_spectro: {
    guideMainEcho: "H73N",
    guideWeapons: [weapon.sword.sword001.id],
    guideSkillOrder: ["liberation", "forte", "basic", "skill", "outro"],
  },
  verina: {
    guideMainEcho: "X78",
    guideWeapons: [weapon.rectifier.rectifier102.id],
    guideSkillOrder: ["forte", "liberation", "skill", "basic", "outro"],
  },
  calcharo: {
    guideMainEcho: "W75N",
    guideWeapons: [
      weapon.broadblade.broadblade006.id,
      weapon.broadblade.broadblade001.id,
    ],
    guideSkillOrder: ["forte", "liberation", "skill", "outro", "basic"],
  },
  encore: {
    guideMainEcho: "W77N",
    guideWeapons: [
      weapon.rectifier.rectifier007.id,
      weapon.rectifier.rectifier002.id,
      weapon.rectifier.rectifier107.id,
    ],
    guideSkillOrder: ["liberation", "forte", "skill", "outro", "basic"],
  },
  jianxin: {
    guideMainEcho: "H72",
    guideWeapons: [weapon.rectifier.rectifier101.id],
    guideSkillOrder: ["liberation", "forte", "basic", "skill", "outro"],
  },
  lingyang: {
    guideMainEcho: "N74",
    guideWeapons: [],
    guideSkillOrder: ["forte", "liberation", "outro", "skill", "basic"],
  },
  sanhua: {
    guideMainEcho: "H72",
    guideWeapons: [weapon.sword.sword001.id],
    guideSkillOrder: ["forte", "liberation", "skill", "outro", "basic"],
  },
  baizhi: {
    guideMainEcho: "X78",
    guideWeapons: [],
    guideSkillOrder: ["liberation", "skill", "forte", "outro", "basic"],
  },
  chixia: {
    guideMainEcho: "W77N",
    guideWeapons: [],
    guideSkillOrder: ["forte", "liberation", "basic", "skill", "outro"],
  },
  mortefi: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideSkillOrder: ["liberation", "forte", "basic", "skill", "outro"],
  },
  yuanwu: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideSkillOrder: ["liberation", "skill", "forte", "outro", "basic"],
  },
  yangyang: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideSkillOrder: ["liberation", "skill", "forte", "basic", "outro"],
  },
  aalto: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideSkillOrder: ["basic", "forte", "liberation", "skill", "outro"],
  },
  taoqi: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideSkillOrder: ["forte", "skill", "liberation", "basic", "outro"],
  },
  danjin: {
    guideMainEcho: "H80N",
    guideWeapons: [],
    guideSkillOrder: ["forte", "skill", "liberation", "basic", "outro"],
  },
};
