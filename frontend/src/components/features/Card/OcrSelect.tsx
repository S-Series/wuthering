import EchoSelect from "./EchoSelect";
import EchoDragSelect from "./EchoDragSelect";

import "./OcrSelect.css";
import { locale } from "@/locales/locale";
import { useAppStore } from "@/stores/appStore";

type EchoIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Props = {
  selectIdx: EchoIndex;
  setSelectIdx: React.Dispatch<React.SetStateAction<EchoIndex>>;
  onImageInput: () => void;
};
export default function OcrSelect({
  selectIdx,
  setSelectIdx,
  onImageInput,
}: Props) {
	const { lang } = useAppStore();
  const localeText = locale(lang);

  return (
    <div className="ocr-select-layout">
      <div className="ocr-select-body">
        <div className="select-item-slot">
          <span className="item-slot-title">{localeText.ocr.echoList}</span>

          <div className="item-slot-container">
            <EchoDragSelect num={selectIdx} onClick={setSelectIdx} />
          </div>
        </div>

        <div className="select-item-slot">
          <span className="item-slot-title">{localeText.ocr.echoData}</span>

          <div className="item-slot-container">
            <EchoSelect index={selectIdx as EchoIndex} />
          </div>

          <div className="ocr-select-actions">
            <button type="button" 
              onClick={onImageInput}
              disabled={true}
              style={{opacity:"0.25"}}>
              {localeText.card.imageInput} (점검중)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
