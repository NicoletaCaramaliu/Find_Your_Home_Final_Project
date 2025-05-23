import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNavBar from "../../components/MainNavBar";
import api from "../../api";
import { formatUtcToLocal } from "../../utils/formatDate";

interface ConversationPreview {
  conversationId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserProfilePictureUrl: string;
  lastMessage: string;
  lastMessageDate: string;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/conversations/myConversations")
      .then(res => setConversations(res.data))
      .catch(err => console.error("Eroare la încărcarea conversațiilor:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <MainNavBar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Conversațiile mele</h1>

        {conversations.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">Nu ai conversații active.</p>
        ) : (
          <ul className="space-y-4">
            {conversations.map(conv => (
              <li
                key={conv.conversationId}
                onClick={() => navigate(`/chat/${conv.conversationId}`)}
                className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
              >
                <img
                  src={conv.otherUserProfilePictureUrl || "/images/defaultProfilePicture.png"}
                  alt={conv.otherUserName}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/defaultProfilePicture.png";
                  }}
                />

                <div className="flex-1">
                  <div className="font-semibold">{conv.otherUserName}</div>
                  <div
                        className="text-sm text-gray-600 dark:text-gray-300 max-w-full overflow-hidden break-all whitespace-normal"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical"
                        }}
                      >
                        {conv.lastMessage}
                    </div>
                </div>
                <div className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                  {formatUtcToLocal(conv.lastMessageDate)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
