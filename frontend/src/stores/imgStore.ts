import { defineStore } from "pinia";
import { ref } from "vue";
import {
  type ImageKey,
  type ImageTransformState,
  createInitialImageState,
} from "@/runtime/image.runtime";

export const useImgStore = defineStore("img", () => {
  const characterImage = ref<ImageTransformState>(createInitialImageState());
  const namecardImage = ref<ImageTransformState>(createInitialImageState());

  function setImageSrc(key: ImageKey, src: string | null) {
    if (key === "characterImage") {
      characterImage.value = { ...characterImage.value, src, x: 0, y: 0, scale: 1 };
    } else {
      namecardImage.value = { ...namecardImage.value, src, x: 0, y: 0, scale: 1 };
    }
  }

  function setImageTransform(key: ImageKey, partial: Partial<ImageTransformState>) {
    if (key === "characterImage") {
      characterImage.value = { ...characterImage.value, ...partial };
    } else {
      namecardImage.value = { ...namecardImage.value, ...partial };
    }
  }

  function replaceImageState(key: ImageKey, next: ImageTransformState) {
    if (key === "characterImage") characterImage.value = { ...next };
    else namecardImage.value = { ...next };
  }

  function resetImage(key: ImageKey) {
    if (key === "characterImage") characterImage.value = createInitialImageState();
    else namecardImage.value = createInitialImageState();
  }

  function resetAllImages() {
    characterImage.value = createInitialImageState();
    namecardImage.value = createInitialImageState();
  }

  return { characterImage, namecardImage, setImageSrc, setImageTransform, replaceImageState, resetImage, resetAllImages };
});
