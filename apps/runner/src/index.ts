import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import http from "http";
import { fetchSupabaseFolder } from "./supabaseStorage";
import Terminal from "./terminal";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT || 4000;

const terminalManager = new Terminal();

wss.on('connection', (ws: any) => {
  console.log('New Client Connection');

  ws.on('message', async (message: any) => {
    const parsedMessage = JSON.parse(message.toString());
    console.log(parsedMessage);
    if(parsedMessage?.type=== "fetch") {
      console.log("Received fetch command");
      try{
        await fetchSupabaseFolder("react", "../apps");
        console.log("Fetch completed");
        ws.send(JSON.stringify({ message: "Fetch operation completed successfully!" }));
      }catch(e){
        console.log("Error occurred", e);
        ws.send(JSON.stringify({ message: "Fetch operation failed" }));
      }
    }

    if(parsedMessage?.type=== "terminal") {
      const {sessionId,action,data} = parsedMessage;
      if(!sessionId) {
        ws.send(JSON.stringify({ message: 'Missing sessionId for terminal action' }));
        return;
      }
      if(action ==="start") {
        console.log(`Starting terminal session for sessionId: ${sessionId}`);
        const terminalProcess = terminalManager.init(sessionId, "someReplId", (data: string) => {
          ws.send(JSON.stringify({ sessionId, data }));
        });
        ws.send(JSON.stringify({ message: `Terminal session started with sessionId: ${sessionId}` }));
      }

      if (action === "input") {
        if (!data) {
          ws.send(JSON.stringify({ message: 'Missing data for terminal input' }));
          return;
        }
        console.log(`Writing data to terminal session ${sessionId}`);
        terminalManager.write(sessionId, data);
      }

      if (action === "resize") {
        const { cols, rows } = parsedMessage;
        if (cols && rows) {
          terminalManager.resize(sessionId, cols, rows);
        }
      }

      if (action === "close") {
        console.log(`Closing terminal session for sessionId: ${sessionId}`);
        terminalManager.close(sessionId);
        ws.send(JSON.stringify({ message: `Terminal session closed for sessionId: ${sessionId}` }));
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
