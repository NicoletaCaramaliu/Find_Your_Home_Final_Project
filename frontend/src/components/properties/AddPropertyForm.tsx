import React, { useEffect, useState } from "react";
import api from "../../api";
import axios from "axios";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

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
  latitude: 44.4268,
  longitude: 26.1025,
};

const AddPropertyForm: React.FC<Props> = ({
  isEdit = false,
  initialData,
  onSuccess,
  onCancel,
}) => {
  //load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBG-_7FJZ_xOMG3zfjE50XbHFz_7SCfh8Y" 
  });

  const [form, setForm] = useState({ ...defaultForm });
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string; imageUrl: string; order: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  

  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: form.latitude,
    lng: form.longitude,
  });

  useEffect(() => {
    if (isEdit && initialData) {
      setForm({ ...defaultForm, ...initialData });
      setLocation({ lat: initialData.latitude, lng: initialData.longitude });
      fetchExistingImages(initialData.id);
    }
  }, [isEdit, initialData]);

  const fetchExistingImages = async (propertyId: string) => {
    try {
      const res = await api.get(`/Properties/getAllPropertyImages?propertyId=${propertyId}`);
      const withOrder = res.data.map((img: any, index: number) => ({
        ...img,
        order: img.order ?? index + 1, 
      }));
      setExistingImages(withOrder);
    } catch (err) {
      console.error("Error fetching property images", err);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const { name, type, value } = target;
    const finalValue = type === "checkbox" ? (target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const uniqueNewFiles = newFiles.filter(
        (newFile) => !images.some((existing) => existing.name === newFile.name && existing.size === newFile.size)
      );
      setImages((prev) => [...prev, ...uniqueNewFiles]);
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
    formData.append("Latitude", location.lat.toString());
    formData.append("Longitude", location.lng.toString());
    images.forEach((file) => formData.append("images", file));

    try {
      if (isEdit && initialData?.id) {
        formData.append("Id", initialData.id);
        const res = await api.put(`/Properties/updateProperty`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const { Duplicates } = res.data;
        setMessage("✅ Proprietatea a fost actualizată!");
        if (Duplicates && Duplicates.length > 0) {
          alert(`⚠️ Următoarele imagini existau deja:\n${Duplicates.join("\n")}`);
        }
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

  const moveImage = (index: number, direction: number) => {
    setExistingImages((prev) => {
      const updated = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= updated.length) return updated;

      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;

      return updated.map((img, i) => ({ ...img, order: i + 1 }));
    });
  };

  const saveImageOrder = async () => {
    try {
      const updates = existingImages.map((img) => ({
        id: img.id,
        order: img.order,
      }));
      await api.post("/Properties/updateImageOrder", updates);
      setMessage("✅ Ordinea imaginilor a fost salvată!");
    } catch (err) {
      console.error("Eroare la salvarea ordinii imaginilor", err);
      setMessage("❌ Eroare la salvarea ordinii imaginilor");
    }
  };



  const textFields = [
    { name: "name", label: "Nume", type: "text" },
    { name: "category", label: "Categorie(apartament, casă...)", type: "text" },
    { name: "description", label: "Descriere", type: "text" },
    { name: "address", label: "Adresă", type: "text" },
    { name: "city", label: "Oraș", type: "text" },
    { name: "state", label: "Județ", type: "text" },
    { name: "zip", label: "Cod poștal", type: "text" },
    { name: "price", label: "Preț(€)", type: "number" },
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
        <p className={`mb-4 font-medium ${
          loading ? "text-blue-600 dark:text-blue-400"
          : message.includes("✅") ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"}`}>
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

        <div className="col-span-2 h-80 mb-4">
          <label className="mb-1 font-medium block">📍 Selectează Locația pe Hartă</label>
          {loadError && <p className="text-red-500">❌ Eroare la încărcarea hărții</p>}
          {!isLoaded ? (
            <p>⏳ Se încarcă harta...</p>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={location}
              zoom={12}
              onClick={(e) => {
                const newLocation = { lat: e.latLng!.lat(), lng: e.latLng!.lng() };
                setLocation(newLocation);
                setForm((prev) => ({ ...prev, latitude: newLocation.lat, longitude: newLocation.lng }));
              }}
            >
              <Marker
                position={location}
                draggable
                onDragEnd={(e) => {
                  const newLocation = { lat: e.latLng!.lat(), lng: e.latLng!.lng() };
                  setLocation(newLocation);
                  setForm((prev) => ({ ...prev, latitude: newLocation.lat, longitude: newLocation.lng }));
                }}
              />
            </GoogleMap>
          )}
        </div>

        <div className="flex flex-col col-span-2">
          <label htmlFor="images" className="mb-1 font-medium">Adaugă Imagini</label>
          <input type="file" id="images" multiple accept="image/*" onChange={handleImageChange} className="p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
        </div>

        {images.length > 0 && (
          <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {images.map((file, index) => (
              <div key={index} className="relative border rounded overflow-hidden shadow dark:border-gray-700">
                <img src={URL.createObjectURL(file)} alt={`new-${index}`} className="w-full h-40 object-cover" />
                <button type="button" onClick={() => handleRemoveNewImage(index)} className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700">Elimină</button>
              </div>
            ))}
          </div>
        )}

        {isEdit && existingImages.length > 0 && (
          <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {existingImages
              .sort((a, b) => a.order - b.order)  
              .map((img, index) => (
                <div key={img.id} className="relative border rounded overflow-hidden shadow dark:border-gray-700">
                  <img src={img.imageUrl} alt="property" className="w-full h-40 object-cover" />
                  <div className="absolute top-1 right-1 flex flex-col">
                    <button type="button" onClick={() => moveImage(index, -1)} className="bg-blue-600 text-white text-xs px-1 rounded hover:bg-blue-700">↑</button>
                    <button type="button" onClick={() => moveImage(index, 1)} className="bg-blue-600 text-white text-xs px-1 rounded hover:bg-blue-700">↓</button>
                    <button type="button" onClick={() => handleDeleteImage(img.id)} className="bg-red-600 text-white text-xs px-1 rounded hover:bg-red-700">Șterge</button>
                    </div>
                </div>
              ))}
          </div>
        )}
        <button onClick={saveImageOrder} className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Salvează ordinea imaginilor
        </button>



        <div className="col-span-2 flex gap-4 mt-6">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Se trimite..." : isEdit ? "Salvează" : "Adaugă"}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-400 text-black dark:text-white rounded hover:bg-gray-500">
            Anulează
          </button>
        </div>
      </form>

      {isEdit && (
        <div className="mt-6">
          <button type="button" onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Șterge Proprietatea
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="mt-4 p-4 border rounded bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 shadow-lg">
          <p className="mb-4 font-semibold">Ești sigur că vrei să ștergi această proprietate?</p>
          <div className="flex gap-4">
            <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Da, șterge
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-400 text-black dark:text-white rounded hover:bg-gray-500">
              Nu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPropertyForm;
