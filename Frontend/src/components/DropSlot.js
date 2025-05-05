import Select from "react-select";
import "./DropSlot.css";
import { useState } from "react";

function DropSlot({ index }) {
  const [cost, setCost] = useState(null);

  const costOptions = [
    { value: 0, label: "Cost 4" },
    { value: 1, label: "Cost 3" },
    { value: 2, label: "Cost 1" },
  ];

  const mainOptions = [{ value: "", label: "속성 선택" }];
  const valueOptions = [{ value: "", label: "수치 선택" }];

  const selectStyle = {
    control: (base, state) => ({
      ...base,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "0.75rem",
      borderRadius: 3,
      height: "100%",              // 드롭다운 높이를 부모에 맞춤
      minHeight: "32px",           // 최소 높이 지정 (없으면 collapse될 수 있음)
      width: "100%",               // 가로 100% 채우기
      boxSizing: "border-box",     // padding 포함
    }),
    container: (base) => ({
      ...base,
      width: "100%",               // 컨테이너도 100%
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
      fontSize: "0.75rem",
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "0.75rem",
      backgroundColor: state.isFocused ? "#eee" : "white",
      color: "black",
    }),
  };

  return (
    <div className="equipment-container">
      <div className="dropdown-grid">
        {[0, 1].map((i) => (
          <div className="dropdown-row" key={`main-${i}`}>
            <Select
              options={mainOptions}
              styles={selectStyle}
              placeholder="속성 선택"
            />
            <Select
              options={valueOptions}
              styles={selectStyle}
              placeholder="수치 선택"
            />
          </div>
        ))}

        <div className="dropdown-divider" />

        {[0, 1, 2, 3, 4].map((i) => (
          <div className="dropdown-row" key={`sub-${i}`}>
            <Select
              options={mainOptions}
              styles={selectStyle}
              placeholder="속성 선택"
            />
            <Select
              options={valueOptions}
              styles={selectStyle}
              placeholder="수치 선택"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DropSlot;
