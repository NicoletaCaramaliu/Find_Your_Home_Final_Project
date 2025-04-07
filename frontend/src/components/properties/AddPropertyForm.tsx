import React, { useEffect, useState } from "react";
import api from "../../api";
import axios from "axios";

interface Props {
  isEdit?: boolean;
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const defaultForm = {
  category: "",
  name: "",
  description: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  price: 1000,
  rooms: 1,
  bathrooms: 1,
  garage: false,
  level: 1,
  squareFeet: 50,
  isAvailable: true,
  numberOfKitchen: 1,
  numberOfBalconies: 1,
  hasGarden: false,
  forRent: false,
  views: 0,
  yearOfConstruction: new Date().getFullYear(),
  furnished: false,
  petFriendly: false,
};

const AddPropertyForm: React.FC<Props> = ({
  isEdit = false,
  initialData,
  onSuccess,
  onCancel,
}) => {
  const [form, setForm] = useState({ ...defaultForm });
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<
    { id: string; imageUrl: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isEdit && initialData) {
      setForm({ ...defaultForm, ...initialData });
      fetchExistingImages(initialData.id);
    }
  }, [isEdit, initialData]);

  const fetchExistingImages = async (propertyId: string) => {
    try {
      const res = await api.get(
        `/Properties/getAllPropertyImages?propertyId=${propertyId}`
      );
      setExistingImages(res.data);
    } catch (err) {
      console.error("Error fetching property images", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, type, value } = target;
    const finalValue =
      type === "checkbox" ? (target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await api.delete(`/Properties/deletePropertyImage?imageId=${imageId}`);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error("Failed to delete image", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!initialData?.id) return;
    try {
      await api.delete(`/Properties/deleteProperty?propertyId=${initialData.id}`);
      setMessage("✅ Proprietatea a fost ștearsă!");
      setTimeout(() => {
        onSuccess();
        onCancel();
      }, 1000);
    } catch (err) {
      console.error("Eroare la ștergerea proprietății:", err);
      setMessage("❌ Eroare la ștergerea proprietății");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(isEdit ? "Se salvează modificările..." : "Se încarcă proprietatea...");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value != null ? value.toString() : "");
    });
    images.forEach((file) => formData.append("images", file));

    try {
      if (isEdit && initialData?.id) {
        formData.append("Id", initialData.id);
        await api.put(`/Properties/updateProperty`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("✅ Proprietatea a fost actualizată!");
      } else {
        await api.post("/Properties/createProperty", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("✅ Anunț publicat cu succes!");
      }

      onSuccess();
      setTimeout(() => {
        setLoading(false);
        onCancel();
      }, 1500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error.response?.data?.errors;
        console.error("Eroare API:", err);
        setMessage("❌ Eroare: " + JSON.stringify(err, null, 2));
      }
      setLoading(false);
    }
  };

  const textFields = [
    { name: "name", label: "Nume", type: "text" },
    { name: "category", label: "Categorie", type: "text" },
    { name: "description", label: "Descriere", type: "text" },
    { name: "address", label: "Adresă", type: "text" },
    { name: "city", label: "Oraș", type: "text" },
    { name: "state", label: "Județ", type: "text" },
    { name: "zip", label: "Cod poștal", type: "text" },
    { name: "price", label: "Preț", type: "number" },
    { name: "rooms", label: "Camere", type: "number" },
    { name: "bathrooms", label: "Băi", type: "number" },
    { name: "level", label: "Etaj", type: "number" },
    { name: "squareFeet", label: "Suprafață (m²)", type: "number" },
    { name: "numberOfKitchen", label: "Bucătării", type: "number" },
    { name: "numberOfBalconies", label: "Balcoane", type: "number" },
    { name: "yearOfConstruction", label: "An construcție", type: "number" },
  ];

  const checkboxFields = [
    { name: "garage", label: "Garaj" },
    { name: "isAvailable", label: "Disponibil" },
    { name: "hasGarden", label: "Grădină" },
    { name: "forRent", label: "Pentru închiriere" },
    { name: "furnished", label: "Mobilat" },
    { name: "petFriendly", label: "Pet Friendly" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow w-full text-gray-800 dark:text-gray-100">
      <h2 className="text-2xl font-semibold mb-6">
        {isEdit ? "Editează Proprietatea" : "Adaugă Proprietate"}
      </h2>

      {message && (
        <p
          className={`mb-4 font-medium ${
            loading
              ? "text-blue-600 dark:text-blue-400"
              : message.includes("✅")
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {textFields.map(({ name, label, type }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="mb-1 font-medium">{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              value={form[name as keyof typeof form] as string | number}
              onChange={handleChange}
              required
              className="p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        ))}

        {checkboxFields.map(({ name, label }) => (
          <div key={name} className="flex items-center gap-2">
            <input
              id={name}
              name={name}
              type="checkbox"
              checked={form[name as keyof typeof form] as boolean}
              onChange={handleChange}
              className="accent-blue-600 dark:accent-blue-400"
            />
            <label htmlFor={name} className="font-medium">{label}</label>
          </div>
        ))}

        <div className="flex flex-col col-span-2">
          <label htmlFor="images" className="mb-1 font-medium">Adaugă Imagini</label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
        </div>

        {isEdit && existingImages.length > 0 && (
          <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {existingImages.map((img) => (
              <div key={img.id} className="relative border rounded overflow-hidden shadow dark:border-gray-700">
                <img src={img.imageUrl} alt="property" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                >
                  Șterge
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="col-span-2 flex gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Se trimite..." : isEdit ? "Salvează" : "Adaugă"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-black dark:text-white rounded hover:bg-gray-500"
          >
            Anulează
          </button>
        </div>
      </form>

      {isEdit && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Șterge Proprietatea
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="mt-4 p-4 border rounded bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 shadow-lg">
          <p className="mb-4 font-semibold">Ești sigur că vrei să ștergi această proprietate?</p>
          <div className="flex gap-4">
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Da, șterge
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-400 text-black dark:text-white rounded hover:bg-gray-500"
            >
              Nu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPropertyForm;
