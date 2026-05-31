import { useAppStore } from "@/stores/appStore";
import { useImgStore } from "@/stores/imgStore";

import ImagePicker from "@/components/ImagePicker";

import "./Card.Character.css"
import { useCharacter } from "@/stores/characterDataStore";

const BASE_URL = import.meta.env.VITE_IMAGE_BASE;

const UI_BUTTON_POS = [
  { x: 85.5, y: 62.8 },
  { x: 73.89, y: 72.1 },
  { x: 60, y: 79.5 },
  { x: 45, y: 85 },
  { x: 29.3, y: 88.3 },
  { x: 13, y: 88.9 },
];

export default function CardCharacterSection() {
  const { imgVer } = useAppStore();
  const { characterId } = useCharacter();

  const setImageSrc = useImgStore((s) => s.setImageSrc);
  const characterImage = useImgStore((s) => s.characterImage);

  const characterAssetId = characterId?.includes("rover") ? "rover" : characterId;

  console.log(characterAssetId);

  return (
    <div className="card-character">
      <ImagePicker
        src={characterImage.src}
        defaultSrc={`${BASE_URL}/character/${characterAssetId}/stand.png?v=${imgVer}`}
        onChangeSrc={(src) => setImageSrc("characterImage", src)}
      />
    </div>
  );
}
