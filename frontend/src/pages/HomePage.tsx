import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainNavBar from '../components/MainNavBar';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import api from '../api';
import { Property } from '../types/Property'; 

const HomePage = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white font-[Inter]">
      <MainNavBar />

      <section className="relative flex flex-col md:flex-row h-[80vh]">
        <div className="md:w-3/4 relative">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/videos/homePageVideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="bg-black/50 absolute inset-0" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Găsește-ți casa visurilor</h1>
            <p className="text-lg mb-6 max-w-xl">Caută, cumpără sau închiriază rapid locuința perfectă pentru tine. Experiență premium, simplă și eficientă.</p>
            <Link to="/properties" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg transition">
              Vezi toate proprietățile
            </Link>
          </div>
        </div>

        <div className="md:w-1/4 bg-white dark:bg-gray-800 flex items-center justify-center p-2">
          {loadError && <p className="text-red-600">Eroare la încărcarea hărții</p>}
          {!isLoaded ? (
            <p>Se încarcă harta...</p>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              zoom={10}
              center={{ lat: 44.4268, lng: 26.1025 }}
            >
              {properties.map((property) => (
                <Marker
                  key={property.id}
                  position={{ lat: property.latitude, lng: property.longitude }}
                  onClick={() => setSelectedProperty(property)}
                  label={{
                    text: `$${property.price}`,
                    className: "text-xs bg-white px-1 py-0.5 rounded shadow",
                  }}
                />
              ))}

              {selectedProperty && (
                <InfoWindow
                  position={{ lat: selectedProperty.latitude, lng: selectedProperty.longitude }}
                  onCloseClick={() => setSelectedProperty(null)}
                >
                  <div className="p-2">
                    <h3 className="font-bold">{selectedProperty.name}</h3>
                    <p>Preț: ${selectedProperty.price}</p>
                    <p>{selectedProperty.address}, {selectedProperty.city}</p>
                    <Link to={`/properties/${selectedProperty.id}`} className="text-blue-600 hover:underline">Vezi detalii</Link>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </div>
      </section>

      <section className="py-16 container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">🏡 Proprietăți recomandate</h2>
        <Slider {...sliderSettings}>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1">
                <img src={`https://source.unsplash.com/400x300/?house,${item}`} alt={`Property ${item}`} className="h-56 w-full object-cover"/>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Proprietate #{item}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Preț: $XXX,XXX</p>
                  <Link to="/properties" className="text-blue-600 hover:underline text-sm">Vezi detalii</Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
        <h2 className="text-3xl font-bold text-center mb-10">✨ De ce să alegi FindYourHome?</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "🔍", text: "Căutare rapidă" },
            { icon: "🏠", text: "Proprietăți verificate" },
            { icon: "📅", text: "Rezervări online" },
            { icon: "🔔", text: "Notificări în timp real" }
          ].map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-2xl transition">
              <p className="text-5xl mb-4">{item.icon}</p>
              <p className="font-semibold">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gray-100 dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-10">🗣 Ce spun clienții noștri?</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { name: "Andrei", text: "Am găsit apartamentul perfect în mai puțin de o săptămână. Recomand!" },
            { name: "Maria", text: "Platforma e simplă, eficientă și plină de oferte bune." },
            { name: "Ioana", text: "Am închiriat rapid un apartament pentru vacanță. Super experiență!" }
          ].map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <p className="italic mb-4">"{item.text}"</p>
              <p className="font-bold">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">❓ Întrebări frecvente</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: "Cum pot publica o proprietate?", a: "Te poți înregistra gratuit și adăuga anunțul tău în câteva minute." },
            { q: "Este necesară o taxă pentru utilizatori?", a: "Căutarea este gratuită, dar pot exista opțiuni premium pentru promovarea anunțurilor." },
            { q: "Cum pot programa o vizionare?", a: "Contactează direct proprietarul sau folosește sistemul nostru de programare online." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <h3 className="font-semibold">{item.q}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">📢 Gata să-ți găsești locuința visurilor?</h2>
        <p className="mb-6">Vezi toate ofertele noastre și începe căutarea perfectă.</p>
        <Link to="/properties" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
          Vezi proprietățile
        </Link>
      </section>

      <section className="py-16 container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">🌐 Despre FindYourHome</h2>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          FindYourHome este platforma modernă care îți oferă acces la cele mai noi locuințe, programări online și experiențe rapide. Descoperă proprietăți atent selecționate și bucură-te de un proces simplu și eficient.
        </p>
      </section>

      <footer className="bg-gray-800 text-white py-6 text-center">
        <p className="mb-2 font-semibold">© 2025 FindYourHome</p>
        <p className="text-sm">Toate drepturile rezervate | <Link to="/contact" className="underline hover:text-blue-300">Contact</Link></p>
      </footer>
    </div>
  );
};

export default HomePage;
