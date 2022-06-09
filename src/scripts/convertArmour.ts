import {
  AugmentStat,
  GrindLevel,
  GRIND_KEYS,
  GRIND_LEVELS,
  Unit,
} from "augmenting/types"
import { BigNumber } from "mathjs"
import { HasGrindLevels, RecordSheet, Replace } from "./common"

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
  [0, 10, 20, 30, 41, 51], // Guessing +50 Grind
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
    ...otherKeys
  } = row
  const stats = { hp, pp, MEL, RNG, TEC, DmgResist, Status }
  const stars = Number(Stars)

  const grinds = GRIND_KEYS.reduce((memory, key) => {
    memory[key] = otherKeys[key]
    return memory
  }, {} as Record<typeof GRIND_KEYS[number], string>)

  const defenseBase = Number(grinds["Grind0"])
  const data: Partial<UnitData> = {
    name: Series,
    level: Number(Lv),
    stars,
    limit: Number(Limit) as GrindLevel,
    stat: {},
  }

  const grindLevelTuples = GRIND_LEVELS.map((level) => {
    const rawGrind = grinds[`Grind${level}`]
    let grind: number = Number(rawGrind)
    if (rawGrind === null || rawGrind === undefined || rawGrind === "")
      grind = defenseBase + rarityBackfill[stars][Math.floor(level / 10)]
    return [level, grind]
  })
  data.grindValues = Object.fromEntries(grindLevelTuples)

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
