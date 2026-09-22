import type { LocaleSchema } from "@/locales/locale.schema";
import type { LangType } from "@/stores/appStore";

export const cardDetail = {
  kr: {
    sections: {
      party: "추천 파티정보",
      skill: "스킬작 우선순위",
      weapon: "추천 무기",
      echo: "추천 에코",
      main: "추천 주옵션",
      sub: "추천 부옵션",
      target: "목표 스탯",
    },
    skills: {
      basic: "일반 공격",
      skill: "공명 스킬",
      liberation: "공명 해방",
      forte: "공명 회로",
      outro: "변주 스킬",
    },
    subStats: {
      priority: "유효 옵션",
      secondary: "반유효 옵션",
    },
  },
  en: {
    sections: {
      party: "Team Recs",
      skill: "Skill Priority",
      weapon: "Weapon Recs",
      echo: "Echo Recs",
      main: "Main Stats",
      sub: "Sub Stats",
      target: "Target Stats",
    },
    skills: {
      basic: "Basic",
      skill: "Skill",
      liberation: "Liberation",
      forte: "Forte",
      outro: "Outro",
    },
    subStats: {
      priority: "Priority",
      secondary: "Secondary",
    },
  },
  jp: {
    sections: {
      party: "おすすめ編成",
      skill: "スキル優先度",
      weapon: "おすすめ武器",
      echo: "おすすめ音骸",
      main: "メインステータス",
      sub: "サブステータス",
      target: "目標ステータス",
    },
    skills: {
      basic: "通常攻撃",
      skill: "共鳴スキル",
      liberation: "共鳴解放",
      forte: "共鳴回路",
      outro: "終奏スキル",
    },
    subStats: {
      priority: "優先オプション",
      secondary: "次点オプション",
    },
  },
  zh: {
    sections: {
      party: "推荐配队",
      skill: "技能优先级",
      weapon: "推荐武器",
      echo: "推荐声骸",
      main: "主词条",
      sub: "副词条",
      target: "目标属性",
    },
    skills: {
      basic: "普攻",
      skill: "共鸣技能",
      liberation: "共鸣解放",
      forte: "共鸣回路",
      outro: "延奏技能",
    },
    subStats: {
      priority: "优先词条",
      secondary: "次选词条",
    },
  },
} satisfies Record<LangType, LocaleSchema["cardDetail"]>;
