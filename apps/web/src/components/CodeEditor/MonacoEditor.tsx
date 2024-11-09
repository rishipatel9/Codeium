import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";

type EditorProps = {
  content: string;
  setContent: (value: string) => void;
};

export default function MonacoEditor({ content, setContent }: EditorProps) {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("black-theme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "background", background: "000000" },
          { token: "", foreground: "ffffff" }
        ],
        colors: {
          "editor.background": "#000000",
          "editor.foreground": "#ffffff",
        }
      });
      monaco.editor.setTheme("black-theme");
    }
  }, [monaco]);

  const getLanguage = (content: string): string => {
    if (content.includes('import React') || content.includes('<')) {
      return content.includes('jsx') ? 'typescript' : 'javascript';
    }
    return 'javascript'; 
  };

  return (
    <div style={{ height: "100%", maxHeight: "calc(100vh - <HEADER_HEIGHT>)", overflow: "auto" }}>
      <Editor
        height="100%"
        defaultLanguage={getLanguage(content)} 
        value={content}
        theme="black-theme"
        onChange={(value) => setContent(value || "")}
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
