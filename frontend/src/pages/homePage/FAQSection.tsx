const FAQSection = () => (
  <section id="faq" className="py-16 container mx-auto">
    <h2 className="text-3xl font-bold text-center mb-2">❓ Întrebări frecvente</h2>

    <div className="text-center mb-10">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Nu ai găsit răspunsul?{" "}
        <a href="#contact" className="text-blue-600 hover:underline">
          Contactează-ne!
        </a>
      </p>
    </div>

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
);

export default FAQSection;
