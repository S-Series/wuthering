import { useMemo, useState } from "react";

import { useElevatedOverlay } from "@/contexts/useElevatedOverlay";
import { locale } from "@/locales/locale";
import { useAppStore } from "@/stores/appStore";

import OcrImageInput, { type OcrDebugData } from "./OcrImageInput";
import OcrSelect from "./OcrSelect";

import "./OcrSlot.css";

type EchoIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export default function OcrPlayground() {
  const { lang } = useAppStore();
  const { openElevatedOverlay } = useElevatedOverlay();
  const [debug, setDebug] = useState<OcrDebugData | null>();
  const [selectIdx, setSelectIdx] = useState<EchoIndex>(0);

  const localeText = useMemo(() => locale(lang), [lang]);

  const openImageInput = () => {
    openElevatedOverlay(
      <OcrImageInput
        selectIdx={selectIdx}
        onSelectIdx={setSelectIdx}
        initialDebug={debug}
        onDebugChange={setDebug}
      />,
      {
        title: localeText.card.imageInput,
        width: "min(92vw, 64rem, calc((100dvh - 2rem) * 4 / 3))",
        height: null,
        ratio: "4 / 3",
      },
    );
  };

  return (
    <div className="ocr-comp-body echo-data-manager">
      <div className="ocr-slot echo">
        <div className="ocr-data-editor">
          <OcrSelect
            selectIdx={selectIdx}
            setSelectIdx={setSelectIdx}
            onImageInput={openImageInput}
          />
        </div>
      </div>
    </div>
  );
}
