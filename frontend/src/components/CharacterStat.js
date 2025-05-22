import "./CharacterStat.css";
import useFitText from "use-fit-text";
import { FixedStats } from "../Datas/Stats";

function CharacterStat({ id, value, color = '#00000000' }) {
  const lang = localStorage.getItem("lang") || "kr";

  const stat = FixedStats[id];
  const label = stat ? stat[lang] || id : id;

  return (
    <div
      className="character-stat-grid"
      style={{
        color: color,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "optimizeLegibility",
      }}>
      <img
        className="character-stat-icon"
        src={`/ico/stats/${id}.webp`}
        onError={(e) => (e.currentTarget.src = "/default.webp")}
      />
      <div className="character-stat-text-grid">
        <span className="character-stat-text">
          &nbsp;&nbsp;{label || "NaN"}
        </span>
        <span className="character-stat-text R">{value || "NaN"}</span>
      </div>
    </div>
  );
}

export default CharacterStat;
