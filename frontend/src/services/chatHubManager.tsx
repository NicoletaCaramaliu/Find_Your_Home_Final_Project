import * as signalR from "@microsoft/signalr";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5266";

export const chatConnection = new signalR.HubConnectionBuilder()
  .withUrl(`${API_URL}/chatHub`, {
    accessTokenFactory: () => localStorage.getItem("token") || "",
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

let chatStarted = false;

export async function startChatConnection() {
  if (chatConnection.state === "Connected" || chatStarted) return;

  if (chatConnection.state === "Disconnected") {
    try {
      await chatConnection.start();
      chatStarted = true;
      console.log("ChatHub connected:", chatConnection.connectionId);
    } catch (err) {
      console.error("ChatHub connection failed:", err);
      setTimeout(() => startChatConnection(), 2000);
    }
  } else {
    console.warn("ChatHub: current state:", chatConnection.state);
  }
}

export function onChatEvent(event: string, callback: (...args: any[]) => void) {
  console.log(`ChatHub subscribed to: ${event}`);
  chatConnection.on(event, callback);
}

export function offChatEvent(event: string, callback?: (...args: any[]) => void) {
  if (callback) {
    chatConnection.off(event, callback);
  } else {
    chatConnection.off(event);
  }
}

export function sendChat(method: string, ...args: any[]) {
  if (chatConnection.state === "Connected") {
    return chatConnection.send(method, ...args);
  } else {
    console.warn("ChatHub not connected:", method);
  }
}
