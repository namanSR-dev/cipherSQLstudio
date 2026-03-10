// Dev note: this route handles fetch/error states and delegates rendering to assignments components.
import { fetchAssignments } from "@/lib/api";
import AssignmentGrid from "@/components/assignments/AssignmentGrid";
import type { Assignment } from "@/types/assignment";

type AssignmentPreview = Pick<
  Assignment,
  "id" | "title" | "description" | "difficulty"
>;

export default async function AssignmentsPage() {
  let assignments: AssignmentPreview[] = [];
  let loadError: string | null = null;

  try {
    assignments = await fetchAssignments();
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Failed to load assignments.";
  }

  return (
    <main className="assignments-page">
      <h1 className="assignments-page__heading">CipherSQLStudio Assignments</h1>
      <p className="assignments-page__subheading">
        Choose a challenge, inspect the problem statement, and run your SQL against
        live validation.
      </p>

      {loadError ? (
        <div className="assignments-page__notice">
          <p>Could not load assignments.</p>
          <p>{loadError}</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="assignments-page__notice">
          <p>No assignments found.</p>
        </div>
      ) : (
        <AssignmentGrid assignments={assignments} />
      )}
    </main>
  );
}


