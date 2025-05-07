import * as signalR from "@microsoft/signalr";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5266";

export const notificationConnection = new signalR.HubConnectionBuilder()
  .withUrl(`${API_URL}/notificationhub`, {
    accessTokenFactory: () => localStorage.getItem("token") || "",
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

let hasStarted = false;

export async function startNotificationConnection() {
  if (notificationConnection.state === "Connected" || hasStarted) return;

  if (notificationConnection.state === "Disconnected") {
    try {
      await notificationConnection.start();
      hasStarted = true;
      console.log("SignalR connected:", notificationConnection.connectionId);
    } catch (err) {
      console.error("SignalR connection failed:", err);
      
      setTimeout(() => startNotificationConnection(), 2000);
    }
  } else {
    console.warn("⚠️ Cannot start SignalR. Current state:", notificationConnection.state);
  }
}

export function onNotification(event: string, callback: (...args: any[]) => void) {
  console.log(`📡 Listening for event: "${event}"`);
  notificationConnection.on(event, callback);
}

export function offNotification(event: string, callback?: (...args: any[]) => void) {
  if (callback) {
    notificationConnection.off(event, callback);
    console.log(`Unsubscribed from: "${event}"`);
  } else {
    notificationConnection.off(event);
    console.log(`Unsubscribed from ALL handlers for: "${event}"`);
  }
}

export function getNotificationConnectionState() {
  return notificationConnection.state;
}

export function sendToHub(method: string, ...args: any[]) {
  if (notificationConnection.state === "Connected") {
    console.log("➡️ Sending to hub:", method, args);
    return notificationConnection.send(method, ...args);
  } else {
    console.warn("Cannot send to hub, not connected. Method:", method);
  }
}