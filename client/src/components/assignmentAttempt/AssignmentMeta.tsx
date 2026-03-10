// Dev note: metadata header is split out to keep detail page readable and easy to test.
import DifficultyBadge from "@/components/assignments/DifficultyBadge";

interface AssignmentMetaProps {
  title: string;
  difficulty?: string;
  description: string;
}

export default function AssignmentMeta({
  title,
  difficulty,
  description,
}: AssignmentMetaProps) {
  return (
    <header className="assignment-meta content-card">
      <h1 className="assignment-meta__title">{title}</h1>
      <DifficultyBadge difficulty={difficulty} />
      <p className="assignment-meta__description">{description}</p>
    </header>
  );
}


