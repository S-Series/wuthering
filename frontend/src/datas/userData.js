import { FixedStats, FixedMainSub, FixedStatsSub } from "./Stats";
import { FixedStatsMain4, FixedStatsMain3, FixedStatsMain1 } from "./Stats";

class EchoData {
  constructor() {
    this.echoId = "G03";
    this.harmony = "Eclipse";
    this.cost = 4;
    this.stats = Array(7).fill(
      [null, null]
    );
  }

  SetCost(costData) { this.cost = costData; }

  SetDataByOcr(ocrData) {
    // this.stats = Array(7).fill(["", ""]);
  }
}
export default EchoData;

class ProfileData {
  constructor(_characterId = null) {
    this.characterId = _characterId || "rover";
    this.weaponId = "";
    this.constellation = [0, 0]; // [C, W]
    this.harmony = "Eclipse";
    this.echoData = Array.from({ length: 5 }, () => new EchoData());
    this.statScore = Array(2).fill(0);
  }

  SetProfileData(characterId) {
    const saved = localStorage.getItem(`profile-${characterId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      this.characterId = parsed.characterId;
      this.weaponId = parsed.weaponId;
      this.constellation = parsed.constellation;
      this.echoData = parsed.echoData.map((e) =>
        Object.assign(new EchoData(), e)
      );
    }
  }

  SaveToJson() {
    localStorage.setItem(
      `profile-${this.characterId}`,
      JSON.stringify({
        characterId: this.characterId,
        weaponId: this.weaponId,
        constellation: this.constellation,
        echoData: this.echoData,
      })
    );
  }
}
export const profileData = new ProfileData();

class UserData {
  constructor() {
    this.playerName = "Camellya";
    this.playerUid = "000 000 000";
  }
}
export const userdata = new UserData();