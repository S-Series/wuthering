import { useState, useRef, useEffect } from "react";

function ImageDrag({
  path = null,
  posValue = { x: 0, y: 0, s: 1 },
  overFlowHidden = true,
  onChange = () => {},
}) {
  const dragging = useRef(false);
  const imgSlotRef = useRef();

  const [imgPos, setImgPos] = useState({ x: 0, y: 0, s: 1 });
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [imgSlotSize, setImgSlotSize] = useState({ width: 0, height: 0 });
  const [minScale, setMinScale] = useState(1);

  //$ onLoad
  useEffect(() => {
    if (path) {
      const img = new Image();
      img.onload = () => {
        setImgSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      setMinScale(
        Math.max(
          imgSlotSize.width / imgSize.width,
          imgSlotSize.height / imgSize.height
        )
      );
    } else {
      setImgSize({ width: 0, height: 0 });
    }

    setImgSlotSize({
      width: imgSlotRef.current.offsetWidth,
      height: imgSlotRef.current.offsetHeight,
    });
  }, []);
  //$ Image Size Change
  useEffect(() => {
    setImgPos({ x: imgPos.x, y: imgPos.y, s: minScale });
  }, [path]);
  //$ Dragging Pos Change
  useEffect(() => {
    const handleMove = (e) => {
      if (!dragging.current) return;

      const posX = Math.min(
        Math.max(
          e.clientX - posValue.x,
          (imgSize.width * posValue.s - imgSlotSize.width) / -2
        ),
        (imgSize.width * posValue.s - imgSlotSize.width) / +2
      );
      const posY = Math.min(
        Math.max(
          e.clientY - posValue.y,
          (imgSize.height * posValue.s - imgSlotSize.height) / -2
        ),
        (imgSize.height * posValue.s - imgSlotSize.height) / +2
      );

      setImgPos({ x: posX, y: posY, s: posValue.s });
    };
  });

  useEffect(() => {
    onChange({ x: imgPos.x, y: imgPos.y, s: imgPos.s });
  }, [imgPos]);

  return (
    <div
      className="image-holder"
      ref={imgSlotRef}
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        border: "1px solid #000000",
        backgroundColor: "#00000066",
        alignItems: "center",
        justifyContent: "center",
        overflow: `${overFlowHidden ? "hidden" : "visible"}`,
      }}>
      {path !== null && (
        <img
          src="/bg.png"
          onLoad={(e) =>
              setImgSize({
                width: e.target.naturalWidth,
                height: e.target.naturalHeight,
              })
            }
          draggable={false}
          style={{
            position: "absolute",
            transform: `translate(${posValue.x}px, ${posValue.y}px) scale(${posValue.s})`,
            transformOrigin: "center",
            userSelect: "none",
          }}
        />
      )}
      {console.log(imgPos)}
      {console.log(imgSize)}
      {console.log(imgSlotSize)}
      {console.log(minScale)}
    </div>
  );
}
export default ImageDrag;
