import React, { useEffect, useState } from "react";
import api from "../../../api";

interface RentalSidebarProps {
  rentalId: string;
}

interface RentalInfo {
  id?: string;
  rentalId: string;
  rentPaymentDay: string;
  electricityPaymentDay: string;
  waterPaymentDay: string;
  gasPaymentDay: string;
  internetPaymentDay: string;
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
  rentPaymentDay: "Zi plată chirie",
  electricityPaymentDay: "Zi plată electricitate",
  waterPaymentDay: "Zi plată apă",
  gasPaymentDay: "Zi plată gaz",
  internetPaymentDay: "Zi plată internet",
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

const RentalSidebar: React.FC<RentalSidebarProps> = ({ rentalId }) => {
  const [rentalInfo, setRentalInfo] = useState<RentalInfo | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);  

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get(`/rentalsinfo/getRentalInfo/${rentalId}`);
        setRentalInfo(res.data);
        setIsNew(false);
      } catch (err) {
        console.warn("Nu există info, creăm gol.");
        setRentalInfo({
          rentalId,
          rentPaymentDay: "",
          electricityPaymentDay: "",
          waterPaymentDay: "",
          gasPaymentDay: "",
          internetPaymentDay: "",
          landlordPhone: "",
          plumberPhone: "",
          electricianPhone: "",
          gasServicePhone: "",
          internetProviderPhone: "",
          contractSigned: false,
          contractStartDate: "",
          contractEndDate: "",
          rentAmount: ""
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
    try {
      if (isNew) {
        await api.post("/rentalsinfo/create", rentalInfo);
        showMessage("✅ Informații create cu succes!");
        setIsNew(false);
      } else {
        await api.put(`/rentalsinfo/update/${rentalId}`, rentalInfo);
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

  if (loading) return <p>Se încarcă...</p>;
  if (!rentalInfo) return <p>Informații indisponibile</p>;

  return (
    <aside className="hidden md:block w-64 bg-white dark:bg-gray-700 shadow-lg p-4 h-screen sticky top-0 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">ℹ️ Info utile (editabil)</h3>
      <ul className="space-y-2 text-sm">
        {Object.entries(rentalInfo)
          .filter(([key]) => key !== "id" && key !== "rentalId")
          .map(([key, value]) => (
            <li key={key}>
              <strong>{fieldLabels[key as keyof RentalInfo] ?? key}:</strong>{" "}
              {typeof value === "boolean" ? (
                <input
                  type="checkbox"
                  checked={value}
                  onChange={e => handleChange(key as keyof RentalInfo, e.target.checked)}
                />
              ) : (
                <input
                  type="text"
                  value={value ?? ""}
                  onChange={e => handleChange(key as keyof RentalInfo, e.target.value)}
                  className="bg-transparent border-b focus:outline-none w-32"
                />
              )}
            </li>
          ))}
      </ul>
      <div className="mt-4 flex space-x-2">
        <button onClick={saveInfo} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">{isNew ? "Creează" : "Salvează"}</button>
        {!isNew && <button onClick={deleteInfo} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">Șterge</button>}
      </div>
      {message && <div className="mt-2 text-sm text-green-600">{message}</div>}
    </aside>
  );
};

export default RentalSidebar;
