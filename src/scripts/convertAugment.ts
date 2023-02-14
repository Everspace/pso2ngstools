import { AugmentImageType } from "augmenting/images/augment"
import { augmentTierToRoman } from "augmenting/tools"
import { Augment, AugmentStat } from "augmenting/types"
import { writeFileJson } from "./common"
import { getSheetRows } from "./google"

interface DataSheetRow {
  baseName: string
  category: string
  icon: AugmentImageType
  tier: string
  bp: string
  rate: string
  hp: string
  pp: string
  MEL: string
  RNG: string
  TEC: string
  ALL: string
  PotencyFloor: string
  DmgResist: string
  ConditionalPot: string
  StatusResist: string
  drop: string
}

type TranslationTable = Record<
  keyof DataSheetRow,
  keyof Augment | keyof AugmentStat
>

const translationTable: TranslationTable = {
  baseName: "baseName",
  category: "category",
  icon: "icon",
  tier: "tier",
  bp: "bp",
  rate: "rate",
  drop: "location",
  hp: "hp",
  pp: "pp",
  MEL: "meleePotency",
  RNG: "rangedPotency",
  TEC: "techPotency",
  ALL: "potency",
  PotencyFloor: "floorPotency",
  DmgResist: "damageResist",
  ConditionalPot: "conditionalPotency",
  StatusResist: "statusResist",
}

export function handleAugmentRow(rawRow: any): Augment {
  const row = rawRow as DataSheetRow
  const {
    baseName,
    category,
    icon,
    tier,
    rate,
    drop,
    bp,
    hp,
    pp,
    MEL,
    RNG,
    TEC,
    ALL,
    PotencyFloor,
    DmgResist,
    ConditionalPot,
    StatusResist,
  } = row

  const stats = {
    bp,
    hp,
    pp,
    MEL,
    RNG,
    TEC,
    ALL,
    PotencyFloor,
    DmgResist,
    ConditionalPot,
    StatusResist,
  }

  let name: string = baseName
  let tierNumber: undefined | number
  if (tier !== "") {
    tierNumber = Number(tier)
    name = `${baseName} ${augmentTierToRoman[tierNumber - 1]}`
  }

  const data: Augment = {
    name,
    baseName,
    category,
    icon,
    tier: tierNumber,
    rate: Number(rate),
    [translationTable["drop"]]: drop,
    stat: {},
  }

  const processedStats: AugmentStat = Object.fromEntries(
    (Object.entries(stats) as Array<[keyof TranslationTable, string]>)
      .filter(
        ([name, value]) =>
          value !== "" && value !== null && value !== undefined,
      )
      .map(([name, value]) => [translationTable[name], Number(value)]),
  )
  data.stat = processedStats

  return data
}

export async function doAffixes() {
  const rows = await getSheetRows("Affixes")
  const allAugments = rows.map(handleAugmentRow)

  writeFileJson(allAugments, "./src/augmenting/data/Augments.json")
}
