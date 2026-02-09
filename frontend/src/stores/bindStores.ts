import { useUserStore } from "@/stores/userStore";
import { useSaveStore } from "@/stores/saveStore";
import { extractSavedCharacter } from "@/stores/saveAdapter";

let bound = false;

export const bindUserStoreToSaveStore = () => {
  if (bound) return;
  bound = true;

  useUserStore.subscribe((state) => {
    const saved = extractSavedCharacter(state.selectedCharacter);
    if (!saved) return;
    useSaveStore.getState().setCharacter(saved.characterId, saved);
  });
};
