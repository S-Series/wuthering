import { useMemo, useState } from "react";
import Select, { components } from "react-select";
import { useProfile } from "../hooks/useProfile";
import { useStyleHelper } from "../hooks/useStyleHelpers";

import { FixedStats, FixedStatsMain4, FixedStatsMain3, FixedStatsMain1 } from "../data/Stats";

function EchoStatDrop({ index = 0, sizeValue = 1 }) {
  const apiUrl = process.env.REACT_APP_API_URL;

  const lang = useProfile();
  const { setSlotStyle } = useStyleHelper(sizeValue);
  const {echoList, EditEchoList} = useProfile();
  const echoData = useMemo(() => {
    return echoList[index];
  }, [echoList]);

  const dataIndex = useMemo(() => {
    if (echoData.cost === 1) return 2;
    else if (echoData.cost === 3) return 1;
    else return 0; 
  }, [echoData])

  const statsSelectOption = useMemo(() => {
    return Object.values(FixedStats).map((item) => ({
      value: item.id,
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
            {item[lang === "en" ? "id" : lang] ?? "error"}
          </span>
        </div>
      ),
    }));
  }, [lang, sizeValue]);

  console.log(statsSelectOption);

  // size is 600 * 816
  return (
    <div
      style={{
        pointerEvents: "auto",
      }}
    >
      <div
        className="divider"
        style={{
          ...setSlotStyle({ w: 575, h: 2, x: 12.5, y: 156 }),
          backgroundColor: "#ffffff33",
        }}
      />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="">
          <div
            style={{
              ...setSlotStyle({ w: 300, h: 50, x: 15, y: 232 + i * 116 }),
            }}
          >
            <Select options={statsSelectOption} />
          </div>
          <div
            style={{
              ...setSlotStyle({ w: 250, h: 50, x: 335, y: 232 + i * 116 }),
            }}
          >
            <Select options={statsSelectOption} />
          </div>
        </div>
      ))}
    </div>
  );
}
export default EchoStatDrop;
