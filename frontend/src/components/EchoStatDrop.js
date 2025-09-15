import { useMemo, useState } from "react";
import Select from "react-select";
import { useProfile } from "../hooks/useProfile";
import { useStyleHelper } from "../hooks/useStyleHelpers";
import { FixedStats } from "../data/Stats";

function EchoStatDrop({ index = 0, sizeValue = 1 }) {
  const lang = useProfile();
  const { setSlotStyle } = useStyleHelper(sizeValue);

  console.log(Object.values(FixedStats).map((stat) => stat.kr));

  const statsSelectOption = useMemo(() => {
    return Object.values(FixedStats).map((stat) => ({
      value: stat.id,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${10 * sizeValue}px`,
          }}
        >
          <img
            alt=""
            src={`/default.webp`}
            style={{
              width: `${75 * sizeValue}px`,
              height: `${75 * sizeValue}px`,
              transform: `translateX(-${10 * sizeValue}px)`,
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <span
            className={`${lang}Font`}
            style={{ fontSize: `${32 * sizeValue}px` }}
          >
            {stat[lang === "en" ? "id" : lang] ?? "error"}
          </span>
        </div>
      ),
    }));
  }, [lang, sizeValue]);

  const [primarySel, setPrimarySel] = useState(Array(5).fill(null));
  const [secondarySel, setSecondarySel] = useState(Array(5).fill(null));

  const makeValue = (val) =>
    val == null ? null : statsSelectOption.find((o) => o.value === val) ?? null;

  const isDisabledPrimary = (rowIndex) => (option) => {
    if (secondarySel[rowIndex] === option.value) return true;
    for (let i = 0; i < primarySel.length; i++) {
      if (i !== rowIndex && primarySel[i] === option.value) return true;
    }
    return false;
  };

  const isDisabledSecondary = (rowIndex) => (option) => {
    if (primarySel[rowIndex] === option.value) return true;
    for (let i = 0; i < secondarySel.length; i++) {
      if (i !== rowIndex && secondarySel[i] === option.value) return true;
    }
    return false;
  };

  const onChangePrimary = (rowIndex) => (opt) => {
    const v = opt?.value ?? null;
    setPrimarySel((prev) => {
      const next = [...prev];
      next[rowIndex] = v;
      return next;
    });
  };

  const onChangeSecondary = (rowIndex) => (opt) => {
    const v = opt?.value ?? null;
    setSecondarySel((prev) => {
      const next = [...prev];
      next[rowIndex] = v;
      return next;
    });
  };

  return (
    <div style={{ pointerEvents: "auto" }}>
      <div
        className="divider"
        style={{
          ...setSlotStyle({ w: 575, h: 2, x: 12.5, y: 156 }),
          backgroundColor: "#ffffff33",
        }}
      />
      {[...Array(5)].map((_, i) => (
        <div key={i}>
          <div style={{ ...setSlotStyle({ w: 300, h: 50, x: 15, y: 232 + i * 116 }) }}>
            <Select
              options={statsSelectOption}
              value={makeValue(primarySel[i])}
              onChange={onChangePrimary(i)}
              isClearable
              placeholder="Type"
              isOptionDisabled={isDisabledPrimary(i)}
            />
          </div>
          <div style={{ ...setSlotStyle({ w: 250, h: 50, x: 335, y: 232 + i * 116 }) }}>
            <Select
              options={statsSelectOption}
              value={makeValue(secondarySel[i])}
              onChange={onChangeSecondary(i)}
              isClearable
              placeholder="Element"
              isOptionDisabled={isDisabledSecondary(i)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default EchoStatDrop;
