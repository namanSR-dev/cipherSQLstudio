// Dev note: submit button state is controlled by parent; keep this component stateless.
interface EditorToolbarProps {
  runningQuery: boolean;
  hasQuery: boolean;
}

export default function EditorToolbar({ runningQuery, hasQuery }: EditorToolbarProps) {
  return (
    <div className="editor-panel__toolbar">
      <button
        type="submit"
        className="editor-panel__run-btn"
        disabled={runningQuery || !hasQuery}
      >
        {runningQuery ? "Running..." : "Run Query"}
      </button>
    </div>
  );
}


