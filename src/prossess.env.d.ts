declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_SPREADSHEET?: string
      GOOGLE_API_KEY?: string
    }
  }
}
