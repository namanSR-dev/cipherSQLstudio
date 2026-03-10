// Dev note: handles empty-state vs list rendering for normalized sample tables.
import SampleTable from "@/components/assignmentAttempt/SampleTable";
import type { NormalizedSampleTable } from "@/utils/normalizeSampleTables";

interface SampleTablesProps {
  tables: NormalizedSampleTable[];
}

export default function SampleTables({ tables }: SampleTablesProps) {
  return (
    <section className="content-card">
      <h2 className="content-card__title">Sample Tables</h2>

      {tables.length === 0 ? (
        <p>No sample tables available.</p>
      ) : (
        tables.map((table) => <SampleTable key={table.name} table={table} />)
      )}
    </section>
  );
}


