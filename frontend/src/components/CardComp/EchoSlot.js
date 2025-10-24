import { echoDict, harmony } from "../../data/Echos";
import { useStyleHelper } from "../../hooks/useStyleHelpers";
import { useProfile } from "../../hooks/useProfile";
import { useApi } from "../../hooks/useApi";
import { FixedStats, FixedMainSub } from "../../data/Stats";

function EchoSlot({ index = 0, sizeValue = 0 }) {

  const { assetApiUrl } = useApi();
  
  const { setSlotStyle } = useStyleHelper(sizeValue);
  const { echoList, echoScore } = useProfile();
  
  function subStyleValue(idx, isText) {
    return {
      w: isText ? 130 : 35,
      h: 35,
      x: 9,
      y: 264 + 42 * idx,
    };
  }
  function costToIndex(cost) {
    if (cost === 4) return 0;
    else if (cost === 3) return 1;
    else return 2;
  }

  return (
    <div>
      <div className="echo-image-frame">
        <img
          alt=""
          src={
            echoList[index]?.echoId && echoList[index]?.echoId !== "default"
              ? `${assetApiUrl}/ico/echos/${echoList[index].echoId}.webp`
              : "/default.webp"
          }
          style={{
            ...setSlotStyle({ w: 140 - 2, h: 140 - 2, x: 4, y: 4 }),
            border: "1px solid #000",
            backgroundColor: "#00000066",
          }}
        />
        <img
          alt=""
          src={`${assetApiUrl}/ico/harmony/${echoList[index].harmony}.webp`}
          style={{
            ...setSlotStyle({ w: 40, h: 40, x: 54, y: 124 }),
            zIndex: 200,
          }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/default.webp";
          }}
        />
      </div>
      <div className="echo-bar">
        <div
          style={{
            ...setSlotStyle({ w: 148, h: 4, x: 0, y: 142 }),
            backgroundColor: `${
              harmony[echoList[index]?.harmony]?.colorCode || "#fff"
            }`,
            zIndex: 100,
          }}
        />
        <div
          style={{
            ...setSlotStyle({ w: 138, h: 3, x: 5, y: 251 }),
            backgroundColor: "#ffffff66",
            zIndex: 100,
          }}
        />
        <div
          style={{
            ...setSlotStyle({ w: 138, h: 3, x: 5, y: 475 }),
            backgroundColor: "#ffffff66",
            zIndex: 100,
          }}
        />
      </div>
      <div className="echo-main-stats">
        <img
          alt=""
          src={`${assetApiUrl}/ico/stats/${echoList[index]?.mainStat}.webp`}
          style={setSlotStyle({ w: 35, h: 35, x: 9, y: 165 })}
        />
        <span
          className="numFont"
          style={{
            ...setSlotStyle({ w: 130, h: 35, x: 9, y: 165 }),
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            color: "#fff",
            fontSize: `${28 * sizeValue}px`,
          }}>
          {FixedStats[echoList[index]?.mainStat]?.ValueMain[
            costToIndex(echoList[index]?.cost)
          ] || "----"}
          %
        </span>
        <img
          alt=""
          src={`${assetApiUrl}/ico/stats/${
            FixedMainSub[costToIndex(echoList[index]?.cost)][0]
          }.webp`}
          style={setSlotStyle({ w: 35, h: 35, x: 9, y: 207 })}
        />
        <span
          className="numFont"
          style={{
            ...setSlotStyle({ w: 130, h: 35, x: 9, y: 207 }),
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            color: "#fff",
            fontSize: `${28 * sizeValue}px`,
          }}>
          {FixedMainSub[costToIndex(echoList[index]?.cost)][1] || "----"}
        </span>
      </div>
      <div className="echo-sub-stats">
        {echoList[index]?.subStats.map((item, idx) =>
          echoList[index]?.subStats[idx][0] !== "dummy" &&
          echoList[index]?.subStats[idx][1] >= 0 ? (
            <div key={idx} style={{ alignContent: "center" }}>
              <img
                alt=""
                src={`${assetApiUrl}/ico/stats/${echoList[index]?.subStats[idx][0]}.webp`}
                style={setSlotStyle(subStyleValue(idx, false))}
              />
              <span
                className="numFont"
                style={{
                  ...setSlotStyle(subStyleValue(idx, true)),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  color: "#fff",
                  fontSize: `${28 * sizeValue}px`,
                }}>
                {`${
                  FixedStats[echoList[index].subStats[idx][0]].ValueSub[
                    echoList[index].subStats[idx][1]
                  ] || 0
                }` +
                  `${
                    ["Crit", "Bns", "Pct"].some((item) =>
                      echoList[index].subStats[idx][0].includes(item)
                    )
                      ? "%"
                      : ""
                  }`}
              </span>
            </div>
          ) : (
            <div key={idx} style={{ alignContent: "center" }}>
              <img
                alt=""
                src={`/default.webp`}
                style={setSlotStyle(subStyleValue(idx, false))}
              />
              <span
                className="numFont"
                style={{
                  ...setSlotStyle(subStyleValue(idx, true)),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  color: "#fff",
                  fontSize: `${30 * sizeValue}px`,
                }}>
                ----
              </span>
            </div>
          )
        )}
      </div>
      <div className="echo-score">
        <img
          alt=""
          src={`/default.webp`}
          style={{
            ...setSlotStyle({ w: 140, h: 72.5, x: 4, y: 481 }),
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
        <div className="cv-av">
          <span
            className="numFont"
            style={{
              ...setSlotStyle({ w: 135, h: 35, x: 6.5, y: 553 }),
              color: "#fff",
              textAlign: "left",
              transform: `translateY(-${4 * sizeValue}px)`,
              fontSize: `${28 * sizeValue}px`,
            }}>
            Cv.
          </span>
          <span
            className="numFont"
            style={{
              ...setSlotStyle({ w: 135, h: 35, x: 6.5, y: 553 }),
              color: "#fff",
              textAlign: "right",
              transform: `translateY(-${4 * sizeValue}px)`,
              fontSize: `${28 * sizeValue}px`,
            }}>
            {echoScore[index][0]}pt
          </span>
          <span
            className="numFont"
            style={{
              ...setSlotStyle({ w: 135, h: 35, x: 6.5, y: 585 }),
              color: "#fff",
              textAlign: "left",
              transform: `translateY(-${4 * sizeValue}px)`,
              fontSize: `${28 * sizeValue}px`,
            }}>
            Av.
          </span>
          <span
            className="numFont"
            style={{
              ...setSlotStyle({ w: 135, h: 35, x: 6.5, y: 585 }),
              color: "#fff",
              textAlign: "right",
              transform: `translateY(-${4 * sizeValue}px)`,
              fontSize: `${28 * sizeValue}px`,
            }}>
            {echoScore[index][1]}pt
          </span>
        </div>
      </div>
    </div>
  );
}
export default EchoSlot;
