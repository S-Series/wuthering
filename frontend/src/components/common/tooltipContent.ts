import { character } from "@/datas/characters";
import { getCharacterMeta } from "@/datas/characters.meta";
import { characterConstellStats, type CharacterConstell } from "@/datas/characterConstellStats";
import type { CharacterId } from "@/datas/characterStats";
import { echoDict } from "@/datas/echos";
import { harmony } from "@/datas/harmonies";
import { FixedStats, type StatId } from "@/datas/stats";
import { weaponDict } from "@/datas/weapon";
import { weaponStat } from "@/datas/weaponStats";
import { locale } from "@/locales/locale";
import type { LangType } from "@/stores/appStore";
import type { CritRateBudget } from "@/runtime/critRateScore.helpers";

export type TooltipContent = { title: string; description?: string; lines?: string[] };
export type TooltipContext = { lang: LangType; characterId: CharacterId; chain: number; refinement: number; weaponId?: string | null; critRateBudget?: CritRateBudget };
const langs = ["kr", "en", "jp", "zh"] as const;
const tr = (lang: LangType, ...text: [string, string, string, string]) => text[langs.indexOf(lang)];
const valid = <T extends object>(object: T, key: string): key is Extract<keyof T, string> => Object.prototype.hasOwnProperty.call(object, key);
export const formatInfoStat = (id: string, value: number) => `${Number(value.toFixed(1)).toLocaleString()}${/crit|Pct|Bns/.test(id) ? "%" : ""}`;

export function critScoreTooltipLines(budget: CritRateBudget, lang: LangType): string[] {
  const pct = (value: number) => `${Number(value.toFixed(2))}%`;
  return [
    tr(lang, `부옵 외 크리티컬: ${pct(budget.fixed)}`, `Crit rate outside substats: ${pct(budget.fixed)}`, `サブ以外の会心率: ${pct(budget.fixed)}`, `副词条以外的暴击率: ${pct(budget.fixed)}`),
    tr(lang, `유효 부옵 상한: ${pct(budget.available)} / 최대 ${pct(budget.maximum)}`, `Useful substat cap: ${pct(budget.available)} / maximum ${pct(budget.maximum)}`, `有効サブ上限: ${pct(budget.available)} / 最大 ${pct(budget.maximum)}`, `有效副词条上限: ${pct(budget.available)} / 最高 ${pct(budget.maximum)}`),
    tr(lang, `장착 부옵 ${pct(budget.substats)} → 유효 ${pct(budget.effective)} · 초과 ${pct(budget.wasted)}`, `Equipped subs ${pct(budget.substats)} → effective ${pct(budget.effective)} · wasted ${pct(budget.wasted)}`, `装備サブ ${pct(budget.substats)} → 有効 ${pct(budget.effective)} · 超過 ${pct(budget.wasted)}`, `已装备副词条 ${pct(budget.substats)} → 有效 ${pct(budget.effective)} · 溢出 ${pct(budget.wasted)}`),
    tr(lang, "100% 초과 부옵과 해당 쌍크리 보너스를 제외하고, 가능한 유효 옵션을 기준으로 500점 환산합니다. 개별 에코 점수는 단독 평가입니다.", "Substat crit above 100% and its paired-crit bonus are excluded. The best usable rolls define 500 points; individual Echo scores are standalone ratings.", "100%を超えるサブ会心率と対応する会心ペア加点を除外し、有効な構成を500点に換算します。個別エコーは単独評価です。", "排除超过100%的副词条暴击率及对应双暴加分，以有效配置折算500分。单个声骸为独立评分。"),
  ];
}

export function statTooltip(id: string, lang: LangType): TooltipContent | null {
  if (!valid(FixedStats, id) || id === "dummy") return null;
  const descriptions = {
    hp: tr(lang, "캐릭터의 최종 HP입니다. HP 계수를 사용하는 캐릭터의 능력에도 영향을 줍니다.", "Final HP. Also affects abilities that scale with HP.", "最終HPです。HPを参照する能力にも影響します。", "角色最终生命值，也影响按生命值计算的能力。"),
    atk: tr(lang, "캐릭터·무기의 기초 공격력에 공격력%와 고정 공격력, 장비 효과를 합산한 수치입니다.", "Character and weapon base ATK plus percentage, flat and equipment bonuses.", "キャラクター・武器の基礎攻撃力に割合・固定値・装備効果を合算した値です。", "角色和武器基础攻击力，加上百分比、固定值及装备效果。"),
    def: tr(lang, "캐릭터의 최종 방어력입니다. 방어력 계수를 사용하는 캐릭터의 능력에도 영향을 줍니다.", "Final DEF. Also affects abilities that scale with DEF.", "最終防御力です。防御力を参照する能力にも影響します。", "角色最终防御力，也影响按防御力计算的能力。"),
    resonanceBns: tr(lang, "공명 에너지 충전 효율입니다. 캐릭터와 운용에 따라 필요한 수치가 다릅니다.", "Resonance Energy regeneration efficiency. Requirements depend on the character and rotation.", "共鳴エネルギーの獲得効率です。必要値はキャラクターと運用によって異なります。", "共鸣能量回复效率，需求随角色和输出循环而变化。"),
    critRate: tr(lang, "공격이 크리티컬로 적중할 확률입니다. 100%를 넘는 부분은 크리티컬 확률을 더 높이지 않습니다.", "Chance to land a critical hit. Values above 100% do not increase the chance further.", "クリティカルが発生する確率です。100%を超えても発生確率は上がりません。", "攻击触发暴击的概率，超过100%的部分不会继续提高概率。"),
    critDmg: tr(lang, "크리티컬 적중 시 적용되는 피해 배율입니다. 예를 들어 200%는 기본 피해의 2배입니다.", "Damage multiplier on a critical hit. For example, 200% means twice the base damage.", "クリティカル時のダメージ倍率です。200%なら元のダメージの2倍です。", "暴击时的伤害倍率，例如200%表示原伤害的2倍。"),
  };
  let description: string;
  if (valid(descriptions, id)) description = descriptions[id];
  else if (id.endsWith("Pct")) description = tr(lang, "기초 능력치를 기준으로 적용되는 퍼센트 증가 옵션입니다.", "Percentage bonus applied to the corresponding base stat.", "対応する基礎能力値に掛かる割合ボーナスです。", "按对应基础属性计算的百分比加成。" );
  else description = tr(lang, "해당 속성·공격 유형 또는 치유에 적용되는 보너스입니다. 조건에 맞는 효과에 반영됩니다.", "Bonus for the indicated element, attack type or healing. Applies to matching effects.", "該当する属性・攻撃タイプ・回復へのボーナスです。", "对应属性、攻击类型或治疗的加成，作用于符合条件的效果。" );
  return { title: FixedStats[id][lang], description };
}

export function gameTooltip(kind: string, id: string, context: TooltipContext): TooltipContent | null {
  const { lang, characterId, chain, refinement } = context;
  const values = (stats: readonly { statId: StatId; value: number }[]) => stats.filter(s => s.statId !== "dummy" && s.value !== 0).map(s => `${FixedStats[s.statId][lang]} +${formatInfoStat(s.statId, s.value)}`);
  if (kind === "stat") return statTooltip(id, lang);
  if (kind === "refinement") {
    const level = Number(id);
    if (!Number.isInteger(level) || level < 1 || level > 5) return null;
    const weapon = context.weaponId ? gameTooltip("weapon", context.weaponId, { ...context, refinement: level }) : null;
    return { title: `${weapon?.title ?? "Weapon"} · R${level}`, description: tr(lang, "무기 공진 단계를 설정합니다. 아래 옵션은 이 단계를 선택했을 때의 계산값입니다.", "Set weapon refinement. The options below preview this rank.", "武器のランクを設定します。以下はこのランクでの計算値です。", "设置武器谐振等级，下方预览此等级的计算值。"), lines: weapon?.lines };
  }
  if (kind === "character" && valid(character, id)) {
    const item = character[id];
    const meta = getCharacterMeta(id, id === characterId ? chain : 0);
    return { title: item[lang], lines: [tr(lang, `유효 스탯: ${FixedStats[meta.statType][lang]}`, `Scaling stat: ${FixedStats[meta.statType][lang]}`, `有効ステータス: ${FixedStats[meta.statType][lang]}`, `有效属性：${FixedStats[meta.statType][lang]}`), tr(lang, `권장 공명 효율 ${meta.resReq}%`, `Recommended Energy Regen ${meta.resReq}%`, `推奨共鳴効率 ${meta.resReq}%`, `推荐共鸣效率 ${meta.resReq}%`)] };
  }
  if (kind === "weapon" && valid(weaponDict, id)) {
    const stats = weaponStat[id];
    const r = id === context.weaponId ? Math.max(1, refinement) : 1;
    return { title: weaponDict[id][lang], description: tr(lang, "최대 레벨 기준으로 사이트 계산에 반영하는 옵션입니다.", "Options included in this site's calculations at maximum level.", "最大レベルでサイトの計算に反映する効果です。", "按满级展示本站计算中计入的属性。"), lines: [
      `${FixedStats.atk[lang]} ${stats.atk}`,
      ...values([{ statId: stats.statType[0], value: stats.value[0] }]),
      ...values([{ statId: stats.statType[1], value: stats.value[1] * (1 + (r - 1) * 0.25) }]).map(s => `R${r} · ${s}`),
    ] };
  }
  if (kind === "echo") {
    const item = Object.values(echoDict).map(cost => valid(cost, id) ? cost[id] : undefined).find(Boolean);
    if (!item) return null;
    return { title: item[lang], description: tr(lang, "메인 슬롯에 장착했을 때 계산에 반영하는 효과입니다.", "Effects included in the calculation when equipped in the main slot.", "メインスロット装備時に計算へ反映する効果です。", "装备在主声骸位置时计入的效果。"), lines: values(item.getStats(characterId)) };
  }
  if (kind === "harmony" && valid(harmony, id)) {
    const item = harmony[id];
    return { title: item[lang], description: tr(lang, "필요한 세트 수를 충족하면 계산에 반영되는 효과입니다.", "Calculated effects when the required set count is equipped.", "必要セット数を満たすと計算に反映する効果です。", "装备达到所需件数时计入的效果。"), lines: item.option.flatMap(option => values(option.options).map(s => `${option.count} · ${s}`)) };
  }
  if (kind === "chain") {
    const level = Number(id);
    if (!Number.isInteger(level) || level < 0 || level > 6) return null;
    const effects = characterConstellStats[characterId]?.[level as CharacterConstell] ?? [];
    return { title: `${character[characterId][lang]} · C${level}`, description: tr(lang, "이 단계까지 돌파를 설정합니다. 전용 공격·고정값 효과는 전체 스탯에 합산하지 않습니다.", "Set the Resonance Chain to this level. Attack-specific and fixed-value effects are not added to general stats.", "この段階まで共鳴チェーンを設定します。特定攻撃・固定値の効果は全体ステータスに加算しません。", "设定到此共鸣链层数。专属攻击及固定数值效果不计入通用属性。"), lines: effects.flatMap(effect => [effect.note, ...(["specific", "fixed", "unknown"].includes(effect.scope) ? [] : values(effect.stats))].filter((s): s is string => Boolean(s))) };
  }
  if (kind === "skill" && valid(locale(lang).cardDetail.skills, id)) return {
    title: locale(lang).cardDetail.skills[id],
    description: tr(lang, "추천 스킬 강화 우선순위입니다. 왼쪽부터 먼저 강화할 스킬을 표시합니다.", "Recommended skill upgrade priority, from left to right.", "おすすめのスキル強化順です。左から優先します。", "推荐技能升级顺序，从左到右优先。"),
  };
  return null;
}

export function actionTooltip(label: string, context: TooltipContext): TooltipContent {
  const { lang } = context;
  const text = locale(lang).card;
  const entries: [string, string][] = [
    [text.characterWeaponData, tr(lang, "캐릭터와 무기를 선택하고 돌파·공진 단계를 설정합니다.", "Choose a character and weapon, then set Chain and refinement levels.", "キャラクター・武器と共鳴チェーン・ランクを設定します。", "选择角色、武器及共鸣链和谐振等级。")],
    [text.oMenu, tr(lang, "장착·예비 에코를 편집하고 드래그로 배치합니다. 스크린샷 OCR 입력도 여기서 사용합니다.", "Edit and reorder equipped and spare Echoes. Screenshot OCR input is available here.", "装備・予備音骸の編集と並べ替え、画像OCR入力を行います。", "编辑和拖动装备、备用声骸，也可使用截图OCR输入。")],
    [text.cloudSync, text.cloudSyncDescription],
    [text.cloudSyncUpload, text.cloudSyncUploadDescription],
    [text.cloudSyncDownload, text.cloudSyncDownloadDescription],
    [text.request, tr(lang, "현재 캐릭터·무기·에코 세팅과 이미지로 공유용 스펙 카드를 생성합니다.", "Generate a shareable card from the current build and images.", "現在の装備と画像から共有用カードを生成します。", "使用当前配装与图片生成可分享的属性卡。")],
    [text.download, tr(lang, "생성한 스펙 카드 이미지를 기기에 저장합니다. 먼저 이미지 생성을 완료하세요.", "Save the generated card image to your device. Generate an image first.", "生成済みカード画像を端末に保存します。先に画像を生成してください。", "将已生成的属性卡保存到设备，请先生成图片。")],
    [text.help, tr(lang, "스펙 카드 화면의 기능을 단계별로 안내합니다.", "Walk through the card editor's features step by step.", "カード画面の機能を順番に案内します。", "逐步介绍属性卡编辑器的功能。")],
    [text.scoreboard, tr(lang, "에코 점수 평가 기준표를 새 창으로 엽니다.", "Open the Echo scoring reference in a new tab.", "音骸の評価基準を新しいタブで開きます。", "在新标签页打开声骸评分标准。")],
  ];
  const normalized = label.replace(/\s+/g, " ").trim();
  const undecorated = (value: string) => value.replace(/^[ⓘ§\s]+|[↗\s]+$/g, "");
  const comparable = undecorated(normalized);
  const found = entries.find(([key]) => comparable === undecorated(key) || comparable.startsWith(undecorated(key) + " "));
  return { title: normalized, description: found?.[1] };
}

export function imageTooltip(src: string, context: TooltipContext): TooltipContent | null {
  const path = src.split(/[?#]/)[0];
  const stat = path.match(/\/ico\/stats\/([^/]+)\./)?.[1];
  if (stat) return gameTooltip("stat", stat, context) ?? gameTooltip("skill", stat, context);
  const set = path.match(/\/ico\/harmony\/([^/]+)\./)?.[1];
  if (set) return gameTooltip("harmony", set, context);
  const echo = path.match(/\/ico\/echos\/(?:[^/]+\/)?([^/]+)\./)?.[1];
  if (echo) return gameTooltip("echo", echo, context);
  const char = path.match(/\/character\/([^/]+)\//)?.[1];
  if (char) return gameTooltip("character", char === "rover" ? (context.characterId.startsWith("rover_") ? context.characterId : "rover_spectro") : char, context);
  const weapon = path.match(/\/weapon\/[^/]+\/([^/]+)\./)?.[1];
  if (weapon) {
    const entry = Object.values(weaponDict).find(item => item.imgKey === weapon && path.includes(`/weapon/${item.id.replace(/\d+$/, "")}/`));
    if (entry) return gameTooltip("weapon", entry.id, context);
  }
  return null;
}

export function enumTooltip(id: string, lang: LangType): TooltipContent | null {
  const elements: Record<string, string> = { aero: "aeroBns", fusion: "fusionBns", glacio: "glacioBns", electro: "electroBns", havoc: "havocBns", spectro: "spectroBns" };
  if (valid(elements, id)) return { title: FixedStats[elements[id] as StatId][lang].replace(/ 피해보너스| DMG Bonus|ダメージアップ|伤害加成/g, ""), description: tr(lang, "이 속성의 캐릭터를 필터링합니다.", "Filter characters by this element.", "この属性のキャラクターを絞り込みます。", "筛选此属性的角色。") };
  const weapons = { sword: ["직검", "Sword", "迅刀", "迅刀"], broadblade: ["대검", "Broadblade", "長刃", "长刃"], gauntlet: ["권갑", "Gauntlets", "手甲", "臂铠"], pistol: ["권총", "Pistols", "拳銃", "佩枪"], rectifier: ["증폭기", "Rectifier", "増幅器", "音感仪"] };
  if (valid(weapons, id)) return { title: weapons[id][langs.indexOf(lang)], description: tr(lang, "이 무기 유형의 캐릭터를 필터링합니다.", "Filter characters by this weapon type.", "この武器種のキャラクターを絞り込みます。", "筛选使用此武器类型的角色。") };
  return null;
}

export const tooltipCopy = (lang: LangType) => ({
  unavailable: tr(lang, "현재 상태에서는 사용할 수 없습니다.", "Unavailable in the current state.", "現在の状態では使用できません。", "当前状态下不可用。"),
  input: tr(lang, "이 항목의 값을 입력하거나 수정합니다.", "Enter or edit this field.", "この項目を入力・編集します。", "输入或修改此项。"),
  select: tr(lang, "목록을 열어 원하는 값을 선택합니다.", "Open the list to select a value.", "一覧から値を選択します。", "打开列表选择选项。"),
  close: tr(lang, "현재 창을 닫습니다.", "Close this panel.", "この画面を閉じます。", "关闭当前窗口。"),
  menu: tr(lang, "사이트 메뉴를 열거나 닫습니다.", "Open or close the site menu.", "サイトメニューを開閉します。", "打开或关闭网站菜单。"),
  theme: tr(lang, "밝은 테마와 어두운 테마를 전환합니다.", "Switch between light and dark themes.", "ライト・ダークテーマを切り替えます。", "切换浅色和深色主题。"),
  language: tr(lang, "사이트 표시 언어를 선택합니다.", "Choose the site's display language.", "サイトの表示言語を選択します。", "选择网站显示语言。"),
  image: tr(lang, "클릭해서 이미지를 바꾸고, 드래그로 위치·휠로 크기를 조절합니다.", "Click to replace the image. Drag to move it and use the wheel to zoom.", "クリックで画像を変更、ドラッグで移動、ホイールで拡大縮小します。", "点击替换图片，拖动调整位置，滚轮缩放。"),
  cv: tr(lang, "에코 부옵의 크리티컬 × 2 + 크리티컬 피해로 계산하는 크리티컬 점수입니다.", "Critical Value: Echo substat Crit Rate × 2 + Crit DMG.", "音骸サブステータスのクリティカル率×2＋クリティカルダメージです。", "声骸副属性的暴击率×2＋暴击伤害。"),
  tv: tr(lang, "캐릭터별 유효 옵션 가중치와 세팅 보정을 반영한 종합점수입니다. 실제 전투 DPS와는 다릅니다.", "Build score based on character-specific stat weights and adjustments; not actual combat DPS.", "キャラクター別の有効ステータスと補正による総合スコアです。戦闘DPSではありません。", "按角色有效属性权重及配装修正计算的综合评分，不代表实战DPS。"),
  characters: tr(lang, "캐릭터를 검색·필터링하고 저장된 세팅을 확인합니다.", "Search and filter characters and view saved builds.", "キャラクターの検索・絞り込みと保存済み装備の確認を行います。", "搜索、筛选角色并查看已保存的配装。"),
  card: tr(lang, "캐릭터·무기·에코를 편집하고 공유용 스펙 카드를 만듭니다.", "Edit a build and create a shareable character card.", "キャラクター・武器・音骸を編集して共有用カードを作成します。", "编辑角色、武器及声骸并制作可分享的属性卡。"),
  board: tr(lang, "게시글을 읽고 의견을 나누는 게시판을 엽니다.", "Open community posts and discussions.", "投稿と意見交換の掲示板を開きます。", "打开帖子及讨论社区。"),
  profile: tr(lang, "로그인과 계정·게임 프로필 정보를 관리합니다.", "Sign in and manage account and game profile information.", "ログインとアカウント・ゲームプロフィールを管理します。", "登录并管理账号和游戏资料。"),
  home: tr(lang, "공지사항, 업데이트와 게임 콘텐츠 정보를 확인합니다.", "View notices, updates and game content information.", "お知らせ・更新・ゲームコンテンツ情報を確認します。", "查看公告、更新及游戏内容信息。"),
  rank: tr(lang, "종합점수에 따른 등급입니다. 에코 점수표에서 평가 기준을 확인할 수 있습니다.", "Grade based on the build score. See the Echo scoring reference for thresholds.", "総合スコアによるランクです。評価基準は音骸スコア表で確認できます。", "按综合评分划分的等级，可在声骸评分表查看标准。"),
});
