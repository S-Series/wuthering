import EchoSelect from "./EchoSelect";
import EchoDragSelect from "./EchoDragSelect";

import "./OcrSelect.css";
import { useState } from "react";
import { useAppStore } from "@/stores/appStore";

type EchoIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Props = {
	debugText: string;
  selectIdx: EchoIndex;
  setSelectIdx: React.Dispatch<React.SetStateAction<EchoIndex>>;
};
export default function OcrSelect({ debugText, selectIdx, setSelectIdx }: Props) {
	const { lang } = useAppStore();
  const [isShowDebug, setShowDebug] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        flexDirection: "column",
      }}
    >
      <div className="ocr-select-body">
        <div className="select-item-slot">
          <span className="item-slot-title"> 에코 목록 </span>

          <div className="item-slot-container">
            <EchoDragSelect num={selectIdx} onClick={setSelectIdx} />
          </div>
        </div>

        <div className="select-item-slot">
          <span className="item-slot-title"> 에코 데이터 </span>

          <div className="item-slot-container">
            <EchoSelect index={selectIdx as EchoIndex} />
          </div>
        </div>
      </div>

      <div className={`ocr-debug-slot ${isShowDebug ? "active" : ""}`}>
        <p className={`${lang}-font`}>{debugText}</p>
      </div>

      <button
        className="ocr-debug-button"
        onClick={() => setShowDebug((v) => !v)}
      >
        asdf
      </button>
    </div>
  );
}
