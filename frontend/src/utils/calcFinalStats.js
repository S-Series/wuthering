export function calculateFinalStats({ characterStats, weaponStats, echoList }) {
  const base = {
    hp: characterStats.baseHp,
    atk: characterStats.baseAtk + weaponStats.atk,
    def: characterStats.baseDef,
    res: characterStats.resonanceBns,
    CritRate: characterStats.CritRate,
    CritDmg: characterStats.CritDmg,
    typeBns: [characterStats.typeBns[0], characterStats.typeBns[1]]
  };
  const calcMag = {
    hp: 1,
    atk: 1,
    def: 1,
    res: 1,
    CritRate: 1,
    CritDmg: 1,
    typeBns: [1, 1]
  }
  const calcAdd = {
    hp: 0,
    atk: 0,
    def: 0,
    res: 0,
    CritRate: 0,
    CritDmg: 0,
    typeBns: [0, 0]
  }

  const total = {
    hp: base.hp * calcMag.hp + calcAdd.hp,
    atk: base.atk * calcMag.atk + calcAdd.atk,
    def: base.def * calcMag.def + calcAdd.def,
    res: base.res * calcMag.res + calcAdd.res,
    CritRate: base.CritRate * calcMag.CritRate + calcAdd.CritRatehp,
    CritDmg: base.CritDmg * calcMag.CritDmg + calcAdd.CritDmg,
    typeBns: [
        base.typeBns[0] * calcMag.typeBns[0] + calcAdd.typeBns[0],
        base.typeBns[1] * calcMag.typeBns[1] + calcAdd.typeBns[1]
    ]
  }

  return total;
}
