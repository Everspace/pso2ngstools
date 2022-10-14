import { AugmentStat, GRIND_LEVELS, Unit } from "augmenting/types"
import { BigNumber } from "mathjs"
import { RecordSheet, Replace, writeFileJson } from "./common"
import { getSheetRows } from "./google"
import { GrindBase, GrindLimit, ArmourGrind } from "./grindInfo"
import { MiscData } from "./miscSheet"

type DataSheetKeys =
  | "Series"
  | "Lv"
  | "Stars"
  | "Defense"
  | "hp"
  | "pp"
  | "MEL"
  | "RNG"
  | "TEC"
  | "DmgResist"
  | "Status"

type TranslationTable = Partial<Record<DataSheetKeys, keyof AugmentStat>>

const translationTable: TranslationTable = {
  DmgResist: "damageResist",
  MEL: "meleePotency",
  RNG: "rangedPotency",
  TEC: "techPotency",
  Status: "statusResist",
  hp: "hp",
  pp: "pp",
}

export type UnitData = Replace<Unit, BigNumber, number>
export function handleArmorRow(row: RecordSheet<DataSheetKeys>): UnitData {
  const {
    Series,
    Lv,
    Stars,
    Defense,
    hp,
    pp,
    MEL,
    RNG,
    TEC,
    DmgResist,
    Status,
  } = row
  const stats = { hp, pp, MEL, RNG, TEC, DmgResist, Status }
  const stars = Number(Stars)

  const defenseBase = Number(Defense)
  const data: Partial<UnitData> = {
    name: Series,
    level: Number(Lv),
    stars,
    limit: GrindBase[stars] ?? MiscData.MAX_GRIND,
    limit_max: GrindLimit[stars] ?? MiscData.MAX_GRIND,
    stat: {},
  }

  const grinds: Partial<Record<string, number>> = {}

  for (const level of GRIND_LEVELS) {
    grinds[level.toString()] = defenseBase + ArmourGrind[stars][`Grind${level}`]
  }

  //@ts-ignore TODO: Figure out how to do this safely?
  data.grindValues = grinds as Record<GrindLevel, number>

  const processedStats: AugmentStat = Object.fromEntries(
    (Object.entries(stats) as Array<[keyof TranslationTable, string]>)
      .filter(
        ([name, value]) =>
          value !== "" && value !== null && value !== undefined,
      )
      .map(([name, value]) => [translationTable[name], Number(value)]),
  )
  data.stat = processedStats

  return data as UnitData
}

export async function doArmour() {
  const allArmours: Record<string, UnitData> = {}
  for await (const entry of await getSheetRows("Armour")) {
    const armour = handleArmorRow(entry as any)
    allArmours[armour.name] = armour
  }
  writeFileJson(allArmours, "./src/augmenting/data/Armours.json")
}
