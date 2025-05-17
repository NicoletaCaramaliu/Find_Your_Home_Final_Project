import React from "react";
import { useNavigate } from "react-router-dom";
import { formatUtcToLocal } from "../../utils/formatDate";


export interface ReviewItemProps {
  rating: number;
  comment: string;
  reviewerUsername: string;
  reviewerProfilePicture: string;
  reviewerId?: string; 
  createdAt: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  rating,
  comment,
  reviewerUsername,
  reviewerProfilePicture,
  reviewerId,
  createdAt
}) => {
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  const defaultImg = "/images/defaultProfilePicture.png";
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (
      reviewerId &&
      reviewerId !== "00000000-0000-0000-0000-000000000001" // ID-ul sistemului
    ) {
      navigate(`/user/${reviewerId}`);
    }
  };

  return (
    <div className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm mb-2">
      <img
        src={reviewerProfilePicture || defaultImg}
        alt={reviewerUsername}
        className={`w-10 h-10 rounded-full object-cover mr-3 ${
          reviewerId &&
          reviewerId !== "00000000-0000-0000-0000-000000000001"
            ? "cursor-pointer"
            : "cursor-default"
        }`}
        onClick={handleNavigate}
        onError={(e) => (e.currentTarget.src = defaultImg)}
      />
      <div>
        <p className="font-semibold text-gray-800 dark:text-white">
          {reviewerUsername}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formatUtcToLocal(createdAt)}
        </p>

        <p className="text-yellow-500 text-sm">{stars}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{comment}</p>
      </div>
      
    </div>
  );
};

export default ReviewItem;
