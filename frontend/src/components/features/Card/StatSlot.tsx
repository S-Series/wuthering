import { useAppStore } from "@/stores/appStore";
import { FixedStats, type StatId } from "@/datas/stats";
import "./StatSlot.css"

interface StatSlotProps {
    statId: StatId;
    statValue: number;
    plusValue: number;
    onHoverStat?: (statId: StatId | null) => void;
}

export default function StatSlot({
    statId,
    statValue,
    plusValue,
    onHoverStat,
}: StatSlotProps) {
    const { lang } = useAppStore();
    const isPct = ((
        statId.includes("crit")
        || statId.includes("Bns")
        || statId.includes("Pct"))
        ? true : false
    );
    
    return (
        <div
            className="stat-slot-body"
            onMouseEnter={() => onHoverStat?.(statId)}
            onMouseLeave={() => onHoverStat?.(null)}
            onFocus={() => onHoverStat?.(statId)}
            onBlur={() => onHoverStat?.(null)}
            tabIndex={0}
        >
            <div className="container">
                <img src={`/ico/stats/${statId}.webp`}/>
                <span className={`${lang}-font`}>{
                    FixedStats[statId][lang]
                        .replace("アップ", " ✢")
                        .replace("加成", " ✢")
                }</span>
                <p className={`num-font ${isPct ? "" : "blank"}`}>
                    {isPct ? (statValue.toFixed(1) + "%") : statValue}
                </p>
            </div>
            <em className={`num-font`}>
                +{isPct ? (plusValue.toFixed(1) + "%") : plusValue}
            </em>
        </div>
    )
}
