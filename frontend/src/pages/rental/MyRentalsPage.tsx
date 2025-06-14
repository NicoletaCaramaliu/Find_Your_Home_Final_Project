import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import MainNavBar from "../../components/MainNavBar";

interface Rental {
  id: string;
  propertyId: string;
  renterId: string;
  propertyName: string;
  renterName: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

const MyRentalsPage: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await api.get("/rentals/active/owner");
        setRentals(res.data);
      } catch (err) {
        console.error("Eroare la preluarea închirierilor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      <MainNavBar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Închirieri active pentru proprietățile tale</h1>

        {loading ? (
          <p>Se încarcă închirierile...</p>
        ) : rentals.length === 0 ? (
          <p>Nu ai închirieri active momentan.</p>
        ) : (
          <div className="space-y-4">
            {rentals.map((rental) => (
                <div
                    key={rental.id}
                    className="bg-white dark:bg-gray-700 p-4 rounded shadow flex justify-between items-center"
                >
                    <div>
                    <h2
                        onClick={() => navigate(`/properties/${rental.propertyId}`)}
                        className="text-xl font-semibold text-blue-600 cursor-pointer hover:underline"
                    >
                        {rental.propertyName}
                    </h2>
                    <p
                        onClick={() => navigate(`/user/${rental.renterId}`)}
                        className="text-sm text-blue-500 cursor-pointer hover:underline"
                    >
                        Chiriaș: {rental.renterName}
                    </p>
                    <p className="mt-2">
                        Început: {format(new Date(rental.startDate), "yyyy-MM-dd")}
                    </p>
                    {rental.endDate && (
                        <p>
                        Final: {format(new Date(rental.endDate), "yyyy-MM-dd")}
                        </p>
                    )}
                    </div>

                    <div>
                    <button
                        onClick={() => navigate(`/rental-collaboration/${rental.id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Gestionează închirierea
                    </button>
                    </div>
                </div>
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRentalsPage;
