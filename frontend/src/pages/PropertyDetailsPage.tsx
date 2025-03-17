import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';

const API_URL = "http://localhost:5266/api/Properties";

interface Property {
    id: string;
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
    isAvailable: boolean;
    ownerId: number;
    imageUrls: string[];
}

const PropertyDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]); // State pentru imagini

    // Fetch property details
    useEffect(() => {
        if (!id) {
            setError("Invalid property ID.");
            setLoading(false);
            return;
        }

        fetch(`${API_URL}/id?id=${id}`)
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
                    isAvailable: data.isAvailable,
                    ownerId: data.ownerId,
                    imageUrls: [] 
                });

                // images of the property
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
                            <p className="text-gray-700 dark:text-gray-300">Rooms: {property.rooms}</p>
                            <p className="text-gray-700 dark:text-gray-300">Bathrooms: {property.bathrooms}</p>
                            <p className="text-gray-700 dark:text-gray-300">Garage: {property.garage ? "Yes" : "No"}</p>
                            <p className="text-gray-700 dark:text-gray-300">Size: {property.squareFeet} sqft</p>
                        </div>
                        {/* Afișează imaginile proprietății */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {images.length > 0 ? (
                                images.map((url, index) => (
                                    <img key={index} src={url} alt={`Property ${index + 1}`} className="w-full h-64 object-cover rounded-lg mb-4" />
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No images available</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyDetailsPage;
