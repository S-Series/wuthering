import type { RenderCardPayload } from "@/api/render.api";
import { useAppStore } from "@/stores/appStore";
import { useEffect, useRef, useState } from "react";

async function requestDebugRenderCard(payload: RenderCardPayload) {
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
  const previewUrlRef = useRef("");
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const handleClick = async () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }

    setPreviewUrl("");
    const blob = await requestDebugRenderCard({
      base: {
        lang: lang,
      },
      user: {
        server: "Asia",
        name: "SSeries",
        uid: "800123456",
        level: 80,
      },
      character: {
        id: "phoebe",
        name: "페비",
        constell: 0,
        elementType: "spectro",
        weaponType: "rectifier",
        attackType: "heavy",
        mainStatType: "atk",
      },
      weapon: {
        id: "fantasy_variation",
        name: "꼭두각시의 손",
        stats: ["500", "36.0"],
        statType: "critRate",
        imgKey: "ico002",
      },
      stats: {
        statId: ["hp","atk","def","resonanceBns","critRate","critDmg","spectroBns","heavyBns"],
        statName: ["HP","공격력","방어력","공명 효율","크리티컬","크리티컬 피해","회절 피해보너스","강공격 피해보너스"],
        statValue: ["15384","1370","1259","100.0%","41.0%","166.0%","12.0%","0.0%"],
        additionalValue: ["4559","1557","413","0.0%","36.0%","16.0%","12.0%","0.0%"],
        harmony: [["Sound", "セマンティック・ウィッシュ", "5"]],
        score: [150.3, 314.6],
      },
      namecard: {
        score: 273.9,
        rank: "ss",
      },
      echoes: [{
        id: "Z04",
        harmonyId: "Rift",
        stats: [
          { "statId": "atkPct", "statValue": "18.0%", "statColorHex": "#fff" },
          { "statId": "hp", "statValue": "2280", "statColorHex": "#fff" },
          { "statId": "critRate", "statValue": "10.5%", "statColorHex": "#fc0" },
          { "statId": "critDmg", "statValue": "21.0%", "statColorHex": "#555" },
          { "statId": "atkPct", "statValue": "11.6%", "statColorHex": "#c90" },
          { "statId": "ResonanceBns", "statValue": "12.6%", "statColorHex": "#fff" },
          { "statId": "atk", "statValue": "50", "statColorHex": "#fff" }
        ],
        scores: ["34.8", "49.1"],
        rank: "sss"
      }, {
        id: "Z04",
        harmonyId: "Rift",
        stats: [
          { "statId": "atkPct", "statValue": "18.0%", "statColorHex": "#fff" },
          { "statId": "hp", "statValue": "2280", "statColorHex": "#fff" },
          { "statId": "critRate", "statValue": "10.5%", "statColorHex": "#fc0" },
          { "statId": "critDmg", "statValue": "21.0%", "statColorHex": "#555" },
          { "statId": "atkPct", "statValue": "11.6%", "statColorHex": "#c90" },
          { "statId": "ResonanceBns", "statValue": "12.6%", "statColorHex": "#fff" },
          { "statId": "atk", "statValue": "50", "statColorHex": "#fff" }
        ],
        scores: ["34.8", "49.1"],
        rank: "sss"
      }, {
        id: "Z04",
        harmonyId: "Rift",
        stats: [
          { "statId": "atkPct", "statValue": "18.0%", "statColorHex": "#fff" },
          { "statId": "hp", "statValue": "2280", "statColorHex": "#fff" },
          { "statId": "critRate", "statValue": "10.5%", "statColorHex": "#fc0" },
          { "statId": "critDmg", "statValue": "21.0%", "statColorHex": "#555" },
          { "statId": "atkPct", "statValue": "11.6%", "statColorHex": "#c90" },
          { "statId": "ResonanceBns", "statValue": "12.6%", "statColorHex": "#fff" },
          { "statId": "atk", "statValue": "50", "statColorHex": "#fff" }
        ],
        scores: ["34.8", "49.1"],
        rank: "sss"
      }, {
        id: "Z04",
        harmonyId: "Rift",
        stats: [
          { "statId": "atkPct", "statValue": "18.0%", "statColorHex": "#fff" },
          { "statId": "hp", "statValue": "2280", "statColorHex": "#fff" },
          { "statId": "critRate", "statValue": "10.5%", "statColorHex": "#fc0" },
          { "statId": "critDmg", "statValue": "21.0%", "statColorHex": "#555" },
          { "statId": "atkPct", "statValue": "11.6%", "statColorHex": "#c90" },
          { "statId": "ResonanceBns", "statValue": "12.6%", "statColorHex": "#fff" },
          { "statId": "atk", "statValue": "50", "statColorHex": "#fff" }
        ],
        scores: ["34.8", "49.1"],
        rank: "sss"
      }, {
        id: "Z04",
        harmonyId: "Rift",
        stats: [
          { "statId": "atkPct", "statValue": "18.0%", "statColorHex": "#fff" },
          { "statId": "hp", "statValue": "2280", "statColorHex": "#fff" },
          { "statId": "critRate", "statValue": "10.5%", "statColorHex": "#fc0" },
          { "statId": "critDmg", "statValue": "21.0%", "statColorHex": "#555" },
          { "statId": "atkPct", "statValue": "11.6%", "statColorHex": "#c90" },
          { "statId": "ResonanceBns", "statValue": "12.6%", "statColorHex": "#fff" },
          { "statId": "atk", "statValue": "50", "statColorHex": "#fff" }
        ],
        scores: ["34.8", "49.1"],
        rank: "sss"
      },],
    });

    const imageUrl = URL.createObjectURL(blob);
    previewUrlRef.current = imageUrl;
    setPreviewUrl(imageUrl);
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button onClick={handleClick}>ASDF</button>
      <img style={{ width: "75%", alignSelf: "center" }} src={previewUrl} alt="render result" />
    </div>
   );
}
