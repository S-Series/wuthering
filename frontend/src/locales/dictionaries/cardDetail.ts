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
    parties: {
      standard: "정석 파티",
      temporary: "추천 조합",
      harmonyBreak: "조화도 파괴 파티",
      //=========================
      fusionAnomaly: "불꽃 이상효과 파티",
      glacioAnomaly: "서리 이상효과 파티",
      aeroAnomaly: "풍식 이상효과 파티",
      spectroAnomaly: "광학 이상효과 파티",
      havocAnomaly: "암흑 이상효과 파티",
      //=========================
      echoDamageAmp: "에코 피해 증폭 파티",
      basicAttackAmp: "일반공격 피해 증폭 파티",
      skillDamageAmp: "스킬 피해 증폭 파티",
      //=========================
      concertoCluster: "조화도 밀집 파티",
      concertoWave: "조화도 파동 파티",
      linmoEngine: "린모 엔진 파티",
      hypercarryMainDps: "하이퍼캐리 메인딜러",
      //=========================
      secondSlotSupport: "2번 자리 서포터",
      thirdSlotSupport: "3번 자리 서포터",
      //=========================
      teamCore: "조합 핵심 캐릭터",
      teamDps: "조합 딜러",
      aeroDps: "기류 딜러 조합",
      //=========================
      cyberpunk: "사이버펑크 파티",
      quickswap: "퀵스왑 파츠",
      //=========================
      alternative: "대체 캐릭터",
      budgetAlternatives: "가성비 대체 캐릭",
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
    parties: {
      standard: "Standard Party",
      temporary: "Recommended Team",
      harmonyBreak: "Tune Break Party",
      //=========================
      fusionAnomaly: "Fusion Anomaly Party",
      glacioAnomaly: "Glacio Anomaly Party",
      aeroAnomaly: "Aero Anomaly Party",
      spectroAnomaly: "Spectro Anomaly Party",
      havocAnomaly: "Havoc Anomaly Party",
      //=========================
      echoDamageAmp: "Echo DMG Amp Party",
      basicAttackAmp: "Basic Attack DMG Amp Party",
      skillDamageAmp: "Skill DMG Amp Party",
      //=========================
      concertoCluster: "Concerto Cluster Party",
      concertoWave: "Concerto Wave Party",
      linmoEngine: "Lyn-Mo Engine Party",
      hypercarryMainDps: "Hypercarry Main DPS",
      //=========================
      secondSlotSupport: "Slot 2 Support",
      thirdSlotSupport: "Slot 3 Support",
      //=========================
      teamCore: "Team Core",
      teamDps: "Team DPS",
      aeroDps: "Aero DPS Team",
      //=========================
      cyberpunk: "Cyberpunk Party",
      quickswap: "Quickswap Piece",
      //=========================
      alternative: "Alternative Character",
      budgetAlternatives: "Budget Alternatives",
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
    parties: {
      standard: "基本編成",
      temporary: "おすすめ編成",
      harmonyBreak: "協奏度破壊編成",
      //=========================
      fusionAnomaly: "焦熱異常編成",
      glacioAnomaly: "凝縮異常編成",
      aeroAnomaly: "気動異常編成",
      spectroAnomaly: "回折異常編成",
      havocAnomaly: "消滅異常編成",
      //=========================
      echoDamageAmp: "音骸ダメージ強化編成",
      basicAttackAmp: "通常攻撃ダメージ強化編成",
      skillDamageAmp: "スキルダメージ強化編成",
      //=========================
      concertoCluster: "協奏度集中編成",
      concertoWave: "協奏度波動編成",
      linmoEngine: "リンモエンジン編成",
      hypercarryMainDps: "ハイパーキャリーメインDPS",
      //=========================
      secondSlotSupport: "2枠目サポーター",
      thirdSlotSupport: "3枠目サポーター",
      //=========================
      teamCore: "編成コア",
      teamDps: "編成DPS",
      aeroDps: "気動DPS編成",
      //=========================
      cyberpunk: "サイバーパンク編成",
      quickswap: "クイックスワップ枠",
      //=========================
      alternative: "代替キャラクター",
      budgetAlternatives: "低コスト代替",
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
    parties: {
      standard: "标准配队",
      temporary: "推荐配队",
      harmonyBreak: "协奏值破坏队",
      //=========================
      fusionAnomaly: "热熔异常队",
      glacioAnomaly: "冷凝异常队",
      aeroAnomaly: "气动异常队",
      spectroAnomaly: "衍射异常队",
      havocAnomaly: "湮灭异常队",
      //=========================
      echoDamageAmp: "声骸伤害增幅队",
      basicAttackAmp: "普攻伤害增幅队",
      skillDamageAmp: "技能伤害增幅队",
      //=========================
      concertoCluster: "协奏值聚集队",
      concertoWave: "协奏值波动队",
      linmoEngine: "林莫引擎队",
      hypercarryMainDps: "单核主C",
      //=========================
      secondSlotSupport: "2号位辅助",
      thirdSlotSupport: "3号位辅助",
      //=========================
      teamCore: "组合核心",
      teamDps: "组合输出",
      aeroDps: "气动输出队",
      //=========================
      cyberpunk: "赛博朋克队",
      quickswap: "速切组件",
      //=========================
      alternative: "替代角色",
      budgetAlternatives: "低成本替代",
    },
  },
} satisfies Record<LangType, LocaleSchema["cardDetail"]>;
