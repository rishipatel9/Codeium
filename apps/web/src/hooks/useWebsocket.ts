import { useState, useEffect, useRef } from "react";

export function useWebSocket(session: string) {
  const [fileTree, setFileTree] = useState(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000/");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket Connected");
      console.log("Session:", session);
      ws.send(JSON.stringify({ type: "fetch", payload: { replId: session.split("/")[1], userId: session.split("/")[0] }}));
      setTimeout(() => ws.send(JSON.stringify({ type: "filetree" })), 3000);
    };

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      console.log("Received data", parsedData);

      // Update file tree
      if (parsedData.fileTree) {
        setFileTree(parsedData.fileTree);
      }

      // Update editor content when file data is received
      if (parsedData.type === "file" && parsedData.action === "read") {
        setEditorContent(parsedData.payload.content || ""); 
      }
    };

    return () => {
      ws.close();
    };
  }, [session]);

  const fetchFile = (filePath: string) => {
    console.log("Fetching file", filePath);
    wsRef.current?.send(JSON.stringify({ type: "file", action: "read", payload: { path: filePath } }));
  };

  return { fileTree, editorContent, fetchFile , setEditorContent};
}
