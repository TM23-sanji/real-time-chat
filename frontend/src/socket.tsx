import socket from "socket.io-client";

let socketInstance:any=null;

export const initializeSocket = (roomName:string) => {
    socketInstance = socket(import.meta.env.VITE_BASE_URL,{auth:{token:localStorage.getItem('token')},query:{roomName}});
    return socketInstance;
}

interface MessageData {
    sender: string;
    text: string;
}

export const receiveMsg = (eventName:string,callback:(data:any)=>void) => {
    socketInstance.on(eventName, callback);
}

export const sendMsg = (eventName: string, data: MessageData): void => {
    socketInstance.emit(eventName, data);
}