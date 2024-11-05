import { Socket } from "./Websocket";

type PingWebsiteProps = {
    url: string;
    interval: number;
    maxAttempts: number;
};

export const pingWebsite = async ({ url, interval, maxAttempts }: PingWebsiteProps) => {
    let attempts = 0;

    const checkWebsite = async () => {
        const isServerUp = await checkWebSocketServer(url);
        if (isServerUp) {
            console.log(`${url} is up!`);
            await sendYourRequest(); 
            clearInterval(pingInterval);
        } else {
            attempts++;
            console.log(`Attempt ${attempts}: ${url} is down.`);
            if (attempts >= maxAttempts) {
                clearInterval(pingInterval);
                console.error(`Max attempts reached. ${url} is still down.`);
            }
        }
    };

    const pingInterval = setInterval(checkWebsite, interval);
};

const sendYourRequest = async () => {
    try {
        Socket?.send("hello world"); 
        console.log('Message sent to WebSocket: "hello world"');
    } catch (error) {
        console.error('Error sending request:', error);
    }
};

const checkWebSocketServer = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            socket.close();
            resolve(true);
        };

        socket.onerror = () => {
            resolve(false);
        };
    });
};

// Usage
// const urlToPing = 'ws://localhost:30007'; /
// const intervalInMilliseconds = 5000; 
// const maximumAttempts = 10;

// pingWebsite({ url: urlToPing, interval: intervalInMilliseconds, maxAttempts: maximumAttempts });
