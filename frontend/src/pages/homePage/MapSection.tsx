import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import api from '../../api';
import { Property } from '../../types/Property';

const MapSection = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBG-_7FJZ_xOMG3zfjE50XbHFz_7SCfh8Y"
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get<Property[]>('/Properties/getAllProperties');
        setProperties(response.data);
      } catch (error) {
        console.error("Eroare la încărcarea proprietăților", error);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="md:w-1/4 bg-white dark:bg-gray-800 flex items-center justify-center p-2">
      {loadError && <p className="text-red-600">Eroare la încărcarea hărții</p>}
      {!isLoaded ? <p>Se încarcă harta...</p> : (
        <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} zoom={10} center={{ lat: 44.4268, lng: 26.1025 }}>
          {properties.filter(p => p.isAvailable && !p.isRented).map(p => (
            <Marker key={p.id} position={{ lat: p.latitude, lng: p.longitude }} onClick={() => setSelectedProperty(p)}
              label={{ text: `${p.price}€`, className: "text-xs bg-white px-1 py-0.5 rounded shadow" }} />
          ))}
          {selectedProperty && (
            <InfoWindow position={{ lat: selectedProperty.latitude, lng: selectedProperty.longitude }} onCloseClick={() => setSelectedProperty(null)}>
              <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow p-4 max-w-xs">
                <h3 className="font-bold text-lg mb-2">{selectedProperty.name}</h3>
                <p className="text-sm mb-1">Preț: ${selectedProperty.price}</p>
                <p className="text-sm mb-1">{selectedProperty.address}, {selectedProperty.city}</p>
                <Link to={`/properties/${selectedProperty.id}`} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Vezi detalii
                </Link>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default MapSection;
