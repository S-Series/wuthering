/**
 * Utility functions for generating asset paths across the application.
 */

/**
 * Character related assets
 */
export const getCharacterArt = (id: string) => `/character/${id.includes('rover') ? 'rover' : id}/art.png`;
export const getCharacterStand = (id: string) => `/character/${id.includes('rover') ? 'rover' : id}/stand.png`;
export const getCharacterIcon = (id: string) => `/character/${id.includes('rover') ? 'rover' : id}/ico.webp`;
export const getCharacterConstell = (id: string, index: number) => `/character/${id.includes('rover') ? 'rover' : id}/C${index + 1}.png`;

/**
 * Weapon related assets
 */
export const getWeaponImage = (type: string, key: string) => `/weapon/${type}/${key}.png`;
export const getWeaponTypeIcon = (type: string) => `/ico/weapon_type/${type}.webp`;

/**
 * Element & Stats related assets
 */
export const getElementIcon = (element: string) => `/ico/element/${element}.png`;
export const getStatIcon = (stat: string) => `/ico/stats/${stat}.webp`;
export const getStatBnsIcon = (stat: string) => `/ico/stats/${stat}Bns.webp`;

/**
 * Echo related assets
 */
export const getEchoIcon = (id: string | number) => `/ico/echos/${id}.webp`;
export const getHarmonyIcon = (id: string | number) => `/ico/harmony/${id}.webp`; // note: some are .png, some .webp, usually webp for the main icons
export const getHarmonyIconPng = (id: string | number) => `/ico/harmony/${id}.png`;

/**
 * UI & Rank related assets
 */
export const getRankIcon = (rank: string) => `/ico/rank/${rank}.png`;
export const getConstellOverlay = (level: number) => `/ui/CharacterC${level}.png`;
