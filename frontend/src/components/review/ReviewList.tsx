import React, { useState } from "react";
import ReviewItem, { ReviewItemProps } from "./ReviewItem";

interface ReviewListProps {
  reviews: ReviewItemProps[];
  initialVisible?: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, initialVisible = 5 }) => {
  const [visibleCount, setVisibleCount] = useState(initialVisible);

  const showMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const hasMore = visibleCount < reviews.length;

  return (
    <div className="border rounded-md p-4 bg-white dark:bg-gray-800 max-h-[300px] overflow-y-auto shadow-inner">
      {reviews.slice(0, visibleCount).map((review, index) => (
        <ReviewItem key={index} {...review} />
      ))}

      {hasMore && (
        <div className="flex justify-center mt-2">
          <button
            onClick={showMore}
            className="text-blue-600 hover:underline text-sm"
          >
            Afișează mai multe
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
