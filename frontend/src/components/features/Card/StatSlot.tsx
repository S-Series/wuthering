import { useAppStore } from "@/hooks/appStore";
import type { StatId } from "@/datas/stats";
import "./StatSlot.css"

interface StatSlotProps {
    statId: StatId;
    statValue: number;
    plusValue: number;
}

export default function StatSlot({ statId, statValue, plusValue }: StatSlotProps) {
    const { lang } = useAppStore();
    const isPct = ((
        statId.includes("Crit")
        || statId.includes("Bns")
        || statId.includes("Pct"))
        ? true : false
    );
    
    return (
        <div className="stat-slot-body">
            <div className="container">
                <img src={`/ico/stats/${statId}.webp`}/>
                <span className={`${lang}-font`}>{`Stat Name`}</span>
                <p className={`num-font`}>
                    {isPct ? (statValue.toFixed(1) + "%") : statValue}
                </p>
            </div>
            <em className={`num-font`}>
                +{isPct ? (plusValue.toFixed(1) + "%") : plusValue}
            </em>
        </div>
    )
}