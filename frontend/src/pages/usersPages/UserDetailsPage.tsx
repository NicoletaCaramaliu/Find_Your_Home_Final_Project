import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainNavBar from '../../components/MainNavBar';
import PropertiesList from '../../components/properties/PropertiesList';
import { Property } from '../../types/Property';
import api from "../../api";
import UserCard, { UserCardProps } from '../../components/user/UserCard';
import ReviewItem, { ReviewItemProps } from '../../components/review/ReviewItem';
import ReviewList from "../../components/review/ReviewList";
import AddReviewForm from "../../components/review/AddReviewForm";

const UserDetailsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserCardProps | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<ReviewItemProps[]>([]);
  const [role, setRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [canCheckDone, setCanCheckDone] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [showConfirmReport, setShowConfirmReport] = useState(false);
  const [reportMessage, setReportMessage] = useState<string | null>(null);


  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get('/User/getUser', {
          params: { id: userId },
        });

        const userData = res.data;
        setRole(userData.role);

        const transformedUser: UserCardProps = {
          username: userData.username,
          profileImageUrl: userData.profilePicture,
          userId: userData.id,
          createdAt: userData.createdAt,
          showContactButton: true,
          disableLink: true,
        };

        setUser(transformedUser);

        const rolesWithProperties = [0, 1];
        if (rolesWithProperties.includes(userData.role)) {
          const propRes = await api.get('/Properties/getAllPropertiesByUserId', {
            params: { userId: userId },
          });
          setProperties(propRes.data);
        }

      } catch (err) {
        console.error("Eroare la încărcarea utilizatorului:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (userId) {
          const reviewRes = await api.get(`/reviews/getReviews/${userId}`);
          const sorted = reviewRes.data.sort(
            (a: ReviewItemProps, b: ReviewItemProps) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setReviews(sorted);
        }
      } catch (err) {
        console.error("Eroare la încărcarea recenziilor:", err);
      }
    };

    fetchReviews();
  }, [userId, reviewRefreshKey]);

  useEffect(() => {
    const checkCanReview = async () => {
      if (!userId || !currentUserId || userId === currentUserId) return;

      try {
        const res = await api.get(`/reviews/canReview/${userId}`);
        setCanReview(res.data === true);
      } catch (err) {
        setCanReview(false);
      } finally {
        setCanCheckDone(true);
      }
    };

    checkCanReview();
  }, [userId, currentUserId]);

  useEffect(() => {
    const checkHasReported = async () => {
      if (!userId || !currentUserId || userId === currentUserId) return;

      try {
        const res = await api.get(`/UserReports/hasReported`, {
          params: { reporterId: currentUserId, reportedId: userId },
        });
        setHasReported(res.data);
      } catch (err) {
        console.error("Eroare la verificarea raportării:", err);
      }
    };

    checkHasReported();
  }, [userId, currentUserId]);

  const handleReport = async () => {
    if (!userId || !currentUserId) return;

    try {
      await api.post(`/UserReports/reportUser`, {
        reporterUserId: currentUserId,
        reportedUserId: userId,
        reason: "Comportament de agent",
      });
      setHasReported(true);
      setReportMessage("Utilizator raportat cu succes.");
      setShowConfirmReport(false);
    } catch (err) {
      console.error("Eroare la raportare:", err);
      setReportMessage("A apărut o eroare la raportare.");
      setShowConfirmReport(false);
    }
  };


  const averageRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : undefined;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <div className="text-lg">Se încarcă profilul...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <MainNavBar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {user && (
          <div className="mb-10">
            <UserCard {...user} averageRating={averageRating} />
          </div>
        )}

        {userId && currentUserId && userId !== currentUserId && [1].includes(role ?? -1) && (
          <div className="mb-6 flex justify-end flex-col items-end space-y-2">
            {!hasReported ? (
              <>
                {!showConfirmReport ? (
                  <button
                    onClick={() => setShowConfirmReport(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition"
                  >
                    🚩 Raportează ca agent
                  </button>
                ) : (
                  <div className="space-x-2">
                    <span className="text-sm text-gray-800 dark:text-gray-200">Ești sigur că vrei să raportezi acest utilizator?</span>
                    <button
                      onClick={handleReport}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow transition"
                    >
                      Da
                    </button>
                    <button
                      onClick={() => setShowConfirmReport(false)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded shadow transition"
                    >
                      Anulează
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-green-500">Ai raportat deja acest utilizator.</p>
            )}

            {reportMessage && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{reportMessage}</p>
            )}
          </div>
        )}


        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Review-uri primite</h2>
          <div className="bg-white dark:bg-gray-800 rounded shadow p-4 space-y-4">
            {reviews.length > 0 ? (
              <ReviewList reviews={reviews} initialVisible={5} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Acest utilizator nu are review-uri încă.</p>
            )}
          </div>

          {userId && currentUserId && userId !== currentUserId && canCheckDone && (
            canReview ? (
              <AddReviewForm
                targetUserId={userId}
                onReviewAdded={() => setReviewRefreshKey(prev => prev + 1)}
              />
            ) : (
              <p className="mt-4 text-sm text-gray-500 italic">
                Poți lăsa o recenzie doar dacă ai avut contact (rezervări comune) cu acest utilizator.
              </p>
            )
          )}
        </div>

        {[0, 1].includes(role ?? -1) && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Proprietățile utilizatorului:</h3>
            <div className="bg-white dark:bg-gray-700 rounded shadow p-4 max-h-[500px] overflow-y-auto">
              {properties.length === 0 ? (
                <p>Nu a adăugat nicio proprietate încă.</p>
              ) : (
                <PropertiesList properties={properties} noResults={false} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsPage;
