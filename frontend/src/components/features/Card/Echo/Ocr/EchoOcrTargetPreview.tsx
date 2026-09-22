import { FixedStats } from "@/datas/stats";
import type { EchoRuntime } from "@/runtime/echo.runtime";
import { getEquipmentRank } from "@/types/character.type";

import "./EchoOcrTargetPreview.css";

type Props = {
  baseUrl: string;
  echoData: EchoRuntime;
  score: [number, number];
  slotNumber: number;
};

const PERCENT_STAT_KEYS = ["crit", "Pct", "Bns"];

function formatStatValue(statId: string, value: number) {
  if (!statId || statId === "dummy" || value === -1) return "- - -";

  const formatted = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
  const suffix = PERCENT_STAT_KEYS.some((key) => statId.includes(key)) ? "%" : "";

  return `${formatted}${suffix}`;
}

function PreviewStat({
  statId,
  value,
  muted = false,
}: {
  statId: string;
  value: number;
  muted?: boolean;
}) {
  return (
    <div className={`ocr-target-preview-stat ${muted ? "muted" : ""}`}>
      <img
        className="ocr-target-preview-stat__icon"
        src={`/ico/stats/${statId}.webp`}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = "/default.webp";
        }}
        alt=""
      />
      <span className="num-font">{formatStatValue(statId, value)}</span>
    </div>
  );
}

export default function EchoOcrTargetPreview({
  baseUrl,
  echoData,
  score,
  slotNumber,
}: Props) {
  const costStatId = echoData.cost === 1 ? FixedStats.hp.id : FixedStats.atk.id;
  const costStatValue = (() => {
    switch (echoData.cost) {
      case 4: return 150;
      case 3: return 100;
      case 1: return 2280;
      default: return -1;
    }
  })();
  const rank = getEquipmentRank(score[1] ?? 0);

  return (
    <div className="echo-ocr-target-preview ocr-target-preview-card">
      <div className="ocr-target-preview-card__header">
        <span>Slot {slotNumber}</span>
        <img
          className="ocr-target-preview-card__rank-icon"
          src={`/ico/rank/${rank}.png`}
          alt="rank"
        />
      </div>

      <div className="ocr-target-preview-card__hero">
        <img
          className="ocr-target-preview-card__echo-image"
          src={`${baseUrl}/ico/echos/${echoData.echoId}.webp`}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/default.webp";
          }}
          alt=""
        />
        <img
          className="ocr-target-preview-card__harmony-icon"
          src={`/ico/harmony/${echoData.setId}.png`}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/default.webp";
          }}
          alt=""
        />
      </div>

      <div className="ocr-target-preview-card__stats main">
        <PreviewStat statId={echoData.mainOption.statId} value={echoData.mainOption.statValue} />
        <PreviewStat statId={costStatId} value={costStatValue} muted />
      </div>

      <div className="ocr-target-preview-card__stats sub">
        {echoData.subOptions.map((item, index) => (
          <PreviewStat
            key={`ocr-target-preview-stat-${index}`}
            statId={item.statId}
            value={item.statValue}
            muted={item.statId === "dummy"}
          />
        ))}
      </div>

      <div className="ocr-target-preview-card__score">
        <div className="textbox">
          <span>Cv.</span>
          <span>
            <em className="num-font">{score[0].toFixed(1)}</em>
            pt
          </span>
        </div>
        <div className="textbox">
          <span className="en-font">Av.</span>
          <span>
            <em className="num-font">{score[1].toFixed(1)}</em>
            pt
          </span>
        </div>
      </div>
    </div>
  );
}
