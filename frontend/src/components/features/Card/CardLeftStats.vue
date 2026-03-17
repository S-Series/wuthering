<template>
  <div class="card-contents">
    <!-- Header Buttons -->
    <div class="card-contents-slot header">
      <div class="item-slot">
        <button disabled class="card-page-button content top">
          <span>{{ localeText.card.help }}</span>
        </button>
        <button disabled class="card-page-button content top">
          <span>{{ localeText.card.request }}</span>
        </button>
        <button disabled class="card-page-button content top">
          <span>{{ localeText.card.download }}</span>
        </button>
      </div>

      <div class="item-slot">
        <button class="card-page-button content top">
          <span>{{ localeText.card.plate1 }}</span>
        </button>
        <button class="card-page-button content top">
          <span>{{ localeText.card.plate2 }}</span>
        </button>
      </div>
    </div>

    <!-- Main Card Content -->
    <div class="card-contents-slot main">
      <!-- Character Slot -->
      <div class="main-item-slot character">
        <div 
          class="card-character-slot" 
          :style="{ backgroundImage: `url(${getCharacterArt(characterId)})` }"
        >
          <ImagePicker 
            v-model:src="imgStore.characterImage.src"
            :default-src="getCharacterStand(characterId)"
          />

          <div class="constell-overlay">
            <img :src="getConstellOverlay(charStore.characterData.constell[0])" />
            <button 
              v-for="(item, idx) in UI_BUTTON_POS" 
              :key="`constell-${idx}`"
              :class="['constell-button', charStore.characterData.constell[0] > idx ? 'active' : '']"
              :style="{ left: `${item.x}%`, top: `${item.y}%` }"
              @click="updateConstell(idx)"
            >
              <img 
                class="constell-image" 
                :src="getCharacterConstell(characterId, idx)" 
              />
            </button>
          </div>

          <span class="account-info region en-font">Asia Server</span>
          <span class="account-info player-name en-font">Lv.-- Guest Player</span>
          <span class="account-info player-uid en-font">UID. - - - - - - - - -</span>
          <span :class="['character-name', `${appStore.lang}-font`]">
            {{ capitalize(selectedCharacterData[appStore.lang] || selectedCharacterData.en) }}
          </span>

          <img class="character-icon element" :src="getElementIcon(selectedCharacterData.element)" />
          <img class="character-icon stat-type" :src="getStatIcon('atk')" />
          <img class="character-icon attack-type" :src="getStatBnsIcon(selectedCharacterData.type)" />
          <img class="character-icon weapon-type" :src="getWeaponImage('type', selectedCharacterData.weapon)" />
        </div>
      </div>

      <!-- Weapon Slot -->
      <div class="main-item-slot weapon">
        <div class="weapon-info-img">
          <img 
            :src="getWeaponImage(selectedCharacterData.weapon, weaponData?.imgKey || '')"
            @error="(e) => (e.currentTarget as HTMLImageElement).src = '/default.webp'"
          />
        </div>
        <div class="weapon-info-slot">
          <template v-if="weaponData">
            <span class="weapon-name">{{ weaponData[appStore.lang] || '- - - - - - -' }}</span>
            <img class="weapon-stat-icon main" :src="getStatIcon('atk')" />
            <span class="weapon-stat num-font main">{{ weaponData.atk || '- - -' }}</span>
            <img class="weapon-stat-icon sub" :src="getStatIcon(weaponData.statType[0])" 
              @error="(e) => (e.currentTarget as HTMLImageElement).src = '/default.webp'" />
            <span class="weapon-stat num-font sub">
              {{ weaponData.value[0]?.toFixed(1) || '- - -' }}<em>%</em>
            </span>
          </template>
          <template v-else>
            <Skeleton width="120px" height="18px" style="margin-bottom: 8px" />
            <div style="display: flex; gap: 8px; align-items: center">
              <Skeleton width="40px" height="16px" />
              <Skeleton width="60px" height="16px" />
            </div>
          </template>
        </div>
      </div>

      <!-- Stats Slot -->
      <div class="main-item-slot stats">
        <StatSlot
          v-for="statId in STAT_IDS"
          :key="`stat-${statId}`"
          :stat-id="statId"
          :stat-value="FINAL_STATS_MAP[statId] ?? 0"
          :plus-value="(FINAL_STATS_MAP[statId] ?? 0) - (BASE_STATS_MAP[statId] ?? 0)"
          is-animated
        />

        <div class="harmony-slot">
          <div class="container">
            <img :src="getHarmonyIcon(harmony.Clouds.id)" />
            <span :class="appStore.lang + '-font'">
              {{ harmony.Clouds[appStore.lang] }} <em class="num-font">[5]</em>
            </span>
          </div>
          <div class="container">
            <img :src="getHarmonyIcon(harmony.Revelation.id)" />
            <span :class="appStore.lang + '-font'">
              {{ harmony.Revelation[appStore.lang] }} <em class="num-font">[5]</em>
            </span>
          </div>
        </div>

        <div class="score-slot">
          <span class="en-font"> Cv. <CountUp :value="scores[0]" :decimals="1" class="num-font" />pt </span>
          <span class="en-font"> Av. <CountUp :value="scores[1]" :decimals="1" class="num-font" />pt </span>
        </div>
      </div>

      <!-- Description Slot -->
      <div class="main-item-slot description">
        <span class="en-font kuro">Unofficial Fan Project: All assets © Kuro Games</span>
        <span class="en-font powered">Powered by. SSeries</span>
        <span class="en-font link">
          <em><img class="link-image" src="/link.png" />WuWa.dev</em> © 2025
        </span>
      </div>

      <!-- Namecard Slot -->
      <div class="main-item-slot namecard">
        <div class="namecard-score">
          <img :src="getRankIcon(getCharacterRank(scores[1]))" />
          <span class="en-font"> Av. <CountUp :value="scores[1]" :decimals="1" class="num-font" />pt </span>
        </div>
        <div class="namecard-image">
          <ImagePicker 
            v-model:src="imgStore.namecardImage.src"
            :default-src="getCharacterArt(characterId)"
          />
        </div>
      </div>

      <!-- Echoes Slot -->
      <div class="main-item-slot echos">
        <EchoSlot
          v-for="idx in [0, 1, 2, 3, 4]"
          :key="`echo-slot-${idx}`"
          :index="charStore.characterData.echoDataIndex[idx]"
        />
      </div>
    </div>

    <!-- Footer Buttons -->
    <div class="card-contents-slot footer">
      <div class="item-slot">
        <button class="card-page-button content bottom">
          <span>{{ localeText.card.image1 }}</span>
        </button>
      </div>
      <div class="item-slot">
        <button class="card-page-button content bottom" @click="$emit('open-scoreboard')">
          <span>{{ localeText.card.scoreboard }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/appStore';
import { useImgStore } from '@/stores/imgStore';
import { useCharacterStore } from '@/stores/characterDataStore';

import ImagePicker from '@/components/ImagePicker.vue';
import StatSlot from '@/components/features/Card/StatSlot.vue';
import EchoSlot from '@/components/features/Card/EchoSlot.vue';
import Skeleton from '@/components/Skeleton.vue';
import CountUp from '@/components/common/CountUp.vue';

import { type Character } from '@/datas/characters';
import { weaponDict } from '@/datas/weapon';
import { weaponStat } from '@/datas/weaponStats';
import { harmony } from '@/datas/echos';
import { ATTACK_TYPE_STAT_MAP, ELEMENT_STAT_MAP, type StatId } from '@/datas/stats';
import { getCharacterRank } from '@/types/character.type';
import { getCharacterArt, getCharacterStand, getCharacterConstell, getWeaponImage, getElementIcon, getStatIcon, getStatBnsIcon, getHarmonyIcon, getRankIcon, getConstellOverlay } from '@/utils/assetHelper';
import { patchConstell } from '@/runtime/characterData.helpers';
import { locale } from '@/locales/locale';

const props = defineProps<{
    selectedCharacterData: Character;
}>();

defineEmits(['open-scoreboard']);

const appStore = useAppStore();
const imgStore = useImgStore();
const charStore = useCharacterStore();

const UI_BUTTON_POS = [
  { x: 85.5, y: 62.8 }, { x: 73.89, y: 72.1 }, { x: 60, y: 79.5 },
  { x: 45, y: 85 }, { x: 29.3, y: 88.3 }, { x: 13, y: 88.9 },
];

const characterId = computed(() => charStore.characterId);
const localeText = computed(() => locale(appStore.lang));

const STAT_IDS = computed<StatId[]>(() => [
  'hp' as StatId, 'atk' as StatId, 'def' as StatId, 'resonanceBns' as StatId,
  'critRate' as StatId, 'critDmg' as StatId,
  (ELEMENT_STAT_MAP[props.selectedCharacterData.element] || 'dummy') as StatId,
  (ATTACK_TYPE_STAT_MAP[props.selectedCharacterData.type] || 'dummy') as StatId,
]);

const scores = computed(() => {
  const s = charStore.equipmentScore;
  const idx = charStore.characterData.echoDataIndex;
  return [
    s[idx[0]][0] + s[idx[1]][0] + s[idx[2]][0] + s[idx[3]][0] + s[idx[4]][0],
    s[idx[0]][1] + s[idx[1]][1] + s[idx[2]][1] + s[idx[3]][1] + s[idx[4]][1],
  ];
});

const weaponData = computed(() => {
  const id = charStore.characterData.weaponId;
  if (!id) return null;
  const base = weaponDict[id];
  const stat = weaponStat[id];
  return base && stat ? { ...base, ...stat } : null;
});

const BASE_STATS_MAP = computed<Partial<Record<StatId, number>>>(() => ({
  hp: charStore.characterBaseStat?.hp || 0,
  atk: charStore.characterBaseStat?.atk || 0,
  def: charStore.characterBaseStat?.def || 0,
  resonanceBns: charStore.characterBaseStat?.resonanceBns || 0,
  critRate: charStore.characterBaseStat?.critRate || 0,
  critDmg: charStore.characterBaseStat?.critDmg || 0,
  aeroBns: charStore.characterBaseStat?.aero || 0,
  fusionBns: charStore.characterBaseStat?.fusion || 0,
  glacioBns: charStore.characterBaseStat?.glacio || 0,
  electroBns: charStore.characterBaseStat?.electro || 0,
  havocBns: charStore.characterBaseStat?.havoc || 0,
  spectroBns: charStore.characterBaseStat?.spectro || 0,
  basicBns: charStore.characterBaseStat?.basic || 0,
  heavyBns: charStore.characterBaseStat?.heavy || 0,
  skillBns: charStore.characterBaseStat?.skill || 0,
  liberationBns: charStore.characterBaseStat?.liberation || 0,
  healBns: charStore.characterBaseStat?.heal || 0,
}));

const FINAL_STATS_MAP = computed<Partial<Record<StatId, number>>>(() => ({
  hp: charStore.characterFinalStat?.hp || 0,
  atk: charStore.characterFinalStat?.atk || 0,
  def: charStore.characterFinalStat?.def || 0,
  resonanceBns: charStore.characterFinalStat?.resonanceBns || 0,
  critRate: charStore.characterFinalStat?.critRate || 0,
  critDmg: charStore.characterFinalStat?.critDmg || 0,
  aeroBns: charStore.characterFinalStat?.aero || 0,
  fusionBns: charStore.characterFinalStat?.fusion || 0,
  glacioBns: charStore.characterFinalStat?.glacio || 0,
  electroBns: charStore.characterFinalStat?.electro || 0,
  havocBns: charStore.characterFinalStat?.havoc || 0,
  spectroBns: charStore.characterFinalStat?.spectro || 0,
  basicBns: charStore.characterFinalStat?.basic || 0,
  heavyBns: charStore.characterFinalStat?.heavy || 0,
  skillBns: charStore.characterFinalStat?.skill || 0,
  liberationBns: charStore.characterFinalStat?.liberation || 0,
  healBns: charStore.characterFinalStat?.heal || 0,
}));

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

function updateConstell(idx: number) {
  const current = charStore.characterData.constell[0];
  const next = current === idx + 1 ? 0 : idx + 1;
  charStore.patchCharacterData(patchConstell(charStore.characterData, true, next));
}
</script>
