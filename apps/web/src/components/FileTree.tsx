import React, { useEffect, useState } from 'react'

const FileTree = () => {
  return (
    <div>
      
    </div>
  )
}

export default FileTree
const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(()=>{
        const ws = new WebSocket("ws://localhost:30007");
        setSocket(ws);
        ws.onopen = () => {
            console.log("Connected to WebSocket");
            ws.send(
              JSON.stringify({
                type: "fetch",
                path: "",
              })
            );
          };
    },[])
