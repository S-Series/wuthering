import { echoDict } from "../../Datas/Echo";
import { userdata } from "../../Datas/userData";
import EchoData from "../../Datas/userData";

function EchoSlot({ echoData = new EchoData(), sizeValue = 0 }) {
  const apiUrl = process.env.REACT_APP_API_URL;

  const setSlotStyle = ({ w = null, h = null, x = 0, y = 0 }) => {
    return {
      position: "absolute",
      width: `${w === null ? "100%" : `calc(${w}px * ${sizeValue})`}`,
      height: `${h === null ? "100%" : `calc(${h}px * ${sizeValue})`}`,
      top: `calc(${y}px * ${sizeValue})`,
      left: `calc(${x}px * ${sizeValue})`,
    };
  };

  return (
    <div>
      <img
        src={`${apiUrl}/static/ico/echos/${echoData.echoId}.webp`}
        style={{
          ...setSlotStyle({ w: 140 - 2, h: 140 - 2, x: 4, y: 4 }),
          border: "1px solid #000",
          backgroundColor: "#00000066",
        }}
      />
      <img
        src={`${apiUrl}/static/ico/harmony/${echoData.harmony}.webp`}
        style={{
          ...setSlotStyle({ w: 40, h: 40, x: 54, y: 124 }),
          zIndex: 200,
        }}
      />
      <div>
        <div
          style={{
            ...setSlotStyle({ w: 148, h: 4, x: 0, y: 142 }),
            backgroundColor: "#cc99cc",
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
      {echoData.stats.map((item, idx) =>
        echoData.stats[idx][0] !== null && echoData.stats[idx][1] !== null ? (
          <div key={idx} style={{ alignContent: "center" }}>
            <img
              src={`${apiUrl}/static/ico/stats/${echoData.stats[idx][0]}.webp`}
              style={{
                ...setSlotStyle({
                  w: 35,
                  h: 35,
                  x: 9,
                  y: 165 + 42 * idx + (idx < 2 ? 0 : 15),
                }),
              }}
            />
            <span
              style={{
                ...setSlotStyle({
                  w: 130,
                  h: 35,
                  x: 9,
                  y: 165 + 42 * idx + (idx < 2 ? 0 : 15),
                }),
                color: "#fff",
                textAlign: "right",
                transform: `translateY(-${3 * sizeValue}px)`,
                fontSize: `${30 * sizeValue}px`,
              }}>
              {echoData.stats[idx][1].toFixed(1)}
              {echoData.stats[idx][0].includes("Crit") ||
              echoData.stats[idx][0].includes("bns") ||
              echoData.stats[idx][0].includes("pct")
                ? "%"
                : ""}
            </span>
          </div>
        ) : (
          <div key={idx} style={{ alignContent: "center" }}>
            <img
              src={`/default.webp`}
              style={{
                ...setSlotStyle({
                  w: 35,
                  h: 35,
                  x: 9,
                  y: 165 + 42 * idx + (idx < 2 ? 0 : 15),
                }),
              }}
            />
            <span
              style={{
                ...setSlotStyle({
                  w: 130,
                  h: 35,
                  x: 9,
                  y: 165 + 42 * idx + (idx < 2 ? 0 : 15),
                }),
                color: "#fff",
                textAlign: "right",
                transform: `translateY(-${4 * sizeValue}px)`,
                fontSize: `${30 * sizeValue}px`,
              }}>
              NaN
            </span>
          </div>
        )
      )}
      <img
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
          56.7pt
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
          123.4pt
        </span>
      </div>
    </div>
  );
}
export default EchoSlot;
