'use client'
import React, { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalComponent: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null); 
  const sessionId = useRef<string | null>(null); 
  const xterm = useRef<XTerm | null>(null); 
  const fitAddon = useRef(new FitAddon()); 
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:30007");
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      sessionId.current = `session-${Date.now()}`;
      ws.send(
        JSON.stringify({
          type: "terminal",
          sessionId: sessionId.current,
          action: "start",
        })
      );
    };

    ws.onmessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data);
      if (data.sessionId === sessionId.current && data.data) {
        if (xterm.current) {
          xterm.current.write(data.data);
        }
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      // Initialize XTerm
      xterm.current = new XTerm();
      xterm.current.loadAddon(fitAddon.current);
      xterm.current.open(terminalRef.current);

      // Resize the terminal to fit the container
      fitAddon.current.fit();

      // Handle terminal input and send to WebSocket
      xterm.current.onData((data: string) => {
        if (socket && sessionId.current) {
          socket.send(
            JSON.stringify({
              type: "terminal",
              sessionId: sessionId.current,
              action: "input",
              data,
            })
          );
        }
      });
    }

    // Cleanup on component unmount
    return () => {
      if (xterm.current) {
        xterm.current.dispose();
      }
    };
  }, [socket]);

  return (
    <div>
      <div
        ref={terminalRef}
        style={{ width: "100%", height: "500px", backgroundColor: "#24252B" }}
      ></div>
    </div>
  );
};

export default TerminalComponent;
