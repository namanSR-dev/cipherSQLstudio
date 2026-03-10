// Dev note: sample table normalization is isolated here to keep rendering components data-agnostic.
import type { QueryRow } from "@/types/query";

export interface NormalizedSampleTable {
  name: string;
  columns: string[];
  rows: QueryRow[];
}

export function normalizeSampleTables(sampleTables: unknown): NormalizedSampleTable[] {
  if (!sampleTables) return [];

  const tableEntries = Array.isArray(sampleTables)
    ? sampleTables.map((table) => [null, table] as const)
    : typeof sampleTables === "object"
      ? Object.entries(sampleTables as Record<string, unknown>)
      : [];

  return tableEntries.map(([nameFromKey, rawTable], tableIndex) => {
    const table =
      rawTable && typeof rawTable === "object"
        ? (rawTable as Record<string, unknown>)
        : {};

    const name =
      (typeof table.name === "string" && table.name) ||
      (typeof table.tableName === "string" && table.tableName) ||
      nameFromKey ||
      `table_${tableIndex + 1}`;

    const providedColumns = Array.isArray(table.columns)
      ? table.columns.filter((column): column is string => typeof column === "string")
      : [];

    const rawRows = Array.isArray(table.rows)
      ? table.rows
      : Array.isArray(table.data)
        ? table.data
        : [];

    if (rawRows.length === 0) {
      return { name, columns: providedColumns, rows: [] };
    }

    const firstRow = rawRows[0];

    if (Array.isArray(firstRow)) {
      const columns =
        providedColumns.length > 0
          ? providedColumns
          : firstRow.map((_, columnIndex) => `col_${columnIndex + 1}`);

      const rows = rawRows
        .filter((row): row is unknown[] => Array.isArray(row))
        .map((row) => {
          const normalized: QueryRow = {};

          columns.forEach((column, columnIndex) => {
            normalized[column] = row[columnIndex] ?? null;
          });

          return normalized;
        });

      return { name, columns, rows };
    }

    if (typeof firstRow === "object" && firstRow !== null) {
      const objectRows = rawRows.filter(
        (row): row is Record<string, unknown> =>
          typeof row === "object" && row !== null && !Array.isArray(row),
      );

      const columns =
        providedColumns.length > 0
          ? providedColumns
          : Array.from(new Set(objectRows.flatMap((row) => Object.keys(row))));

      const rows = objectRows.map((row) => {
        const normalized: QueryRow = {};

        columns.forEach((column) => {
          normalized[column] = row[column] ?? null;
        });

        return normalized;
      });

      return { name, columns, rows };
    }

    return { name, columns: providedColumns, rows: [] };
  });
}


