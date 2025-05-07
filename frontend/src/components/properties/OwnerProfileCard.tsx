import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";


export interface OwnerProfileCardProps  {
  username: string;
  profileImageUrl: string;
  ownerId: string;
  createdAt: string;
  showContactButton?: boolean;
  disableLink?: boolean;
}

const OwnerProfileCard: React.FC<OwnerProfileCardProps > = ({ username, profileImageUrl, ownerId, createdAt,showContactButton = true, disableLink = false }) => {
  const defaultProfileImage = "/images/defaultProfilePicture.png";
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const navigate = useNavigate();

  const handleContact = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/Conversations/startOrGet", {
        otherUserId: ownerId,
      });
      const conversationId = res.data;
      navigate(`/chat/${conversationId}`);
    } catch (err) {
      console.error("Eroare la inițiere conversație:", err);
      alert("A apărut o eroare la contactarea proprietarului.");
    }
  };

  return (
    <Link to={`/ownerPage/${ownerId}`} className="block">
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
            <img
              src={profileImageUrl || defaultProfileImage}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultProfileImage;
              }}
              alt={`${name}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4">
            <p className="text-lg font-semibold text-gray-800 dark:text-white">{username}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Proprietar</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Înregistrat din: {formattedDate}</p>
          </div>
        </div>
        <button
          onClick={handleContact}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Contactează proprietarul
        </button>
      </div>
    </Link>
  );
};

export default OwnerProfileCard;
