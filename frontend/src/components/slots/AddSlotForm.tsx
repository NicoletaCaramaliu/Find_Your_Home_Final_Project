import React, { useState } from "react";
import api from "../../api";

interface Props {
  propertyId: string;
  selectedDate: Date;
  onSuccess: () => void;
  onCancel: () => void;
}

const AddSlotForm: React.FC<Props> = ({ propertyId, selectedDate, onSuccess, onCancel }) => {
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("14:30");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const now = new Date();

    // verificare daca ziua e in trecut
    const selectedDateOnly = new Date(selectedDate.toDateString());
    if (selectedDateOnly < new Date(now.toDateString())) {
      setError("Nu poți adăuga un slot într-o zi din trecut.");
      setLoading(false);
      return;
    }

    // verif daca ora de start este in trecut (daca este pentru azi)
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const slotStart = new Date(selectedDate);
    slotStart.setHours(startHour, startMinute, 0, 0);

    if (slotStart < now) {
      setError("Ora de început este în trecut.");
      setLoading(false);
      return;
    }

    // verificare ora de sfarsit > ora de inceput
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const slotEnd = new Date(selectedDate);
    slotEnd.setHours(endHour, endMinute, 0, 0);

    if (slotEnd <= slotStart) {
      setError("Ora de sfârșit trebuie să fie după ora de început.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        propertyId,
        date: selectedDate.toISOString(),
        startTime,
        endTime,
        visitDurationInMinutes: duration,
      };

      await api.post("/availability/addSlot", payload);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Eroare la adăugarea slotului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded shadow space-y-4"
    >
      <h3 className="text-lg font-semibold">Adaugă un Slot</h3>

      {error && <p className="text-red-600">{error}</p>}

      <div>
        <label>Ora de început</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label>Ora de sfârșit</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label>Durata vizitei (minute)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min={5}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Se adaugă..." : "Adaugă Slot"}
        </button>
        <button type="button" onClick={onCancel} className="text-red-600 hover:underline">
          Anulează
        </button>
      </div>
    </form>
  );
};

export default AddSlotForm;
