import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import api from "../api";
import * as signalR from "@microsoft/signalr";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  senderName?: string;
  senderProfilePictureUrl?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5266";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get<Notification[]>('/notifications/GetUserNotifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/notificationhub`, { 
        accessTokenFactory: () => localStorage.getItem("token") || ""
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: () => 3000,
      })
      .build();

    connection.onclose(() => {
      console.log("Disconnected ❌");
      setConnectionStatus("disconnected");
    });

    connection.onreconnecting(() => {
      console.log("Reconnecting 🔄...");
      setConnectionStatus("connecting");
    });

    connection.onreconnected(() => {
      console.log("Reconnected ✅");
      setConnectionStatus("connected");
    });

    connection.start()
      .then(() => {
        console.log("Connected to NotificationHub ✅");
        setConnectionStatus("connected");

        connection.on("ReceiveNotification", (notificationMessage: any) => {
          console.log("Received notification:", notificationMessage);
          const newNotification: Notification = {
            id: crypto.randomUUID(),
            type: notificationMessage.type,
            title: notificationMessage.title,
            message: notificationMessage.message,
            timestamp: notificationMessage.timestamp,
            isRead: false,
            senderName: "System",
            senderProfilePictureUrl: ""
          };

          setNotifications(prev => [newNotification, ...prev]);
        });
      })
      .catch(error => {
        console.error("Connection failed:", error);
        setConnectionStatus("disconnected");
      });

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.isRead);

  const handleNotificationClick = async (notificationId: string, notification: Notification) => {
    try {
      await api.patch(`/notifications/mark-as-read/${notificationId}`);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );

      if (notification.type === "booking-request") {
        navigate("/properties"); 
      } else if (notification.type === "booking-accepted") {
        navigate("/properties");
      } else if (notification.type === "booking-rejected") {
        navigate("/properties");
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative text-gray-900 dark:text-gray-100 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-6 h-6" />
        {unreadNotifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
          {connectionStatus === "connecting" && (
            <div className="p-4 text-yellow-600 text-center">Connecting...</div>
          )}
          {connectionStatus === "disconnected" && (
            <div className="p-4 text-red-600 text-center">Disconnected. Trying again...</div>
          )}
          {connectionStatus === "connected" && (
            <>
              {notifications.length === 0 ? (
                <div className="p-4 text-gray-500 dark:text-gray-400">
                  No notifications.
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id, notification)}
                    className={`px-4 py-2 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      !notification.isRead ? "font-bold bg-blue-50 dark:bg-gray-700" : ""
                    }`}
                  >
                    <div className="text-gray-800 dark:text-gray-100">{notification.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(notification.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
