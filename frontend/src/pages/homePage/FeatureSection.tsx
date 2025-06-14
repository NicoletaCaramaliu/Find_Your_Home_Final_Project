const FeatureSection = () => (
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
);

export default FeatureSection;
