import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Event, View } from "react-big-calendar";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { parseISO, addMonths, isAfter } from "date-fns";
import api from "../../../api";
import moment from "moment";
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  baseDate: string | null, title: string, field: string, contractEnd: string | null
): RentalCalendarEvent[] => {
  if (!baseDate) return [];

  const events: RentalCalendarEvent[] = [];
  let startDate = parseISO(baseDate);
  const endDate = contractEnd ? parseISO(contractEnd) : addMonths(startDate, 12);
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

  const fetchInfo = async () => {
    try {
      const res = await api.get(`/rentalsinfo/getRentalInfo/${rentalId}`);
      const info = res.data;
      console.log("Date primite din API:", info);

      const loadedEvents: RentalCalendarEvent[] = [
        ...generateRecurringEvents(info?.rentPaymentDate, eventTypes.RentPaymentDate, "RentPaymentDate", info?.contractEndDate),
        ...generateRecurringEvents(info?.electricityPaymentDate, eventTypes.ElectricityPaymentDate, "ElectricityPaymentDate", info?.contractEndDate),
        ...generateRecurringEvents(info?.waterPaymentDate, eventTypes.WaterPaymentDate, "WaterPaymentDate", info?.contractEndDate),
        ...generateRecurringEvents(info?.gasPaymentDate, eventTypes.GasPaymentDate, "GasPaymentDate", info?.contractEndDate),
        ...generateRecurringEvents(info?.internetPaymentDate, eventTypes.InternetPaymentDate, "InternetPaymentDate", info?.contractEndDate),
      ];

      if (info?.contractStartDate) {
        loadedEvents.push({
          id: "contractStart",
          title: "Contract început",
          start: parseISO(info.contractStartDate),
          end: parseISO(info.contractStartDate),
          field: "ContractStartDate"
        });
      }

      if (info?.contractEndDate) {
        loadedEvents.push({
          id: "contractEnd",
          title: "Contract sfârșit",
          start: parseISO(info.contractEndDate),
          end: parseISO(info.contractEndDate),
          field: "ContractEndDate"
        });
      }

      setEvents(loadedEvents);
    } catch (err) {
      console.error("Eroare la încărcarea calendarului:", err);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, [rentalId]);

  const handleSelectSlot = (slotInfo: any) => setSelectedDate(slotInfo.start);

  const handleSaveEvent = async () => {
    if (!selectedDate) return;

    // 🔥 Convertim data la format local (YYYY-MM-DD)
    const localDateString = moment(selectedDate).format("YYYY-MM-DD");

    console.log("Data selectată pentru backend:", localDateString);

    const newEvent: RentalCalendarEvent = {
      id: Math.random().toString(),
      title: eventTypes[selectedEventType] || "Eveniment",
      start: selectedDate,
      end: selectedDate,
      field: selectedEventType
    };

    try {
      // 🔥 Trimitere cu data locală (fără conversie UTC)
      await api.put(`/rentalsinfo/updateField/${rentalId}?fieldName=${newEvent.field}&value=${localDateString}`);
      await fetchInfo();
      setSelectedDate(null);
    } catch (err) {
      console.error("Eroare la salvare:", err);
    }
  };

  const dayPropGetter = (date: Date) => {
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      return {
        style: {
          border: '2px solid blue',
          backgroundColor: '#e6f7ff',
        }
      };
    }
    return {};
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
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        {selectedDate && (
          <button
            onClick={handleSaveEvent}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            Salvează {moment(selectedDate).format("DD MMMM YYYY")} ({eventTypes[selectedEventType]})
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setCurrentDate(moment(currentDate).subtract(1, 'month').toDate())}
          className="px-2 py-1 rounded 
            bg-gray-200 text-black hover:bg-gray-300
            dark:bg-black dark:text-white dark:hover:bg-gray-800"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-lg font-semibold">{moment(currentDate).format("MMMM YYYY")}</span>
        <button
          onClick={() => setCurrentDate(moment(currentDate).add(1, 'month').toDate())}
          className="px-2 py-1 rounded 
            bg-gray-200 text-black hover:bg-gray-300
            dark:bg-black dark:text-white dark:hover:bg-gray-800"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
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
          toolbar={false}
          dayPropGetter={dayPropGetter}
        />
      </div>
    </div>
  );
};

export default RentalCalendarSection;
