import type { EchoRuntime } from "@/runtime/echo.runtime";

import "./EchoSlot.css"

interface StatSlotProps {
    Echodata?: EchoRuntime;
}

const PERCENT_STAT_KEYS = ["Crit", "Pct", "Bns"];
function MakeStatSlot({ StatId = "", StatValue = -1, }
    : { StatId?: string; StatValue?: number; }) {
    return (
        <div className="echo-stat-slot">
            <img alt="stat icon" src={`/ico/stats/${StatId}.webp`}
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/default.webp"
                }} />
            <span className="num-font">
                {StatValue === -1 ? "- - - -" : StatValue}
                {PERCENT_STAT_KEYS.some(key => StatId.includes(key)) ? "%" : ""}
            </span>
        </div>
    );
}

export default function EchoSlot({ Echodata }: StatSlotProps) {
    return (
        <div className="echo-slot-body">
            <div className="echo-image-slot">
                <img className="echo-image" alt="echo icon"
                    src="/default.webp" />
                <img className="harmony-image" alt="echo icon"
                    src="/default.webp" />
                <div className="divider echo"/>
            </div>

            <div className="stat-container main">
                <MakeStatSlot
                    StatId={Echodata?.mainOption.statId}
                    StatValue={Echodata?.mainOption?.statValue ?? -1} />

                <MakeStatSlot
                    StatId={Echodata?.cost === 1 ? "hp" : "atk"}
                    StatValue={(() => {
                        switch(Echodata?.cost) {
                            case 4: return 150;
                            case 3: return 100;
                            case 1: return 2280;
                            default: return -1;
                        }
                    })()} />
            </div>

            <div className="divider stat"/>

            <div className="stat-container sub">
                <MakeStatSlot
                    StatId={Echodata?.subOptions[0].statId}
                    StatValue={Echodata?.subOptions[0].statValue || -1} />

                <MakeStatSlot
                    StatId={Echodata?.subOptions[1].statId}
                    StatValue={Echodata?.subOptions[1].statValue || -1} />

                <MakeStatSlot
                    StatId={Echodata?.subOptions[2].statId}
                    StatValue={Echodata?.subOptions[2].statValue || -1} />

                <MakeStatSlot
                    StatId={Echodata?.subOptions[3].statId}
                    StatValue={Echodata?.subOptions[3].statValue || -1} />

                <MakeStatSlot
                    StatId={Echodata?.subOptions[4].statId}
                    StatValue={Echodata?.subOptions[4].statValue || -1} />
            </div>

            <div className="divider stat"/>

            <div className="score-container">
                <img alt="rank icon" src="/ico/rank/SSS.png"/>
                <div className="slot">
                    <span className="en-font">Cv.</span>
                    <span className="en-font"> <em className="num-font">23.4</em>pt</span>
                </div>
                <div className="slot">
                    <span className="en-font">Av.</span>
                    <span className="en-font"> <em className="num-font">123.4</em>pt</span>
                </div>
            </div>
        </div>
    )
}