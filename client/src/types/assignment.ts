// Dev note: assignment contract used by UI components; update this first when backend shape changes.
export interface Assignment {
  id: string;
  title: string;
  description: string;
  difficulty?: string;
  question: string;
  sampleTables: unknown;
}


