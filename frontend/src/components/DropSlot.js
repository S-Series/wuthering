import Select from "react-select";
import "./DropSlot.css";
import { useState } from "react";
import { FixedStats } from "../Datas/Stats";

function DropSlot({ type, value }) {
  const lang = "kr";

  const selectStyle = {
    control: (base) => ({
      ...base,
      whiteSpace: "nowrap",
    }),
    indicatorsContainer: (base) => ({ ...base }),
    singleValue: (base) => ({ ...base }),
    menu: (base) => ({ ...base }),
    option: (base, state) => ({ ...base }),
  };

  const statOptions = Object.entries(FixedStats).map(([id, stat]) => ({
    value: id,
    label: stat[lang] || id,
  }));

  const getValueOptions = (id) => {
    const stat = FixedStats[id];
    if (!stat) return [];

    const vals = [...(stat.ValueMain || []), ...(stat.SubValue || [])]
      .filter(v => v != null)
      .map(v => ({
        value: typeof v === "string" ? parseFloat(v) : v,
        label: typeof v === "string" ? v : v.toString()
      }));

    return vals;
  };

  return (
    <div className="equipment-container">
      <div className="dropdown-grid">
        {[0, 1].map((i) => (
          <div className="dropdown-row" key={`main-${i}`}>
            <Select
              options={statOptions}
              styles={selectStyle}
              placeholder="속성 선택"
              defaultValue={
                type[i]
                  ? statOptions.find((opt) => opt.value === type[i])
                  : null
              }
            />
            <Select
              options={getValueOptions(type[i])}
              styles={selectStyle}
              placeholder="수치 선택"
              defaultValue={
                value[i] ? { value: value[i], label: value[i] } : null
              }
            />
          </div>
        ))}

        <div className="dropdown-divider" />

        {[0, 1, 2, 3, 4].map((i) => (
          <div className="dropdown-row" key={`sub-${i}`}>
            <Select
              options={statOptions}
              styles={selectStyle}
              placeholder="속성 선택"
              defaultValue={
                type[i + 2]
                  ? statOptions.find((opt) => opt.value === type[i + 2])
                  : null
              }
            />
            <Select
              options={getValueOptions(type[i + 2])}
              styles={selectStyle}
              placeholder="수치 선택"
              defaultValue={
                value[i + 2]
                  ? { value: value[i + 2], label: value[i + 2] }
                  : null
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DropSlot;
