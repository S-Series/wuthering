<template>
  <div id="card-page-slot">
    <div class="card-section left">
      <div class="card-contents">
        <!-- Header Buttons -->
        <div class="card-contents-slot header">
          <div class="item-slot">
            <button disabled class="card-page-button content top">
              <span>{{ localeText.help }}</span>
            </button>
            <button disabled class="card-page-button content top">
              <span>{{ localeText.request }}</span>
            </button>
            <button disabled class="card-page-button content top">
              <span>{{ localeText.download }}</span>
            </button>
          </div>

          <div class="item-slot">
            <button class="card-page-button content top">
              <span>{{ localeText.plate1 }}</span>
            </button>
            <button class="card-page-button content top">
              <span>{{ localeText.plate2 }}</span>
            </button>
          </div>
        </div>

        <!-- Main Card Content -->
        <div class="card-contents-slot main">
          <!-- Character Slot -->
          <div class="main-item-slot character">
            <div 
              class="card-character-slot" 
              :style="{ backgroundImage: `url(/character/${characterId.includes('rover') ? 'rover' : characterId}/art.png)` }"
            >
              <ImagePicker 
                v-model:src="imgStore.characterImage.src"
                :default-src="(`/character/${characterId.includes('rover') ? 'rover' : characterId}/stand.png` as string)"
              />

              <div class="constell-overlay">
                <img :src="`/ui/CharacterC${charStore.characterData.constell[0]}.png`" />
                <button 
                  v-for="(item, idx) in UI_BUTTON_POS" 
                  :key="`constell-${idx}`"
                  :class="['constell-button', charStore.characterData.constell[0] > idx ? 'active' : '']"
                  :style="{ left: `${item.x}%`, top: `${item.y}%` }"
                  @click="updateConstell(idx)"
                >
                  <img 
                    class="constell-image" 
                    :src="`/character/${characterId.includes('rover') ? 'rover' : characterId}/C${idx + 1}.png`" 
                  />
                </button>
              </div>

              <span class="account-info region en-font">Asia Server</span>
              <span class="account-info player-name en-font">Lv.-- Guest Player</span>
              <span class="account-info player-uid en-font">UID. - - - - - - - - -</span>
              <span :class="['character-name', `${appStore.lang}-font`]">
                {{ capitalize(selectedCharacterData[appStore.lang] || selectedCharacterData.en) }}
              </span>

              <img class="character-icon element" :src="`/ico/element/${selectedCharacterData.element}.png`" />
              <img class="character-icon stat-type" src="/ico/stats/atk.webp" />
              <img class="character-icon attack-type" :src="`/ico/stats/${selectedCharacterData.type}Bns.webp`" />
              <img class="character-icon weapon-type" :src="`/ico/weapon_type/${selectedCharacterData.weapon}.webp`" />
            </div>
          </div>

          <!-- Weapon Slot -->
          <div class="main-item-slot weapon">
            <div class="weapon-info-img">
              <img 
                :src="`/weapon/${selectedCharacterData.weapon}/${weaponData?.imgKey}.png`"
                @error="(e) => (e.currentTarget as HTMLImageElement).src = '/default.webp'"
              />
            </div>
            <div class="weapon-info-slot">
              <span class="weapon-name">{{ weaponData?.[appStore.lang] || '- - - - - - - - - -' }}</span>
              <img class="weapon-stat-icon main" src="/ico/stats/atk.webp" />
              <span class="weapon-stat num-font main">{{ weaponData?.atk || '- - -' }}</span>
              <img class="weapon-stat-icon sub" :src="`/ico/stats/${weaponData?.statType[0]}.webp`" 
                @error="(e) => (e.currentTarget as HTMLImageElement).src = '/default.webp'" />
              <span class="weapon-stat num-font sub">
                {{ weaponData?.value[0]?.toFixed(1) || '- - -' }}<em>%</em>
              </span>
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
            />

            <div class="harmony-slot">
              <div class="container">
                <img :src="`/ico/harmony/${harmony.Clouds.id}.webp`" />
                <span :class="appStore.lang + '-font'">
                  {{ harmony.Clouds[appStore.lang] }} <em class="num-font">[5]</em>
                </span>
              </div>
              <div class="container">
                <img :src="`/ico/harmony/${harmony.Revelation.id}.webp`" />
                <span :class="appStore.lang + '-font'">
                  {{ harmony.Revelation[appStore.lang] }} <em class="num-font">[5]</em>
                </span>
              </div>
            </div>

            <div class="score-slot">
              <span class="en-font"> Cv. <em class="num-font">{{ scores[0].toFixed(1) }}</em>pt </span>
              <span class="en-font"> Av. <em class="num-font">{{ scores[1].toFixed(1) }}</em>pt </span>
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
              <img :src="`/ico/rank/${getCharacterRank(scores[1])}.png`" />
              <span class="en-font"> Av. <em class="num-font">{{ scores[1].toFixed(1) }}</em>pt </span>
            </div>
            <div class="namecard-image">
              <ImagePicker 
                v-model:src="imgStore.namecardImage.src"
                :default-src="`/character/${characterId.includes('rover') ? 'rover' : characterId}/art.png`"
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
              <span>{{ localeText.image1 }}</span>
            </button>
          </div>
          <div class="item-slot">
            <button class="card-page-button content bottom" @click="openScoreboard">
              <span>{{ localeText.scoreboard }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Selection Panel -->
    <div class="card-section right">
      <!-- Character Selection -->
      <div class="card-section-wrapper">
        <button 
          :class="[appStore.lang + '-font', cardSection === 0 ? 'active' : '']"
          @click="toggleSection(0)"
        >
          {{ localeText.cMenu }}
        </button>
        <button 
          :class="['card-preview character', cardSection === 0 ? '' : 'active']"
          @click="toggleSection(0)"
        >
          <img :src="`/character/${selectedCharacterData.en}/ico.webp`" />
          <span :class="appStore.lang + '-font'">{{ selectedCharacterData[appStore.lang] }}</span>
        </button>
        <div v-show="cardSection === 0" class="card-slot active">
          <div class="filter-slot">
            <button 
              v-for="(item, idx) in WeaponLists" :key="item"
              :class="['filter-item', weaponFilter[idx] ? 'active' : '']"
              @click="weaponFilter[idx] = !weaponFilter[idx]"
            >
              <img :src="`/ico/weapon_type/${item}.webp`" />
            </button>
          </div>
          <div class="filter-slot">
            <button 
              v-for="(item, idx) in ElementLists" :key="item"
              :class="['filter-item', elementFilter[idx] ? 'active' : '']"
              @click="elementFilter[idx] = !elementFilter[idx]"
            >
              <img :src="`/ico/element/${item}.png`" />
            </button>
          </div>
          <div 
            v-for="[id, item] in filteredCharacters" :key="id"
            :class="['card-item', item.element, id === characterId ? 'selected' : '']"
            @click="selectCharacter(id as CharacterId)"
          >
          <img :src="`/character/${id.includes('rover') ? 'rover' : id}/ico.webp`" />
          <span :class="appStore.lang + '-font'">{{ item[appStore.lang] || item.en }}</span>
        </div>
        </div>
      </div>

      <!-- Weapon Selection -->
      <div class="card-section-wrapper">
        <button 
          :class="[appStore.lang + '-font', cardSection === 1 ? 'active' : '']"
          @click="toggleSection(1)"
        >
          {{ localeText.wMenu }}
        </button>
        <button 
          :class="['card-preview weapon', cardSection === 1 ? '' : 'active']"
          @click="toggleSection(1)"
        >
          <img :src="`/weapon/${selectedCharacterData.weapon}/${weaponData?.imgKey}.png`" />
          <span :class="appStore.lang + '-font'">{{ weaponData?.[appStore.lang] }}</span>
        </button>
        <div v-show="cardSection === 1" class="card-slot active">
          <div 
            v-for="item in filteredWeapons" :key="item.id"
            :class="['card-item weapon', item.id.includes('00') ? 'spectro' : 'havoc', item.id === weaponData?.id ? 'selected' : '']"
            @click="selectWeapon(item.id)"
          >
            <img :src="`/weapon/${selectedCharacterData.weapon}/${item.imgKey}.png`" />
            <div style="display: flex; flex-direction: column">
              <span :class="appStore.lang + '-font'">{{ item.id.includes('00') ? '★★★★★' : '★★★★' }}</span>
              <span :class="appStore.lang + '-font'">{{ item[appStore.lang] }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Echo Management -->
      <div class="card-section-wrapper">
        <button 
          :class="[appStore.lang + '-font', cardSection === 2 ? 'active' : '']"
          @click="toggleSection(2)"
        >
          {{ localeText.eMenu }}
        </button>
        <div :class="['card-preview echo', cardSection === 2 ? '' : 'active']" @click="toggleSection(2)">
          <img 
            v-for="idx in [0,1,2,3,4]" :key="idx"
            :src="`/ico/echos/${charStore.characterData.echoData[idx].echoId}.webp`"
            @error="(e) => (e.currentTarget as HTMLImageElement).src = 'default.webp'"
          />
        </div>
        <div v-show="cardSection === 2" class="card-slot echo active">
          <div class="echo-slot">
            <button @click="openOcr">
              {{ localeText.oMenu }}
            </button>
          </div>
          <div class="drag-slot">
            <EchoDragSelect :num="-999" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, markRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { useImgStore } from '@/stores/imgStore';
import { useOverlay } from '@/composables/useOverlay';
import { useCharacterStore } from '@/stores/characterDataStore';

import ImagePicker from '@/components/ImagePicker.vue';
import StatSlot from '@/components/features/Card/StatSlot.vue';
import EchoSlot from '@/components/features/Card/EchoSlot.vue';
import OcrSlot from '@/components/features/Card/OcrSlot.vue';
import EchoDragSelect from '@/components/features/Card/EchoDragSelect.vue';

import { character, WeaponTypes as WeaponLists, ElementTypes as ElementLists, type Character } from '@/datas/characters';
import { type CharacterId } from '@/datas/characterStats';
import { weapon, weaponDict } from '@/datas/weapon';
import { weaponStat } from '@/datas/weaponStats';
import { harmony } from '@/datas/echos';
import { ATTACK_TYPE_STAT_MAP, ELEMENT_STAT_MAP, type StatId } from '@/datas/stats';
import { getCharacterRank } from '@/types/character.type';
import { patchConstell, setWeaponId } from '@/runtime/characterData.helpers';
import { locale } from '@/locales/locale';

import '@/pages/Card.css';
import '@/pages/Card.contents.main.css';

const appStore = useAppStore();
const imgStore = useImgStore();
const charStore = useCharacterStore();
const { openOverlay } = useOverlay();
const route = useRoute();
const router = useRouter();

const SCOREBOARD_URL = "https://docs.google.com/spreadsheets/d/169EqXJatZIMqL0MPbHF6Eg9DgLFcaxjE6hG03gYZ-_U/edit?gid=1750559029#gid=1750559029";
const UI_BUTTON_POS = [
  { x: 85.5, y: 62.8 }, { x: 73.89, y: 72.1 }, { x: 60, y: 79.5 },
  { x: 45, y: 85 }, { x: 29.3, y: 88.3 }, { x: 13, y: 88.9 },
];

const cardSection = ref(2);
const weaponFilter = ref([false, false, false, false, false]);
const elementFilter = ref([false, false, false, false, false, false]);

const characterId = computed(() => charStore.characterId);
const localeText = computed(() => locale(appStore.lang).card);

const selectedCharacterData = computed<Character>(() => 
  character[characterId.value] || character['rover_spectro']
);

const STAT_IDS = computed<StatId[]>(() => [
  'hp' as StatId, 'atk' as StatId, 'def' as StatId, 'resonanceBns' as StatId,
  'critRate' as StatId, 'critDmg' as StatId,
  (ELEMENT_STAT_MAP[selectedCharacterData.value.element] || 'dummy') as StatId,
  (ATTACK_TYPE_STAT_MAP[selectedCharacterData.value.type] || 'dummy') as StatId,
]);

const scores = computed(() => {
  const s = charStore.equipmentScore;
  const idx = charStore.characterData.echoDataIndex;
  return [
    s[idx[0]][0] + s[idx[1]][0] + s[idx[2]][0] + s[idx[3]][0] + s[idx[4]][0],
    s[idx[0]][1] + s[idx[1]][1] + s[idx[2]][1] + s[idx[3]][1] + s[idx[4]][1],
  ];
});

const filteredCharacters = computed(() => {
  let result = Object.entries(character);
  const hasElementFilter = elementFilter.value.some(Boolean);
  if (hasElementFilter) {
    result = result.filter(([_, char]) => elementFilter.value[ElementLists.indexOf(char.element)]);
  }
  const hasWeaponFilter = weaponFilter.value.some(Boolean);
  if (hasWeaponFilter) {
    result = result.filter(([_, char]) => weaponFilter.value[WeaponLists.indexOf(char.weapon)]);
  }
  return result;
});

const filteredWeapons = computed(() => Object.values(weapon[selectedCharacterData.value.weapon]));

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

function toggleSection(idx: number) {
  cardSection.value = cardSection.value === idx ? -1 : idx;
}

function selectCharacter(id: CharacterId) {
  charStore.setCharacterId(id);
  cardSection.value = -1;
  router.replace({ query: { character: id } });
}

function selectWeapon(id: string) {
  charStore.patchCharacterData(setWeaponId(charStore.characterData, id as any));
  cardSection.value = -1;
}

function openOcr() {
  openOverlay(markRaw(OcrSlot));
}

function openScoreboard() {
  window.open(SCOREBOARD_URL, "_blank");
}

onMounted(() => {
  const param = route.query.character as string;
  if (param && character[param as CharacterId]) {
    charStore.setCharacterId(param as CharacterId);
  } else {
    const saved = localStorage.getItem('selectedCharacterId');
    if (saved && character[saved as CharacterId]) {
      charStore.setCharacterId(saved as CharacterId);
    } else {
      charStore.setCharacterId('rover_spectro');
    }
  }
});

watch(characterId, (newId) => {
  localStorage.setItem('selectedCharacterId', newId);
});
</script>
