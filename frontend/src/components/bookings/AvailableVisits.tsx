import React, { useEffect, useState } from "react";
import { format, addMinutes } from "date-fns";
import api from "../../api";

interface Props {
  propertyId: string;
}

interface Slot {
  id: string;
  date: string;
  startTime: string; 
  endTime: string;   
  visitDurationInMinutes: number;
  bookings: Booking[]; 
}

interface Booking {
  startTime: string;
  endTime: string;
  status: BookingStatus;
}

type BookingStatus = "Pending" | "Confirmed" | "Cancelled" | "Completed";

interface Visit {
  start: Date;
  end: Date;
  availabilitySlotId: string;
  status: BookingStatus | "Available";
}

const AvailableVisits: React.FC<Props> = ({ propertyId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await api.get(`/availability/getSlots/${propertyId}`);
        setSlots(res.data);
      } catch (err) {
        console.error("Eroare la preluarea sloturilor:", err);
      }
    };

    fetchSlots();
  }, [propertyId]);

  useEffect(() => {
    const dailySlots = slots.filter(
      (s) => format(new Date(s.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );

    const generated: Visit[] = [];

    for (const slot of dailySlots) {
      const baseDate = new Date(slot.date);
      const [startHour, startMinute] = slot.startTime.split(":").map(Number);
      const [endHour, endMinute] = slot.endTime.split(":").map(Number);

      let start = new Date(baseDate.setHours(startHour, startMinute, 0, 0));
      const end = new Date(baseDate.setHours(endHour, endMinute, 0, 0));

      while (start < end) {
        const visitEnd = addMinutes(start, slot.visitDurationInMinutes);
        if (visitEnd <= end) {
          // Verifică dacă există o rezervare în acest interval
          const booking = slot.bookings?.find((b) => {
            const bookingStart = new Date(`${slot.date}T${b.startTime}`);
            const bookingEnd = new Date(`${slot.date}T${b.endTime}`);
            return start.getTime() === bookingStart.getTime() && visitEnd.getTime() === bookingEnd.getTime();
          });

          const status = booking?.status || "Available";

          generated.push({
            start: new Date(start),
            end: new Date(visitEnd),
            availabilitySlotId: slot.id,
            status
          });
        }
        start = visitEnd;
      }
    }

    setVisits(generated);
  }, [slots, selectedDate]);

  const handleBooking = async (visit: Visit) => {
    try {
      setLoading(true);
      await api.post("/bookings/bookSlot", {
        propertyId,
        availabilitySlotId: visit.availabilitySlotId,
        slotDate: visit.start.toISOString().split("T")[0],
        startTime: format(visit.start, "HH:mm:ss"),
        endTime: format(visit.end, "HH:mm:ss")
      });
      alert("Vizita a fost rezervată!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Eroare la rezervare");
    } finally {
      setLoading(false);
    }
  };

  const getButtonColor = (status: Visit["status"]) => {
    switch (status) {
      case "Available":
        return "bg-green-600 hover:bg-green-700";
      case "Pending":
        return "bg-yellow-500 cursor-not-allowed";
      case "Confirmed":
        return "bg-green-600 hover:bg-green-700";
      case "Cancelled":
      case "Completed":
        return "bg-red-600 cursor-not-allowed";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Programează o vizită</h2>
      <input
        type="date"
        className="mb-4 p-2 rounded border"
        value={format(selectedDate, "yyyy-MM-dd")}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      />

      {visits.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {visits.map((visit, idx) => (
            <button
              key={idx}
              disabled={loading || visit.status !== "Available"}
              onClick={() => handleBooking(visit)}
              className={`text-white px-4 py-2 rounded font-medium ${getButtonColor(visit.status)} disabled:opacity-50`}
            >
              {format(visit.start, "HH:mm")} - {format(visit.end, "HH:mm")}
              {visit.status !== "Available" && ` (${visit.status})`}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mt-2">Nu există intervale disponibile pentru această zi.</p>
      )}
    </div>
  );
};

export default AvailableVisits;
