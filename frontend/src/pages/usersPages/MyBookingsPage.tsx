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
  isForRent: boolean;  
  isSold: boolean;
}

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
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

  const cancelBooking = async (id: string) => {
    try {
      await api.post(`/bookings/cancel/${id}`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "3" } : b))
      );
    } catch (err) {
      console.error("Eroare la anulare:", err);
    }
  };

  const sellProperty = async (propertyId: string) => {
    try {
      await api.patch(`/Properties/sellProperty?propertyId=${propertyId}`);
      const res = await api.get("/bookings/getAllMyPropertiesBookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Eroare la vânzare:", err);
      alert("A apărut o eroare la marcare ca vândut.");
    }
  };

  const contactUser = async (userId: string) => {
    try {
      const res = await api.post("/Conversations/startOrGet", {
        otherUserId: userId,
      });
      const conversationId = res.data;
      navigate(`/chat/${conversationId}`);
    } catch (err) {
      console.error("Eroare la inițiere conversație:", err);
      alert("A apărut o eroare la contactarea utilizatorului.");
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
        return "Anulat";
      case 4:
        return "Completat";
      default:
        return "Necunoscut";
    }
  };

  const filteredBookings = bookings.filter(
    (b) => statusFilter === "all" || Number(b.status) === Number(statusFilter)
  );

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <MainNavBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Rezervări primite</h1>

        <div className="mb-4">
          <label className="mr-2 font-medium">Filtrează după status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded border dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Toate</option>
            <option value="0">În așteptare</option>
            <option value="1">Confirmat</option>
            <option value="2">Respins</option>
            <option value="3">Anulat</option>
            <option value="4">Completat</option>
          </select>
        </div>

        {loading ? (
          <p>Se încarcă rezervările...</p>
        ) : filteredBookings.length === 0 ? (
          <p>Nu există rezervări care corespund filtrului selectat.</p>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
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
                      onClick={() => navigate(`/user/${booking.userId}`)}
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
                  <div className="flex flex-col items-end gap-2">
                    {Number(booking.status) === 0 && (
                      <>
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
                      </>
                    )}

                    {Number(booking.status) === 1 && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        Anulează
                      </button>
                    )}

                    {!booking.isForRent && Number(booking.status) === 4 && !booking.isSold && (
                      <button
                        onClick={() => sellProperty(booking.propertyId)}
                        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        Marcare Vândut
                      </button>
                    )}

                    <button
                      onClick={() => contactUser(booking.userId)}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Contactează utilizatorul
                    </button>
                  </div>
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
