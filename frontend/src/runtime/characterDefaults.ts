import type { CharacterId } from "@/datas/characterStats";
import { getDefaultCharacterWeaponId, resolveCharacterWeaponId } from "@/datas/characterWeapons";
import { createEmptyCharacterData, type CharacterData } from "@/types/character.type";

/** UI defaults are separate from the weaponless builds used by stat/reference calculations. */
export function createDefaultCharacterData(id: CharacterId): CharacterData {
  return { ...createEmptyCharacterData(id), weaponId: getDefaultCharacterWeaponId(id) };
}

export function withDefaultCharacterWeapon(data: CharacterData): CharacterData {
  const weaponId = resolveCharacterWeaponId(data.characterId, data.weaponId);
  return weaponId === data.weaponId ? data : { ...data, weaponId };
}
