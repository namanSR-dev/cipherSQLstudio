// Dev note: Monaco setup is isolated in this wrapper; page components should pass only value/change props.
"use client";

import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

interface SQLEditorProps {
  query: string;
  onChange: (value: string) => void;
}

export default function SQLEditor({ query, onChange }: SQLEditorProps) {
  const [theme, setTheme] = useState<"vs-light" | "vs-dark">("vs-light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const syncTheme = () => {
      setTheme(mediaQuery.matches ? "vs-dark" : "vs-light");
    };

    syncTheme();
    mediaQuery.addEventListener("change", syncTheme);

    return () => {
      mediaQuery.removeEventListener("change", syncTheme);
    };
  }, []);

  return (
    <div className="sql-editor-shell">
      <Editor
        height="320px"
        defaultLanguage="sql"
        value={query}
        onChange={(value) => onChange(value ?? "")}
        theme={theme}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "JetBrains Mono, Fira Code, Consolas, monospace",
          scrollBeyondLastLine: false,
          lineNumbersMinChars: 3,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
}


