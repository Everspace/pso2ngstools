import { allClasses, ClassAbbreviation, ClassLevel } from "augmenting/types"
import { toNumberOrNull } from "./common"
import level1Stats from "./level1Stat.json"

const statNames = ["HP", "Atk", "Def"]

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
