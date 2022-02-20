import { AugmentStat, GrindLevel, Unit } from "augmenting/types"
import { BigNumber } from "mathjs"
import {
  HasGrindLevels,
  MAX_GRIND_INDEX,
  MAX_GRIND_KEY,
  RecordSheet,
  Replace,
} from "./common"

// Guessed offsets for
// [rarity][Grind of 10]
const rarityBackfill = [
  //null, Grind0, Grind10, Grind20...
  [0, 0, 0, 0, 0, 0, 0], // "None"
  [0, 10, 20, 30, 40, 50], // Guess +50 grind
  [0, 10, 20, 30, 40, 50], // Guess +50 grind
  [0, 10, 20, 30, 40, 50],
  [0, 10, 20, 30, 41, 51],
  [0, 10, 20, 30, 41, 51],
]

type DataSheetKeys =
  | "Series"
  | "Lv"
  | "Stars"
  | "hp"
  | "pp"
  | "MEL"
  | "RNG"
  | "TEC"
  | "DmgResist"
  | "Status"

interface DataSheetRow extends RecordSheet<DataSheetKeys>, HasGrindLevels {
  Limit: GrindLevel
}
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
export function handleArmorRow(row: DataSheetRow): UnitData {
  const {
    Series,
    Lv,
    Stars,
    Limit,
    hp,
    pp,
    MEL,
    RNG,
    TEC,
    DmgResist,
    Status,
    ...grinds
  } = row
  const stats = { hp, pp, MEL, RNG, TEC, DmgResist, Status }
  const stars = Number(Stars)
  const defenseBase = Number(grinds["Grind0"])

  const data: Partial<UnitData> = {
    name: Series,
    level: Number(Lv),
    stars,
    limit: Number(Limit),
    defenseBase,
    stat: {},
  }

  const defenseLimit = grinds[`Grind${Limit}`]
  if (defenseLimit === "")
    data.defenseLimit =
      defenseBase + rarityBackfill[stars][Math.floor(Number(Limit) / 10)]
  else data.defenseLimit = Number(defenseLimit)

  const defenseMax = grinds[MAX_GRIND_KEY]
  if (defenseMax === "")
    data.defenseMax = defenseBase + rarityBackfill[stars][MAX_GRIND_INDEX]
  else data.defenseMax = Number(defenseMax)

  const processedStats: AugmentStat = Object.fromEntries(
    (Object.entries(stats) as Array<[keyof TranslationTable, string]>)
      .filter(([name, value]) => value !== "")
      .map(([name, value]) => [translationTable[name], Number(value)]),
  )
  data.stat = processedStats

  return data as UnitData
}
