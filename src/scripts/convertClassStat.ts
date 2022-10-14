import {
  allClasses,
  ClassAbbreviation,
  ClassData,
  ClassLevel,
} from "augmenting/types"
import { toNumberOrNull, writeFileJson } from "./common"
import { getSheetRows } from "./google"
import level1Stats from "./level1Stat.json"

const statNames = ["HP", "Atk", "Def"]
const deltas: StatDelta = {}
let maxLevel = 1
for await (const entry of await getSheetRows("StatDelta")) {
  const attackDelta = toNumberOrNull(entry["attack"])
  const defenseDelta = toNumberOrNull(entry["defense"])
  deltas[entry["level"]] = {
    attackDelta,
    defenseDelta,
  }

  const level = toNumberOrNull(entry["level"]) ?? 1
  if (attackDelta && maxLevel < level) maxLevel = level
}
export const MaxLevel = maxLevel

type RowTuple = [ClassAbbreviation, string, string, string]
const classStats: RowTuple[] = allClasses.map(
  (c) => [c, ...statNames.map((s) => c + s)] as RowTuple,
)

export type ClassStatResultTuple = [number, ClassAbbreviation, ClassLevel]
export type StatDelta = Record<
  string,
  { attackDelta: number | null; defenseDelta: number | null }
>

export function handleClassStatRow(
  row: Record<string, string>,
  statDeltas: StatDelta,
): ClassStatResultTuple[] {
  const classInfo = classStats.map(
    ([className, classHp, classAttack, classDefense]) => {
      const hp = toNumberOrNull(row[classHp])
      const level = Number(row[className]!)
      let attack = toNumberOrNull(row[classAttack])
      let defense = toNumberOrNull(row[classDefense])

      const [attackLevel1, defenseLevel1] = level1Stats[className]
      const { attackDelta, defenseDelta } = statDeltas[row[className]]

      if (attack === null) {
        if (attackDelta === null) return null
        attack = attackLevel1 + attackDelta
      }
      if (defense === null) {
        if (defenseDelta === null) return null
        defense = defenseLevel1 + defenseDelta
      }

      const cl: ClassLevel = {
        attack,
        defense,
      }
      if (hp !== null) cl.hp = Number(hp)
      const result = [level, className, cl] as ClassStatResultTuple
      return result
    },
  )

  return classInfo.filter((thing) => thing !== null) as ClassStatResultTuple[]
}

export async function doClasses() {
  const classes: ClassData = allClasses.reduce(
    (mem, cname) => ({ ...mem, [cname]: [{ attack: 0, defense: 0 }] }),
    {} as any,
  )
  for await (const entry of await getSheetRows("StatTable")) {
    const classResult = handleClassStatRow(entry, deltas)
    classResult.forEach(([level, c, stat]) => {
      classes[c][level] = stat
    })
  }

  writeFileJson(classes, "./src/augmenting/data/Classes.json")
}
