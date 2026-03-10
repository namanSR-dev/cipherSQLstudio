// Dev note: shared table renderer for SQL output; keep cell formatting rules centralized.
import { type QueryRow } from "@/lib/api";

interface ResultsTableProps {
  rows: QueryRow[];
}

function formatCellValue(value: unknown) {
  if (value === null) return "NULL";
  if (value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function ResultsTable({ rows }: ResultsTableProps) {
  if (rows.length === 0) return null;

  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

  return (
    <div className="results-table-wrap">
      <table className="results-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={`${rowIndex}-${column}`}>{formatCellValue(row[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


