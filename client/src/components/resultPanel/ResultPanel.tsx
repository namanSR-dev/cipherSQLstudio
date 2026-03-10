// Dev note: panel handles mode/collapse UI; output and hint rendering are delegated to dedicated views.
import type { QueryRow } from "@/types/query";
import HintView from "@/components/resultPanel/HintView";
import OutputView from "@/components/resultPanel/OutputView";

export type ResultMode = "output" | "hint";

interface ResultPanelProps {
  isOpen: boolean;
  resultMode: ResultMode;
  onToggleOpen: () => void;
  onSelectMode: (mode: ResultMode) => void;
  queryError: string | null;
  rows: QueryRow[];
  assignmentId: string;
  query: string;
}

export default function ResultPanel({
  isOpen,
  resultMode,
  onToggleOpen,
  onSelectMode,
  queryError,
  rows,
  assignmentId,
  query,
}: ResultPanelProps) {
  return (
    <section className="result-panel">
      <header className="result-panel__header">
        <h2 className="result-panel__title">Result Panel</h2>
        <div className="result-panel__controls">
          <button
            type="button"
            className={`result-panel__mode-btn ${
              resultMode === "output" ? "is-active" : ""
            }`}
            onClick={() => onSelectMode("output")}
          >
            Output
          </button>
          <button
            type="button"
            className={`result-panel__mode-btn ${
              resultMode === "hint" ? "is-active" : ""
            }`}
            onClick={() => onSelectMode("hint")}
          >
            AI Hint
          </button>
          <button
            type="button"
            className="result-panel__collapse-btn"
            onClick={onToggleOpen}
          >
            {isOpen ? "Collapse" : "Expand"}
          </button>
        </div>
      </header>

      {isOpen ? (
        <div className="result-panel__content">
          {resultMode === "output" ? (
            <OutputView queryError={queryError} rows={rows} />
          ) : (
            <HintView assignmentId={assignmentId} query={query} />
          )}
        </div>
      ) : null}
    </section>
  );
}


