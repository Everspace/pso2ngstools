/* eslint-disable import/first */
import denv from "dotenv"
denv.config({ path: process.cwd() + "\\.env" })
denv.config({ path: process.cwd() + "\\.env.local" })

import {
  allClasses,
  ClassData,
  CombatActivity,
  CombatActivityType,
  GameRegion,
} from "augmenting/types"
import fs from "fs/promises"
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet"
import { handleArmorRow, UnitData } from "./convertArmour"
import { handleAugmentRow } from "./convertAugment"
import { handleClassStatRow, StatDelta } from "./convertClassStat"
import { handleWeaponRow, WeaponData } from "./convertWeapon"
import { toNumberOrNull } from "./common"

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET)

async function openParse<T>(
  fileSource: string,
  fileTarget: string | null,
  callback: (sheet: GoogleSpreadsheetWorksheet) => T | Promise<T>,
): Promise<T> {
  const source = await doc.sheetsByTitle[fileSource]
  const data = await callback(source)

  if (fileTarget) {
    const dest = await fs.open(fileTarget, "w")
    dest.writeFile(JSON.stringify(data, null, 2))
    dest.close()
  }

  return data
}

async function doClasses() {
  const statDelta = await openParse("StatDelta", null, async (sheet) => {
    const deltas: StatDelta = {}
    for await (const entry of await sheet.getRows()) {
      deltas[entry["level"]] = {
        attackDelta: toNumberOrNull(entry["attack"]),
        defenseDelta: toNumberOrNull(entry["defense"]),
      }
    }
    return deltas
  })

  return await openParse(
    "StatTable",
    "./src/augmenting/data/Classes.json",
    async (sheet) => {
      const classes: ClassData = allClasses.reduce(
        (mem, cname) => ({ ...mem, [cname]: [{ attack: 0, defense: 0 }] }),
        {} as any,
      )
      const rows = await sheet.getRows()
      for (const entry of rows) {
        const classResult = handleClassStatRow(entry, statDelta)
        classResult.forEach(([level, c, stat]) => {
          classes[c][level] = stat
        })
      }
      return classes
    },
  )
}

async function main() {
  await doc.useApiKey(process.env.GOOGLE_API_KEY!)
  await doc.loadInfo()

  await Promise.allSettled([
    doClasses(),
    openParse(
      "Affixes",
      "./src/augmenting/data/Augments.json",
      async (sheet) => {
        const allAugments = []
        for await (const entry of await sheet.getRows()) {
          allAugments.push(handleAugmentRow(entry as any))
        }
        return allAugments
      },
    ),
    openParse("Armour", "./src/augmenting/data/Armours.json", async (sheet) => {
      const allArmours: Record<string, UnitData> = {}
      for await (const entry of await sheet.getRows()) {
        const armour = handleArmorRow(entry as any)
        allArmours[armour.name] = armour
      }
      return allArmours
    }),
    openParse(
      "Weapons",
      "./src/augmenting/data/Weapons.json",
      async (sheet) => {
        const allArmours: Record<string, WeaponData> = {}
        for await (const entry of await sheet.getRows()) {
          const weapon = handleWeaponRow(entry as any)
          allArmours[weapon.name] = weapon
        }
        return allArmours
      },
    ),
    openParse(
      "BPRequirements",
      "./src/augmenting/data/BPRequirements.json",
      async (sheet) => {
        const data: CombatActivity[] = []

        for await (const entry of await sheet.getRows()) {
          const { Region, Type, Name, Rank, BP } = entry
          if ([Region, Type, Name, Rank, BP].indexOf("") !== -1) continue
          data.push({
            name: Name,
            region: Region as GameRegion,
            type: Type as CombatActivityType,
            rank: Number(Rank),
            bp: Number(BP),
          })
        }

        return data.sort((a, b) =>
          `${a.name}${a.rank}`.localeCompare(`${b.name}${b.rank}`),
        )
      },
    ),
  ])
}

try {
  main()
} catch (e) {
  console.log(e)
  process.exit(1)
}
