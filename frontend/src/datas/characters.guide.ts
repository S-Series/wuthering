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
    guideMainEcho: "Z06",
    guideWeapons: [
      weapon.rectifier.rectifier010.id,
      weapon.rectifier.rectifier007.id,
      weapon.rectifier.rectifier002.id,
    ],
    guideParties: [
      {
        nameKey: "glacioAnomaly",
        characters: [character.hiyuki.id, character.chisa.id],
      },
      {
        nameKey: "echoDamageAmp",
        characters: [character.sigrika.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary", //기타
        characters: [character.phrolova.id],
      },
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
    guideParties: [
      {
        nameKey: "cyberpunk",
        characters: [character.rebecca.id, character.shorekeeper.id],
      },
      {
        nameKey: "budgetAlternatives",
        characters: [character.verina.id, character.buling.id],
      },
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
    guideParties: [
      {
        nameKey: "cyberpunk",
        characters: [character.lucy.id, character.shorekeeper.id],
      },
      {
        nameKey: "budgetAlternatives",
        characters: [character.verina.id, character.buling.id],
      },
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
    guideParties: [
      {
        nameKey: "fusionAnomaly",
        characters: [character.aemeath.id, character.chisa.id],
      },
      {
        nameKey: "concertoCluster",
        characters: [character.luuk_herssen.id, character.mornye.id],
      },
      {
        nameKey: "budgetAlternatives",
        characters: [character.shorekeeper.id, character.verina.id],
      },
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
    guideParties: [
      {
        nameKey: "glacioAnomaly",
        characters: [character.lucilla.id, character.chisa.id],
      },
      {
        nameKey: "linmoEngine",
        characters: [character.lynae.id, character.mornye.id],
      },
      {
        nameKey: "temporary",
        characters: [
          character.shorekeeper.id,
          character.verina.id,
          character.jianxin.id,
        ],
      },
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
    guideParties: [
      {
        nameKey: "echoDamageAmp",
        characters: [character.qiuyuan.id, character.shorekeeper.id],
      },
      {
        nameKey: "echoDamageAmp",
        characters: [character.lucilla.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [
          character.chiaccona.id,
          character.verina.id,
          character.aalto.id,
        ],
      },
    ],
    guideSkillOrder: ["forte", "liberation", "basic", "outro", "skill"],
  },
  luuk_herssen: {
    guideMainEcho: "R57",
    guideWeapons: [weapon.gauntlet.gauntlet007.id, weapon.sword.sword001.id],
    guideParties: [
      {
        nameKey: "linmoEngine",
        characters: [character.lynae.id, character.mornye.id],
      },
      {
        nameKey: "concertoCluster",
        characters: [character.denia.id, character.mornye.id],
      },
      {
        nameKey: "basicAttackAmp",
        characters: [character.sanhua.id, character.shorekeeper.id],
      },
    ],
    guideSkillOrder: ["skill", "liberation", "basic", "forte", "outro"],
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
        nameKey: "fusionAnomaly",
        characters: [character.denia.id, character.chisa.id],
      },
      {
        nameKey: "concertoWave",
        characters: [character.lynae.id, character.mornye.id],
      },
      {
        nameKey: "temporary",
        characters: [
          character.lupa.id,
          character.shorekeeper.id,
          character.jianxin.id,
        ],
      },
    ],
    guideSkillOrder: ["liberation", "forte", "skill", "basic", "outro"],
  },
  mornye: {
    guideMainEcho: "R66",
    guideWeapons: [
      weapon.broadblade.broadblade008.id,
      weapon.broadblade.broadblade101.id,
    ],
    guideParties: [
      {
        nameKey: "thirdSlotSupport",
        characters: [character.lynae.id, character.denia.id, character.lupa.id],
      },
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
    guideParties: [
      {
        nameKey: "secondSlotSupport",
        characters: [character.mornye.id],
      },
      {
        nameKey: "hypercarryMainDps",
        characters: [character.sanhua.id, character.shorekeeper.id],
      },
    ],
    guideSkillOrder: ["forte", "liberation", "basic", "skill", "outro"],
  },
  chisa: {
    guideMainEcho: "Z03",
    guideWeapons: [
      weapon.broadblade.broadblade007.id,
      weapon.broadblade.broadblade006.id,
    ],
    guideParties: [
      {
        nameKey: "fusionAnomaly",
        characters: [character.aemeath.id, character.denia.id],
      },
      {
        nameKey: "glacioAnomaly",
        characters: [character.hiyuki.id, character.lucilla.id],
      },
      {
        nameKey: "aeroAnomaly",
        characters: [character.cartethyia.id, character.chiaccona.id],
      },
    ],
    guideSkillOrder: ["forte", "liberation", "basic", "skill", "outro"],
  },
  buling: {
    guideMainEcho: "X78",
    guideWeapons: [
      weapon.rectifier.rectifier102.id,
      weapon.rectifier.rectifier104.id,
    ],
    guideParties: [
      {
        nameKey: "skillDamageAmp",
        characters: [
          character.phrolova.id,
          character.carlotta.id,
          character.jinhsi.id,
        ],
      },
    ],
    guideSkillOrder: ["forte", "basic", "skill", "outro", "liberation"],
  },
  qiuyuan: {
    guideMainEcho: "X79",
    guideWeapons: [weapon.sword.sword007.id, weapon.sword.sword001.id],
    guideParties: [
      {
        nameKey: "echoDamageAmp",
        characters: [character.sigrika.id, character.shorekeeper.id],
      },
      {
        nameKey: "echoDamageAmp",
        characters: [character.galbrena.id, character.shorekeeper.id],
      },
      {
        nameKey: "echoDamageAmp",
        characters: [character.phrolova.id, character.cantarella.id],
      },
    ],
    guideSkillOrder: ["forte", "liberation", "outro", "skill", "basic"],
  },
  galbrena: {
    guideMainEcho: "H56",
    guideWeapons: [
      weapon.pistol.pistol004.id,
      weapon.pistol.pistol005.id,
      weapon.pistol.pistol001.id,
    ],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.qiuyuan.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.lupa.id, character.changli.id],
      },
      {
        nameKey: "temporary",
        characters: [character.verina.id, character.mortefi.id],
      },
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
    guideParties: [
      {
        nameKey: "standard",
        characters: [character.augusta.id, character.shorekeeper.id],
      },
      {
        nameKey: "linmoEngine",
        characters: [character.lynae.id, character.mornye.id],
      },
      {
        nameKey: "budgetAlternatives",
        characters: [character.jianxin.id, character.shorekeeper.id],
      },
    ],
    guideSkillOrder: ["forte", "liberation", "outro", "skill", "basic"],
  },
  augusta: {
    guideMainEcho: "W87",
    guideWeapons: [
      weapon.broadblade.broadblade005.id,
      weapon.broadblade.broadblade006.id,
    ],
    guideParties: [
      {
        nameKey: "standard",
        characters: [character.iuno.id, character.shorekeeper.id],
      },
      {
        nameKey: "budgetAlternatives",
        characters: [character.mortefi.id, character.verina.id],
      },
    ],
    guideSkillOrder: ["liberation", "forte", "basic", "skill", "outro"],
  },
  phrolova: {
    guideMainEcho: "W93N",
    guideWeapons: [
      weapon.rectifier.rectifier007.id,
      weapon.rectifier.rectifier002.id,
    ],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [
          character.cantarella.id,
          character.qiuyuan.id,
          character.roccia.id,
        ],
      },
      {
        nameKey: "temporary",
        characters: [character.sanhua.id, character.buling.id],
      },
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
    guideParties: [
      {
        nameKey: "teamDps",
        characters: [
          character.changli.id,
          character.aemeath.id,
          character.galbrena.id,
        ],
      },
      {
        nameKey: "teamCore",
        characters: [
          character.mornye.id,
          character.denia.id,
          character.brant.id,
        ],
      },
      {
        nameKey: "temporary", //기타
        characters: [character.encore.id, character.mortefi.id],
      },
    ],
    guideSkillOrder: ["liberation", "outro", "forte", "basic", "skill"],
  },
  cartethyia: {
    guideMainEcho: "Z02",
    guideWeapons: [weapon.sword.sword006.id],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [
          character.chiaccona.id,
          character.chisa.id,
          character.rover_aero.id,
        ],
      },
    ],
    guideSkillOrder: ["forte", "liberation", "basic", "skill", "outro"],
  },
  chiaccona: {
    guideMainEcho: "W85",
    guideWeapons: [
      weapon.pistol.pistol003.id,
      weapon.pistol.pistol107.id,
      weapon.pistol.pistol101.id,
    ],
    guideParties: [
      {
        nameKey: "aeroAnomaly",
        characters: [
          character.cartethyia.id,
          character.chisa.id,
          character.rover_aero.id,
        ],
      },
      {
        nameKey: "aeroDps",
        characters: [
          character.iuno.id,
          character.sigrika.id,
          character.jiyan.id,
        ],
      },
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
    guideParties: [
      {
        nameKey: "spectroAnomaly",
        characters: [character.phoebe.id, character.rover_spectro.id],
      },
      {
        nameKey: "temporary", //기타
        characters: [character.shorekeeper.id, character.verina.id],
      },
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
    guideParties: [
      {
        nameKey: "temporary",
        characters: [
          character.phrolova.id,
          character.qiuyuan.id,
          character.roccia.id,
        ],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "basic", "outro"],
  },
  rover_aero: {
    guideMainEcho: "Z02",
    guideWeapons: [weapon.sword.sword005.id],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.cartethyia.id, character.chiaccona.id],
      },
      {
        nameKey: "temporary",
        characters: [character.jiyan.id, character.mortefi.id],
      },
    ],
    guideSkillOrder: ["forte", "liberation", "skill", "outro", "basic"],
  },
  brant: {
    guideMainEcho: "H82",
    guideWeapons: [weapon.sword.sword004.id, weapon.sword.sword102.id],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.changli.id, character.lupa.id],
      },
      {
        nameKey: "temporary",
        characters: [character.encore.id, character.lupa.id],
      },
      {
        nameKey: "temporary",
        characters: [character.sanhua.id, character.shorekeeper.id],
      },
    ],
    guideSkillOrder: ["forte", "basic", "liberation", "outro", "skill"],
  },
  phoebe: {
    guideMainEcho: "W71",
    guideWeapons: [
      weapon.rectifier.rectifier005.id,
      weapon.rectifier.rectifier007.id,
      weapon.rectifier.rectifier002.id,
    ],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.zani.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.rover_spectro.id, character.shorekeeper.id],
      },
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
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.phrolova.id, character.cantarella.id],
      },
      {
        nameKey: "temporary",
        characters: [character.camellya.id, character.shorekeeper.id],
      },
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
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.zhezhi.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.taoqi.id, character.lumi.id],
      },
      {
        nameKey: "temporary",
        characters: [character.verina.id, character.buling.id],
      },
    ],
    guideSkillOrder: ["liberation", "skill", "forte", "outro", "basic"],
  },
  lumi: {
    guideMainEcho: "W75N",
    guideWeapons: [weapon.broadblade.broadblade101.id],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.carlotta.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.carlotta.id, character.verina.id],
      },
    ],
    guideSkillOrder: ["forte", "liberation", "skill", "outro", "basic"],
  },
  camellya: {
    guideMainEcho: "H80N",
    guideWeapons: [weapon.sword.sword003.id, weapon.sword.sword001.id],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.roccia.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.sanhua.id, character.shorekeeper.id],
      },
    ],
    guideSkillOrder: ["skill", "forte", "liberation", "outro", "basic"],
  },
  youhu: {
    guideMainEcho: "X78",
    guideWeapons: [weapon.gauntlet.gauntlet101.id],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [],
      },
    ],
    guideSkillOrder: ["skill", "forte", "liberation", "basic", "outro"],
  },
  shorekeeper: {
    guideMainEcho: "X78",
    guideWeapons: [
      weapon.rectifier.rectifier004.id,
      weapon.rectifier.rectifier102.id,
    ],
    guideParties: [
      {
        nameKey: "temporary", //설명 생략
        characters: [character.shorekeeper.id],
      },
    ],
    guideSkillOrder: ["outro", "skill", "basic", "forte", "liberation"],
  },
  xiangliyao: {
    guideMainEcho: "W75N",
    guideWeapons: [
      weapon.gauntlet.gauntlet002.id,
      weapon.gauntlet.gauntlet006.id,
    ],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.yinlin.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.calcharo.id, character.verina.id],
      },
      {
        nameKey: "quickswap",
        characters: [character.xiangliyao.id],
      },
    ],
    guideSkillOrder: ["liberation", "forte", "outro", "skill", "basic"],
  },
  zhezhi: {
    guideMainEcho: "N74N",
    guideWeapons: [
      weapon.rectifier.rectifier003.id,
      weapon.rectifier.rectifier002.id,
    ],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.carlotta.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.jinhsi.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.changli.id, character.shorekeeper.id],
      },
    ],
    guideSkillOrder: ["liberation", "forte", "basic", "skill", "outro"],
  },
  changli: {
    guideMainEcho: "W77N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.brant.id, character.lupa.id],
      },
      {
        nameKey: "quickswap",
        characters: [character.changli.id],
      },
    ],
    guideSkillOrder: ["skill", "forte", "liberation", "basic", "outro"],
  },
  jinhsi: {
    guideMainEcho: "Z01",
    guideWeapons: [
      weapon.broadblade.broadblade003.id,
      weapon.broadblade.broadblade006.id,
      weapon.broadblade.broadblade001.id,
    ],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.yinlin.id, character.buling.id],
      },
      {
        nameKey: "temporary",
        characters: [character.zhezhi.id, character.buling.id],
      },
      {
        nameKey: "temporary",
        characters: [character.yuanwu.id, character.buling.id],
      },
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
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.jinhsi.id],
      },
      {
        nameKey: "quickswap",
        characters: [character.yinlin.id],
      },
      {
        nameKey: "temporary", //기타
        characters: [character.xiangliyao.id, character.calcharo.id],
      },
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
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.mortefi.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.yangyang.id, character.shorekeeper.id],
      },
      {
        nameKey: "alternative",
        characters: [character.aalto.id, character.verina.id],
      },
    ],
    guideSkillOrder: ["liberation", "forte", "skill", "outro", "basic"],
  },
  rover_havoc: {
    guideMainEcho: "H81",
    guideWeapons: [weapon.sword.sword001.id],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.roccia.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.danjin.id, character.shorekeeper.id],
      },
    ],
    guideSkillOrder: ["liberation", "forte", "skill", "basic", "outro"],
  },
  rover_spectro: {
    guideMainEcho: "H73N",
    guideWeapons: [weapon.sword.sword001.id],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.zani.id, character.phoebe.id],
      },
      {
        nameKey: "temporary",
        characters: [character.phoebe.id, character.shorekeeper.id],
      },
    ],
    guideSkillOrder: ["liberation", "forte", "basic", "skill", "outro"],
  },
  verina: {
    guideMainEcho: "X78",
    guideWeapons: [weapon.rectifier.rectifier102.id],
    guideParties: [
      {
        nameKey: "alternative",
        characters: [character.shorekeeper.id],
      },
    ],
    guideSkillOrder: ["forte", "liberation", "skill", "basic", "outro"],
  },
  calcharo: {
    guideMainEcho: "W75N",
    guideWeapons: [
      weapon.broadblade.broadblade006.id,
      weapon.broadblade.broadblade001.id,
    ],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.yinlin.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.xiangliyao.id, character.shorekeeper.id],
      },
      {
        nameKey: "alternative",
        characters: [character.verina.id],
      },
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
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.changli.id, character.brant.id],
      },
      {
        nameKey: "temporary",
        characters: [character.brant.id, character.lupa.id],
      },
      {
        nameKey: "temporary",
        characters: [character.lupa.id, character.mornye.id],
      },
    ],
    guideSkillOrder: ["liberation", "forte", "skill", "outro", "basic"],
  },
  jianxin: {
    guideMainEcho: "H72",
    guideWeapons: [weapon.rectifier.rectifier101.id],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.iuno.id, character.shorekeeper.id],
      },
    ],
    guideSkillOrder: ["liberation", "forte", "basic", "skill", "outro"],
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
    guideSkillOrder: ["forte", "liberation", "outro", "skill", "basic"],
  },
  sanhua: {
    guideMainEcho: "H72",
    guideWeapons: [weapon.sword.sword001.id],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.camellya.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.brant.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.luuk_herssen.id, character.shorekeeper.id],
      },
    ],
    guideSkillOrder: ["forte", "liberation", "skill", "outro", "basic"],
  },
  baizhi: {
    guideMainEcho: "X78",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.zani.id, character.phoebe.id],
      },
      {
        nameKey: "temporary",
        characters: [character.phoebe.id, character.rover_spectro.id],
      },
      {
        nameKey: "temporary",
        characters: [character.changli.id, character.brant.id],
      },
      {
        nameKey: "temporary",
        characters: [character.changli.id, character.lupa.id],
      },
      {
        nameKey: "temporary",
        characters: [character.carlotta.id, character.zhezhi.id],
      },
      {
        nameKey: "temporary",
        characters: [character.camellya.id, character.roccia.id],
      },
      {
        nameKey: "temporary",
        characters: [character.camellya.id, character.sanhua.id],
      },
      {
        nameKey: "temporary",
        characters: [character.jinhsi.id, character.zhezhi.id],
      },
      {
        nameKey: "temporary",
        characters: [character.xiangliyao.id, character.yinlin.id],
      },
      {
        nameKey: "temporary",
        characters: [character.calcharo.id, character.yinlin.id],
      },
      {
        nameKey: "temporary",
        characters: [character.jiyan.id, character.mortefi.id],
      },
      {
        nameKey: "temporary",
        characters: [character.encore.id, character.sanhua.id],
      },
      {
        nameKey: "temporary",
        characters: [character.lucy.id, character.rebecca.id],
      },
      {
        nameKey: "temporary",
        characters: [character.chixia.id, character.yangyang.id],
      },
      {
        nameKey: "temporary",
        characters: [character.rover_spectro.id, character.yangyang.id],
      },
    ],
    guideSkillOrder: ["liberation", "skill", "forte", "outro", "basic"],
  },
  chixia: {
    guideMainEcho: "W77N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.changli.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.changli.id, character.verina.id],
      },
      {
        nameKey: "temporary",
        characters: [character.brant.id, character.lupa.id],
      },
      {
        nameKey: "temporary",
        characters: [character.lupa.id, character.mornye.id],
      },
      {
        nameKey: "temporary",
        characters: [character.brant.id, character.mornye.id],
      },
      {
        nameKey: "temporary",
        characters: [character.yangyang.id, character.baizhi.id],
      },
    ],
    guideSkillOrder: ["forte", "liberation", "basic", "skill", "outro"],
  },
  mortefi: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.augusta.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.augusta.id, character.verina.id],
      },
      {
        nameKey: "temporary",
        characters: [character.phoebe.id, character.rover_spectro.id],
      },
      {
        nameKey: "temporary",
        characters: [character.jinhsi.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.jinhsi.id, character.verina.id],
      },
      {
        nameKey: "temporary",
        characters: [character.jiyan.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.jiyan.id, character.verina.id],
      },
      {
        nameKey: "temporary",
        characters: [character.jiyan.id, character.baizhi.id],
      },
      {
        nameKey: "temporary",
        characters: [character.jiyan.id, character.rover_aero.id],
      },
    ],
    guideSkillOrder: ["liberation", "forte", "basic", "skill", "outro"],
  },
  yuanwu: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.jinhsi.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.jinhsi.id, character.verina.id],
      },
    ],
    guideSkillOrder: ["liberation", "skill", "forte", "outro", "basic"],
  },
  yangyang: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.jiyan.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.jiyan.id, character.verina.id],
      },
      {
        nameKey: "temporary",
        characters: [character.changli.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.chixia.id, character.baizhi.id],
      },
      {
        nameKey: "temporary",
        characters: [character.rover_spectro.id, character.baizhi.id],
      },
    ],
    guideSkillOrder: ["liberation", "skill", "forte", "basic", "outro"],
  },
  aalto: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.jiyan.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.jiyan.id, character.verina.id],
      },
    ],
    guideSkillOrder: ["basic", "forte", "liberation", "skill", "outro"],
  },
  taoqi: {
    guideMainEcho: "H72",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.carlotta.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.carlotta.id, character.verina.id],
      },
      {
        nameKey: "temporary",
        characters: [character.jinhsi.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.changli.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.changli.id, character.verina.id],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "basic", "outro"],
  },
  danjin: {
    guideMainEcho: "H80N",
    guideWeapons: [],
    guideParties: [
      {
        nameKey: "temporary",
        characters: [character.camellya.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.camellya.id, character.verina.id],
      },
      {
        nameKey: "temporary",
        characters: [character.roccia.id, character.shorekeeper.id],
      },
      {
        nameKey: "temporary",
        characters: [character.rover_havoc.id, character.shorekeeper.id],
      },
    ],
    guideSkillOrder: ["forte", "skill", "liberation", "basic", "outro"],
  },
};
