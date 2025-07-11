import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import SlotCalendar from "./SlotCalendar";
import api from "../../api";
import { parseError } from "../../utils/parseError";

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
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    fetchSlots();
  }, [propertyId]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await api.get<Slot[]>(`/availability/getSlots/${propertyId}`);
      setSlots(response.data);
    } catch (error) {
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
      setMessage(parseError(error));
      setMessageType("error");
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div className="relative bg-white dark:bg-gray-900 p-6 rounded shadow max-w-2xl mx-auto mt-20">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold focus:outline-none"
          aria-label="Închide"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-blue-500">Calendar disponibilități</h2>

        <SlotCalendar propertyId={propertyId} />

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

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-blue-500 mb-3">Lista perioadelor existente</h3>

          {loading ? (
            <div className="text-center text-gray-600 dark:text-gray-300">Se încarcă...</div>
          ) : slots.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Nu există perioade setate.</div>
          ) : (
            <div className="space-y-4">
              {slots
                .filter(slot => new Date(slot.date) >= new Date(new Date().toDateString()))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400">Nu există perioade viitoare.</div>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto border rounded p-2 dark:border-gray-700">
                    {slots
                      .filter(slot => new Date(slot.date) >= new Date(new Date().toDateString()))
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((slot) => (
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
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default SlotManagerModal;
