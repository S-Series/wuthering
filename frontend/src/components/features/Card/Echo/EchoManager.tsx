import { useState } from "react";

import EchoOcrPanel from "./Ocr/EchoOcrPanel";
import EchoManagerLayout from "./EchoManagerLayout";

import "./EchoManager.css";

type EchoIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export default function EchoManager() {
  const [selectIdx, setSelectIdx] = useState<EchoIndex>(0);

  return (
    <div className="ocr-comp-body echo-data-manager">
      <div className="echo-manager-section echo">
        <div className="echo-manager-content">
          <EchoManagerLayout
            selectIdx={selectIdx}
            setSelectIdx={setSelectIdx}
            ocrPanel={
              <EchoOcrPanel
                selectIdx={selectIdx}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
