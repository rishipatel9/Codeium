import WebSocketManager from "./Websocket";


type PingWebsiteProps = {
    url: string;
    interval: number;
    maxAttempts: number;
};

export const pingWebsite = async ({ url, interval, maxAttempts }: PingWebsiteProps) => {
    let attempts = 0;

    const checkWebsite = async () => {
        const isServerUp = await WebSocketManager.getInstance()?.isServerUp();
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
        WebSocketManager.getInstance()?.sendMessage({message:"hello world"}); 
        console.log('Message sent to WebSocket: "hello world"');
    } catch (error) {
        console.error('Error sending request:', error);
    }
};

