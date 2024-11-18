// WebSocketManager.ts
const wsUrl = process.env.NEXT_PUBLIC_SERVICE_URL || "ws://localhost:4000/";

class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket;
  private initialized: boolean = false;
  private eventListeners: { [key: string]: (data: any) => void } = {};

  private constructor(wsUrl: string) {
    this.ws = new WebSocket(wsUrl);
    this.init();
  }

  public static getInstance(): WebSocketManager {
    if (!this.instance) {
      this.instance = new WebSocketManager(wsUrl);
    }
    return this.instance;
  }

  private init() {
    this.ws.onopen = () => {
      console.log("WebSocket connected: WebSocketManager");
      this.initialized = true;
    };

    this.ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.type && this.eventListeners[parsedData.type]) {
        this.eventListeners[parsedData.type](parsedData.payload);
      }
    };
  }

  // Rename addEventListener to onMessage to avoid conflict
  public onMessage(type: string, callback: (data: any) => void) {
    console.log()
    this.eventListeners[type] = callback;
  }

  public sendMessage(message: object): void {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open. Unable to send message.");
    }
  }

  public isServerUp(): boolean {
    return this.initialized;
  }
}

export default WebSocketManager;
