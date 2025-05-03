import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import api from "../../api";
import { parseError } from "../../utils/parseError";

interface Props {
  propertyId: string;
}

interface Visit {
  start: string;
  end: string;
  status: string;
  availabilitySlotId: string;
}

const AvailableVisits: React.FC<Props> = ({ propertyId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await api.get(`/availability/getVisits/${propertyId}`);
        setVisits(res.data);
      } catch (err) {
        console.error("Eroare la preluarea vizitelor:", err);
      }
    };

    fetchVisits();
  }, [propertyId]);

  const translateStatus = (status: string): string => {
    switch (status) {
      case "Available": return "Disponibil";
      case "Pending": return "În așteptare";
      case "Confirmed": return "Confirmat";
      case "Cancelled": return "Anulat";
      case "Completed": return "Finalizat";
      default: return status;
    }
  };

  const handleBooking = (visit: Visit) => {
    setSelectedVisit(visit);
  };

  const confirmBooking = async () => {
    if (!selectedVisit) return;

    try {
      setLoading(true);

      const slotDate = selectedVisit.start.split("T")[0];
      const startTime = selectedVisit.start.split("T")[1].substring(0, 8);
      const endTime = selectedVisit.end.split("T")[1].substring(0, 8);

      await api.post("/bookings/bookSlot", {
        propertyId,
        availabilitySlotId: selectedVisit.availabilitySlotId,
        slotDate,
        startTime,
        endTime,
      });

      setMessage({ type: "success", text: "Vizita a fost rezervată cu succes!" });
      setSelectedVisit(null);
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      const parsedError = parseError(err);
      setMessage({ type: "error", text: parsedError });
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  const getButtonClasses = (status: Visit["status"], loading: boolean) => {
    const baseClasses = "text-white px-4 py-2 rounded font-medium transition duration-200";
    switch (status) {
      case "Available": return `${baseClasses} bg-green-600 hover:bg-green-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`;
      case "Pending": return `${baseClasses} bg-yellow-500 cursor-not-allowed`;
      case "Confirmed": return `${baseClasses} bg-blue-600 cursor-not-allowed`;
      case "Cancelled":
      case "Completed": return `${baseClasses} bg-red-600 cursor-not-allowed`;
      default: return `${baseClasses} bg-gray-400`;
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Programează o vizită</h2>

      <input
        type="date"
        className="mb-4 p-2 rounded border dark:bg-gray-700 dark:text-white"
        value={format(selectedDate, "yyyy-MM-dd")}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      />

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-green-600 inline-block" />
          <span>Disponibil</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-yellow-500 inline-block" />
          <span>În așteptare (Un alt utilizator așteaptă confirmarea proprietarului).</span>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message.text}
        </div>
      )}

      {visits.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {visits
            .filter(visit =>
              visit.start.startsWith(format(selectedDate, "yyyy-MM-dd")) &&
              (visit.status === "Available" || visit.status === "Pending")
            )
            .map((visit, idx) => (
              <button
                key={idx}
                disabled={loading || visit.status !== "Available"}
                onClick={() => handleBooking(visit)}
                className={getButtonClasses(visit.status, loading)}
              >
                {format(new Date(visit.start), "HH:mm")} - {format(new Date(visit.end), "HH:mm")}
                {visit.status !== "Available" && ` (${translateStatus(visit.status)})`}
              </button>
            ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Nu există intervale disponibile pentru această zi.
        </p>
      )}

      {selectedVisit && (
        <div className="mt-6 p-4 bg-yellow-100 text-yellow-900 rounded shadow">
          <p className="mb-2">
            Ești sigur că vrei să rezervi perioada de vizită{" "}
            <strong>
              {format(new Date(selectedVisit.start), "yyyy-MM-dd HH:mm")} -{" "}
              {format(new Date(selectedVisit.end), "HH:mm")}
            </strong>?
          </p>
          <button
            onClick={confirmBooking}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            disabled={loading}
          >
            Confirmă rezervarea
          </button>
          <button
            onClick={() => setSelectedVisit(null)}
            className="ml-4 text-sm text-gray-600 underline"
          >
            Anulează
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailableVisits;
