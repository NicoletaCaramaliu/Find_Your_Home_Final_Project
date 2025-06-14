import React, { useEffect, useState } from 'react';
import api from '../../../../api';
import ReviewItem from '../../../../components/review/ReviewItem';

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewerUsername: string;
  reviewerProfilePicture: string;
  reviewerId: string;
  createdAt: string;
}

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);  

  useEffect(() => {
    api.get('/reviews/getAllReviews')
      .then(res => setReviews(res.data))
      .catch(err => {
        console.error(err);
        setErrorMessage('Eroare la încărcarea recenziilor.');
      });
  }, []);

  const handleDelete = async (reviewId: string) => {
    setDeletingId(reviewId);
    try {
      await api.delete(`/reviews/deleteReview/${reviewId}`);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      setSuccessMessage('Recenzie ștearsă cu succes!');
      setErrorMessage(null);
    } catch (err) {
      console.error("Eroare la ștergerea recenziei:", err);
      setErrorMessage('Eroare la ștergere.');
      setSuccessMessage(null);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null); 
    }
  };

  const filteredReviews = reviews.filter((review) =>
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.reviewerUsername?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Recenzii</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Caută după conținut sau nume utilizator..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{errorMessage}</div>
      )}

      {filteredReviews.length === 0 ? (
        <p>Nicio recenzie disponibilă.</p>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="relative">
              <ReviewItem
                rating={review.rating}
                comment={review.comment}
                reviewerUsername={review.reviewerUsername}
                reviewerProfilePicture={review.reviewerProfilePicture}
                reviewerId={review.reviewerId}
                createdAt={review.createdAt}
              />
              {confirmDeleteId === review.id ? (
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 p-2 rounded shadow">
                  <p>Confirmi ștergerea?</p>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Da
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Nu
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(review.id)}
                  className="absolute top-2 right-2 text-sm text-red-600 hover:text-red-800 bg-white dark:bg-gray-700 rounded-full p-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
