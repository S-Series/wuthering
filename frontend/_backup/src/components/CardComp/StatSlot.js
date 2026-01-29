import { useEffect } from "react";
import { FixedStats } from "../../data/Stats";
import { useProfile } from "../../hooks/useProfile";

function StatSlot({ styles = [{}, {}, {}], imgPath, statId = "", fontSize }) {
  const { lang, finalStats } = useProfile();

  return (
    <div
      style={{
        ...styles[0],
        backgroundColor: "#ffffff33",
        alignContent: "center",
      }}>
      <img
        alt=""
        src={imgPath}
        style={{
          display: "block",
          height: "90%",
          aspectRatio: "1/1",
          marginLeft: "1.1%",
        }}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/default.webp";
        }}
      />
      <span
        className={`${lang}Font`}
        style={{
          ...styles[1],
          display: "flex",
          color: "#fff",
          alignItems: "center",
          justifyContent: "flex-start",
          textAlign: "left",
          fontSize: fontSize[0],
          whiteSpace: "pre-wrap",
        }}>
        {FixedStats[statId]?.[lang]}
      </span>
      <span
        className="numFont"
        style={{
          ...styles[1],
          display: "flex",
          color: "#fff",
          alignItems: "center",
          justifyContent: "flex-end",
          textAlign: "right",
          fontSize: fontSize[0],
        }}>
        {statId.includes("Bns") || statId.includes("Crit")
          ? `${finalStats[statId]?.toFixed(1)}%`
          : finalStats[statId]}
      </span>
      <span
        className="numFont"
        style={{
          ...styles[2],
          display: "flex",
          color: "#ddaa00",
          alignItems: "center",
          justifyContent: "flex-end",
          fontSize: fontSize[1],
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        }}>
        +
        {statId.includes("Bns") || statId.includes("Crit")
          ? `${finalStats[`${statId}Delta`]?.toFixed(1)}%`
          : finalStats[`${statId}Delta`]}
      </span>
    </div>
  );
}
export default StatSlot;
