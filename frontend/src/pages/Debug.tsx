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
    id: string;
    name: string;
    constell: number;
    elementType: string;
    weaponType: string;
    attackType: string;
    mainStatType: string;
  };
  weapon: {
    id: string;
    name: string;
    stats: [string, string];
    statType: string;
  };
  stats: {
    statName: string[];
    statValue: string[];
    additionalValue: string[];
    harmony: [string, number][];
    score: [number, number];
  };
  echoes: { 
    id: string,
    statName: string[];
    statValue: string[];
    statColorHex: string[];
  }[];
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
      },
      user: { 
        server: "Asia",
        name: "sharp", 
        uid: "800123456",
        level: 80,
      },
      character: { 
        id: "phoebe", 
        name: "피비", 
        constell: 0,
        elementType: "spectro",
        weaponType: "string",
        attackType: "string",
        mainStatType: "string",
      },
      weapon: { 
        id: "fantasy_variation", 
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