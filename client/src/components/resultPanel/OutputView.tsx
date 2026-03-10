// Dev note: output view defines error/empty/result precedence for consistent result panel behavior.
import ResultsTable from "@/components/ResultsTable";
import type { QueryRow } from "@/types/query";

interface OutputViewProps {
  queryError: string | null;
  rows: QueryRow[];
}

export default function OutputView({ queryError, rows }: OutputViewProps) {
  if (queryError) {
    return <p className="result-panel__message is-error">{queryError}</p>;
  }

  if (rows.length > 0) {
    return <ResultsTable rows={rows} />;
  }

  return <p className="result-panel__message">Run a query to view output rows.</p>;
}


