import { CombatActivity, CombatActivityType } from "augmenting/types"
import { doArmour } from "./convertArmour"
import { doAffixes } from "./convertAugment"
import { doClasses, MaxLevel } from "./convertClassStat"
import { doWeapons } from "./convertWeapon"
import { writeFileJson } from "./common"
import { MiscData } from "./miscSheet"
import { getSheetRows } from "./google"

async function doBP() {
  const data: CombatActivity[] = []
  for await (const entry of await getSheetRows("BPRequirements")) {
    const { Region, Type, Name, Rank, BP } = entry
    if ([Region, Type, Name, Rank, BP].indexOf("") !== -1) continue
    data.push({
      name: Name,
      region: Region,
      type: Type as CombatActivityType,
      rank: Number(Rank),
      bp: Number(BP),
    })
  }

  writeFileJson(
    data.sort((a, b) =>
      `${a.name}${a.rank}`.localeCompare(`${b.name}${b.rank}`),
    ),
    "./src/augmenting/data/BPRequirements.json",
  )
}

async function main() {
  await Promise.all([
    doClasses(),
    doWeapons(),
    doAffixes(),
    doArmour(),
    doBP(),
    writeFileJson(
      { ...MiscData, MAX_LEVEL: MaxLevel },
      "./src/augmenting/data/Consts.json",
    ),
  ])
}

try {
  await main()
} catch (e) {
  console.log(e)
  process.exit(1)
}
