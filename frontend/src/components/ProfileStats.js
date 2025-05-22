import "./ProfileStats.css";

import { useRef, useState, useEffect } from "react";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";

import OCRSlot from "./OcrSlot";
import DropSlot from "./DropSlot";
import ImageRange from "./ImageRange";

function ProfileStats() {
  const fileInputRef = useRef();

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(2);
  const [imgPath, setImgPath] = useState({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [echoCost, setEchoCost] = useState({
    0: 2,
    1: 1,
    2: 0,
    3: 1,
    4: 2,
  });
  const [imgCrop, setImgCrop] = useState({
    0: { x: 0, y: 0, s: 1 },
    1: { x: 0, y: 0, s: 1 },
    2: { x: 0, y: 0, s: 1 },
    3: { x: 0, y: 0, s: 1 },
    4: { x: 0, y: 0, s: 1 },
  });

  //$ Ctrl+V Keydown && Double click
  useEffect(() => {
    const handlePaste = (e) => {
        const item = [...e.clipboardData.items].find((i) =>
            i.type.includes("image")
        );
        if (item) {
            const file = item.getAsFile();
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                setImgPath((prev) => ({
              ...prev,
              [selectedIndex]: url,
            }));
            };
            img.src = url;
        };
    };

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "v") {
        // 붙여넣기는 paste에서만 처리
      }
    };

    const handleDoubleClick = async () => {
  if (!fileInputRef.current || lastSelectedIndex === null) return;

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      const img = new Image();

      img.onload = () => {
        setImgPath((prev) => ({
          ...prev,
          [lastSelectedIndex]: url,
        }));
      };

      img.src = url;
    };

    reader.readAsDataURL(file);
  };

  input.click();
};

    window.addEventListener("paste", handlePaste);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("dblclick", handleDoubleClick);

    return () => {
      window.removeEventListener("paste", handlePaste);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [selectedIndex]);

  //$ Delete Keydown
  useEffect(() => {
    const handleDelete = (e) => {
      if (
        e.key === "Delete" &&
        selectedIndex !== null &&
        imgPath[selectedIndex]
      ) {
        setImgPath((prev) => ({
          ...prev,
          [selectedIndex]: null,
        }));
      }
    };

    window.addEventListener("keydown", handleDelete);
    return () => {
      window.removeEventListener("keydown", handleDelete);
    };
  }, [selectedIndex, imgPath]);

  useEffect(() => {
    if (selectedIndex !== null) {
      setLastSelectedIndex(selectedIndex);
    }
  }, [selectedIndex]);

  const echoCostDropOption = [
    { value: 0, label: "4 Cost" },
    { value: 1, label: "3 Cost" },
    { value: 2, label: "1 Cost" },
  ];
  const echoCostDropStyle = {
    control: (base) => ({
      ...base,
      width: "calc(80% - 2px)",
      height: "100%",
      border: `2px solid ${isCostExceeded ? "#ff0000" : "#eeeeee"}`,
    }),
    menu: (base) => ({
      ...base,
      width: "70%",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: 200,
    }),
    container: (base) => ({
      ...base,
      display: "flex",
      width: "20%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    }),
  };

  //#region Cost Clac
  const costMap = { 0: 4, 1: 3, 2: 1 };
  const calcTotalCost = (echoCost) =>
    Object.values(echoCost).reduce((sum, val) => sum + costMap[val], 0);
  const isCostExceeded = calcTotalCost(echoCost) > 12;
  //#endregion

  return (
    <div className="profile-stat-slot">
      <div className="profile-echo-cost-slot">
        {[0, 1, 2, 3, 4].map((i) => (
          <Select
            options={echoCostDropOption}
            value={echoCostDropOption.find((opt) => opt.value === echoCost[i])}
            onChange={(selected) =>
              setEchoCost((prev) => ({ ...prev, [i]: selected.value }))
            }
            styles={echoCostDropStyle}
          />
        ))}
      </div>
      <div className="profile-ocr-slot">
        {[0, 1, 2, 3, 4].map((i) => (
          <OCRSlot
            key={i}
            index={i}
            isMain={i === 2}
            imgPath={imgPath[i]}
            echoCost={echoCost[i]}
            selected={selectedIndex === i}
            onClick={() => setSelectedIndex(i)}
            setImgPath={setImgPath}
          />
        ))}
      </div>
      <div className="profile-ocr-img-crop">
        <AnimatePresence mode="wait">
          {lastSelectedIndex !== null && (
            <motion.div
              key={lastSelectedIndex + imgPath[lastSelectedIndex]}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.175 }}
              style={{ position: "absolute", width: "100%", height: "100%" }}>
              <ImageRange
                src={imgPath[lastSelectedIndex]}
                crop={imgCrop[lastSelectedIndex]}
                onChange={(newCrop) =>
                  setImgCrop((prev) => ({
                    ...prev,
                    [lastSelectedIndex]: newCrop,
                  }))
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
export default ProfileStats;
