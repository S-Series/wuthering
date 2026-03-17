<template>
  <div class="card-section right">
    <!-- Character Selection -->
    <div class="card-section-wrapper">
      <button 
        :class="[appStore.lang + '-font', cardSection === 0 ? 'active' : '']"
        @click="toggleSection(0)"
      >
        {{ localeText.card.cMenu }}
      </button>
      <div class="search-slot">
        <input 
          v-model="searchQuery" 
          type="text" 
          :placeholder="searchPlaceholder"
          class="search-input"
        />
      </div>
      <button 
        :class="['card-preview character', cardSection === 0 ? '' : 'active']"
        @click="toggleSection(0)"
      >
        <img :src="getCharacterIcon(selectedCharacterData.en)" />
        <span :class="appStore.lang + '-font'">{{ selectedCharacterData[appStore.lang] }}</span>
      </button>
      <div v-show="cardSection === 0" class="card-slot active">
        <div class="filter-slot">
          <button 
            v-for="(item, idx) in WeaponLists" :key="item"
            :class="['filter-item', weaponFilter[idx] ? 'active' : '']"
            @click="weaponFilter[idx] = !weaponFilter[idx]"
          >
            <img :src="getWeaponTypeIcon(item)" />
          </button>
        </div>
        <div class="filter-slot">
          <button 
            v-for="(item, idx) in ElementLists" :key="item"
            :class="['filter-item', elementFilter[idx] ? 'active' : '']"
            @click="elementFilter[idx] = !elementFilter[idx]"
          >
            <img :src="getElementIcon(item)" />
          </button>
        </div>
        <div 
          v-for="[id, item] in filteredCharacters" :key="id"
          :class="['card-item', item.element, id === characterId ? 'selected' : '']"
          @click="selectCharacter(id as CharacterId)"
        >
          <img :src="getCharacterIcon(id)" />
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
        {{ localeText.card.wMenu }}
      </button>
      <button 
        :class="['card-preview weapon', cardSection === 1 ? '' : 'active']"
        @click="toggleSection(1)"
      >
        <img :src="getWeaponImage(selectedCharacterData.weapon, weaponData?.imgKey || '')" />
        <span :class="appStore.lang + '-font'">{{ weaponData?.[appStore.lang] }}</span>
      </button>
      <div v-show="cardSection === 1" class="card-slot active">
        <div 
          v-for="item in filteredWeapons" :key="item.id"
          :class="['card-item weapon', item.id.includes('00') ? 'spectro' : 'havoc', item.id === weaponData?.id ? 'selected' : '']"
          @click="selectWeapon(item.id)"
        >
          <img :src="getWeaponImage(selectedCharacterData.weapon, item.imgKey)" />
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
        {{ localeText.card.eMenu }}
      </button>
      <div :class="['card-preview echo', cardSection === 2 ? '' : 'active']" @click="toggleSection(2)">
        <img 
          v-for="idx in [0,1,2,3,4]" :key="idx"
          :src="getEchoIcon(charStore.characterData.echoData[idx].echoId)"
          @error="(e) => (e.currentTarget as HTMLImageElement).src = 'default.webp'"
        />
      </div>
      <div v-show="cardSection === 2" class="card-slot echo active">
        <div class="echo-slot">
          <button @click="$emit('open-ocr')">
            {{ localeText.card.oMenu }}
          </button>
        </div>
        <div class="drag-slot">
          <EchoDragSelect :num="-999" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { useCharacterStore } from '@/stores/characterDataStore';

import EchoDragSelect from '@/components/features/Card/EchoDragSelect.vue';

import { character, WeaponTypes as WeaponLists, ElementTypes as ElementLists, type Character } from '@/datas/characters';
import { type CharacterId } from '@/datas/characterStats';
import { weapon, weaponDict } from '@/datas/weapon';
import { weaponStat } from '@/datas/weaponStats';
import { getCharacterIcon, getWeaponImage, getWeaponTypeIcon, getElementIcon, getEchoIcon } from '@/utils/assetHelper';
import { setWeaponId } from '@/runtime/characterData.helpers';
import { locale } from '@/locales/locale';

defineEmits(['open-ocr']);

const appStore = useAppStore();
const charStore = useCharacterStore();
const router = useRouter();

const cardSection = ref(2);
const weaponFilter = ref([false, false, false, false, false]);
const elementFilter = ref([false, false, false, false, false, false]);

const characterId = computed(() => charStore.characterId);
const localeText = computed(() => locale(appStore.lang));

const searchQuery = ref('');

const searchPlaceholder = computed(() => {
  switch (appStore.lang) {
    case 'kr': return '검색...';
    case 'en': return 'Search...';
    case 'jp': return '検索...';
    case 'zh': return '搜索...';
    default: return 'Search...';
  }
});

const selectedCharacterData = computed<Character>(() => 
  character[characterId.value] || character['rover_spectro']
);

const filteredCharacters = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  return Object.entries(character)
    .filter(([_, data]) => {
      const matchQuery = !query || 
                         data.en.toLowerCase().includes(query) || 
                         (data.kr && data.kr.includes(query)) ||
                         (data.jp && data.jp.includes(query)) ||
                         (data.zh && data.zh.includes(query));
      
      const matchWeapon = weaponFilter.value.every(v => !v) || 
                          weaponFilter.value[WeaponLists.indexOf(data.weapon)];
      const matchElement = elementFilter.value.every(v => !v) || 
                           elementFilter.value[ElementLists.indexOf(data.element)];
      
      return matchQuery && matchWeapon && matchElement;
    });
});

const filteredWeapons = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  const weaponList = weapon[selectedCharacterData.value.weapon] || {};
  return Object.values(weaponList)
    .filter((item: any) => {
      const matchQuery = !query || 
                         item.en.toLowerCase().includes(query) || 
                         (item.kr && item.kr.includes(query)) ||
                         (item.jp && item.jp.includes(query)) ||
                         (item.zh && item.zh.includes(query));
      return matchQuery;
    });
});

const weaponData = computed(() => {
  const id = charStore.characterData.weaponId;
  if (!id) return null;
  const base = weaponDict[id];
  const stat = weaponStat[id];
  return base && stat ? { ...base, ...stat } : null;
});

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
</script>
