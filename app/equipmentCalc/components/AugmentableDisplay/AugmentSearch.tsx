"use client"

import { Combobox } from "@headlessui/react"
import { allAugments } from "augmenting/data/augments"
import {
  addAugmentAtomFamily,
  augmentableFamily,
  removeAugmentAtomFamily,
} from "augmenting/state/augmentableState"
import { Augment, AugmentableSlot } from "augmenting/types"
import clsx from "clsx"
import { useSetAtom } from "jotai/react"
import { atom } from "jotai/vanilla"
import { atomFamily } from "jotai/vanilla/utils"
import { compare } from "mathjs"
import { Fragment, useState } from "react"

function augmentToName(augment: Augment) {
  return `${augment.name} - ${augment.stat.bp?.toNumber() ?? "??"} BP`
}

function augmentEqual(a: Augment | null, b: Augment | null) {
  return a?.name === b?.name
}

type Filterer<T> = (options: T[], query: string) => T[]
const filterer: Filterer<Augment> = (options, query) => {
  if (query.trim() === "") return []
  return options
    .filter((aug) => aug.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => compare(a.stat.bp ?? 0, b.stat.bp ?? 0) as number)
    .reverse()
    .slice(0, 20)
}
export const updateAugmentAtom = atomFamily((params: AugmentLineProps) => {
  const { number, slot } = params
  const augmentsAtom = augmentableFamily(slot)
  const removeAtom = removeAugmentAtomFamily(slot)
  const addAtom = addAugmentAtomFamily(slot)
  return atom(null, (get, set, update: Augment | null) => {
    const augment = get(augmentsAtom)[number]
    if (update) set(addAtom, update)
    else set(removeAtom, augment)
  })
})

export type AugmentLineProps = {
  augment?: Augment
  number: number
  slot: AugmentableSlot
}
export function AugmentSearch({ augment, number, slot }: AugmentLineProps) {
  const handleChange = useSetAtom(updateAugmentAtom({ number, slot }))
  const [query, setQuery] = useState("")
  const filteredAugments = filterer(allAugments, query)

  const options = filteredAugments.map((aug) => (
    <Combobox.Option key={aug.name} value={aug} as={Fragment}>
      {({ active }) => (
        <li
          className={clsx(
            "bg-white text-black",
            active && "bg-blue-400 text-white",
          )}
        >
          {augmentToName(aug)}
        </li>
      )}
    </Combobox.Option>
  ))

  return (
    <Combobox
      value={augment}
      by={augmentEqual}
      onChange={handleChange}
      nullable
      multiple={false}
    >
      <Combobox.Input
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(aug: Augment) =>
          `${aug.name} (${aug.stat.bp?.toNumber() ?? "??"} BP) - ${
            aug.rate * 10
          }%`
        }
      />
      <Combobox.Options>{options}</Combobox.Options>
      {augment ? <button onClick={() => handleChange(null)}>x</button> : null}
    </Combobox>
  )
}
