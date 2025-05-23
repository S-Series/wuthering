import "./EquipSlot.css";

function EquipSlot({ types = null, values = 0, color = "#ff0000ff" }) {
  const iconTypes = types;
  const statValues = values;

  return (
    <div className="equipment-grid">
      <img className="equipment-img" src="/gem.webp" />
      <div className="equipment-divider" />
      <div className="equipment-slot">
        <div className="equipment-stat-slot">
          <img className="equipment-stat-icon" src="/gem.webp" />
          <span className="equipment-stat-label" style={{ color: color }}>
            23.4%
          </span>
        </div>
        <div className="equipment-stat-slot">
          <img className="equipment-stat-icon" src="/gem.webp" />
          <span className="equipment-stat-label" style={{ color: color }}>
            23.4%
          </span>
        </div>
      </div>
      <div className="equipment-divider" />
      <div className="equipment-slot">
        <div className="equipment-stat-slot">
          <img className="equipment-stat-icon" src="/gem.webp" />
          <span className="equipment-stat-label" style={{ color: color }}>
            23.4%
          </span>
        </div>
        <div className="equipment-stat-slot">
          <img className="equipment-stat-icon" src="/gem.webp" />
          <span className="equipment-stat-label" style={{ color: color }}>
            23.4%
          </span>
        </div>
      </div>
      <div className="equipment-divider no-line" />
      <div className="equipment-slot">
        <div className="equipment-stat-slot">
          <img className="equipment-stat-icon" src="/gem.webp" />
          <span className="equipment-stat-label" style={{ color: color }}>
            23.4%
          </span>
        </div>
        <div className="equipment-stat-slot">
          <img className="equipment-stat-icon" src="/gem.webp" />
          <span className="equipment-stat-label" style={{ color: color }}>
            23.4%
          </span>
        </div>
      </div>
      <div className="equipment-divider no-line" />
      <div className="equipment-slot">
        <div className="equipment-stat-slot">
          <img className="equipment-stat-icon" src="/gem.webp" />
          <span className="equipment-stat-label" style={{ color: color }}>
            23.4%
          </span>
        </div>
        <div className="equipment-stat-slot">
          <span className="equipment-stat-label score" style={{ color: color }}>
            {"123.4" + "pt"}&nbsp;
          </span>
        </div>
      </div>
    </div>
  );
}
export default EquipSlot;
