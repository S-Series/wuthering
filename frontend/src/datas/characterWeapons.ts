import { characterGuideData } from "./characters.guide";
import { character } from "./characters";
import type { CharacterId } from "./characterStats";
import { weapon, type WeaponId } from "./weapon";
import { weaponStat } from "./weaponStats";

export function isUsableCharacterWeapon(id: CharacterId, weaponId: unknown): weaponId is WeaponId {
  if (typeof weaponId !== "string" || !Object.prototype.hasOwnProperty.call(weaponStat, weaponId)) return false;
  if (!Object.prototype.hasOwnProperty.call(weapon[character[id].weapon], weaponId)) return false;
  const stats = weaponStat[weaponId as WeaponId];
  return Number.isFinite(stats.atk) && stats.atk > 0 && stats.value.length >= 2 &&
    stats.value.length === stats.statType.length && stats.value.every(Number.isFinite);
}

/** Every character has an explicit, equipable first recommendation. */
export function getDefaultCharacterWeaponId(id: CharacterId): WeaponId {
  const first = characterGuideData[id].guideWeapons[0];
  if (!isUsableCharacterWeapon(id, first)) throw new Error(`Invalid first recommended weapon for ${id}`);
  return first;
}

export function resolveCharacterWeaponId(id: CharacterId, savedWeapon: unknown): WeaponId {
  return isUsableCharacterWeapon(id, savedWeapon) ? savedWeapon : getDefaultCharacterWeaponId(id);
}
