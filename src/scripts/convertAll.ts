/* eslint-disable import/first */
import denv from "dotenv"
denv.config({ path: process.cwd() + "\\.env" })
denv.config({ path: process.cwd() + "\\.env.local" })

import { MAX_LEVEL } from "augmenting/state/consts"
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
import { handleClassStatRow } from "./convertClassStat"
import { handleWeaponRow, WeaponData } from "./convertWeapon"

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET)

async function openParse(
  fileSource: string,
  fileTarget: string,
  callback: (sheet: GoogleSpreadsheetWorksheet) => any | Promise<any>,
) {
  const source = await doc.sheetsByTitle[fileSource]
  const dest = await fs.open(fileTarget, "w")
  const data = await callback(source)
  dest.writeFile(JSON.stringify(data, null, 2))
  dest.close()
}

async function main() {
  console.log(process.env.GOOGLE_API_KEY)
  doc.useApiKey(process.env.GOOGLE_API_KEY!)
  await doc.loadInfo()
  Promise.all([
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
      "StatTable",
      "./src/augmenting/data/Classes.json",
      async (sheet) => {
        const classes: ClassData = allClasses.reduce(
          (mem, cname) => ({ ...mem, [cname]: [{ attack: 0, defense: 0 }] }),
          {} as any,
        )
        for await (const entry of await sheet.getRows()) {
          const classResult = handleClassStatRow(entry)
          classResult.forEach(([level, c, stat]) => {
            if (level > MAX_LEVEL) return
            classes[c][level] = stat
          })
        }
        return classes
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

main()
