function StatSlot({
  styles = [{}, {}],
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
        onError={e =>{
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/default.webp";
        }}
      />
      <span
        style={{
          ...styles[1],
          color: "#fff",
          textAlign: "left",
          fontSize: fontSize[0],
        }}>
        {textValue[0]}
      </span>
      <span
        style={{
          ...styles[1],
          color: "#fff",
          textAlign: "right",
          fontSize: fontSize[0],
        }}>
        {textValue[1] ?? "54321"}
      </span>
      <span
        style={{
          ...styles[2],
          color: "#ddaa00",
          textAlign: "right",
          fontSize: fontSize[1],
        }}>
        {textValue[2] ?? "(+12345)"}
      </span>
    </div>
  );
}
export default StatSlot;
