import { echoDict, harmony } from "../../data/Echo";
import { userdata } from "../../data/userData";
import EchoData from "../../data/userData";
import ProfileCard from "../ProfileCard";
import { useStyleHelper } from "../../hooks/useStyleHelpers";
import { useProfile } from "../../hooks/useProfile";

function EchoSlot({ index = 0, sizeValue = 0 }) {

  const apiUrl = process.env.REACT_APP_API_URL;
  const { setSlotStyle } = useStyleHelper(sizeValue);
  const { echoList } = useProfile();
  
  function subStyleValue(idx, isText) {
    return {
      w: isText ? 130 : 35,
      h: 35,
      x: 9,
      y: 264 + 42 * idx,
    };
  }

  return (
    <div>
      <img
        alt=""
        src={
          echoList[index]?.echoId && echoList[index]?.echoId !== "default"
            ? `${apiUrl}/static/ico/echos/${echoList[index].echoId}.webp`
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
        src={`${apiUrl}/static/ico/harmony/${echoList[index].harmony}.webp`}
        style={{
          ...setSlotStyle({ w: 40, h: 40, x: 54, y: 124 }),
          zIndex: 200,
        }}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/default.webp";
        }}
      />
      <div>
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
      {echoList[index]?.subStats.map((item, idx) =>
        echoList[index]?.subStats[idx][0] !== "dummy" &&
        echoList[index]?.subStats[idx][1] !== 0 ? (
          <div key={idx} style={{ alignContent: "center" }}>
            <img
              alt=""
              src={`${apiUrl}/static/ico/stats/${echoList[index]?.subStats[idx][0]}.webp`}
              style={setSlotStyle(subStyleValue(idx, false))}
            />
            <span
              style={{
                ...setSlotStyle(subStyleValue(idx, true)),
                color: "#fff",
                textAlign: "right",
                transform: `translateY(-${3 * sizeValue}px)`,
                fontSize: `${30 * sizeValue}px`,
              }}>
              {["Crit", "bns", "pct"].some((item) =>
                echoList[index].subStats[idx][0].includes(item)
              )
                ? `${echoList[index].subStats[idx][1].toFixed(1)}%`
                : `${Math.round(echoList[index].subStats[idx][1])}`}
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
              style={{
                ...setSlotStyle(subStyleValue(idx, true)),
                color: "#fff",
                textAlign: "right",
                transform: `translateY(-${4 * sizeValue}px)`,
                fontSize: `${30 * sizeValue}px`,
              }}>
              ----
            </span>
          </div>
        )
      )}
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
          style={{
            ...setSlotStyle({ w: 135, h: 35, x: 6.5, y: 553 }),
            color: "#fff",
            textAlign: "right",
            transform: `translateY(-${4 * sizeValue}px)`,
            fontSize: `${28 * sizeValue}px`,
          }}>
          0pt
        </span>
        <span
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
          style={{
            ...setSlotStyle({ w: 135, h: 35, x: 6.5, y: 585 }),
            color: "#fff",
            textAlign: "right",
            transform: `translateY(-${4 * sizeValue}px)`,
            fontSize: `${28 * sizeValue}px`,
          }}>
          0pt
        </span>
      </div>
    </div>
  );
}
export default EchoSlot;
