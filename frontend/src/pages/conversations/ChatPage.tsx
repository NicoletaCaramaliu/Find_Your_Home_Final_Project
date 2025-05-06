import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MainNavBar from "../../components/MainNavBar";
import api from "../../api";
import {
  startNotificationConnection,
  onNotification,
  offNotification,
  sendToHub,
  notificationConnection,
} from "../../services/signalrManager";

interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  message: string;
  createdAt: string;
}

export default function ChatPage() {
  const { id: conversationId } = useParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) setUserId(id);
  }, []);

  useEffect(() => {
    if (!conversationId) return;
    api
      .get(`/message/${conversationId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Eroare la mesajele conversației:", err));
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    let isMounted = true;

    const connect = async () => {
      await startNotificationConnection();

      const waitAndJoin = () => {
        if (notificationConnection.state === "Connected") {
          sendToHub("JoinConversation", conversationId);
        } else {
          setTimeout(waitAndJoin, 300);
        }
      };

      waitAndJoin();

      const messageHandler = (data: ChatMessage) => {
        if (data.conversationId === conversationId && isMounted) {
          setMessages((prev) => [...prev, data]);
        }
      };

      onNotification("ReceiveMessage", messageHandler);

      return () => {
        isMounted = false;
        sendToHub("LeaveConversation", conversationId);
        offNotification("ReceiveMessage", messageHandler);
      };
    };

    connect();
  }, [conversationId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !conversationId) return;

    try {
      await api.post("/message/send", {
        conversationId,
        message: newMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          conversationId,
          senderId: userId,
          message: newMessage,
          createdAt: new Date().toISOString(),
        },
      ]);

      setNewMessage("");
    } catch (err) {
      console.error("Eroare la trimiterea mesajului:", err);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col">
      <MainNavBar />
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Conversație</h2>

        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-4 rounded shadow space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded max-w-xs break-words ${
                  msg.senderId === userId
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none"
                }`}
              >
                <div>{msg.message}</div>
                <div className="text-xs mt-1 text-gray-500 dark:text-gray-400 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 rounded border dark:bg-gray-800 dark:text-white"
            placeholder="Scrie un mesaj..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Trimite
          </button>
        </div>
      </div>
    </div>
  );
}
