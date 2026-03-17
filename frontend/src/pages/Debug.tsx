import { useAppStore } from "@/stores/appStore";
import { useState } from "react";

export type RenderPayload = {
  base: {
    lang: string;
  };
  user: {
    server: string;
    level: number;
    name: string;
    uid: string;
  };
  character: {
    imgKey: string;
    name: string;
    constell: number;
    elementType: string;
    weaponType: string;
    attackType: string;
    mainStatType: string;
  };
  weapon: {
    imgKey: string;
    name: string;
    stats: [string, string];
    statType: string;
  };
  stats: {
    statName: string[];
    statValue: string[];
    additionalValue: string[];
  };
  echoes: { id: string }[];
};

export async function requestRenderCard(payload: RenderPayload) {
  const response = await fetch("http://localhost:8080/render/card", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Render request failed: ${response.status}`);
  }

  return response.blob();
}

export default function Debug() {
  const {lang} = useAppStore();
  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const handleClick = async () => {
    const blob = await requestRenderCard({
      base: {
        lang: lang,
        storage: BASE_URL,
      },
      user: { 
        name: "sharp", 
        uid: "800123456" 
      },
      character: { 
        imgKey: "phoebe", 
        name: "피비", 
        level: 90 
      },
      weapon: { 
        imgKey: "fantasy_variation", 
        name: "판타지 변주", 
      },
      stats: { 
        statName: ["HP"],
        statValue: ["26151"],
        additionalValue: ["9439"],
      },
      echoes: [{ id: "echo_1" }, { id: "echo_2" }],
    });

    const imageUrl = URL.createObjectURL(blob);
    setPreviewUrl(imageUrl);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button onClick={handleClick}>ASDF</button>
      <img style={{ width: "90%", alignSelf: "center" }} src={previewUrl} alt="render result" />
    </div>
   );
}