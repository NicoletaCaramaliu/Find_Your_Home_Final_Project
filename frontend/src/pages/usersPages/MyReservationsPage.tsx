import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import MainNavBar from "../../components/MainNavBar";

interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
}

const MyReservationsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/getMyBookings");
        setBookings(res.data);
      } catch (err) {
        console.error("Eroare la preluarea rezervărilor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const cancelBooking = async (id: string) => {
    try {
      await api.post(`/bookings/cancel/${id}`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "3" } : b))
      );
    } catch (err) {
      console.error("Eroare la anulare rezervare:", err);
    }
  };

  const getStatusLabel = (status: string | number) => {
    switch (Number(status)) {
      case 0:
        return "În așteptare";
      case 1:
        return "Confirmată";
      case 2:
        return "Respinsă";
      case 3:
        return "Anulată";
      case 4:
        return "Completată";
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
        <h1 className="text-2xl font-bold mb-4">Rezervările mele</h1>

        <div className="mb-4">
          <label className="mr-2 font-medium">Filtrează după status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded border dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Toate</option>
            <option value="0">În așteptare</option>
            <option value="1">Confirmată</option>
            <option value="2">Respinsă</option>
            <option value="3">Anulată</option>
            <option value="4">Completată</option>
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
                <div className="flex justify-between items-center">
                  <div>
                    <h2
                      className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer"
                      onClick={() =>
                        navigate(`/properties/${booking.propertyId}`)
                      }
                    >
                      {booking.propertyName}
                    </h2>
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

                  {Number(booking.status) === 1 && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      Anulează
                    </button>
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

export default MyReservationsPage;
