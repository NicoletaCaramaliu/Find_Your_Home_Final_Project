import React from "react";
import { Dialog } from "@headlessui/react";
import SlotCalendar from "./SlotCalendar"; 

interface Props {
  propertyId: string;
  onClose: () => void;
}

const SlotManagerModal: React.FC<Props> = ({ propertyId, onClose }) => {
  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow max-w-2xl mx-auto mt-20">
        <h2 className="text-xl font-semibold mb-4">Sloturi disponibile</h2>
        <SlotCalendar propertyId={propertyId} />
        <div className="mt-4 text-right">
          <button onClick={onClose} className="text-red-600 hover:underline">
            Închide
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default SlotManagerModal;
