"use client"

import { Combobox, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/20/solid"
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

type AugmentUpdateAtomProps = {
  number: number
  slot: AugmentableSlot
}
export const updateAugmentAtom = atomFamily(
  ({ number, slot }: AugmentUpdateAtomProps) => {
    const augmentsAtom = augmentableFamily(slot)
    const removeAtom = removeAugmentAtomFamily(slot)
    const addAtom = addAugmentAtomFamily(slot)
    return atom(null, (get, set, update: Augment | null) => {
      const augment = get(augmentsAtom)[number]
      if (update) return set(addAtom, update)
      if (!augment) return
      set(removeAtom, augment)
    })
  },
)

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
            active ? "bg-blue-400 text-white" : "bg-white text-black",
          )}
        >
          {augmentToName(aug)}
        </li>
      )}
    </Combobox.Option>
  ))

  return (
    <div className="w-full">
      <Combobox
        value={augment}
        by={augmentEqual}
        onChange={handleChange}
        nullable
        multiple={false}
      >
        <div className="flex">
          <Combobox.Input
            className="flex-auto rounded-none border p-1"
            spellCheck={false}
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(aug: Augment | null) =>
              aug
                ? `${aug.name} (${aug.stat.bp?.toNumber() ?? "??"} BP) - ${
                    aug.rate * 10
                  }%`
                : ""
            }
          />
          {augment ? (
            <div className="flex items-center border-t border-r border-b">
              <button onClick={() => handleChange(null)}>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>

        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Combobox.Options className="absolute z-30 max-h-60 w-full overflow-auto border bg-white">
            {options}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  )
}
