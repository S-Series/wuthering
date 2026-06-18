import { useEffect, useMemo, useState } from "react";

type GuideStep = {
  target: string;
  title: string;
  description: string;
};

type HighlightRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type Props = {
  dismissed: boolean;
  onDismissedChange: (value: boolean) => void;
  onClose: () => void;
};

const GUIDE_STEPS: GuideStep[] = [
  {
    target: "management",
    title: "데이터 관리",
    description:
      "캐릭터와 무기 데이터를 바꾸거나, 에코 데이터를 OCR/수동 입력으로 정리하는 곳입니다. 클라우드 동기화는 준비 중인 기능입니다.",
  },
  {
    target: "actions",
    title: "이미지 생성",
    description:
      "현재 카드 상태로 이미지를 생성하고, 생성된 이미지가 있으면 다운로드 창을 열 수 있습니다.",
  },
  {
    target: "preview",
    title: "명함 미리보기",
    description:
      "캐릭터 이미지, 무기, 스탯, 에코 점수를 한 장의 카드로 확인합니다. 캐릭터 이미지를 클릭하면 캐릭터/무기 선택 창이 열립니다.",
  },
  {
    target: "detail",
    title: "추천 가이드",
    description:
      "선택한 캐릭터의 추천 파티, 무기, 에코, 주옵션/부옵션, 목표 스탯을 한 번에 확인하는 영역입니다.",
  },
  {
    target: "scoreboard",
    title: "에코 점수표",
    description:
      "에코 점수 기준표를 새 창으로 열어 현재 세팅 점수를 비교할 수 있습니다.",
  },
];

function getStepIndexFromHash() {
  const match = window.location.hash.match(/^#card-guide-(\d+)$/);
  if (!match) return 0;

  const parsed = Number(match[1]) - 1;
  if (!Number.isFinite(parsed)) return 0;

  return Math.min(Math.max(0, parsed), GUIDE_STEPS.length - 1);
}

function getStepHash(index: number) {
  return index === 0 ? "#card-guide" : `#card-guide-${index + 1}`;
}

function getTargetRect(target: string): HighlightRect | null {
  const element = document.querySelector<HTMLElement>(
    `[data-card-guide="${target}"]`
  );

  if (!element) return null;

  const rect = element.getBoundingClientRect();
  const padding = Math.min(window.innerWidth * 0.012, 12);

  return {
    height: rect.height + padding * 2,
    left: rect.left - padding,
    top: rect.top - padding,
    width: rect.width + padding * 2,
  };
}

export default function CardGuideOverlay({
  dismissed,
  onDismissedChange,
  onClose,
}: Props) {
  const [stepIndex, setStepIndex] = useState(getStepIndexFromHash);
  const [rect, setRect] = useState<HighlightRect | null>(null);

  const currentStep = GUIDE_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === GUIDE_STEPS.length - 1;

  const panelStyle = useMemo(() => {
    const panelWidth = Math.min(window.innerWidth * 0.86, 360);
    const viewportPadding = Math.min(window.innerWidth * 0.04, 24);

    if (!rect) {
      return {
        left: `${Math.max(viewportPadding, (window.innerWidth - panelWidth) / 2)}px`,
        top: `${Math.max(viewportPadding, window.innerHeight * 0.22)}px`,
        width: `${panelWidth}px`,
      };
    }

    const nextToTarget = rect.left + rect.width + viewportPadding;
    const hasRightSpace = nextToTarget + panelWidth < window.innerWidth;
    const hasLeftSpace = rect.left - viewportPadding - panelWidth > viewportPadding;
    const belowTarget = rect.top + rect.height + viewportPadding;
    const hasBottomSpace = belowTarget + 210 < window.innerHeight;

    const left = hasRightSpace
      ? nextToTarget
      : hasLeftSpace
        ? rect.left - viewportPadding - panelWidth
        : Math.min(
            Math.max(viewportPadding, rect.left),
            window.innerWidth - panelWidth - viewportPadding
          );

    const top = hasRightSpace || hasLeftSpace
      ? Math.min(
          Math.max(viewportPadding, rect.top),
          window.innerHeight - 230 - viewportPadding
        )
      : hasBottomSpace
        ? belowTarget
        : Math.max(viewportPadding, rect.top - 230 - viewportPadding);

    return {
      left: `${left}px`,
      top: `${top}px`,
      width: `${panelWidth}px`,
    };
  }, [rect]);

  useEffect(() => {
    const onHashChange = () => setStepIndex(getStepIndexFromHash());

    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  useEffect(() => {
    const updateRect = () => setRect(getTargetRect(currentStep.target));
    const target = document.querySelector<HTMLElement>(
      `[data-card-guide="${currentStep.target}"]`
    );

    target?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });

    const measureId = window.setTimeout(updateRect, 220);

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      window.clearTimeout(measureId);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [currentStep.target]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && !isLast) {
        window.location.hash = getStepHash(stepIndex + 1);
      }
      if (event.key === "ArrowLeft" && !isFirst) {
        window.location.hash = getStepHash(stepIndex - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFirst, isLast, onClose, stepIndex]);

  return (
    <div
      aria-modal="true"
      className="card-guide-overlay"
      role="dialog"
    >
      {rect && (
        <div
          aria-hidden="true"
          className="card-guide-spotlight"
          style={{
            height: `${rect.height}px`,
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
          }}
        />
      )}

      <div className="card-guide-panel" style={panelStyle}>
        <div className="card-guide-progress">
          <span>{`${stepIndex + 1} / ${GUIDE_STEPS.length}`}</span>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              onClose();
            }}
          >
            닫기
          </a>
        </div>

        <h2>{currentStep.title}</h2>
        <p>{currentStep.description}</p>

        <label className="card-guide-dismiss-option">
          <input
            type="checkbox"
            checked={dismissed}
            onChange={(event) => {
              onDismissedChange(event.currentTarget.checked);
            }}
          />
          <span>다시 보지 않기</span>
        </label>

        <div className="card-guide-actions">
          <a
            aria-disabled={isFirst}
            className={isFirst ? "disabled" : ""}
            href={isFirst ? getStepHash(stepIndex) : getStepHash(stepIndex - 1)}
          >
            이전
          </a>
          <a
            href={isLast ? "#" : getStepHash(stepIndex + 1)}
            onClick={
              isLast
                ? (event) => {
                    event.preventDefault();
                    onClose();
                  }
                : undefined
            }
          >
            {isLast ? "완료" : "다음"}
          </a>
        </div>
      </div>
    </div>
  );
}
