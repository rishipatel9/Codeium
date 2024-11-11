import { WebSocketServer, WebSocket } from "ws";
import http from "http";

import { handleTerminalMessage } from "./handler/terminalhandler";
import { handleFileMessage } from "./handler/filehandler";
import { handleFolderMessage } from "./handler/folderhandler";
import { checkIfFolderExists, fetchSupabaseFolder, generateFileTree } from "./utils/supabaseStorage";

export function setupWebSocket(server: http.Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("New Client Connection");

    ws.on("message", async (message) => {
      const parsedMessage = JSON.parse(message.toString());
      const { type } = parsedMessage;
        console.log(parsedMessage)
      switch (type) {
        case "filetree":
            const fileTree = await generateFileTree("../apps");
            ws.send(JSON.stringify({ fileTree }));
            break;
        case "fetch":
        await fetchFiles(ws,parsedMessage);
            break;
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


async function fetchFiles(ws: WebSocket,parsedMessage:any) {
    try {
        const { replId, userId } = parsedMessage.payload;
        console.log(replId, userId);
  
        const folderExists = await checkIfFolderExists("../apps");
        if (folderExists) {
          console.log("Folder already exists, skipping fetch.");
          ws.send(
            JSON.stringify({
              message: "Folder already exists, fetch operation skipped.",
            })
          );
        } else {
          console.log("Folder does not exist, fetching...");
          await fetchSupabaseFolder(`${userId}/${replId}`, "../apps");
          console.log("Fetch completed");
          ws.send(
            JSON.stringify({
              message: "Fetch operation completed successfully!",
            })
          );
        }
      } catch (e) {
        console.error("Error occurred", e);
        ws.send(JSON.stringify({ message: "Fetch operation failed" }));
      }
}
