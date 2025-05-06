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
    control: (base) => ({
      ...base,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.65rem",
      width: "100%",
      minHeight: "2rem",
      height: "2rem",
      lineHeight: "1rem",
      paddingTop: 0,
      paddingBottom: 0,
      overflow: "hidden",
      whiteSpace: "nowrap",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      width: "2rem",
      height: "2rem",
    }),
    singleValue: (base) => ({
      ...base,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
      fontSize: "0.6rem",
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "0.6rem",
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
