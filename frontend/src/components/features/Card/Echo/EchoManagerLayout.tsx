import EchoEditor from "./EchoEditor";
import EchoInventoryBoard from "./EchoInventoryBoard";

import "./EchoManagerLayout.css";
import { locale } from "@/locales/locale";
import { useAppStore } from "@/stores/appStore";
import type { ReactNode } from "react";

type EchoIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Props = {
  selectIdx: EchoIndex;
  setSelectIdx: React.Dispatch<React.SetStateAction<EchoIndex>>;
  ocrPanel: ReactNode;
  onOpenMultiImageInput?: () => void;
};
export default function EchoManagerLayout({
  selectIdx,
  setSelectIdx,
  ocrPanel,
  onOpenMultiImageInput,
}: Props) {
	const { lang } = useAppStore();
  const localeText = locale(lang);

  return (
    <div className="echo-manager-layout">
      <div className="echo-manager-layout__body">
        <div className="select-item-slot">
          <div className="item-slot-heading">
            <span className="item-slot-title">{localeText.ocr.echoList}</span>
            <button
              type="button"
              className="echo-manager-layout__multi-image-button"
              aria-haspopup="dialog"
              disabled={!onOpenMultiImageInput}
              onClick={onOpenMultiImageInput}
            >
              이미지 여러장 입력
            </button>
            <span className="item-slot-help">{localeText.ocr.echoOrderHelp}</span>
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
