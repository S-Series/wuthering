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
    
    return (
        <div className="stat-slot-body">
            <div className="container">
                <img src={`/ico/stats/${statId}.webp`}/>
                <span className={`${lang}-font`}>{`Stat Name`}</span>
                <p className={`${lang}-font`}>{statValue}</p>
            </div>
            <em className={`${lang}-font`}>+{plusValue}</em>
        </div>
    )
}