/* eslint-disable import/first */
import denv from "dotenv"
denv.config({ path: process.cwd() + "\\.env" })
denv.config({ path: process.cwd() + "\\.env.local" })

import { GoogleSpreadsheet } from "google-spreadsheet"

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET)
doc.useApiKey(process.env.GOOGLE_API_KEY!)
await doc.loadInfo()

export function getSheetRows(name: string) {
  return doc.sheetsByTitle[name].getRows()
}
