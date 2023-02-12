/* eslint-disable import/first */
import denv from "dotenv"
denv.config({ path: process.cwd() + "\\.env" })
denv.config({ path: process.cwd() + "\\.env.local" })

import { GoogleSpreadsheet } from "google-spreadsheet"

if (!process.env?.GOOGLE_SPREADSHEET) {
  throw new Error("Please set GOOGLE_SPREADSHEET")
}

if (!process.env?.GOOGLE_API_KEY) {
  throw new Error("Please set GOOGLE_API_KEY")
}

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET)
doc.useApiKey(process.env.GOOGLE_API_KEY)
await doc.loadInfo()

export function getSheetRows(name: string) {
  return doc.sheetsByTitle[name].getRows()
}
