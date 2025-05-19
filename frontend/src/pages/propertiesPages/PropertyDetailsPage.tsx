import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainNavBar from '../../components/MainNavBar';
import OwnerProfileCard from '../../components/user/UserCard';
import api from "../../api";
import { Property } from '../../types/PropertyDetails';
import { Heart } from 'lucide-react';
import AvailableVisits from '../../components/bookings/AvailableVisits';

interface Owner {
  id: string;
  email: string;
  username: string;
  profilePicture: string;
  createdAt: string;
}

interface PropertyImage {
  id: string;
  imageUrl: string;
}

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Invalid property ID.");
      setLoading(false);
      return;
    }

    const fetchPropertyDetails = async () => {
      try {
        const res = await api.get(`/Properties/${id}`);
        const data = res.data;

        if (!data) throw new Error("Property not found.");

        setProperty({
          id: data.id,
          category: data.category,
          name: data.name,
          description: data.description,
          address: `${data.address}, ${data.city}, ${data.state} ${data.zip}`,
          city: data.city,
          state: data.state,
          zip: data.zip,
          price: data.price,
          rooms: data.rooms,
          bathrooms: data.bathrooms,
          garage: data.garage,
          squareFeet: data.squareFeet,
          level: data.level,
          isAvailable: data.isAvailable,
          ownerId: data.ownerId,
          imageUrls: [],
          numberOfKitchen: data.numberOfKitchen,
          numberOfBalconies: data.numberOfBalconies,
          hasGarden: data.hasGarden,
          forRent: data.forRent,
          views: data.views,
          yearOfConstruction: data.yearOfConstruction,
          furnished: data.furnished,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });

        const [imagesRes, favoriteRes] = await Promise.all([
          api.get(`/Properties/getAllPropertyImages`, {
            params: { propertyId: data.id },
          }),
          api.get(`/Favorites/isAlreadyFavorited`, {
            params: { propertyId: data.id },
          }),
        ]);

        setImages(imagesRes.data);
        setIsFavorited(favoriteRes.data === true);

      } catch (err: any) {
        console.error("Error fetching property details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  useEffect(() => {
    if (property?.ownerId) {
      api.get(`/User/getUser`, {
        params: { id: property.ownerId },
      })
        .then(response => setOwner(response.data))
        .catch(err => console.error("Error fetching owner details:", err));
    }
  }, [property?.ownerId]);

  const handlePrevImage = () => {
    setCurrentIndex(prevIndex =>
      prevIndex !== null ? (prevIndex === 0 ? images.length - 1 : prevIndex - 1) : 0
    );
  };

  const handleNextImage = () => {
    setCurrentIndex(prevIndex =>
      prevIndex !== null ? (prevIndex === images.length - 1 ? 0 : prevIndex + 1) : 0
    );
  };

  const handleToggleFavorite = async () => {
    if (!property) return;
    try {
      if (isFavorited) {
        await api.delete(`/Favorites/removeFromFavorites`, {
          params: { propertyId: property.id },
        });
        setIsFavorited(false);
      } else {
        await api.post(`/Favorites/addToMyFavorites`, null, {
          params: { propertyId: property.id },
        });
        setIsFavorited(true);
      }
    } catch (err) {
      console.error("Eroare la toggle favorite:", err);
      alert("A apărut o eroare. Încearcă din nou.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (currentIndex !== null) {
        if (event.key === "ArrowLeft") handlePrevImage();
        else if (event.key === "ArrowRight") handleNextImage();
        else if (event.key === "Escape") setCurrentIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images]);

  if (loading) return <div className="text-center text-gray-700 dark:text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen w-full bg-blue-950 dark:bg-gray-800/90">
      <div className="w-full bg-blue-500 dark:bg-gray-800/90">
        <MainNavBar />
      </div>
      <div className="container mx-auto p-6">
        {property && (
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    
            <button
              onClick={handleToggleFavorite}
              className="absolute top-4 right-4 bg-white/80 dark:bg-gray-700/80 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-200 z-10"
              title={isFavorited ? "Elimină din favorite" : "Adaugă la favorite"}
            >
              <Heart
                className="w-6 h-6"
                fill={isFavorited ? "red" : "none"}
                stroke="red"
              />
            </button>

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{property.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{property.description}</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{property.address}</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-4">
              ${property.price.toLocaleString()}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <p className="text-gray-700 dark:text-gray-300">Camere: {property.rooms}</p>
              <p className="text-gray-700 dark:text-gray-300">Număr băi: {property.bathrooms}</p>
              <p className="text-gray-700 dark:text-gray-300">Garaj: {property.garage ? "Da" : "Nu"}</p>
              <p className="text-gray-700 dark:text-gray-300">Suprafață: {property.squareFeet} mp</p>
              <p className="text-gray-700 dark:text-gray-300">Etaj: {property.level}</p>
              <p className="text-gray-700 dark:text-gray-300">Bucătării: {property.numberOfKitchen}</p>
              <p className="text-gray-700 dark:text-gray-300">Balcoane: {property.numberOfBalconies}</p>
              <p className="text-gray-700 dark:text-gray-300">Grădină: {property.hasGarden ? "Da" : "Nu"}</p>
              <p className="text-gray-700 dark:text-gray-300">De închiriat: {property.forRent ? "Da" : "Nu"}</p>
              <p className="text-gray-700 dark:text-gray-300">An construcție: {property.yearOfConstruction}</p>
              <p className="text-gray-700 dark:text-gray-300">Mobilat: {property.furnished ? "Da" : "Nu"}</p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.length > 0 ? (
                images.map((img, index) => (
                  <img
                    key={img.id}
                    src={img.imageUrl}
                    alt={`Property ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg mb-4 cursor-pointer transition-transform transform hover:scale-105"
                    onClick={() => setCurrentIndex(index)}
                  />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No images available</p>
              )}
            </div>

            <p className="text-gray-700 dark:text-gray-300 mt-4">Data publicării: {new Date(property.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-700 dark:text-gray-300">Data actualizării: {new Date(property.updatedAt).toLocaleDateString()}</p>
            <p className="text-right text-gray-700 dark:text-gray-300">Vizualizări: {property.views}</p>
          </div>
        )}

        <div className="mt-6">
          {owner && (
            <OwnerProfileCard
            username={owner.username}
            profileImageUrl={owner.profilePicture}
            userId={owner.id}
            createdAt={owner.createdAt}
          />
          )}
          {property && <AvailableVisits propertyId={property.id} />}
        </div>
      </div>

      {currentIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
          onClick={() => setCurrentIndex(null)}
        >
          <div className="relative">
            <button
              className="absolute top-5 right-5 text-white text-3xl bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(null);
              }}
            >
              ✕
            </button>

            <button
              className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white text-3xl p-3 rounded-full hover:bg-opacity-70 transition"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
            >
              ❮
            </button>

            <img
              src={images[currentIndex].imageUrl}
              alt="Selected"
              className="w-screen h-screen max-w-full max-h-full object-contain"
            />

            <button
              className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white text-3xl p-3 rounded-full hover:bg-opacity-70 transition"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              ❯
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsPage;
