// Dev note: SQL result rows are dynamic by column, so this stays index-signature based.
export interface QueryRow {
  [key: string]: unknown;
}


