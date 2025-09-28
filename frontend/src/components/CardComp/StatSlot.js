import { useEffect } from "react";
import { FixedStats } from "../../data/Stats";
import { useProfile } from "../../hooks/useProfile";

function StatSlot({ styles = [{}, {}, {}], imgPath, statId = "", fontSize }) {
  const { lang, finalStats } = useProfile();

  useEffect(() => {
    console.log("StatSlot Rendered", statId, finalStats[statId]);
  }, [statId, JSON.stringify(finalStats)]);

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
        style={{
          ...styles[1],
          color: "#fff",
          textAlign: "left",
          fontSize: fontSize[0],
          whiteSpace: "pre-wrap",
        }}>
        {FixedStats[statId]?.[lang]}
      </span>
      <span
        style={{
          ...styles[1],
          color: "#fff",
          textAlign: "right",
          fontSize: fontSize[0],
        }}>
        {statId.includes("Bns") || statId.includes("Crit")
          ? `${finalStats[statId]?.toFixed(1)}%`
          : finalStats[statId]}
      </span>
      <span
        style={{
          ...styles[2],
          color: "#ddaa00",
          textAlign: "right",
          fontSize: fontSize[1],
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
