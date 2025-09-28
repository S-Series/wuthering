import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { useProfile } from "../hooks/useProfile";
import { useStyleHelper } from "../hooks/useStyleHelpers";
import { FixedStats } from "../data/Stats";

function EchoStatDrop({ index = 0, sizeValue = 1 }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { lang, echoList, PatchEchoStat } = useProfile();
  const { setSlotStyle } = useStyleHelper(sizeValue);
  const UI_COLOR = ["#333366ff", "#0b0b44ff", "#0b0b44ff"];

  const [statFilter, setStatFilter] = useState(() =>
    Array(5).fill([FixedStats.dummy.id, 0])
  );
   
  const statOption = useMemo(() => {
    return Object.values(FixedStats)
      .filter((item) => item.id !== "dummy")
      .filter((item) => item.ValueSub !== null)
      .filter((item) => !statFilter.includes(item.id))
      .map((item) => ({
        value: item.id,
        label: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}>
            <img
              alt=""
              src={`${apiUrl}/static/ico/stats/${item.id}.webp`}
              style={{
                width: `${50 * sizeValue}px`,
                height: `${50 * sizeValue}px`,
                overflow: "visible",
                transform: `translateX(-${10 * sizeValue}px)`,
                overflow: "visible",
              }}
            />
            <span className={`${lang}Font`} style={{color: "#fff"}}>{item[lang] ?? "error"}</span>
          </div>
        ),
      }));
  }, [lang, statFilter, sizeValue]);
  const statValueOption = useMemo(() => {
    return [0, 1, 2, 3, 4].map((index) => {
      const target = Object.values(FixedStats).find(
        (item) => item.id === statFilter[index]
      );
      if (!target) return [];

      return target.ValueSub.map((subValue, idx) => ({
        value: subValue,
        label: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}>
            <img
              alt=""
              src={`${apiUrl}/static/ico/stats/${target.id}.webp`}
              style={{
                width: `${50 * sizeValue}px`,
                height: `${50 * sizeValue}px`,
                overflow: "visible",
                transform: `translateX(-${10 * sizeValue}px)`,
                overflow: "visible",
              }}
            />
            <span className={`${lang}Font`} style={{color: "#fff"}}>{subValue}</span>
          </div>
        ),
      }));
    });
  }, [lang, statFilter, sizeValue]);

  return (
    <div style={{ pointerEvents: "auto" }}>
      <div
        className="divider"
        style={{
          ...setSlotStyle({ w: 575, h: 2, x: 12.5, y: 200 }),
          backgroundColor: "#ffffff33",
        }}
      />
      {[...Array(5)].map((item, idx) => (
        <div key={idx}>
          <div
            style={{
              ...setSlotStyle({ w: 330, h: 50, x: 15, y: 232 + idx * 116 }),
            }}>
            <Select
              options={statOption}
              menuPlacement="auto"
              placeholder={
                Object.values(FixedStats).find(
                  (item) => item.id === echoList[index].subStats[idx][0]
                ).id === "dummy" ? (
                  <span className={`${lang}Font`}>Sub Stats</span>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}>
                    <img
                      alt=""
                      src={`${apiUrl}/static/ico/stats/${
                        echoList[index].subStats[idx][0]
                      }.webp`}
                      style={{
                        width: `${50 * sizeValue}px`,
                        height: `${50 * sizeValue}px`,
                        overflow: "visible",
                        transform: `translateX(-${10 * sizeValue}px)`,
                        overflow: "visible",
                      }}
                    />
                    <span className={`${lang}Font`} style={{ color: "#fff" }}>
                      {
                        Object.values(FixedStats).find(
                          (item) =>
                            item.id === echoList[index].subStats[idx][0]
                        )[lang]
                      }
                    </span>
                  </div>
                )
              }
              isClearable
              styles={{
                menu: (prev) => ({
                  ...prev,
                  width: "fit-content",
                  minWidth: "100%",
                  maxWidth: "200%",
                  backgroundColor: UI_COLOR[2],
                  overflowX: "hidden",
                }),
                menuList: (prev) => ({
                  ...prev,
                  backgroundColor: UI_COLOR[2],
                }),
                option: (prev) => ({
                  ...prev,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
                }),
                singleValue: (prev) => ({
                  ...prev,
                  overflow: "visible",
                }),
                control: (prev) => ({
                  ...prev,
                  background: `linear-gradient(0deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
                }),
              }}
              onChange={(opt) => {
                console.log("main stat changed");
                const newId = opt ? opt.value : FixedStats.dummy.id;
                setStatFilter((prev) =>
                  prev.map((v, i) => (i === idx ? newId : v))
                );
                PatchEchoStat(index, idx, [newId, -1]);
              }}
            />
          </div>
          <div
            style={{
              ...setSlotStyle({ w: 225, h: 50, x: 360, y: 232 + idx * 116 }),
            }}>
            <Select
              options={statValueOption[idx]}
              menuPlacement="auto"
              placeholder={
                Object.values(FixedStats).find(
                  (item) => item.id === echoList[index].subStats[idx][0]
                ).id === "dummy" ? (
                  <span className={`${lang}Font`}>Values</span>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}>
                    <img
                      alt=""
                      src={`${apiUrl}/static/ico/stats/${
                        echoList[index].subStats[idx][0]
                      }.webp`}
                      style={{
                        width: `${50 * sizeValue}px`,
                        height: `${50 * sizeValue}px`,
                        overflow: "visible",
                        transform: `translateX(-${10 * sizeValue}px)`,
                        overflow: "visible",
                      }}
                    />
                    <span className={`${lang}Font`} style={{ color: "#fff" }}>
                      {
                        (Object.values(FixedStats).find(
                          (item) =>
                            item.id === echoList[index].subStats[idx][1]
                        ) ?? "dummy")[lang]
                      }
                    </span>
                  </div>
                )
              }
              styles={{
                menu: (prev) => ({
                  ...prev,
                  width: "100%",
                  minWidth: "100%",
                  overflowX: "hidden",
                }),
                singleValue: (prev) => ({
                  ...prev,
                  overflow: "visible",
                }),
                control: (prev) => ({
                  ...prev,
                  background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
                }),
              }}
              onChange={(opt) => {
                console.log("sub value changed");
                const statId = echoList[index].subStats[idx][0];
                const newVal = opt ? opt.value : -1;
                PatchEchoStat(index, idx, [statId, FixedStats[statId].ValueSub.findIndex(item => item === newVal)]);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
export default EchoStatDrop;
