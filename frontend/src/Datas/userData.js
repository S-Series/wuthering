import { FixedMainSub, FixedStatsSub } from "./Stats";
import { FixedStatsMain4, FixedStatsMain3, FixedStatsMain1 } from "./Stats";

class EchoData {
  constructor() {
    this.echoId = "";
    this.harmony = "";
    this.cost = 4;
    this.stats = Array(7).fill([
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null]
    ]);
  }

  SetCost(costData) { this.cost = costData; }

  SetDataByOcr(ocrData) {
    // this.stats = Array(7).fill(["", ""]);
  }
}

class ProfileData {
  constructor(_characterId = "") {
    this.characterId = _characterId;
    this.weaponId = "";
    this.ascension = [0, 0]; // [C, W]
    this.echoData = Array.from({ length: 5 }, () => new EchoData());
  }

  SetProfileData(characterId) {
    const saved = localStorage.getItem(`profile-${characterId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      this.characterId = parsed.characterId;
      this.weaponId = parsed.weaponId;
      this.ascension = parsed.ascension;
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
        ascension: this.ascension,
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
