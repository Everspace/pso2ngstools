import { List, ListItem } from "@mui/material"
import { ClassIcon } from "icons"
import { useAtom } from "jotai"
import { zero } from "MathConstants"
import { allAugmentsAtom } from "./state/augmentableState"
import { bpTotalAtom, getClassBp, getWeaponBp } from "./state/bpState"
import {
  classInfoAtom,
  classNameAtom,
  levelAtom,
  skillpointAtom,
} from "./state/characterState"
import { weaponStateAtom } from "./state/equipmentState"

export function CharacterDisplay() {
  const [bp] = useAtom(bpTotalAtom)
  const [className] = useAtom(classNameAtom)
  const [classLevel] = useAtom(levelAtom)
  const [classInfo] = useAtom(classInfoAtom)
  const [weaponState] = useAtom(weaponStateAtom)
  const [skillpoint] = useAtom(skillpointAtom)
  const [augments] = useAtom(allAugmentsAtom)
  return (
    <List>
      <ListItem>
        Lv. {classLevel} <ClassIcon shortname={className} /> {className}
      </ListItem>
      <ListItem>Class: {getClassBp(classInfo).toNumber()} BP</ListItem>
      <ListItem>Skill: {skillpoint * 3} BP</ListItem>
      <ListItem>
        Augments:{" "}
        {augments
          .reduce((mem, aug) => mem.add(aug.stat.bp ?? zero), zero)
          .toNumber()}{" "}
        BP
      </ListItem>
      <ListItem>Weapon: {getWeaponBp(weaponState).toNumber()} BP</ListItem>
      <ListItem>Total: {bp} BP</ListItem>
      <ListItem></ListItem>
    </List>
  )
}
