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
    
      if (parsedData.fileTree) {
        setFileTree(parsedData.fileTree);
      }
      
      if (parsedData.type === "file" && parsedData.action === "read") {
        setEditorContent(parsedData.payload.content || "");
        console.log(editorContent)
      }
      if (parsedData.updatedFileTree) {
        setFileTree(parsedData.updatedFileTree); 
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

  const handleCreateFile = (path: string, filename: string) =>  {
    wsRef.current?.send(
      JSON.stringify({
        type: "file",
        action: "create",
        payload: { path: path, name: filename, content: "Initial file content" },
      })
    );
  };

  const handleCreateFolder=(path:string,folderName:string)=> {
    wsRef.current?.send(
      JSON.stringify({
        type: "folder",
        action: "create",
        payload: { path: path, name: folderName },
      })
    )
  }
  
  return { fileTree, editorContent, fetchFile , setEditorContent, handleCreateFile,handleCreateFolder };
}
