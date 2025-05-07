import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import api from "../../api";

interface MessagePreview {
  conversationId: string;
  otherUserName: string;
  otherUserProfilePictureUrl: string;
  lastMessage: string;
  lastMessageDate: string;
}

export default function ChatDropdown() {
  const [conversations, setConversations] = useState<MessagePreview[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    api.get("/conversations/myConversations")
      .then(res => {
        const sorted = res.data
          .sort((a: MessagePreview, b: MessagePreview) =>
            new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime()
          )
          .slice(0, 5); 
        setConversations(sorted);
      })
      .catch(err => {
        console.error("Eroare la preluarea mesajelor:", err);
      });
  }, [open]);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="text-gray-900 dark:text-gray-100 hover:text-blue-400 dark:hover:text-blue-400">
        <MessageSquare size={24} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border rounded shadow-lg z-50">
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Mesaje recente</h3>
            {conversations.length === 0 ? (
              <p className="text-gray-500 text-sm">Nu ai mesaje recente.</p>
            ) : (
              conversations.map((conv) => (
                <Link
                  key={conv.conversationId}
                  to={`/chat/${conv.conversationId}`}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                  onClick={() => setOpen(false)}
                >
                  <img
                      src={conv.otherUserProfilePictureUrl || "/images/defaultProfilePicture.png"}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null; 
                        target.src = "/images/defaultProfilePicture.png";
                      }}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{conv.otherUserName}</div>
                    <div
                        className="text-sm text-gray-600 dark:text-gray-300 max-w-full overflow-hidden break-all whitespace-normal"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical"
                        }}
                      >
                        {conv.lastMessage}
                    </div>

                  </div>
                </Link>
              ))
            )}
            <div className="mt-3 text-center">
              <Link
                to="/conversations"
                className="inline-block text-blue-500 hover:underline text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                Vezi toate conversațiile
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
