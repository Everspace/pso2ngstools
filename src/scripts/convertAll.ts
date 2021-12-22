import { Options, parse, Parser } from "csv-parse"
import fs from "fs/promises"
import { handleAugmentRow } from "./convertAugment"

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
      "./Augments.json",
      { columns: true },
      async (parser) => {
        const allAugments = []
        for await (const entry of parser) {
          allAugments.push(handleAugmentRow(entry))
        }
        return allAugments
      },
    ),
  ])
}

main()
