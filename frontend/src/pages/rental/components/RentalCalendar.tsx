import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Event, View } from "react-big-calendar";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { parseISO, addMonths, isAfter } from "date-fns";
import api from "../../../api";
import moment from "moment";

moment.locale("ro"); 
const localizer = momentLocalizer(moment);

interface RentalCalendarEvent extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  field: string; 
}

interface RentalCalendarSectionProps {
  rentalId: string;
}

const generateRecurringEvents = (
  baseDate: string, title: string, field: string, contractEnd: string
): RentalCalendarEvent[] => {
  if (!baseDate || !contractEnd) return [];
  const events: RentalCalendarEvent[] = [];
  let startDate = parseISO(baseDate);
  const endDate = parseISO(contractEnd);
  let current = startDate;
  let i = 0;
  while (!isAfter(current, endDate)) {
    events.push({
      id: `${field}-${i}`,
      title,
      start: current,
      end: current,
      field
    });
    current = addMonths(current, 1);
    i++;
  }
  return events;
};

const RentalCalendarSection: React.FC<RentalCalendarSectionProps> = ({ rentalId }) => {
  const [events, setEvents] = useState<RentalCalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string>("RentPaymentDate");

  const eventTypes: { [key: string]: string } = {
    RentPaymentDate: "Zi plată chirie",
    ElectricityPaymentDate: "Zi plată electricitate",
    WaterPaymentDate: "Zi plată apă",
    GasPaymentDate: "Zi plată gaz",
    InternetPaymentDate: "Zi plată internet",
  };

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get(`/rentalsinfo/getRentalInfo/${rentalId}`);
        const info = res.data;
        const loadedEvents: RentalCalendarEvent[] = [
          ...generateRecurringEvents(info.rentPaymentDate, eventTypes.RentPaymentDate, "RentPaymentDate", info.contractEndDate),
          ...generateRecurringEvents(info.electricityPaymentDate, eventTypes.ElectricityPaymentDate, "ElectricityPaymentDate", info.contractEndDate),
          ...generateRecurringEvents(info.waterPaymentDate, eventTypes.WaterPaymentDate, "WaterPaymentDate", info.contractEndDate),
          ...generateRecurringEvents(info.gasPaymentDate, eventTypes.GasPaymentDate, "GasPaymentDate", info.contractEndDate),
          ...generateRecurringEvents(info.internetPaymentDate, eventTypes.InternetPaymentDate, "InternetPaymentDate", info.contractEndDate),
          { id: "contractStart", title: "Contract început", start: parseISO(info.contractStartDate), end: parseISO(info.contractStartDate), field: "ContractStartDate" },
          { id: "contractEnd", title: "Contract sfârșit", start: parseISO(info.contractEndDate), end: parseISO(info.contractEndDate), field: "ContractEndDate" }
        ].filter(e => e.start);
        setEvents(loadedEvents);
      } catch (err) {
        console.error("Eroare la încărcarea calendarului:", err);
      }
    };
    fetchInfo();
  }, [rentalId]);

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedDate(slotInfo.start);
  };

  const handleSaveEvent = async () => {
    if (!selectedDate) return;

    const localDateISOString = selectedDate.getFullYear() + "-" +
        String(selectedDate.getMonth() + 1).padStart(2, '0') + "-" +
        String(selectedDate.getDate()).padStart(2, '0') + "T" +
        String(selectedDate.getHours()).padStart(2, '0') + ":" +
        String(selectedDate.getMinutes()).padStart(2, '0') + ":" +
        String(selectedDate.getSeconds()).padStart(2, '0');

    const newEvent: RentalCalendarEvent = {
        id: Math.random().toString(),
        title: eventTypes[selectedEventType] || "Eveniment",
        start: selectedDate,
        end: selectedDate,
        field: selectedEventType
    };

    try {
        await api.put(`/rentalsinfo/updateField/${rentalId}?fieldName=${newEvent.field}&value=${localDateISOString}`);
        setEvents(prev => [...prev, newEvent]);
        setSelectedDate(null);
    } catch (err) {
        console.error("Eroare la salvare:", err);
    }
};


  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <label htmlFor="eventType" className="block text-sm font-medium">Tip eveniment:</label>
        <select
            id="eventType"
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="border rounded p-1 bg-white dark:bg-gray-800 dark:text-white"
            >
            {Object.entries(eventTypes).map(([key, label]) => (
                <option key={key} value={key} className="bg-white dark:bg-gray-800 dark:text-white">
                {label}
                </option>
            ))}
            </select>


        {selectedDate && (
          <button
            onClick={handleSaveEvent}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            Salvează {selectedDate.toLocaleDateString()} ({eventTypes[selectedEventType]})
          </button>
        )}
      </div>

      <div style={{ height: 500, width: "100%" }} className="rounded-xl overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          date={currentDate}
          view={currentView}
          onNavigate={date => setCurrentDate(date)}
          onView={(view: View) => setCurrentView(view)}
          onSelectSlot={handleSelectSlot}
          defaultView="month"
          views={['month', 'week', 'day']}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default RentalCalendarSection;
