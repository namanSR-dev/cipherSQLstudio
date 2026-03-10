// Dev note: normalize difficulty text here so badge styling remains consistent across pages.
export function getDifficultyClass(difficulty?: string) {
  const value = difficulty?.trim().toLowerCase() ?? "";

  if (value === "easy" || value.includes("easy")) return "difficulty-easy";
  if (value === "medium" || value.includes("medium")) return "difficulty-medium";
  if (value === "hard" || value.includes("hard")) return "difficulty-hard";
  return "difficulty-unknown";
}


