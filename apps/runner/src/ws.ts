import { WebSocketServer } from "ws";
import http from "http";



import { handleTerminalMessage } from "./handler/terminalhandler";
import { handleFileMessage } from "./handler/filehandler";
import { handleFolderMessage } from "./handler/folderhandler";

export function setupWebSocket(server: http.Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("New Client Connection");

    ws.on("message", async (message) => {
      const parsedMessage = JSON.parse(message.toString());
      const { type } = parsedMessage;

      switch (type) {
        case "terminal":
          await handleTerminalMessage(ws, parsedMessage);
          break;
        case "file":
          await handleFileMessage(ws, parsedMessage);
          break;
        case "folder":
          await handleFolderMessage(ws, parsedMessage);
          break;
        default:
          ws.send(JSON.stringify({ message: "Unknown message type" }));
      }
    });

    ws.on("close", () => console.log("Client disconnected"));
  });
}
