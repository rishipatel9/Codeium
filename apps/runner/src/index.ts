import express from "express";
import { WebSocketServer  } from "ws";
import cors from "cors"
import http from 'http';
import { fetchSupabaseFolder } from "./supabaseStorage";

const app=express();

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

wss.on('connection', (ws:any) => {
    console.log('New Client Connection');
    ws.on('message', async (message: any) => {
        const parsedMessage = JSON.parse(message.toString());
        console.log(parsedMessage);
        if (parsedMessage?.type === "fetch") {
            console.log("Received fetch command");
            try {
                await fetchSupabaseFolder("react", "../apps"); 
                console.log("Fetch completed");
                ws.send("Fetch operation completed successfully!"); 
            } catch (e) {
                console.log("Error occurred", e);
                ws.send("Fetch operation failed");
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});


server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  })    
  