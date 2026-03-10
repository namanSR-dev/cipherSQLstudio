// Dev note: renders one normalized sample table; expects columns/rows to be precomputed.
import type { NormalizedSampleTable } from "@/utils/normalizeSampleTables";

interface SampleTableProps {
  table: NormalizedSampleTable;
}

export default function SampleTable({ table }: SampleTableProps) {
  return (
    <article className="sample-table">
      <h3 className="sample-table__title">{table.name}</h3>
      <div className="sample-table__scroll">
        <table>
          <thead>
            <tr>
              {table.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={`${table.name}-${rowIndex}`}>
                {table.columns.map((column) => (
                  <td key={`${table.name}-${rowIndex}-${column}`}>
                    {row[column] === null ? "NULL" : String(row[column] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}


