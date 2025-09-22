import { useMemo, useState } from "react";
import Select from "react-select";
import { useProfile } from "../hooks/useProfile";
import { useStyleHelper } from "../hooks/useStyleHelpers";
import { FixedStats } from "../data/Stats";

function EchoStatDrop({ index = 0, sizeValue = 1 }) {
  const lang = useProfile();
  const { setSlotStyle } = useStyleHelper(sizeValue);

  const [statFilter, setStatFilter] = useState(() => []);
  const statOption = useMemo(() => {
    return statFilter.map((item) => ({
      value: item.id,
      label: (
        <div>
          <span>
            {item[lang] ?? "error"}
          </span>
        </div>
      ),
    }));
  }, [statFilter]);

  return (
    <div style={{ pointerEvents: "auto" }}>
      <div
        className="divider"
        style={{
          ...setSlotStyle({ w: 575, h: 2, x: 12.5, y: 156 }),
          backgroundColor: "#ffffff33",
        }}
      />
      {[...Array(5)].map((_, i) => (
        <div key={i}>
          <div style={{ ...setSlotStyle({ w: 300, h: 50, x: 15, y: 232 + i * 116 }) }}>
            <Select
              isClearable
              placeholder="Type"
            />
          </div>
          <div style={{ ...setSlotStyle({ w: 250, h: 50, x: 335, y: 232 + i * 116 }) }}>
            <Select
              isClearable
              placeholder="Element"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default EchoStatDrop;
