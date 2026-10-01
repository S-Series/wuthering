import EchoEditor from "./EchoEditor";
import EchoInventoryBoard from "./EchoInventoryBoard";

import "./EchoManagerLayout.css";
import { locale } from "@/locales/locale";
import { useAppStore } from "@/stores/appStore";
import type { ReactNode } from "react";
import { useElevatedOverlay } from "@/contexts/useElevatedOverlay";
import EchoBatchOcrDialog from "./Ocr/EchoBatchOcrDialog";

type EchoIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Props = {
  selectIdx: EchoIndex;
  setSelectIdx: React.Dispatch<React.SetStateAction<EchoIndex>>;
  ocrPanel: ReactNode;
};
export default function EchoManagerLayout({
  selectIdx,
  setSelectIdx,
  ocrPanel,
}: Props) {
	const { lang } = useAppStore();
  const { openElevatedOverlay } = useElevatedOverlay();
  const localeText = locale(lang);

  return (
    <div className="echo-manager-layout">
      <div className="echo-manager-layout__body">
        <div className="select-item-slot">
          <div className="item-slot-heading">
            <span className="item-slot-title">{localeText.ocr.echoList}</span>
            <span className="item-slot-help">{localeText.ocr.echoOrderHelp}</span>
            <button
              type="button"
              className="echo-manager-layout__batch-ocr-button"
              onClick={() =>
                openElevatedOverlay(
                  <EchoBatchOcrDialog startIndex={selectIdx} />,
                  {
                    title: localeText.ocr.batchTitle,
                    width: "min(92vw, 64rem)",
                    height: "min(80vh, 46rem)",
                    ratio: null,
                    closeOnBackdrop: false,
                  },
                )
              }
            >
              {localeText.ocr.batchInput}
            </button>
          </div>

          <div className="item-slot-container">
            <EchoInventoryBoard
              num={selectIdx}
              onClick={setSelectIdx}
              ocrPanel={ocrPanel}
            />
          </div>
        </div>

        <div className="select-item-slot">
          <span className="item-slot-title">{localeText.ocr.echoData}</span>

          <div className="item-slot-container">
            <EchoEditor index={selectIdx as EchoIndex} />
          </div>
        </div>
      </div>
    </div>
  );
}
