import React, { useEffect, useState } from 'react';
import MainNavBar from '../../components/MainNavBar';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from '../../api';
import { Property } from '../../types/Property'; 
import RecommendedProperties from './RecommendedProperties';
import VideoSection from './VideoSection';
import MapSection from './MapSection';
import FeatureSection from './FeatureSection';
import TestimonialsSection from './TestimonialsSection';
import FAQSection from './FAQSection';
import CallToActionSection from './CallToActionSection';
import AboutSection from './AboutSection';
import Footer from './Footer';


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

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white font-[Inter]">
      <MainNavBar />
        <div className="fixed top-20 left-4 z-50">
            <button
                className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                ☰
            </button>

            {menuOpen && (
                <div className="mt-2 bg-white dark:bg-gray-800 rounded shadow p-2 flex flex-col space-y-2">
                <a href="#recommended" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>🏡 Recomandate</a>
                <a href="#testimonials" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>🗣 Testimoniale</a>
                <a href="#faq" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>❓ Întrebări</a>
                <a href="#contact" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>📞 Contact</a>
                </div>
            )}
            </div>


      <section className="relative flex flex-col md:flex-row h-[70vh] max-w-7xl mx-auto">
        <VideoSection />
        <MapSection />
      </section>

      <section id="recommended">
        <RecommendedProperties />
      </section>

      <FeatureSection />
      <TestimonialsSection />
      <FAQSection />
      <CallToActionSection />
      <AboutSection />
      <Footer /> *
    </div>
  );
};

export default HomePage;
