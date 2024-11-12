"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalComponent: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const sessionId = useRef<string | null>(null);
  const xterm = useRef<XTerm | null>(null);
  const fitAddon = useRef(new FitAddon());

  const terminalRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      xterm.current = new XTerm({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: "JetBrains Mono, monospace",
      });
      xterm.current.loadAddon(fitAddon.current);
      xterm.current.open(node);

      setTimeout(() => fitAddon.current.fit(), 500);
      const resizeObserver = new ResizeObserver(() => {
        fitAddon.current.fit();
      });
      resizeObserver.observe(node);

      return () => {
        xterm.current?.dispose();
        resizeObserver.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
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
        xterm.current?.write(data.data);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (xterm.current && socket) {
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
  }, [socket]);

  return (
    <div>
      <div
        ref={terminalRefCallback}
        className="p-2"
        style={{ width: "100%", height: "100%", maxHeight: 'calc(100vh - <HEADER_HEIGHT>)', overflow: "auto", backgroundColor: "black" }}
      ></div>
    </div>
  );
};

export default TerminalComponent;
