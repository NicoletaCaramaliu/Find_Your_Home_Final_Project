import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import MainNavBar from "../../components/MainNavBar";

interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  userId: string;
  userName: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
}

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/getAllMyPropertiesBookings");
        setBookings(res.data);
      } catch (err) {
        console.error("Eroare la preluarea rezervărilor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const confirmBooking = async (id: string) => {
    try {
      await api.post(`/bookings/confirm/${id}`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "1" } : b))
      );
    } catch (err) {
      console.error("Eroare la confirmare:", err);
    }
  };

  const rejectBooking = async (id: string) => {
    try {
      await api.get(`/bookings/reject/${id}`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "2" } : b))
      );
    } catch (err) {
      console.error("Eroare la respingere:", err);
    }
  };

  const getStatusLabel = (status: string | number) => {
    switch (Number(status)) {
      case 0:
        return "În așteptare";
      case 1:
        return "Confirmat";
      case 2:
        return "Respins";
      case 3:
        return "Completat";
      default:
        return "Necunoscut";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <MainNavBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Rezervări primite</h1>

        {loading ? (
          <p>Se încarcă rezervările...</p>
        ) : bookings.length === 0 ? (
          <p>Nu ai nicio rezervare.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <h2
                      className="text-xl font-semibold cursor-pointer text-blue-600 hover:underline"
                      onClick={() =>
                        navigate(`/properties/${booking.propertyId}`)
                      }
                    >
                      {booking.propertyName}
                    </h2>
                    <p
                      className="text-sm text-blue-500 cursor-pointer hover:underline"
                      onClick={() => navigate(`/users/${booking.userId}`)}
                    >
                      Utilizator: {booking.userName}
                    </p>
                    <p className="mt-2">
                      {format(new Date(booking.slotDate), "yyyy-MM-dd")} —{" "}
                      {booking.startTime} - {booking.endTime}
                    </p>
                    <p>
                      Status:{" "}
                      <span className="font-semibold">
                        {getStatusLabel(booking.status)}
                      </span>
                    </p>
                  </div>
                  {Number(booking.status) === 0 && (
                    <div className="flex flex-col gap-2 items-end">
                      <button
                        onClick={() => confirmBooking(booking.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Acceptă
                      </button>
                      <button
                        onClick={() => rejectBooking(booking.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Respinge
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
