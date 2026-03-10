// Dev note: centralized API layer; keep request/response mapping changes here to avoid touching UI flow.
/**
 * CipherSQLStudio - Frontend API Service Layer
 *    --> This file acts as the central hub for all network communication between 
 *        Next.js frontend and the Express/PostgreSQL backend. 
 */

export type QueryRow = Record<string, unknown>;

export interface AssignmentListItem {
  id: string;
  title: string;
  difficulty?: string;
  description: string;
}

export interface Assignment {
  id: string;
  title: string;
  difficulty?: string;
  description: string;
  question: string;
  sampleTables?: unknown;
  starterQuery?: string;
}

export interface ExecuteQueryResponse {
  rows: QueryRow[];
}

export interface HintResponse {
  hint: string;
}

// Ensure our base URL doesn't end with a trailing slash to prevent double-slashes in paths
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "").replace(/\/$/, "");



//------------------------------//
/* --- EXPORTED API METHODS --- */
//------------------------------//



// Fetches the full list and filters out any malformed items
export const fetchAssignments = () => 
  requestJson<unknown>("/assignments").then((payload) => {
    if (!Array.isArray(payload)) return [];
    return payload
      .map(mapAssignmentListItem)
      .filter((item): item is AssignmentListItem => item !== null);
  });

// Gets the full details for a specific SQL task
export const fetchAssignment = (id: string) => 
  requestJson<unknown>(`/assignments/${id}`).then(mapAssignmentDetail);

// Sends user SQL to the engine for execution
export const executeQuery = (assignmentId: string, query: string) => 
  requestJson<ExecuteQueryResponse>("/query/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assignmentId, query }),
  });

// Hits our Gemini-powered tutoring service for a hint
export const getHint = async (assignmentId: string, query: string) => {
  return requestJson<HintResponse>("/hints", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assignmentId, query }),
  });
};


//------------------------------//
/* --- HELPERS AND MAPPERS --- */
//------------------------------//



/** [HELPER] : Safety check to see if an unknown value is actually a record/object 
 */
const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
};

/** [HELPER] : Basic string validation so we don't deal with empty strings in the UI 
 */
const asNonEmptyString = (value: unknown): string | null => {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
};

/** [MAPPER] : Cleans up the raw JSON for the list view. 
 * If the data is missing an ID or Title, we discard it to keep the UI stable.
 */
const mapAssignmentListItem = (value: unknown): AssignmentListItem | null => {
  const item = asRecord(value);
  if (!item) return null;

  const id = (typeof item.id === "string" || typeof item.id === "number") 
    ? String(item.id) 
    : null;
    
  const title = asNonEmptyString(item.title);

  if (!id || !title) return null;

  return {
    id,
    title,
    difficulty: asNonEmptyString(item.difficulty) ?? undefined,
    description: typeof item.description === "string" ? item.description : "",
  };
};

/** [MAPPER] : Detailed view transformer. 
 * Unlike the list, we throw errors here because if a specific assignment 
 * page fails to load required data, we want to hit the Error Boundary.
 */
const mapAssignmentDetail = (value: unknown): Assignment => {
  const item = asRecord(value);

  if (!item) throw new Error("Invalid assignment payload from API.");

  const id = (typeof item.id === "string" || typeof item.id === "number") 
    ? String(item.id) 
    : "";
    
  const title = typeof item.title === "string" ? item.title : "";

  if (!id || !title) {
    throw new Error("Assignment payload is missing required fields.");
  }

  return {
    id,
    title,
    difficulty: asNonEmptyString(item.difficulty) ?? undefined,
    description: typeof item.description === "string" ? item.description : "",
    question: typeof item.question === "string" ? item.question : "",
    sampleTables: item.sampleTables,
    starterQuery: typeof item.starterQuery === "string" ? item.starterQuery : undefined,
  };
};

/**  [URL BUILDER] : Decides where to send the request. 
 * Fallbacks to the local path if on the client side, otherwise demands an ENV var.
 */
const buildUrl = (path: string): string => {
  if (API_BASE) return `${API_BASE}${path}`;
  if (typeof window !== "undefined") return path;

  throw new Error(
    "NEXT_PUBLIC_API_BASE is not set. Check your .env file!"
  );
};



/**  [CORE FETCH WRAPPER] : Handles the heavy lifting of fetch, 
 * error handling, and JSON parsing so we don't repeat this everywhere.
 */

const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const url = buildUrl(path);
  let response: Response;

  try {
    response = await fetch(url, {
      cache: "no-store", // We want fresh data for SQL queries and assignments
      ...init,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown network error";
    throw new Error(`Connection failed: ${message}`);
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API Error: ${response.status}`);
  }

  return (await response.json()) as T;
};

