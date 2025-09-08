function StatSlot({
  styles = [{}, {}, {}],
  imgPath,
  textValue = ["", "", ""],
  fontSize,
}) {
  return (
    <div
      style={{
        ...styles[0],
        backgroundColor: "#ffffff33",
        alignContent: "center",
      }}>
      <img
        alt=""
        src={imgPath}
        style={{
          display: "block",
          height: "90%",
          aspectRatio: "1/1",
          marginLeft: "1.5%",
        }}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/default.webp";
        }}
      />
      {textValue[0].includes("Attack Damage") ? (
        <span
          style={{
            ...styles[1], //$ 여기 속성값 수정해서 적용하기
            color: "#fff",
            textAlign: "left",
            fontSize: `${8}px`,
            whiteSpace: "pre-wrap",
          }}>
          {textValue[0].replace("Attack Damage", "Attack\nDamage")}
        </span>
      ) : (
        <span
          style={{
            ...styles[1],
            color: "#fff",
            textAlign: "left",
            fontSize: fontSize[0],
            whiteSpace: "pre-wrap",
          }}>
          {textValue[0]}
        </span>
      )}
      <span
        style={{
          ...styles[1],
          color: "#fff",
          textAlign: "right",
          fontSize: fontSize[0],
        }}>
        {textValue[1] ? textValue[1] : "asdf"}
      </span>
      <span
        style={{
          ...styles[2],
          color: "#ddaa00",
          textAlign: "right",
          fontSize: fontSize[1],
        }}>
        +{textValue[2] ?? "(+0)"}
      </span>
    </div>
  );
}
export default StatSlot;
