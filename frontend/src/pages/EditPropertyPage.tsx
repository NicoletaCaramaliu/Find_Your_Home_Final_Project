import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import AddPropertyForm from "../components/properties/AddPropertyForm";
import MainNavBar from "../components/MainNavBar";
import { Property } from "../types/Property";

const EditPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProperty = async () => {
    try {
      const res = await api.get(`/Properties/${id}`);
      const imagesRes = await api.get(`/Properties/getAllPropertyImages?propertyId=${id}`);
      setProperty({
        ...res.data,
        imageUrls: imagesRes.data,
      });
    } catch (err) {
      console.error("Eroare la preluarea proprietății:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  if (loading) return <p className="p-4 text-gray-700 dark:text-gray-200">Se încarcă...</p>;
  if (!property) return <p className="p-4 text-red-600">Proprietatea nu a fost găsită.</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <MainNavBar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Editare Proprietate</h1>

        <AddPropertyForm
          isEdit
          initialData={property}
          onSuccess={() => navigate("/myAccount")}
          onCancel={() => navigate("/myAccount")}
        />
      </div>
    </div>
  );
};

export default EditPropertyPage;
