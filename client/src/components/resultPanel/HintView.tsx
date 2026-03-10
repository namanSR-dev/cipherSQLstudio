// Dev note: hint view parses multiple backend payload shapes; check console log before changing parser logic.
import { useEffect, useState } from "react";
import { getHint } from "@/lib/api";

interface HintViewProps {
  assignmentId: string;
  query: string;
}

interface HintData {
  conceptualCheckin: string;
  guidedQuestion: string;
}

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
};

const getStringValue = (
  record: Record<string, unknown>,
  keys: string[],
): string | null => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return null;
};

const normalizeHintData = (data: Partial<HintData>): HintData => ({
  conceptualCheckin:
    data.conceptualCheckin?.trim() ||
    "Review the query logic and identify which clause may be causing the issue.",
  guidedQuestion:
    data.guidedQuestion?.trim() ||
    "What is the smallest change you can test next?",
});

const extractJsonCandidate = (text: string): string | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) return fencedMatch[1].trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1).trim();
  }

  return null;
};

const parseHintFromText = (text: string): Partial<HintData> | null => {
  const candidate = extractJsonCandidate(text);
  if (!candidate) return null;

  try {
    const parsed = JSON.parse(candidate) as unknown;
    const parsedRecord = asRecord(parsed);
    if (!parsedRecord) return null;

    const wrapped = parsedRecord.hint;
    if (wrapped && typeof wrapped === "object") {
      const wrappedRecord = asRecord(wrapped);
      if (wrappedRecord) {
        const conceptualCheckin = getStringValue(wrappedRecord, [
          "conceptualCheckin",
          "conceptualCheckIn",
          "conceptual_checkin",
        ]);
        const guidedQuestion = getStringValue(wrappedRecord, [
          "guidedQuestion",
          "guided_question",
        ]);
        if (conceptualCheckin || guidedQuestion) {
          return { conceptualCheckin: conceptualCheckin ?? "", guidedQuestion: guidedQuestion ?? "" };
        }
      }
    }

    const conceptualCheckin = getStringValue(parsedRecord, [
      "conceptualCheckin",
      "conceptualCheckIn",
      "conceptual_checkin",
    ]);
    const guidedQuestion = getStringValue(parsedRecord, [
      "guidedQuestion",
      "guided_question",
    ]);

    if (!conceptualCheckin && !guidedQuestion) return null;

    return { conceptualCheckin: conceptualCheckin ?? "", guidedQuestion: guidedQuestion ?? "" };
  } catch {
    return null;
  }
};

const parseHintObject = (value: unknown): HintData | null => {
  const record = asRecord(value);
  if (!record) return null;

  const conceptualCheckin = getStringValue(record, [
    "conceptualCheckin",
    "conceptualCheckIn",
    "conceptual_checkin",
  ]);
  const guidedQuestion = getStringValue(record, [
    "guidedQuestion",
    "guided_question",
  ]);

  const conceptualFromText = conceptualCheckin ? parseHintFromText(conceptualCheckin) : null;
  if (conceptualFromText) {
    return normalizeHintData({
      conceptualCheckin: conceptualFromText.conceptualCheckin,
      guidedQuestion: conceptualFromText.guidedQuestion || guidedQuestion || "",
    });
  }

  if (!conceptualCheckin && !guidedQuestion) return null;

  return normalizeHintData({ conceptualCheckin: conceptualCheckin ?? "", guidedQuestion: guidedQuestion ?? "" });
};

const parseHintData = (payload: unknown): HintData => {
  const directHint = parseHintObject(payload);
  if (directHint) return directHint;

  const wrapper = asRecord(payload);
  if (!wrapper) {
    throw new Error("Invalid hint payload.");
  }

  const wrappedHint = wrapper.hint;

  if (typeof wrappedHint === "string") {
    const trimmed = wrappedHint.trim();
    if (!trimmed) {
      throw new Error("Hint payload is missing expected fields.");
    }

    const parsedFromText = parseHintFromText(trimmed);
    if (parsedFromText) {
      return normalizeHintData(parsedFromText);
    }

    return {
      conceptualCheckin: trimmed,
      guidedQuestion: "What is the next small fix you can try in your query?",
    };
  }

  const parsedWrappedHint = parseHintObject(wrappedHint);
  if (parsedWrappedHint) return parsedWrappedHint;

  throw new Error("Hint payload is missing expected fields.");
};

export default function HintView({ assignmentId, query }: HintViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hintError, setHintError] = useState<string | null>(null);
  const [hintData, setHintData] = useState<HintData | null>(null);
  const [autoRequested, setAutoRequested] = useState(false);

  const requestHint = async () => {
    if (!assignmentId || !query.trim()) return;

    setIsLoading(true);
    setHintError(null);

    try {
      const response = await getHint(assignmentId, query);
      console.log("Hint API raw response:", response);
      setHintData(parseHintData(response as unknown));
    } catch (error) {
      setHintData(null);
      setHintError(error instanceof Error ? error.message : "Failed to fetch hint.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoRequested) return;
    setAutoRequested(true);
    void requestHint();
  }, [autoRequested]);

  return (
    <div className="ai-hint-placeholder">
      <button
        type="button"
        className="result-panel__mode-btn"
        onClick={requestHint}
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? "Getting Hint..." : "Refresh Hint"}
      </button>

      {hintError ? <p className="result-panel__message is-error">{hintError}</p> : null}

      {hintData ? (
        <>
          <h3>Conceptual Check-in</h3>
          <p>{hintData.conceptualCheckin}</p>

          <h3>Guided Question</h3>
          <p>{hintData.guidedQuestion}</p>
        </>
      ) : hintError ? null : (
        <p>Request a hint based on your current query.</p>
      )}
    </div>
  );
}


