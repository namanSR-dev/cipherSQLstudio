// Dev note: thin wrapper around SQLEditor to keep editor module swappable.
import SQLEditor from "@/components/SQLEditor";

interface QueryEditorProps {
  query: string;
  onChange: (value: string) => void;
}

export default function QueryEditor({ query, onChange }: QueryEditorProps) {
  return <SQLEditor query={query} onChange={onChange} />;
}


