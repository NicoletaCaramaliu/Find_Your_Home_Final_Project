import React, { useState } from "react";
import api from "../../api";

interface Props {
  targetUserId: string;
  onReviewAdded: () => void;
}

const AddReviewForm: React.FC<Props> = ({ targetUserId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return alert("Scrie un comentariu.");

    try {
      setLoading(true);
      await api.post("/reviews/addReview", {
        targetUserId,
        rating,
        comment,
      });
      setComment("");
      setRating(5);
      onReviewAdded();
      //alert("Recenzia a fost trimisă cu succes.");
    } catch (err: any) {
      console.error("Eroare la trimiterea recenziei:", err);
      alert(err.response?.data || "A apărut o eroare.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 border-t pt-4">
      <h3 className="text-md font-semibold mb-2">Adaugă o recenzie</h3>

      <div className="mb-3">
        <label className="block text-sm mb-1">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="p-2 border rounded w-24 dark:bg-gray-800 dark:text-white"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} stele
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Comentariu:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          placeholder="Scrie aici părerea ta..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Se trimite..." : "Trimite recenzia"}
      </button>
    </form>
  );
};

export default AddReviewForm;
