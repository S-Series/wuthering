import type { EchoRuntime } from "@/runtime/echo.runtime";
import { useAppStore } from "@/stores/appStore";

type Props = {
  idx: number;
  echoData: EchoRuntime | null;
  isLocked: boolean;
  isSelected: boolean;
  onClick: (idx: number) => void;
};

export default function OcrSelectItem({idx, echoData, isLocked, isSelected, onClick}: Props) {
  const { lang } = useAppStore();
  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;

  return (
    <div className={`echo-item ${isLocked ? "locked" : ""} ${isSelected ? "selected" : ""}`}
      onClick={() => {
        if (!isLocked) onClick(idx);
      }}>
      <img src={`${BASE_URL}/ico/echos/${echoData?.echoId}.webp`}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/default.webp"
        }}/>
      <span className={`${lang}-font`}>
        {echoData
          ? echoData.echoId
          : "Empty Slot"
        }
      </span>
    </div>
  )
}