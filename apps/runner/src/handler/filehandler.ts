import { WebSocket } from "ws";
import fs from "fs";
import path from "path";
import { generateFileTree } from "../utils/supabaseStorage";


const baseDir = "../../../apps";

export async function handleFileMessage(ws: WebSocket, message: any) {
  const { action, payload } = message;
  const filePath = path.join(baseDir, payload.path);

  try {
    switch (action) {
      case "create":
        await fs.promises.writeFile(filePath, payload.content || "");
        const updatedFileTree = await generateFileTree(baseDir);
        ws.send(JSON.stringify({ message: "File created successfully", updatedFileTree }));
        break;

      case "read":
        const fileContent = await fs.promises.readFile(filePath, "utf-8");
        ws.send(JSON.stringify({ message: "File read successfully", content: fileContent }));
        break;

      case "update":
        await fs.promises.writeFile(filePath, payload.content);
        ws.send(JSON.stringify({ message: "File updated successfully" }));
        break;

      case "delete":
        await fs.promises.unlink(filePath);
        ws.send(JSON.stringify({ message: "File deleted successfully" }));
        break;

      default:
        ws.send(JSON.stringify({ message: "Unknown file operation" }));
    }
  } catch (error) {
    console.error("Error handling file operation:", error);
    ws.send(JSON.stringify({ message: "File operation failed", error: error }));
  }
}
