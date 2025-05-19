import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import api from "../../api";
import AddSlotForm from "./AddSlotForm";
import { parseError } from "../../utils/parseError";

interface Props {
  propertyId: string;
}

const SlotCalendar: React.FC<Props> = ({ propertyId }) => {
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddForm, setShowAddForm] = useState(false);

  const loadSlots = async () => {
    try {
      const res = await api.get(`/availability/getSlots/${propertyId}`);
      setSlots(res.data);
    } catch (err: any) {
      console.error("Eroare la preluarea sloturilor:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadSlots();
  }, [propertyId]);

  const filtered = slots.filter(
    (s) => format(new Date(s.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  return (
    <div>
      <Calendar
        onChange={(value: any) => {
          if (value instanceof Date) {
            setSelectedDate(value);
          } else if (Array.isArray(value) && value[0] instanceof Date) {
            setSelectedDate(value[0]);
          }
        }}
        value={selectedDate}
        minDate={new Date()}
      />

      <div className="mt-4">
        <h3 className="font-semibold">
          Sloturi pentru {format(selectedDate, "dd MMM yyyy")}:
        </h3>

        {filtered.length > 0 ? (
          filtered.map((slot) => (
            <div key={slot.id} className="border p-2 rounded mt-2">
              {slot.startTime} - {slot.endTime} ({slot.visitDurationInMinutes} min)
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Nu există sloturi adăugate pentru această zi.</p>
        )}

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-3 text-blue-600 hover:underline"
          >
            ➕ Adaugă un slot nou
          </button>
        )}

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Un slot reprezintă perioada în care sunteți disponibili pentru vizite, alături de durata
          unei vizite. Exemplu: Pentru un slot de la <strong>14:00 - 16:00</strong> și durata
          vizitei de <strong>30 de minute</strong> vor exista 4 vizite posibile pe care utilizatorii
          le pot rezerva (14:00-14:30, 14:30-15:00, etc).
        </p>

        {showAddForm && (
          <AddSlotForm
            propertyId={propertyId}
            selectedDate={selectedDate}
            onSuccess={() => {
              setShowAddForm(false);
              loadSlots(); 
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SlotCalendar;
