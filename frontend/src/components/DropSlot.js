import Select from "react-select";
import "./DropSlot.css";
import { useState } from "react";
import {
  FixedStatsMain4 as Main4,
  FixedStatsMain3 as Main3,
  FixedStatsMain1 as Main1,
  FixedStatsSub as Sub,
} from "../Datas/Stats";

function DropSlot({ type = [], value = [] }) {
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

  const MainOptions4 = Object.entries(Main4).map(([id, stat]) => ({
    value: id,
    label: stat[lang] || id,
  }));
  const MainOptions3 = Object.entries(Main3).map(([id, stat]) => ({
    value: id,
    label: stat[lang] || id,
  }));
  const MainOptions1 = Object.entries(Main1).map(([id, stat]) => ({
    value: id,
    label: stat[lang] || id,
  }));
  const SubOptions = Object.entries(Sub).map(([id, stat]) => ({
    value: id,
    label: stat[lang] || id,
  }));

  const [options, setOptions] = useState(MainOptions4);

  const getValueOptions = (id) => {
    const stat = options;
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
              options={options}
              styles={selectStyle}
              placeholder="속성 선택"
              defaultValue={
                type[i]
                  ? options.find((opt) => opt.value === type[i])
                  : null
              }
            />
            <Select
              options={getValueOptions(type[i], options)}
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
              options={SubOptions}
              styles={selectStyle}
              placeholder="속성 선택"
              defaultValue={
                type[i + 2]
                  ? SubOptions.find((opt) => opt.value === type[i + 2])
                  : null
              }
            />
            <Select
              options={getValueOptions(type[i + 2], SubOptions)}
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
