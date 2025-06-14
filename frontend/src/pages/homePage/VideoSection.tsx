import { Link } from 'react-router-dom';

const VideoSection = () => (
  <div className="md:w-3/4 relative">
    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
      <source src="/videos/homePageVideo.mp4" type="video/mp4" />
      Browserul tau nu poate vedea videoclipul.
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
);

export default VideoSection;
