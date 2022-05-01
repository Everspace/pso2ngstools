import { allClasses, ClassAbbreviation, ClassLevel } from "augmenting/types"

const statNames = ["HP", "Atk", "Def"]

type RowTuple = [ClassAbbreviation, string, string, string]
const classStats: RowTuple[] = allClasses.map(
  (c) => [c, ...statNames.map((s) => c + s)] as RowTuple,
)

export type ClassStatResultTuple = [number, ClassAbbreviation, ClassLevel]

export function handleClassStatRow(
  row: Record<string, string>,
): ClassStatResultTuple[] {
  const classInfo = classStats.map(([name, hp, attack, defense]) => {
    const cl: ClassLevel = {
      attack: Number(row[attack]),
      defense: Number(row[defense]),
    }
    if (row[hp] !== "" || row[hp] !== null) cl.hp = Number(row[hp])
    const result = [Number(row[name]), name, cl] as ClassStatResultTuple
    return result
  })

  return classInfo.filter(([level, name, {attack, defense}]) => !Number.isNaN(attack) && !Number.isNaN(defense))
}
