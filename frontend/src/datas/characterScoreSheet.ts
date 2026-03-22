import type { EchoRuntime } from "@/runtime/echo.runtime";
import type { CharacterId } from "./characterStats";
import { FixedStats, type StatId } from "./stats";
import type { WeaponId } from "./weapon";

type StatWeightMap = Partial<Record<StatId, number>>;
interface CharacterScore extends StatWeightMap {
  maxResCount: number;
  //notSigWeaponComp: number;
  scoreComp?: number;
}

export const characterScoreSheet: Record<CharacterId, CharacterScore> = {
  sigrika: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 3.0,
    [FixedStats.critDmg.id]: 1.5,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1.2,
    maxResCount: 5,
  },
  luuk_herssen: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 1.5,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1.1,
    maxResCount: 4,
  },
  aemeath: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0.25,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 1.25,

    [FixedStats.resonanceBns.id]: 1.2,
    maxResCount: 3,
  },
  mornye: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 0,
    [FixedStats.defPct.id]: 1.0,

    [FixedStats.critRate.id]: 1.5,
    [FixedStats.critDmg.id]: 1,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 1.0,

    [FixedStats.resonanceBns.id]: 2,
    maxResCount: 5,
  },
  lynae: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 1.1,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0.2,
    [FixedStats.liberationBns.id]: 0.2,

    [FixedStats.resonanceBns.id]: 1.2,
    maxResCount: 3,
  },
  chisa: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 1.2,

    [FixedStats.resonanceBns.id]: 1.2,
    maxResCount: 4,
  },
  buling: {
    [FixedStats.hpPct.id]: 1.0,
    [FixedStats.atkPct.id]: 0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 1.0,
    [FixedStats.critDmg.id]: 0.5,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.2,
    maxResCount: 5,
  },
  //* ===========================================================
  aalto: {
    [FixedStats.atkPct.id]: 1.0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,


    [FixedStats.basicBns.id]: 0.25,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 1.0,
    [FixedStats.liberationBns.id]: 0.25,


    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  baizhi: {
    [FixedStats.hpPct.id]: 2.0,

    [FixedStats.liberationBns.id]: 0.5,
    

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 5,
  },
  brant: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 0.8,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,


    [FixedStats.basicBns.id]: 1.1,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0.2,


    [FixedStats.resonanceBns.id]: 1.5,
    maxResCount: 5,
  },
  calcharo: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0.3,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0.1,
    [FixedStats.liberationBns.id]: 1.1,


    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  camellya: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 1.15,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0.35,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 2,
  },
  cantarella: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 1.0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  carlotta: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 1.5,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  changli: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 1.1,
    [FixedStats.liberationBns.id]: 0.4,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 2,
  },
  chiaccona: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 1.0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  chixia: { //치샤
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 1.0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 0.5,
    maxResCount: 3,
  },
  danjin: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 1.0,
    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 2,
  },
  encore: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 1.0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 2,
  },
  jianxin: { //감심
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  jinhsi: { //그뫼엥
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.25,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 1.2,
    [FixedStats.liberationBns.id]: 0.6,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 2,
  },
  jiyan: { //기염
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  lingyang: { //능ㅋㅋ
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 1.0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 1,
  },
  lumi: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 1.0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 2,
  },
  mortefi: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 1.0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  phoebe: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  roccia: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  rover_spectro: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  rover_havoc: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  rover_aero: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  sanhua: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 1.0,

    [FixedStats.resonanceBns.id]: 0.5,
    maxResCount: 1,
  },
  shorekeeper: {
    [FixedStats.hpPct.id]: 2.0,
    [FixedStats.atkPct.id]: 0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 0,
    [FixedStats.critDmg.id]: 1.0,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 1.0,

    [FixedStats.resonanceBns.id]: 2.0,
    maxResCount: 5,
  },
  taoqi: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 0,
    [FixedStats.defPct.id]: 2.0,

    [FixedStats.critRate.id]: 1.5,
    [FixedStats.critDmg.id]: 0.75,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 1.0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  verina: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 1.5,
    [FixedStats.critDmg.id]: 0.75,

    [FixedStats.basicBns.id]: 0.3,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0.3,
    [FixedStats.liberationBns.id]: 0.3,

    [FixedStats.resonanceBns.id]: 2.0,
    maxResCount: 5,
  },
  xiangliyao: { //큐브남
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0.1,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0.3,
    [FixedStats.liberationBns.id]: 1.1,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 2,
  },
  yangyang: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0.5,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 5,
  },
  yinlin: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 1.0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  youhu: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 1.0,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1.5,
    maxResCount: 5,
  },
  yuanwu: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 0,
    [FixedStats.defPct.id]: 1.0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 5,
  },
  zani: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0.1,
    [FixedStats.liberationBns.id]: 0.4,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  zhezhi: { //ㅈㅈ
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 1.0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  cartethyia: {
    [FixedStats.hpPct.id]: 1.5,
    [FixedStats.atkPct.id]: 0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 1.0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  lupa: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0.1,
    [FixedStats.heavyBns.id]: 0.1,
    [FixedStats.skillBns.id]: 0.2,
    [FixedStats.liberationBns.id]: 1.1,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  phrolova: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0.1,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 1.4,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 0,
    maxResCount: 0,
  },
  augusta: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 0.6,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 1.5,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  iuno: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0.3,
    [FixedStats.liberationBns.id]: 1.2,

    [FixedStats.resonanceBns.id]: 1.1,
    maxResCount: 4,
  },
  galbrena: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2.5,
    [FixedStats.critDmg.id]: 1.25,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 2,
  },
  qiuyuan: {
    [FixedStats.hpPct.id]: 0,
    [FixedStats.atkPct.id]: 1,
    [FixedStats.defPct.id]: 0,

    [FixedStats.critRate.id]: 2,
    [FixedStats.critDmg.id]: 1,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 1,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 0,

    [FixedStats.resonanceBns.id]: 1,
    maxResCount: 3,
  },
} as const;

export function getCharacterScore(
  characterId: CharacterId,
  weaponId: WeaponId | null,
  constell: number,
  echoData: [EchoRuntime,EchoRuntime,EchoRuntime,EchoRuntime,EchoRuntime],
): CharacterScore {
  const base = characterScoreSheet[characterId];

  if (!base) throw new Error(`Unknown characterId: ${characterId}`);

  const result: CharacterScore = {...base};

  switch (characterId) {

    //$ Cost3 Res Option
    case "sigrika": {
      const cost3MainOptionResCount =
        echoData
          ?.filter(
            (item) =>
              item.cost === 3 &&
              item.mainOption.statId === FixedStats.resonanceBns.id
          ).length ?? 0;

      if (cost3MainOptionResCount >= 1){
        result[FixedStats.resonanceBns.id] = 1;
        result["maxResCount"] = 2;
        result["scoreComp"] = -30;
      }
      break;
    }
    case "brant": {
      const cost3MainOptionResCount =
        echoData
          ?.filter(
            (item) =>
              item.cost === 3 &&
              item.mainOption.statId === FixedStats.resonanceBns.id
          ).length ?? 0;

      if (cost3MainOptionResCount >= 2){
        if (weaponId === "sword004") { // 브랜트 전무
          result[FixedStats.resonanceBns.id] = 1;
          result["maxResCount"] = 3;
        }
        result["scoreComp"] = -24;
      }
      break;
    }

    //$ Constell
    case "iuno": { //유노 1돌+
      if (constell >= 1) {
        result[FixedStats.resonanceBns.id] = 1;
        result["maxResCount"] = 2;
      }
      break;
    }
    case "encore": { //앙코 2돌+
      if (constell >= 2) {
        result["maxResCount"] = 1;
      }
      break;
    }
    case "zhezhi": { //절지 1돌+ 
      if (constell >= 1) {
        result["maxResCount"] = 3;
      }
      break;
    }
    case "yinlin": { //음림 2돌+
      if (constell >= 2) {
        result["maxResCount"] = 3;
      }
      break;
    }
    case "calcharo": { //카카루 1돌+
      if (constell >= 2) {
        result["maxResCount"] = 2;
      }
      break;
    }
  }

  return result;
}
