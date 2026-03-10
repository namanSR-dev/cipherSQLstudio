// Dev note: badge uses utility-based class mapping; avoid inline color logic in consuming components.
import { getDifficultyClass } from "@/utils/difficulty";

interface DifficultyBadgeProps {
  difficulty?: string;
}

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  if (!difficulty) return null;

  return (
    <span className={`difficulty-badge ${getDifficultyClass(difficulty)}`}>
      {difficulty}
    </span>
  );
}


