import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { useProfile } from "../hooks/useProfile";
import { useStyleHelper } from "../hooks/useStyleHelpers";
import { FixedStats } from "../data/Stats";
import { echoDict, harmony } from "../data/Echo";

function EchoStatDrop({ index = 0, sizeValue = 1 }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { lang, echoList, PatchEchoStat, PatchEchoMainStat } = useProfile();
  const { setSlotStyle } = useStyleHelper(sizeValue);
  const UI_COLOR = ["#333366ff", "#0b0b44ff", "#0b0b44ff"];

  const [statFilter, setStatFilter] = useState(() =>
    Array(5).fill([FixedStats.dummy.id, 0])
  );
  useEffect(() => {
    const filterData = [
      echoList[index].subStats[0][0],
      echoList[index].subStats[1][0],
      echoList[index].subStats[2][0],
      echoList[index].subStats[3][0],
      echoList[index].subStats[4][0],
    ]
    setStatFilter(filterData);
  }, [index, echoList])
  const defaultSelectOption = {
    control: (base) => ({
      ...base,
      overflow: "visible",
      background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
    }),
    option: (prev) => ({
      ...prev,
      whiteSpace: "nowrap",
      background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
    }),
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
    menuList: (prev) => ({
      ...prev,
      backgroundColor: UI_COLOR[2],
    }),
  };
  function costToIndex(cost) {
    if (cost === 4) return 0;
    else if (cost === 3) return 1;
    else return 2;
  }
   
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
  }, [statFilter, apiUrl, sizeValue, lang]);
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
  }, [statFilter, apiUrl, sizeValue, lang]);

  console.log(`Cost${echoList[index]?.cost}`);

  const ECHO_SELECT_OPTION = Object.values(
    echoDict[`Cost${echoList[index]?.cost}`] || []
  ).map((item) => ({
    value: item.id,
    label: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: `${25 * sizeValue}px`,
        }}>
        <img
          alt=""
          src={`${apiUrl}/static/ico/echos/${item.id ?? "default"}.webp`}
          style={{
            width: `${75 * sizeValue}px`,
            height: `${75 * sizeValue}px`,
            alignSelf: "center",
          }}
        />
        <span
          className={`${lang}Font`}
          style={{ fontSize: `${32 * sizeValue}px`, color: "#fff"}}>
          {`${item[lang] || { Set }}`}
        </span>
      </div>
    ),
  }));
  const MAIN_STAT_OPTION = Object.values(FixedStats)
    .filter((item) => item.id !== "dummy")
    .filter((item) => item.ValueMain !== null)
    .filter(
      (item) => item.ValueMain[costToIndex(echoList[index]?.cost)] !== null
    )
    .map((item) => ({
      value: item.id,
      label: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: `${25 * sizeValue}px`,
        }}>
        <img
          alt=""
          src={`${apiUrl}/static/ico/stats/${item.id ?? "default"}.webp`}
          style={{
            width: `${50 * sizeValue}px`,
            height: `${50 * sizeValue}px`,
            alignSelf: "center",
          }}
        />
        <span
          className={`${lang}Font`}
          style={{ fontSize: `${32 * sizeValue}px`, color: "#fff"}}>
          {`${item[lang] || { Set }}`}
        </span>
      </div>
    ),
    }));
  const HARMONY_SELECT_OPTION = Object.values(harmony).map((item) => ({
    value: item.id,
    label: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: `${25 * sizeValue}px`,
        }}>
        <img
          alt=""
          src={`${apiUrl}/static/ico/harmony/${item.id ?? "default"}.webp`}
          style={{
            width: `${50 * sizeValue}px`,
            height: `${50 * sizeValue}px`,
            alignSelf: "center",
          }}
        />
        <span
          className={`${lang}Font`}
          style={{ fontSize: `${32 * sizeValue}px`, color: "#fff"}}>
          {`${item[lang] || { Set }}`}
        </span>
      </div>
    ),
  }));

  return (
    <div style={{ pointerEvents: "auto", zIndex: 750, position: "absolute" }}>
      <div style={setSlotStyle({ w: 350, h: 140, x: 0, y: 0 })}>
        <Select
          options={ECHO_SELECT_OPTION}
          isClearable={true}
          menuPlacement="auto"
          placeholder={<span className={`${lang}Font`}>Echo</span>}
          styles={{
            ...defaultSelectOption,
            control: (base) => ({
              ...base,
              overflow: "visible",
              width: `${350 * sizeValue}px`,
              height: `${120 * sizeValue}px`,
              background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
            }),
            menu: (prev) => ({
              ...prev,
              width: "fit-content",
              minWidth: "100%",
              maxWidth: "200%",
              backgroundColor: UI_COLOR[2],
              overflowX: "hidden",
            }),
          }}
        />
      </div>
      <div
        style={{
          ...setSlotStyle({ w: 235, h: 80, x: 365, y: 20 }),
        }}>
        <Select
          options={HARMONY_SELECT_OPTION}
          isClearable={true}
          menuPlacement="auto"
          placeholder={<span className={`${lang}Font`}>Harmony</span>}
          styles={{
            ...defaultSelectOption,
            control: (base) => ({
              ...base,
              overflow: "visible",
              width: `${235 * sizeValue}px`,
              height: `${80 * sizeValue}px`,
              background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
            }),
            menu: (prev) => ({
              ...prev,
              width: "fit-content",
              right: 0,
              minWidth: "100%",
              maxWidth: "200%",
              backgroundColor: UI_COLOR[2],
              overflowX: "hidden",
            }),
          }}
        />
      </div>
      <div style={setSlotStyle({ w: 350, h: 80, x: 0, y: 140 })}>
        <Select
          options={MAIN_STAT_OPTION}
          isClearable={true}
          menuPlacement="auto"
          placeholder={<span className={`${lang}Font`}>Main Stats</span>}
          styles={{
            ...defaultSelectOption,
            menu: (prev) => ({
              ...prev,
              width: "fit-content",
              minWidth: "100%",
              maxWidth: "200%",
              backgroundColor: UI_COLOR[2],
              overflowX: "hidden",
            }),
          }}
        />
      </div>
      <div
        className="divider"
        style={{
          ...setSlotStyle({ w: 575, h: 2, x: 12.5, y: 220 }),
          backgroundColor: "#ffffff33",
        }}
      />
      {[...Array(5)].map((item, idx) => (
        <div key={idx}>
          <div
            style={{
              ...setSlotStyle({ w: 350, h: 50, x: 0, y: 240 + idx * 100 }),
            }}>
            <Select
              options={statOption}
              menuPlacement="auto"
              value={
                statFilter[idx] === FixedStats.dummy.id
                  ? null
                  : {
                      value: statFilter[idx],
                      label: (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}>
                          <img
                            alt=""
                            src={`${apiUrl}/static/ico/stats/${statFilter[idx]}.webp`}
                            style={{
                              width: `${50 * sizeValue}px`,
                              height: `${50 * sizeValue}px`,
                              overflow: "visible",
                              transform: `translateX(-${10 * sizeValue}px)`,
                              overflow: "visible",
                            }}
                          />
                          <span
                            className={`${lang}Font`}
                            style={{ color: "#fff" }}>
                            {FixedStats?.[statFilter?.[idx]]?.[
                              lang ? lang : "id"
                            ] || "error"}
                          </span>
                        </div>
                      ),
                    }
              }
              placeholder={<span className={`${lang}Font`}>Sub Stats</span>}
              isClearable
              styles={{
                ...defaultSelectOption,
                menu: (prev) => ({
                  ...prev,
                  width: "fit-content",
                  minWidth: "100%",
                  maxWidth: "200%",
                  backgroundColor: UI_COLOR[2],
                  overflowX: "hidden",
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
              ...setSlotStyle({ w: 235, h: 50, x: 365, y: 240 + idx * 100 }),
            }}>
            <Select
              options={statValueOption[idx]}
              menuPlacement="auto"
              value={
                statFilter[idx] === FixedStats.dummy.id
                  ? null
                  : {
                      value: statFilter[idx],
                      label: (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}>
                          <img
                            alt=""
                            src={`${apiUrl}/static/ico/stats/${statFilter[idx]}.webp`}
                            style={{
                              width: `${50 * sizeValue}px`,
                              height: `${50 * sizeValue}px`,
                              overflow: "visible",
                              transform: `translateX(-${10 * sizeValue}px)`,
                              overflow: "visible",
                            }}
                          />
                          <span
                            className={`${lang}Font`}
                            style={{ color: "#fff" }}>
                            {FixedStats?.[statFilter?.[idx]]?.ValueSub[
                              echoList[index].subStats[idx][1]
                            ] || "error"}
                          </span>
                        </div>
                      ),
                    }
              }
              placeholder={<span className={`${lang}Font`}>Values</span>}
              styles={{
                ...defaultSelectOption,
              }}
              onChange={(opt) => {
                console.log("sub value changed");
                const statId = echoList[index].subStats[idx][0];
                const newVal = opt ? opt.value : -1;
                PatchEchoStat(index, idx, [
                  statId,
                  FixedStats[statId].ValueSub.findIndex(
                    (item) => item === newVal
                  ),
                ]);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
export default EchoStatDrop;
