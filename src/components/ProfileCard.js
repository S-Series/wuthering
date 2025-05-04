import "./ProfileCard.css";
import { useState } from "react";

function ProfileCard() {
  const [character, setCharacter] = useState("");
  const [weapon, setWeapon] = useState("");

  const handleCharacterChange = (e) => setCharacter(e.target.value);
  const handleWeaponChange = (e) => setWeapon(e.target.value);

  return (
    <div className="portrait">
      <div className="dropdown-grid">
        <select className="dropdown" value={character} onChange={handleCharacterChange}>
          <option value="">선택하세요</option>
          <option value="fire">불속성</option>
          <option value="ice">얼음속성</option>
          <option value="lightning">번개속성</option>
        </select>
        <select className="dropdown" value={weapon} onChange={handleWeaponChange}>
          <option value="">선택하세요</option>
          <option value="fire">불속성</option>
          <option value="ice">얼음속성</option>
          <option value="lightning">번개속성</option>
        </select>
      </div>
      <div className="profile-card"></div>
    </div>
  );
}

export default ProfileCard;
