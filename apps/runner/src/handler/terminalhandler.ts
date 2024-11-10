import { WebSocket } from "ws";
import Terminal from "../utils/terminal";


const terminalManager = new Terminal();

export async function handleTerminalMessage(ws: WebSocket, message: any) {
  const { sessionId, action, data } = message;
  if (!sessionId) {
    ws.send(JSON.stringify({ message: "Missing sessionId for terminal action" }));
    return;
  }

  switch (action) {
    case "start":
      const terminalProcess = terminalManager.init(sessionId, "someReplId", (data: string) => {
        ws.send(JSON.stringify({ sessionId, data }));
      });
      ws.send(JSON.stringify({ message: `Terminal session started with sessionId: ${sessionId}` }));
      break;

    case "input":
      terminalManager.write(sessionId, data);
      break;

    case "resize":
      const { cols, rows } = message;
      if (cols && rows) {
        terminalManager.resize(sessionId, cols, rows);
      }
      break;

    case "close":
      terminalManager.close(sessionId);
      ws.send(JSON.stringify({ message: `Terminal session closed for sessionId: ${sessionId}` }));
      break;

    default:
      ws.send(JSON.stringify({ message: "Unknown terminal action" }));
  }
}
