// Dev note: grid only maps list data to cards; pagination/filtering belongs to parent route if added later.
import AssignmentCard, {
  type AssignmentCardData,
} from "@/components/assignments/AssignmentCard";

interface AssignmentGridProps {
  assignments: AssignmentCardData[];
}

export default function AssignmentGrid({ assignments }: AssignmentGridProps) {
  return (
    <ul className="assignments-grid">
      {assignments.map((assignment) => (
        <AssignmentCard key={assignment.id} assignment={assignment} />
      ))}
    </ul>
  );
}


