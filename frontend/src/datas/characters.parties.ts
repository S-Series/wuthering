import type { PartyNameKey } from "@/locales/locale.schema";
import type { CharacterId } from "./characterStats";

export type PartyCharacterId = CharacterId | "rover_electro";

export type RecommendedParty = {
  nameKey: PartyNameKey;
  characters: [PartyCharacterId, PartyCharacterId, PartyCharacterId];
};

export const recommendedPartyData: RecommendedParty[] = [
  {
    nameKey: "concertoCluster",
    characters: ["qingxiao", "denia", "mornye"],
  },
  {
    nameKey: "havocAnomaly",
    characters: ["suisui", "xuanling", "chisa"],
  },
  {
    nameKey: "glacioAnomaly",
    characters: ["suisui", "hiyuki", "lucilla"],
  },
  {
    nameKey: "havocAnomaly",
    characters: ["xuanling", "rover_havoc", "chisa"],
  },
  {
    nameKey: "glacioAnomaly",
    characters: ["lucilla", "hiyuki", "chisa"],
  },
  {
    nameKey: "echoDamageAmp",
    characters: ["lucilla", "sigrika", "shorekeeper"],
  },
  {
    nameKey: "cyberpunk",
    characters: ["lucy", "rebecca", "shorekeeper"],
  },
  {
    nameKey: "fusionAnomaly",
    characters: ["denia", "aemeath", "chisa"],
  },
  {
    nameKey: "concertoCluster",
    characters: ["denia", "luuk_herssen", "mornye"],
  },
  {
    nameKey: "linmoEngine",
    characters: ["hiyuki", "lynae", "mornye"],
  },
  {
    nameKey: "echoDamageAmp",
    characters: ["sigrika", "qiuyuan", "shorekeeper"],
  },
  {
    nameKey: "linmoEngine",
    characters: ["luuk_herssen", "lynae", "mornye"],
  },
  {
    nameKey: "basicAttackAmp",
    characters: ["luuk_herssen", "sanhua", "shorekeeper"],
  },
  {
    nameKey: "aeroAnomaly",
    characters: ["chisa", "cartethyia", "chiaccona"],
  },
  {
    nameKey: "echoDamageAmp",
    characters: ["qiuyuan", "galbrena", "shorekeeper"],
  },
  {
    nameKey: "echoDamageAmp",
    characters: ["qiuyuan", "phrolova", "cantarella"],
  },
  {
    nameKey: "temporary",
    characters: ["galbrena", "lupa", "changli"],
  },
  {
    nameKey: "standard",
    characters: ["iuno", "augusta", "shorekeeper"],
  },
  {
    nameKey: "linmoEngine",
    characters: ["iuno", "lynae", "mornye"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["iuno", "jianxin", "shorekeeper"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["augusta", "mortefi", "verina"],
  },
  {
    nameKey: "spectroAnomaly",
    characters: ["zani", "phoebe", "rover_spectro"],
  },
  {
    nameKey: "temporary",
    characters: ["rover_aero", "cartethyia", "chiaccona"],
  },
  {
    nameKey: "temporary",
    characters: ["brant", "changli", "lupa"],
  },
  {
    nameKey: "temporary",
    characters: ["brant", "encore", "lupa"],
  },
  {
    nameKey: "temporary",
    characters: ["brant", "sanhua", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["phoebe", "zani", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["phoebe", "rover_spectro", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["roccia", "phrolova", "cantarella"],
  },
  {
    nameKey: "temporary",
    characters: ["roccia", "camellya", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["carlotta", "zhezhi", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["carlotta", "taoqi", "lumi"],
  },
  {
    nameKey: "temporary",
    characters: ["camellya", "sanhua", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["xiangliyao", "yinlin", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["zhezhi", "jinhsi", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["jinhsi", "yinlin", "buling"],
  },
  {
    nameKey: "temporary",
    characters: ["jinhsi", "yuanwu", "buling"],
  },
  {
    nameKey: "temporary",
    characters: ["jiyan", "mortefi", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["jiyan", "yangyang", "shorekeeper"],
  },
  {
    nameKey: "alternative",
    characters: ["jiyan", "aalto", "verina"],
  },
  {
    nameKey: "temporary",
    characters: ["rover_havoc", "roccia", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["rover_havoc", "danjin", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["calcharo", "yinlin", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["encore", "changli", "brant"],
  },
  {
    nameKey: "temporary",
    characters: ["encore", "lupa", "mornye"],
  },
  {
    nameKey: "temporary",
    characters: ["baizhi", "carlotta", "zhezhi"],
  },
  {
    nameKey: "temporary",
    characters: ["baizhi", "camellya", "sanhua"],
  },
  {
    nameKey: "temporary",
    characters: ["baizhi", "jiyan", "mortefi"],
  },
  {
    nameKey: "temporary",
    characters: ["baizhi", "encore", "sanhua"],
  },
  {
    nameKey: "temporary",
    characters: ["baizhi", "lucy", "rebecca"],
  },
  {
    nameKey: "temporary",
    characters: ["chixia", "changli", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["chixia", "brant", "lupa"],
  },
  {
    nameKey: "temporary",
    characters: ["mortefi", "augusta", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["mortefi", "jinhsi", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["mortefi", "jiyan", "verina"],
  },
  {
    nameKey: "temporary",
    characters: ["yuanwu", "jinhsi", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["taoqi", "carlotta", "shorekeeper"],
  },
  {
    nameKey: "temporary",
    characters: ["danjin", "camellya", "shorekeeper"],
  },
  {
    nameKey: "concertoCluster",
    characters: ["qingxiao", "lynae", "mornye"],
  },
  {
    nameKey: "linmoEngine",
    characters: ["aemeath", "lynae", "mornye"],
  },
  {
    nameKey: "temporary",
    characters: ["lingyang", "zhezhi", "shorekeeper"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["lingyang", "sanhua", "verina"],
  },
  {
    nameKey: "temporary",
    characters: ["lingyang", "zhezhi", "youhu"],
  },
  {
    nameKey: "teamDps",
    characters: ["galbrena", "brant", "lupa"],
  },
  {
    nameKey: "standard",
    characters: ["jingran", "iuno", "shorekeeper"],
  },
  {
    nameKey: "alternative",
    characters: ["qingxiao", "lynae", "chiaccona"],
  },
  {
    nameKey: "alternative",
    characters: ["qingxiao", "lynae", "shorekeeper"],
  },
  {
    nameKey: "linmoEngine",
    characters: ["rover_electro", "lynae", "mornye"],
  },
  {
    nameKey: "alternative",
    characters: ["rover_electro", "yinlin", "shorekeeper"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["rover_electro", "sanhua", "verina"],
  },
  {
    nameKey: "teamDps",
    characters: ["jingran", "lupa", "mornye"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["jingran", "mortefi", "verina"],
  },
  {
    nameKey: "alternative",
    characters: ["jingran", "rebecca", "shorekeeper"],
  },
  {
    nameKey: "havocAnomaly",
    characters: ["xuanling", "rebecca", "suisui"],
  },
  {
    nameKey: "fusionAnomaly",
    characters: ["aemeath", "denia", "suisui"],
  },
  {
    nameKey: "fusionAnomaly",
    characters: ["aemeath", "denia", "lupa"],
  },
  {
    nameKey: "teamDps",
    characters: ["aemeath", "lupa", "brant"],
  },
  {
    nameKey: "teamDps",
    characters: ["aemeath", "lupa", "mornye"],
  },
  {
    nameKey: "glacioAnomaly",
    characters: ["hiyuki", "lynae", "suisui"],
  },
  {
    nameKey: "glacioAnomaly",
    characters: ["hiyuki", "lynae", "chisa"],
  },
  {
    nameKey: "echoDamageAmp",
    characters: ["phrolova", "lucilla", "qiuyuan"],
  },
  {
    nameKey: "cyberpunk",
    characters: ["lucy", "rebecca", "mornye"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["lucy", "rebecca", "verina"],
  },
  {
    nameKey: "standard",
    characters: ["jiyan", "iuno", "chiaccona"],
  },
  {
    nameKey: "standard",
    characters: ["jiyan", "iuno", "shorekeeper"],
  },
  {
    nameKey: "standard",
    characters: ["iuno", "chiaccona", "shorekeeper"],
  },
  {
    nameKey: "alternative",
    characters: ["iuno", "lynae", "chiaccona"],
  },
  {
    nameKey: "standard",
    characters: ["iuno", "yinlin", "shorekeeper"],
  },
  {
    nameKey: "teamDps",
    characters: ["galbrena", "lupa", "mornye"],
  },
  {
    nameKey: "alternative",
    characters: ["phrolova", "danjin", "shorekeeper"],
  },
  {
    nameKey: "alternative",
    characters: ["carlotta", "zhezhi", "verina"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["carlotta", "yangyang", "shorekeeper"],
  },
  {
    nameKey: "linmoEngine",
    characters: ["carlotta", "lynae", "mornye"],
  },
  {
    nameKey: "alternative",
    characters: ["carlotta", "lumi", "shorekeeper"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["carlotta", "zhezhi", "buling"],
  },
  {
    nameKey: "alternative",
    characters: ["jinhsi", "zhezhi", "verina"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["phoebe", "sanhua", "rover_spectro"],
  },
  {
    nameKey: "alternative",
    characters: ["jinhsi", "yinlin", "shorekeeper"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["jinhsi", "yuanwu", "verina"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["jinhsi", "mortefi", "verina"],
  },
  {
    nameKey: "alternative",
    characters: ["jinhsi", "zhezhi", "buling"],
  },
  {
    nameKey: "basicAttackAmp",
    characters: ["encore", "sanhua", "shorekeeper"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["encore", "sanhua", "verina"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["camellya", "sanhua", "verina"],
  },
  {
    nameKey: "linmoEngine",
    characters: ["calcharo", "lynae", "mornye"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["calcharo", "yinlin", "verina"],
  },
  {
    nameKey: "linmoEngine",
    characters: ["xiangliyao", "lynae", "mornye"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["xiangliyao", "yinlin", "verina"],
  },
  {
    nameKey: "alternative",
    characters: ["xiangliyao", "changli", "shorekeeper"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["xiangliyao", "yangyang", "verina"],
  },
  {
    nameKey: "teamDps",
    characters: ["chixia", "lupa", "mornye"],
  },
  {
    nameKey: "alternative",
    characters: ["cartethyia", "chiaccona", "shorekeeper"],
  },
  {
    nameKey: "alternative",
    characters: ["rover_havoc", "danjin", "verina"],
  },
  {
    nameKey: "hypercarryMainDps",
    characters: ["lynae", "sanhua", "shorekeeper"],
  },
  {
    nameKey: "alternative",
    characters: ["aalto", "jiyan", "shorekeeper"],
  },
  {
    nameKey: "budgetAlternatives",
    characters: ["baizhi", "zani", "phoebe"],
  },
];

export function getRecommendedParties(characterId: PartyCharacterId): RecommendedParty[] {
  return recommendedPartyData.filter((party) => party.characters.includes(characterId));
}
