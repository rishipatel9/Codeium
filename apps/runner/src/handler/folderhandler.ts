import { WebSocket } from "ws";
import fs from "fs";
import path from "path";
import { generateFileTree } from "../utils/supabaseStorage";

const baseDir = "../apps";

export async function handleFolderMessage(ws: WebSocket, message: any) {
  const { action, payload } = message;
  const folderPath = path.join(baseDir, payload.path);

  try {
    switch (action) {
        case "create":
            try {
              await fs.promises.mkdir(folderPath, { recursive: true });
              const updatedFileTree = await generateFileTree(baseDir);
              ws.send(
                JSON.stringify({
                  message: "Folder created successfully",
                  status: "success",
                  updatedFileTree,
                })
              );
            } catch (error) {
              console.error("Error creating folder:", error);
              ws.send(
                JSON.stringify({
                  message: "Error creating folder",
                  status: "error",
                  error: error,
                })
              );
            }
            break;

      case "delete":
        await fs.promises.rmdir(folderPath, { recursive: true });
        ws.send(JSON.stringify({ message: "Folder deleted successfully" }));
        break;

      default:
        ws.send(JSON.stringify({ message: "Unknown folder operation" }));
    }
  } catch (error) {
    console.error("Error handling folder operation:", error);
    ws.send(JSON.stringify({ message: "Folder operation failed", error: error }));
  }
}
