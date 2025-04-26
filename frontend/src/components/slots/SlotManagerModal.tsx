import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import SlotCalendar from "./SlotCalendar";
import api from "../../api";
import { parseError } from "../../utils/parseError"; // 🔥 Importăm funcția de erori traduse

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface Props {
  propertyId: string;
  onClose: () => void;
}

const SlotManagerModal: React.FC<Props> = ({ propertyId, onClose }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null); // 🔥 mesaj in modal
  const [messageType, setMessageType] = useState<"success" | "error">("success"); // ✅

  useEffect(() => {
    fetchSlots();
  }, [propertyId]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await api.get<Slot[]>(`/availability/getSlots/${propertyId}`);
      setSlots(response.data);
    } catch (error) {
      console.error("Eroare la încărcarea sloturilor:", error);
      setMessage(parseError(error));
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      await api.delete(`/availability/deleteSlot/${slotId}`);
      setMessage("Slot șters cu succes! ✅");
      setMessageType("success");
      await fetchSlots();
    } catch (error) {
      console.error("Eroare la ștergerea slotului:", error);
      setMessage(parseError(error)); // 🔥
      setMessageType("error");
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-2xl mx-auto mt-20">
        <h2 className="text-xl font-semibold mb-4 text-center">Sloturi disponibile</h2>

        {/* Calendarul */}
        <SlotCalendar propertyId={propertyId} />

        {/* Mesaj de succes sau eroare */}
        {message && (
          <div
            className={`mt-4 p-2 rounded text-center ${
              messageType === "success"
                ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200"
                : "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200"
            }`}
          >
            {message}
          </div>
        )}

        {/* Lista sloturilor */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Lista perioadelor existente</h3>

          {loading ? (
            <div className="text-center text-gray-600 dark:text-gray-300">Se încarcă...</div>
          ) : slots.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Nu există perioade setate.</div>
          ) : (
            <div className="space-y-4">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex justify-between items-center p-2 border rounded dark:border-gray-700"
                >
                  <div className="text-sm text-gray-700 dark:text-gray-200">
                    <div>{new Date(slot.date).toLocaleDateString()}</div>
                    <div>{slot.startTime} - {slot.endTime}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="text-red-600 hover:underline dark:text-red-400 text-sm"
                  >
                    Șterge
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buton închidere */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Închide
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default SlotManagerModal;
