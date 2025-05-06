import * as signalR from "@microsoft/signalr";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5266";

export const notificationConnection = new signalR.HubConnectionBuilder()
  .withUrl(`${API_URL}/notificationhub`, {
    accessTokenFactory: () => localStorage.getItem("token") || "",
  })
  .withAutomaticReconnect()
  .build();

let hasStarted = false;

export async function startNotificationConnection() {
  if (hasStarted || notificationConnection.state === "Connected") return;

  try {
    await notificationConnection.start();
    hasStarted = true;
    console.log("NotificationHub connected.");
  } catch (err) {
    console.error("NotificationHub connection failed:", err);
  }
}

export function onNotification(event: string, callback: (...args: any[]) => void) {
  notificationConnection.on(event, callback);
}

export function offNotification(event: string, callback?: (...args: any[]) => void) {
  if (callback) {
    notificationConnection.off(event, callback);
  } else {
    notificationConnection.off(event);
  }
}


export function getNotificationConnectionState() {
  return notificationConnection.state;
}

export function sendToHub(method: string, ...args: any[]) {
    if (notificationConnection.state === "Connected") {
      return notificationConnection.send(method, ...args);
    } else {
      console.warn("❗ Cannot send, SignalR not connected:", method);
    }
  }
  
