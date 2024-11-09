'use client'

import { useRef, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { FileTree } from "./FileTree";
import MonacoEditor from "./MonacoEditor";
import { initPod } from "@/utils/user";
import { useWebSocket } from "@/hooks/useWebsocket";
import TerminalComponent from "../Terminal";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

type EditorProps = {
  session: string;
  name:string
};

export default function FileEditor({ session, name }: EditorProps) {
  const hasInitialized = useRef(false);
  const { fileTree, editorContent, fetchFile, setEditorContent, handleCreateFile,handleCreateFolder } = useWebSocket(session);

  const [fileTreeWidth, setFileTreeWidth] = useState(240);
  const [editorHeight, setEditorHeight] = useState(500);

  useEffect(() => {
    const startPod = async () => {
      if (!hasInitialized.current) {
        const response = await initPod({ session });
        setTimeout(() => {
          response.success ? toast.success(response.message) : toast.error(response.message);
        }, 0);
        hasInitialized.current = true;
      }
    };

    // startPod();
  }, [session]);

  return (
    <div className="h-screen full w-full bg-black text-white flex flex-col lg:flex-row  overflow-hidden">
      <div className="p-4 border-r-2 border-[#2D2D2D] flex-shrink-0 overflow-scroll" >
        <ResizableBox
          width={fileTreeWidth}
          height={Infinity}
          axis="x"
          minConstraints={[200, 0]}
          maxConstraints={[400, 0]}
          resizeHandles={['e']}
          onResizeStop={(e, data) => setFileTreeWidth(data.size.width)}
        >
          <div className="h-full w-full overflow-scroll">
            <FileTree fileTree={fileTree} fetchFile={fetchFile} name={name} onCreateFile={handleCreateFile} onCreateFolder={handleCreateFolder}/>
          </div>
        </ResizableBox>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-grow border-b-2 border-[#2D2D2D]" style={{ height: editorHeight }}>
          <ResizableBox
            width={Infinity}
            height={editorHeight}
            axis="y"
            minConstraints={[0, 300]}
            maxConstraints={[0, 800]}
            resizeHandles={['s']}
            onResizeStop={(e, data) => setEditorHeight(data.size.height)}
          >
            <div className="h-full w-full">
              <MonacoEditor content={editorContent} setContent={setEditorContent} />
            </div>
          </ResizableBox>
        </div>

        <div className=" border-t-2 border-[#2D2D2D]">
          <TerminalComponent />
        </div>
      </div>
      <Toaster />
    </div>
  );
}