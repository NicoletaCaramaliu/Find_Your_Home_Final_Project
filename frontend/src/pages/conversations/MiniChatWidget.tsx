import { useEffect, useRef, useState } from "react";
import {
  startChatConnection,
  onChatEvent,
  sendChat,
  offChatEvent,
  chatConnection,
} from "../../services/chatHubManager";
import api from "../../api";

interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  message: string;
  createdAt: string;
}

const MiniChatWidget = ({ conversationId, userId }: { conversationId: string; userId: string }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const res = await api.get(`/message/${conversationId}`);
      setMessages(res.data);
    };

    const connect = async () => {
      await startChatConnection();
      sendChat("JoinConversation", conversationId);

      const handler = (msg: ChatMessage) => {
        if (msg.conversationId === conversationId) {
          setMessages((prev) => [...prev, msg]);
        }
      };

      onChatEvent("ReceiveMessage", handler);

      return () => {
        sendChat("LeaveConversation", conversationId);
        offChatEvent("ReceiveMessage", handler);
      };
    };

    loadMessages();
    connect();
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await api.post("/message/send", {
      conversationId,
      message: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-80 bg-white dark:bg-gray-800 border rounded-lg shadow-lg flex flex-col">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-t flex justify-between items-center">
            <span>Chat cu partenerul</span>
            <button onClick={() => setOpen(false)}>&#x2715;</button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2" style={{ maxHeight: "300px" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded ${
                  msg.senderId === userId ? "bg-blue-600 text-white self-end" : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white self-start"
                }`}
              >
                {msg.message}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex border-t p-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Scrie un mesaj..."
              className="flex-1 p-2 border rounded-l"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 rounded-r"
            >
              ▶
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
        >
          💬 Deschide chat
        </button>
      )}
    </div>
  );
};

export default MiniChatWidget;
