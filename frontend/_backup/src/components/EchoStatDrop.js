import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { useProfile } from "../hooks/useProfile";
import { useApi } from "../hooks/useApi";
import { useStyleHelper } from "../hooks/useStyleHelpers";
import { FixedStats } from "../data/Stats";
import { echoDict, harmony } from "../data/Echos";

function EchoStatDrop({ index = 0, sizeValue = 1 }) {
  const { assetApiUrl } = useApi();
  const {
    lang,
    echoList,
    echoScore,
    costToIndex,
    PatchEchoID,
    PatchEchoMainStat,
    PatchEchoStat,
    PatchEchoHarmony,
  } = useProfile();

  const { setSlotStyle } = useStyleHelper(sizeValue);
  const UI_COLOR = ["#333366ff", "#0b0b44ff", "#0b0b44ff"];

  const [statFilter, setStatFilter] = useState(() =>
    Array(5).fill([FixedStats.dummy.id, 0])
  );
  useEffect(() => {
    const sub = echoList?.[index]?.subStats ?? [];
    const filterData = [
      sub?.[0]?.[0] ?? FixedStats.dummy.id,
      sub?.[1]?.[0] ?? FixedStats.dummy.id,
      sub?.[2]?.[0] ?? FixedStats.dummy.id,
      sub?.[3]?.[0] ?? FixedStats.dummy.id,
      sub?.[4]?.[0] ?? FixedStats.dummy.id,
    ];
    setStatFilter(filterData);
  }, [index, echoList]);
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
    valueContainer: (prev) => ({
      ...prev,
      paddingLeft: `${15 * sizeValue}px`,
    }),
  };

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
              src={`${assetApiUrl}/ico/stats/${item.id}.webp`}
              style={{
                width: `${50 * sizeValue}px`,
                height: `${50 * sizeValue}px`,
                overflow: "visible",
                transform: `translateX(-${10 * sizeValue}px)`,
                overflow: "visible",
              }}
            />
            <span className={`${lang}Font`} style={{ color: "#fff" }}>
              {item[lang] ?? "error"}
            </span>
          </div>
        ),
      }));
  }, [statFilter, assetApiUrl, sizeValue, lang]);
  const statValueOption = useMemo(() => {
    return [0, 1, 2, 3, 4].map((index) => {
      const target = Object.values(FixedStats).find(
        (item) => item.id === statFilter[index]
      );
      if (!target) return [];

      return target.ValueSub?.map((subValue, idx) => ({
        value: subValue,
        label: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}>
            <img
              alt=""
              src={`${assetApiUrl}/ico/stats/${target.id}.webp`}
              style={{
                width: `${50 * sizeValue}px`,
                height: `${50 * sizeValue}px`,
                overflow: "visible",
                transform: `translateX(-${10 * sizeValue}px)`,
                overflow: "visible",
              }}
            />
            <span className={`${lang}Font`} style={{ color: "#fff" }}>
              {subValue || ""}
            </span>
          </div>
        ),
      }));
    });
  }, [statFilter, assetApiUrl, sizeValue, lang]);

  const ECHO_SELECT_OPTION = Object.values(
    echoDict[`Cost${echoList[index]?.cost}`] || []
  ).map((item) => ({
    value: item.id,
    list: item.type,
    label: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: `${15 * sizeValue}px`,
        }}>
        <img
          alt=""
          src={`${assetApiUrl}/ico/echos/${item.id ?? "default"}.webp`}
          style={{
            width: `${75 * sizeValue}px`,
            height: `${75 * sizeValue}px`,
            alignSelf: "center",
          }}
        />
        <span
          className={`${lang}Font`}
          style={{ fontSize: `${32 * sizeValue}px`, color: "#fff" }}>
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
          }}>
          <img
            alt=""
            src={`${assetApiUrl}/ico/stats/${item.id ?? "default"}.webp`}
            style={{
              width: `${40 * sizeValue}px`,
              height: `${40 * sizeValue}px`,
              alignSelf: "center",
              transform: `translateX(-${10 * sizeValue}px)`,
            }}
          />
          <span
            className={`${lang}Font`}
            style={{ fontSize: `${32 * sizeValue}px`, color: "#fff" }}>
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
          src={`${assetApiUrl}/ico/harmony/${item.id ?? "default"}.webp`}
          style={{
            width: `${50 * sizeValue}px`,
            height: `${50 * sizeValue}px`,
            alignSelf: "center",
          }}
        />
        <span
          className={`${lang}Font`}
          style={{ fontSize: `${32 * sizeValue}px`, color: "#fff" }}>
          {`${item[lang] || { Set }}`}
        </span>
      </div>
    ),
  }));

  return (
    <div style={{ pointerEvents: "auto", zIndex: 750, position: "absolute" }}>
      <div style={setSlotStyle({ w: 600, h: 140, x: 0, y: 0 })}>
        <Select
          options={
            echoList[index].harmony === "default"
              ? ECHO_SELECT_OPTION
              : ECHO_SELECT_OPTION?.filter((item) =>
                  Object.values(item?.list)?.includes(echoList?.[index]?.harmony)
                )
          }
          isClearable={true}
          menuPlacement="auto"
          placeholder={<span className={`${lang}Font`}>&nbsp;&nbsp;Echo</span>}
          value={
            (echoList[index]?.echoId ?? "") === "default" ||
            !Object.values((echoDict[`Cost${echoList?.[index]?.cost}` ?? "Cost4"]) ?? [])?.some(
              (item) => item?.id === (echoList?.[index]?.echoId || "")
            )
              ? null
              : {
                  value: echoList[index].echoId,
                  label: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: `${15 * sizeValue}px`,
                      }}>
                      <img
                        alt=""
                        src={`${assetApiUrl}/ico/echos/${
                          echoList[index].echoId ?? "default"
                        }.webp`}
                        style={{
                          width: `${75 * sizeValue}px`,
                          height: `${75 * sizeValue}px`,
                          alignSelf: "center",
                        }}
                      />
                      <span
                        className={`${lang}Font`}
                        style={{
                          fontSize: `${32 * sizeValue}px`,
                          color: "#fff",
                        }}>
                        {`${
                          echoDict[`Cost${echoList[index]?.cost}`][
                            echoList[index]?.echoId
                          ][lang] || { Set }
                        }`}
                      </span>
                    </div>
                  ),
                }
          }
          styles={{
            ...defaultSelectOption,
            control: (base) => ({
              ...base,
              overflow: "visible",
              background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
            }),
            valueContainer: (prev) => ({
              ...prev,
              paddingLeft: 0,
            }),
          }}
          onChange={(item) => {
            PatchEchoID(index, item ? item.value : "default");
          }}
        />
      </div>
      <div style={setSlotStyle({ w: 235, h: 80, x: 365, y: 100 })}>
        <Select
          options={(() => {
            const eid = echoList[index].echoId;
            const cost = echoList[index].cost;

            if (eid === "default") return HARMONY_SELECT_OPTION;

            const echo = echoDict[`Cost${cost}`]?.[eid];

            if (echo && Array.isArray(echo.type)) {
              return HARMONY_SELECT_OPTION.filter((opt) =>
                echo.type.includes(opt.value)
              );
            }
            return HARMONY_SELECT_OPTION;
          })()}
          isClearable={true}
          menuPlacement="auto"
          placeholder={<span className={`${lang}Font`}>Harmony</span>}
          value={
            echoList[index].harmony === "default"
              ? null
              : {
                  value: "dummy",
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
                        src={`${assetApiUrl}/ico/harmony/${
                          echoList[index].harmony ?? "default"
                        }.webp`}
                        style={{
                          width: `${50 * sizeValue}px`,
                          height: `${50 * sizeValue}px`,
                          alignSelf: "center",
                        }}
                      />
                      <span
                        className={`${lang}Font`}
                        style={{
                          fontSize: `${32 * sizeValue}px`,
                          color: "#fff",
                        }}>
                        {`${harmony[echoList[index].harmony][lang] || { Set }}`}
                      </span>
                    </div>
                  ),
                }
          }
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
              backgroundColor: UI_COLOR[2],
              overflowX: "hidden",
            }),
          }}
          onChange={(item) => {
            PatchEchoHarmony(index, item ? item.value : "default");
          }}
        />
      </div>
      <div style={setSlotStyle({ w: 350, h: 80, x: 0, y: 100 })}>
        <Select
          options={MAIN_STAT_OPTION}
          isClearable={true}
          menuPlacement="auto"
          placeholder={<span className={`${lang}Font`}>Main Stats</span>}
          value={
            echoList[index].mainStat === FixedStats.dummy.id
              ? null
              : {
                  value: "dummy",
                  label: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                      }}>
                      <img
                        alt=""
                        src={`${assetApiUrl}/ico/stats/${
                          echoList[index].mainStat ?? "default"
                        }.webp`}
                        style={{
                          width: `${50 * sizeValue}px`,
                          height: `${50 * sizeValue}px`,
                          alignSelf: "center",
                          transform: `translateX(-${10 * sizeValue}px)`,
                        }}
                      />
                      <span
                        className={`${lang}Font`}
                        style={{
                          fontSize: `${32 * sizeValue}px`,
                          color: "#fff",
                        }}>
                        {FixedStats?.[echoList[index].mainStat]?.[lang] ||
                          "error"}
                      </span>
                    </div>
                  ),
                }
          }
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
          onChange={(item) => {
            PatchEchoMainStat(index, item ? item.value : FixedStats.dummy.id);
          }}
        />
      </div>
      <div
        className="divider"
        style={{
          ...setSlotStyle({ w: 575, h: 2, x: 12.5, y: 150 }),
          backgroundColor: "#ffffff33",
        }}
      />
      {[...Array(5)].map((item, idx) => (
        <div key={idx}>
          <div
            style={{
              ...setSlotStyle({ w: 350, h: 50, x: 0, y: 230 + idx * 100 }),
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
                            src={`${assetApiUrl}/ico/stats/${statFilter[idx]}.webp`}
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
                const newId = opt ? opt.value : FixedStats.dummy.id;
                setStatFilter((prev) =>
                  prev.map((v, i) => (i === idx ? newId : v))
                );
                PatchEchoStat(index, idx, [newId, -1]);
              }}
            />
          </div>
          <div
            style={setSlotStyle({ w: 235, h: 80, x: 365, y: 230 + idx * 100 })}>
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
                            src={`${assetApiUrl}/ico/stats/${statFilter[idx]}.webp`}
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
                            {FixedStats?.[statFilter?.[idx]]?.ValueSub?.[
                              echoList[index]?.subStats[idx]?.[1]
                            ] || "0"}
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
                const statId =
                  echoList[index].subStats[idx][0] || FixedStats.dummy.id;
                const newVal = opt ? opt.value : -1;
                PatchEchoStat(index, idx, [
                  statId,
                  FixedStats[statId]?.ValueSub?.findIndex(
                    (item) => item === newVal
                  ) || 0,
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
