import { MAX_LEVEL } from "augmenting/state/consts"
import { allClasses, ClassData } from "augmenting/types"
import { Options, parse, Parser } from "csv-parse"
import fs from "fs/promises"
import { handleArmorRow, UnitData } from "./convertArmour"
import { handleAugmentRow } from "./convertAugment"
import { handleClassStatRow } from "./convertClassStat"
import { handleWeaponRow, WeaponData } from "./convertWeapon"

async function openParse(
  fileSource: string,
  fileTarget: string,
  opts: Options | undefined,
  callback: (parser: Parser) => any | Promise<any>,
) {
  const source = await fs.open(fileSource, "r")
  const dest = await fs.open(fileTarget, "w")
  const parser = parse(await source.readFile(), opts)
  const data = await callback(parser)
  dest.writeFile(JSON.stringify(data, null, 2))
  dest.close()
  source.close()
}

async function main() {
  Promise.all([
    openParse(
      "./Affixes - Affixes.csv",
      "./src/augmenting/data/Augments.json",
      { columns: true },
      async (parser) => {
        const allAugments = []
        for await (const entry of parser) {
          allAugments.push(handleAugmentRow(entry))
        }
        return allAugments
      },
    ),
    openParse(
      "./Affixes - Armour.csv",
      "./src/augmenting/data/Armours.json",
      { columns: true },
      async (parser) => {
        const allArmours: Record<string, UnitData> = {}
        for await (const entry of parser) {
          const armour = handleArmorRow(entry)
          allArmours[armour.name] = armour
        }
        return allArmours
      },
    ),
    openParse(
      "./Affixes - Weapons.csv",
      "./src/augmenting/data/Weapons.json",
      { columns: true },
      async (parser) => {
        const allArmours: Record<string, WeaponData> = {}
        for await (const entry of parser) {
          const weapon = handleWeaponRow(entry)
          allArmours[weapon.name] = weapon
        }
        return allArmours
      },
    ),
    openParse(
      "./Affixes - StatTable.csv",
      "./src/augmenting/data/Classes.json",
      { columns: true },
      async (parser) => {
        const classes: ClassData = allClasses.reduce(
          (mem, cname) => ({ ...mem, [cname]: [{ attack: 0, defense: 0 }] }),
          {} as any,
        )
        for await (const entry of parser) {
          const classResult = handleClassStatRow(entry)
          classResult.forEach(([level, c, stat]) => {
            if (level > MAX_LEVEL) return
            classes[c][level] = stat
          })
        }
        return classes
      },
    ),
  ])
}

main()
