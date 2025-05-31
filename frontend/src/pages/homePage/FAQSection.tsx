import React, { useEffect, useState } from 'react';
import api from '../../api';

interface Question {
  id: string;
  questionText: string;
  answerText: string;
}

const FAQSection = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/Questions/getPostedQuestions')
      .then(res => setQuestions(res.data))
      .catch(err => {
        console.error('Eroare la încărcarea întrebărilor frecvente:', err);
        setError('Nu am putut încărca întrebările frecvente.');
      });
  }, []);

  return (
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

      <div className="max-w-3xl mx-auto space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : questions.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Nu există întrebări frecvente disponibile.
          </p>
        ) : (
          questions.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <h3 className="font-semibold">{item.questionText}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{item.answerText}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default FAQSection;
