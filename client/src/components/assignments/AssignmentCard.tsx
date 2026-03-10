// Dev note: card is presentational; navigation target comes from assignment id prop.
import Link from "next/link";
import type { Assignment } from "@/types/assignment";
import DifficultyBadge from "@/components/assignments/DifficultyBadge";

export type AssignmentCardData = Pick<
  Assignment,
  "id" | "title" | "description" | "difficulty"
>;

interface AssignmentCardProps {
  assignment: AssignmentCardData;
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
  return (
    <li className="assignment-card">
      <div className="assignment-card__header">
        <h2 className="assignment-card__title">{assignment.title}</h2>
        <DifficultyBadge difficulty={assignment.difficulty} />
      </div>
      <p className="assignment-card__description">{assignment.description}</p>
      <Link className="assignment-card__cta" href={`/assignments/${assignment.id}`}>
        Attempt Assignment
      </Link>
    </li>
  );
}


