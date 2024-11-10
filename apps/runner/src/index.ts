import express from "express";
import cors from "cors";
import http from "http";
import { setupWebSocket } from "./ws";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

// Initialize WebSocket Server
setupWebSocket(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
