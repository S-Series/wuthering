import { arcaBuildTargetBaselines } from './arca';
import type { CharacterId } from '../characterStats';
import type { BuildTargetBaseline } from './types';

// User-provided targets are kept separate; a future Arca entry takes precedence.
const provisionalBaselines: Partial<Record<CharacterId, BuildTargetBaseline>> = {
  lily: {
    primary: 'hp',
    weaponId: null,
    sourceWeapon: '',
    sets: [],
    setCount: 0,
    setText: '',
    sourceKind: 'provisional',
    notes: '',
    sourcePrimary: '',
    sourceEnergy: '',
    variants: [{
      id: 'provisional',
      label: '',
      costs: [],
      main4: [],
      main3: null,
      allowed3: [],
      main1: null,
      baseline: { hp: 39000, resonanceBns: 260 },
      mainText: '',
      subText: '',
    }],
  },
};

export const buildTargetBaselines = { ...provisionalBaselines, ...arcaBuildTargetBaselines };
