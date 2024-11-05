class WebSocketSingleton {
    private static instance: WebSocketSingleton | null = null;
    private socket: WebSocket | null = null;
    private url: string;
  
    private constructor(url: string) {
      this.url = url;
      this.connect();
    }
  
    public static getInstance(url: string): WebSocketSingleton {
      if (!WebSocketSingleton.instance) {
        WebSocketSingleton.instance = new WebSocketSingleton(url);
      }
      return WebSocketSingleton.instance;
    }
  
    private connect(): void {
      if (typeof WebSocket === 'undefined') {
        console.error('WebSocket is not available in this environment.');
        return;
      }
  
      this.socket = new WebSocket(this.url);
  
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
      };
  
      this.socket.onmessage = (event: MessageEvent) => {
        console.log('Message from server:', event.data);

      };
  
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');

      };
  
      this.socket.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
      };
    }
  
    public send(message: string): void {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(message);
        console.log('Message sent:', message);
      } else {
        console.error('WebSocket is not open. Unable to send message.');
      }
    }
  
    public close(): void {
      if (this.socket) {
        this.socket.close();
        console.log('WebSocket connection closed');
      }
    }
  }
  
  // Usage
  export const Socket = (() => {
    if (typeof window !== 'undefined') { // Ensure code runs only in the browser
      return WebSocketSingleton.getInstance('ws://localhost:30007');
    }
    return null; // Or handle this case as needed
  })();
  
  if (Socket) {
    Socket.send('Hello, Server!');
  } else {
    console.error('WebSocket instance is not available.');
  }
  