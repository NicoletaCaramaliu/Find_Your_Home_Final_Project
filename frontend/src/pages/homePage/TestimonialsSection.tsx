const TestimonialsSection = () => (
  <section id="testimonials" className="py-16 bg-gray-100 dark:bg-gray-900">
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
);

export default TestimonialsSection;
