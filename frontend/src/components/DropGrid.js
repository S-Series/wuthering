import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DropSlot from "./DropSlot";
import "./DropGrid.css";

function DropGrid() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="drop-grid-wrapper">
      <div className="drop-grid-tab-row">
        {[0, 1, 2, 3, 4].map((i) => (
          <button
            key={i}
            className={`drop-grid-tab-btn ${selected === i ? "active" : ""}`}
            onClick={() => setSelected(i)}>
            Echo {i + 1}
          </button>
        ))}
      </div>

      <div className="drop-grid-slot-container">
        <div className="drop-grid-dropdown">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}>
              <div className="drop-grid-info-slot">
                <DropSlot type={[]} value={[]} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default DropGrid;
