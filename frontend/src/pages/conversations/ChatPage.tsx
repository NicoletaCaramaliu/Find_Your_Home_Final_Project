import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import MainNavBar from "../../components/MainNavBar";
import api from "../../api";
import {
  startChatConnection,
  onChatEvent,
  offChatEvent,
  sendChat,
  chatConnection,
} from "../../services/chatHubManager";

interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  message: string;
  createdAt: string;
}

interface ConversationInfo {
  otherUserName: string;
  otherUserProfilePictureUrl: string;
}

export default function ChatPage() {
  const { id: conversationId } = useParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [conversationInfo, setConversationInfo] = useState<ConversationInfo | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) setUserId(id);
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    api.get(`/message/${conversationId}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error("Eroare la mesajele conversației:", err));
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    api.get("/conversations/myConversations")
      .then((res) => {
        const convo = res.data.find((c: any) => c.conversationId === conversationId);
        if (convo) {
          setConversationInfo({
            otherUserName: convo.otherUserName,
            otherUserProfilePictureUrl: convo.otherUserProfilePictureUrl,
          });
        }
      })
      .catch((err) => console.error("Eroare la info conversației:", err));
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    let isMounted = true;

    const connect = async () => {
      await startChatConnection();

      const waitAndJoin = () => {
        if (chatConnection.state === "Connected") {
          sendChat("JoinConversation", conversationId);
        } else {
          setTimeout(waitAndJoin, 300);
        }
      };

      waitAndJoin();

      const messageHandler = (data: ChatMessage) => {
        if (data.conversationId === conversationId && isMounted) {
          setMessages(prev => [...prev, data]);
        }
      };

      onChatEvent("ReceiveMessage", messageHandler);

      return () => {
        isMounted = false;
        sendChat("LeaveConversation", conversationId);
        offChatEvent("ReceiveMessage", messageHandler);
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
        <h2 className="text-xl font-bold mb-2">Conversație</h2>

        {conversationInfo && (
          <div className="flex items-center mb-4 gap-3">
            <img
              src={conversationInfo.otherUserProfilePictureUrl || "/images/defaultProfilePicture.png"}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/defaultProfilePicture.png";
              }}
              alt="Profil"
              className="w-10 h-10 rounded-full object-cover"
            />

            <h3 className="text-lg font-semibold">{conversationInfo.otherUserName}</h3>
          </div>
        )}

          <div
            className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-3 overflow-y-auto"
            style={{ height: "calc(100vh - 320px)" }} 
          >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
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
                  {msg.createdAt && !isNaN(new Date(msg.createdAt).getTime())
                    ? new Date(msg.createdAt).toLocaleTimeString()
                    : ""}
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
