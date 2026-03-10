// Dev note: this page owns query execution state; child components stay presentational via explicit props.
"use client";

import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AssignmentMeta from "@/components/assignmentAttempt/AssignmentMeta";
import AssignmentQuestion from "@/components/assignmentAttempt/AssignmentQuestion";
import SampleTables from "@/components/assignmentAttempt/SampleTables";
import EditorToolbar from "@/components/editor/EditorToolbar";
import QueryEditor from "@/components/editor/QueryEditor";
import ResultPanel, { type ResultMode } from "@/components/resultPanel/ResultPanel";
import { executeQuery, fetchAssignment, type Assignment as ApiAssignment } from "@/lib/api";
import type { QueryRow } from "@/types/query";
import { normalizeSampleTables } from "@/utils/normalizeSampleTables";

export default function AssignmentDetailPage() {
  const params = useParams<{ id: string }>();
  const assignmentId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [assignment, setAssignment] = useState<ApiAssignment | null>(null);
  const [query, setQuery] = useState("SELECT * FROM table_name;");
  const [rows, setRows] = useState<QueryRow[]>([]);
  const [loadingAssignment, setLoadingAssignment] = useState(true);
  const [runningQuery, setRunningQuery] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultMode, setResultMode] = useState<ResultMode>("output");

  useEffect(() => {
    if (!assignmentId) return;

    const loadAssignment = async () => {
      setLoadingAssignment(true);
      setLoadError(null);

      try {
        const data = await fetchAssignment(assignmentId);
        setAssignment(data);

        if (data.starterQuery) {
          setQuery(data.starterQuery);
        }
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "Failed to load assignment.",
        );
      } finally {
        setLoadingAssignment(false);
      }
    };

    void loadAssignment();
  }, [assignmentId]);

  const sampleTables = useMemo(
    () => normalizeSampleTables(assignment?.sampleTables),
    [assignment?.sampleTables],
  );

  const runQuery = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!assignmentId || !query.trim()) return;

    setRunningQuery(true);
    setQueryError(null);

    try {
      const result = await executeQuery(assignmentId, query);
      setRows(result.rows);
      setResultMode("output");
      setIsResultOpen(true);
    } catch (error) {
      setRows([]);
      setResultMode("output");
      setIsResultOpen(true);
      setQueryError(
        error instanceof Error ? error.message : "Query execution failed.",
      );
    } finally {
      setRunningQuery(false);
    }
  };

  if (!assignmentId) {
    return (
      <main className="assignments-page">
        <div className="assignments-page__notice">
          <p>Invalid assignment id.</p>
        </div>
      </main>
    );
  }

  if (loadingAssignment) {
    return (
      <main className="assignments-page">
        <div className="assignments-page__notice">
          <p>Loading assignment...</p>
        </div>
      </main>
    );
  }

  if (loadError || !assignment) {
    return (
      <main className="assignments-page">
        <div className="assignments-page__notice">
          <p>Could not load assignment.</p>
          {loadError ? <p>{loadError}</p> : null}
        </div>
      </main>
    );
  }

  return (
    <main className="assignment-attempt-layout">
      <section className="assignment-attempt-layout__left">
        <AssignmentMeta
          title={assignment.title}
          difficulty={assignment.difficulty}
          description={assignment.description}
        />
        <AssignmentQuestion question={assignment.question} />
        <SampleTables tables={sampleTables} />
      </section>

      <section className="assignment-attempt-layout__right">
        <form onSubmit={runQuery} className="editor-panel">
          <EditorToolbar runningQuery={runningQuery} hasQuery={Boolean(query.trim())} />
          <QueryEditor query={query} onChange={setQuery} />
        </form>
        <ResultPanel
          isOpen={isResultOpen}
          resultMode={resultMode}
          onToggleOpen={() => setIsResultOpen((open) => !open)}
          onSelectMode={(mode) => {
            setResultMode(mode);
            setIsResultOpen(true);
          }}
          queryError={queryError}
          rows={rows}
          assignmentId={assignmentId}
          query={query}
        />
      </section>
    </main>
  );
}


