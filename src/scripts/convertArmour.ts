import { AugmentStat, Unit } from "augmenting/types"

interface DataSheetRow {
  Series: string
  Lv: string
  Stars: string
  hp: string
  pp: string
  MEL: string
  RNG: string
  TEC: string
  DEF: string
  DEFMax: string
  DmgResist: string
  StatusResist: string
}

type TranslationTable = Partial<Record<keyof DataSheetRow, keyof AugmentStat>>

const translationTable: TranslationTable = {
  DmgResist: "damageResist",
  MEL: "meleePotency",
  RNG: "rangedPotency",
  TEC: "techPotency",
  StatusResist: "statusResist",
  hp: "hp",
  pp: "pp",
}

export function handleArmorRow(row: DataSheetRow): Unit {
  const { Series, Lv, DEF, DEFMax, Stars, ...stats } = row

  const data: Partial<Record<keyof Unit, any>> = {
    name: Series,
    level: Number(Lv),
    stars: Number(Stars),
    defenseBase: Number(DEF),
    defenseMax: Number(DEFMax),
    stat: {},
  }

  const processedStats: AugmentStat = Object.fromEntries(
    (Object.entries(stats) as Array<[keyof TranslationTable, string]>)
      .filter(([name, value]) => value !== "")
      .map(([name, value]) => [translationTable[name], Number(value)]),
  )
  data.stat = processedStats

  return data as Unit
}
