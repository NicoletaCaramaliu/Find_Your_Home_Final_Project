import React, { useEffect, useState } from "react";
import api from "../../../api";

interface RentalSidebarProps {
  rentalId: string;
}

interface RentalInfo {
  rentPaymentDate: string;
  electricityPaymentDate: string;
  waterPaymentDate: string;
  gasPaymentDate: string;
  internetPaymentDate: string;
  landlordPhone: string;
  plumberPhone: string;
  electricianPhone: string;
  gasServicePhone: string;
  internetProviderPhone: string;
  contractSigned: boolean;
  contractStartDate: string;
  contractEndDate: string;
  rentAmount: string;
}

const fieldLabels: { [key in keyof RentalInfo]?: string } = {
  rentPaymentDate: "Zi plată chirie",
  electricityPaymentDate: "Zi plată electricitate",
  waterPaymentDate: "Zi plată apă",
  gasPaymentDate: "Zi plată gaz",
  internetPaymentDate: "Zi plată internet",
  landlordPhone: "Telefon proprietar",
  plumberPhone: "Telefon instalator",
  electricianPhone: "Telefon electrician",
  gasServicePhone: "Telefon gaz",
  internetProviderPhone: "Telefon internet",
  contractSigned: "Contract semnat",
  contractStartDate: "Data început contract",
  contractEndDate: "Data sfârșit contract",
  rentAmount: "Suma chirie",
};

const nonEditableFields = [
  "rentPaymentDate",
  "electricityPaymentDate",
  "waterPaymentDate",
  "gasPaymentDate",
  "internetPaymentDate"
];

const RentalSidebar: React.FC<RentalSidebarProps> = ({ rentalId }) => {
  const [rentalInfo, setRentalInfo] = useState<RentalInfo | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get(`/rentalsinfo/getRentalInfo/${rentalId}`);
        const data = res.data;
        const filteredInfo: RentalInfo = {
          rentPaymentDate: data.rentPaymentDate ?? "",
          electricityPaymentDate: data.electricityPaymentDate ?? "",
          waterPaymentDate: data.waterPaymentDate ?? "",
          gasPaymentDate: data.gasPaymentDate ?? "",
          internetPaymentDate: data.internetPaymentDate ?? "",
          landlordPhone: data.landlordPhone ?? "",
          plumberPhone: data.plumberPhone ?? "",
          electricianPhone: data.electricianPhone ?? "",
          gasServicePhone: data.gasServicePhone ?? "",
          internetProviderPhone: data.internetProviderPhone ?? "",
          contractSigned: data.contractSigned ?? false,
          contractStartDate: data.contractStartDate ?? "",
          contractEndDate: data.contractEndDate ?? "",
          rentAmount: data.rentAmount ?? "",
        };
        setRentalInfo(filteredInfo);
        setIsNew(false);
      } catch (err) {
        console.warn("Nu există info, creăm gol.");
        setRentalInfo({
          rentPaymentDate: "",
          electricityPaymentDate: "",
          waterPaymentDate: "",
          gasPaymentDate: "",
          internetPaymentDate: "",
          landlordPhone: "",
          plumberPhone: "",
          electricianPhone: "",
          gasServicePhone: "",
          internetProviderPhone: "",
          contractSigned: false,
          contractStartDate: "",
          contractEndDate: "",
          rentAmount: "",
        });
        setIsNew(true);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [rentalId]);

  const handleChange = (field: keyof RentalInfo, value: any) => {
    if (!rentalInfo) return;
    setRentalInfo({ ...rentalInfo, [field]: value ?? "" });
  };

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  const saveInfo = async () => {
    if (!rentalInfo) return;
    const dataToSave = prepareDataForSave(rentalInfo);

    try {
        if (isNew) {
        await api.post("/rentalsinfo/create", { ...dataToSave, rentalId });
        showMessage("✅ Informații create cu succes!");
        setIsNew(false);
        } else {
        await api.put(`/rentalsinfo/update/${rentalId}`, dataToSave);
        showMessage("✅ Informații actualizate cu succes!");
        }
    } catch (err) {
        console.error("Eroare la salvare:", err);
        showMessage("❌ Eroare la salvare!");
    }
};


  const deleteInfo = async () => {
    if (!window.confirm("Sigur vrei să ștergi informațiile?")) return;
    try {
      await api.delete(`/rentalsinfo/delete/${rentalId}`);
      showMessage("🗑️ Informații șterse!");
      setRentalInfo(null);
      setIsNew(true);
    } catch (err) {
      console.error("Eroare la ștergere:", err);
      showMessage("❌ Eroare la ștergere!");
    }
  };

  const prepareDataForSave = (info: RentalInfo) => ({
  ...info,
  rentPaymentDate: info.rentPaymentDate ? new Date(info.rentPaymentDate).toISOString() : null,
  electricityPaymentDate: info.electricityPaymentDate ? new Date(info.electricityPaymentDate).toISOString() : null,
  waterPaymentDate: info.waterPaymentDate ? new Date(info.waterPaymentDate).toISOString() : null,
  gasPaymentDate: info.gasPaymentDate ? new Date(info.gasPaymentDate).toISOString() : null,
  internetPaymentDate: info.internetPaymentDate ? new Date(info.internetPaymentDate).toISOString() : null,
  contractStartDate: info.contractStartDate ? new Date(info.contractStartDate).toISOString() : null,
  contractEndDate: info.contractEndDate ? new Date(info.contractEndDate).toISOString() : null,
});


  if (loading) return <p>Se încarcă...</p>;
  if (!rentalInfo) return <p>Informații indisponibile</p>;

  return (
    <aside className="hidden md:block w-64 bg-white dark:bg-gray-700 shadow-lg p-4 h-screen sticky top-0 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">ℹ️ Info utile (editabil) </h3>
      <p className="text-sm font-semibold mb-3">- zilele de plată se setează în calendar(setează o zi din lună apoi se va adăuga cu recurență(lunar) în calendar</p>
      <ul className="space-y-2 text-sm">
        {Object.keys(fieldLabels).map((key) => {
          const value = rentalInfo[key as keyof RentalInfo];

          return (
            <li key={key}>
                <strong>{fieldLabels[key as keyof RentalInfo]}:</strong>{" "}
                {typeof value === "boolean" ? (
                    <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                        handleChange(key as keyof RentalInfo, e.target.checked)
                    }
                    />
                ) : key === "contractStartDate" || key === "contractEndDate" ? (
                    <input
                    type="date"
                    value={value ? new Date(value).toISOString().substring(0, 10) : ""}
                    onChange={(e) =>
                        handleChange(key as keyof RentalInfo, e.target.value)
                    }
                    className="bg-transparent border-b focus:outline-none w-32"
                    />
                ) : nonEditableFields.includes(key) ? (
                    <span>{value ? new Date(value).getDate() : "Nespecificat"}</span>
                ) : (
                    <input
                    type="text"
                    value={value !== undefined && value !== null ? String(value) : ""}
                    onChange={(e) =>
                        handleChange(key as keyof RentalInfo, e.target.value)
                    }
                    className="bg-transparent border-b focus:outline-none w-32"
                    />
                )}
                </li>

          );
        })}
      </ul>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={saveInfo}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          {isNew ? "Creează" : "Salvează"}
        </button>
        {!isNew && (
          <button
            onClick={deleteInfo}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          >
            Șterge
          </button>
        )}
      </div>
      {message && <div className="mt-2 text-sm text-green-600">{message}</div>}
    </aside>
  );
};

export default RentalSidebar;
