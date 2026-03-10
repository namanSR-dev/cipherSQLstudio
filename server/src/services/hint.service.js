import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAssignmentDetail } from "../repositories/assignments.repository.js";

/**
 * The Hint Service is designed - logic can evolve into a more advanced tutoring agent.
 * 
 *     ---->> {  Take(assignment.question, Schema, UserSQL_query) => [ Helpful Hint without Answer ]  }.
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use a fast low-latency model for UI interactions
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

export const generateHint = async (assignmentId, query) => {
  const assignment = await getAssignmentDetail(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  // Guard: user requested hint before writing query
  if (!query || !query.trim()) {
    return {
      conceptualCheckin:
        "Start by writing a basic SELECT query that reads data from the main table involved in the problem.",
      guidedQuestion:
        "Which table contains the primary information needed to answer this question?"
    };
  }

  const { question, sampleTables } = assignment;

  const schemaDescription = sampleTables
    .map(
      (table) =>
        `Table ${table.tableName} with columns: ${table.columns
          .map((col) => `${col.columnName} (${col.dataType})`)
          .join(", ")}`
    )
    .join("\n");

  const prompt = `
You are mentoring a student who is solving a SQL exercise.

Assignment:
${question}

Database schema:
${schemaDescription}

Student query:
${query}

Your task is to help the student reason about their mistake without giving the final SQL.

Instructions:
- Identify the likely conceptual mistake.
- Reference relevant tables or columns if useful.
- Do NOT provide corrected SQL.
- Keep explanations short and constructive.

Return your response strictly in JSON format:

{
  "conceptualCheckin": "...short explanation of what might be wrong...",
  "guidedQuestion": "...a question that nudges the student toward the fix..."
}

Keep each field under 60 words.
`;

  try {
    const result = await model.generateContent(prompt);

    const text = result.response.text();

    if (!text) {
      return {
        conceptualCheckin:
          "The hint service couldn't generate a response. Try refining your SQL query.",
        guidedQuestion:
          "Which part of your query logic are you least confident about?"
      };
    }

    // Attempt to parse JSON response
    try {
      return JSON.parse(text);
    } catch {
      // Fallback if model ignores JSON format
      return {
        conceptualCheckin: text,
        guidedQuestion:
          "Based on this hint, what change would you try next in your SQL?"
      };
    }
  } catch (error) {
    console.error("Gemini hint error:", error);

    return {
      conceptualCheckin:
        "The AI hint service is temporarily unavailable.",
      guidedQuestion:
        "Try reviewing your WHERE conditions or joins while the service recovers."
    };
  }
};