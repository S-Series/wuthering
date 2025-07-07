function StatSlot({
  styles = [{}, {}],
  imgPath,
  textValue = ["", ""],
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
        src={imgPath}
        style={{
          display: "block",
          height: "90%",
          aspectRatio: "1/1",
          marginLeft: "1.5%",
        }}
      />
      <span
        style={{
          ...styles[1],
          color: "#fff",
          textAlign: "left",
          fontSize: fontSize,
        }}>
        {textValue[0]}
      </span>
      <span
        style={{
          ...styles[1],
          color: "#fff",
          textAlign: "right",
          fontSize: fontSize,
        }}>
        {textValue[1]}
      </span>
    </div>
  );
}
export default StatSlot;
