import { useAppStore } from "@/hooks/appStore";
import "./StatSlot.css"

interface StatSlotProps {
    statId: string;
    statValue: number;
    plusValue: number;
}

export default function StatSlot({ statId, statValue, plusValue }: StatSlotProps) {
    const { lang } = useAppStore();
    
    return (
        <div className="stat-slot-body">
            <div className="container">
                <img src="/default.webp"/>
                <span className={`${lang}-font`}>{`Stat Name`}</span>
                <p className={`${lang}-font`}>{statValue}</p>
            </div>
            <em className={`${lang}-font`}>+{plusValue}</em>
        </div>
    )
}