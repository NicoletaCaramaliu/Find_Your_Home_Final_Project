import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';
import OwnerProfileCard from '../components/properties/OwnerProfileCard';
import api from "../api";

const API_URL = "http://localhost:5266/api/Properties";
const USER_API_URL = "http://localhost:5266/api/User";

interface Property {
    id: string;
    category: string;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    price: number;
    rooms: number;
    bathrooms: number;
    garage: boolean;
    squareFeet: number;
    level: number;
    numberOfKitchen: number;
    numberOfBalconies: number;
    hasGarden: boolean;
    forRent: boolean;
    views: number;
    yearOfConstruction: number;
    furnished: boolean;
    createdAt: string;
    updatedAt: string;
    isAvailable: boolean;
    ownerId: string;
    imageUrls: string[];
}

interface Owner {
    id: string;
    email: string;
    username: string;
    profilePicture: string;
}

const PropertyDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [owner, setOwner] = useState<Owner | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    // Fetch property details
    useEffect(() => {
        if (!id) {
            setError("Invalid property ID.");
            setLoading(false);
            return;
        }

        fetch(`${API_URL}/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data: any) => {
                if (!data) {
                    throw new Error("Property not found.");
                }

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

                return fetch(`${API_URL}/getAllPropertyImages?propertyId=${data.id}`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to load images.");
                }
                return response.json();
            })
            .then((imageUrls: string[]) => {
                setImages(imageUrls);
            })
            .catch(err => {
                console.error("Error fetching property details:", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (property?.ownerId) {
            console.log("Fetching owner:", property.ownerId);
            fetch(`${USER_API_URL}/getUser?id=${property.ownerId}`)
                .then(response => {
                    console.log("Owner response status:", response.status);
                    return response.json();
                })
                .then(ownerData => {
                    console.log("Owner data:", ownerData);
                    setOwner(ownerData);
                })
                .catch(err => console.error("Error fetching owner details:", err));
        }
    }, [property?.ownerId]);

    const handlePrevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex !== null ? (prevIndex === 0 ? images.length - 1 : prevIndex - 1) : 0));
    };
    
    const handleNextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex !== null ? (prevIndex === images.length - 1 ? 0 : prevIndex + 1) : 0));
    };
    

    //  taste <- ->
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (currentIndex !== null) {
                if (event.key === "ArrowLeft") {
                    handlePrevImage();
                } else if (event.key === "ArrowRight") {
                    handleNextImage();
                } else if (event.key === "Escape") {
                    setCurrentIndex(null); // Închide lightbox-ul cu Esc
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [currentIndex, images]);

    if (loading) {
        return <div className="text-center text-gray-700 dark:text-white">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="min-h-screen w-full bg-blue-950 dark:bg-gray-800/90">
            <div className="w-full bg-blue-500 dark:bg-gray-800/90">
                <MainNavBar />
            </div>
            <div className="container mx-auto p-6">
                {property && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{property.name}</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">{property.description}</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{property.address}</p>
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-4">
                            ${property.price.toLocaleString()}
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                        <p className="text-gray-700 dark:text-gray-300">Camere: {property.rooms}</p>
                        <p className="text-gray-700 dark:text-gray-300">Număr camere: {property.rooms}</p>
                            <p className="text-gray-700 dark:text-gray-300">Număr băi: {property.bathrooms}</p>
                            <p className="text-gray-700 dark:text-gray-300">Garaj: {property.garage ? "Da" : "Nu"}</p>
                            <p className="text-gray-700 dark:text-gray-300">Suprafață: {property.squareFeet} mp</p>
                            <p className="text-gray-700 dark:text-gray-300">Etaj: {property.level}</p>
                            <p className="text-gray-700 dark:text-gray-300">Bucătării: {property.numberOfKitchen}</p>
                            <p className="text-gray-700 dark:text-gray-300">Balcoane: {property.numberOfBalconies}</p>
                            <p className="text-gray-700 dark:text-gray-300">Grădină: {property.hasGarden ? "Da" : "Nu"}</p>
                            <p className="text-gray-700 dark:text-gray-300">De închiriat: {property.forRent ? "Da" : "Nu"}</p>
                            <p className="text-gray-700 dark:text-gray-300">Vizualizări: {property.views}</p>
                            <p className="text-gray-700 dark:text-gray-300">An construcție: {property.yearOfConstruction}</p>
                            <p className="text-gray-700 dark:text-gray-300">Mobilat: {property.furnished ? "Da" : "Nu"}</p>
                        </div>
                        {/* Property images */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {images.length > 0 ? (
                                images.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Property ${index + 1}`}
                                        className="w-full h-64 object-cover rounded-lg mb-4 cursor-pointer transition-transform transform hover:scale-105"
                                        onClick={() => setCurrentIndex(index)}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No images available</p>
                            )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">Data publicării: {new Date(property.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-700 dark:text-gray-300">Data actualizării: {new Date(property.updatedAt).toLocaleDateString()}</p>    
                    </div>
                    
                )}
                <div className="mt-6">
                            {owner && (
                                <OwnerProfileCard
                                name={owner.username}
                                profileImageUrl={owner.profilePicture}
                                ownerId={owner.id}
                            />
                            )}
                        </div>
            </div>

            {/* Lightbox for image navigation */}
            {currentIndex !== null && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
                    onClick={() => setCurrentIndex(null)}
                >
                    <div className="relative">
                        {/* Close button */}
                        <button
                            className="absolute top-5 right-5 text-white text-3xl bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex(null);
                            }}
                        >
                            ✕
                        </button>

                        {/* Previous button */}
                        <button
                            className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white text-3xl p-3 rounded-full hover:bg-opacity-70 transition"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrevImage();
                            }}
                        >
                            ❮
                        </button>

                        {/* Image */}
                        <img
                            src={images[currentIndex]}
                            alt="Selected"
                            className="w-screen h-screen max-w-full max-h-full object-contain"
                        />

                        {/* Next button */}
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
