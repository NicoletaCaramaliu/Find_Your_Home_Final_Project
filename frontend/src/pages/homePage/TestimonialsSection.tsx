import { useEffect, useState } from 'react';
import api from '../../api'; 
import { parseError } from '../../utils/parseError'; 
import { useAuth } from '../../hooks/useAuth';

const { user } = useAuth();

interface Testimonial {
  id: string;
  authorName: string;
  content: string;
}

const TestimonialsSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get('/Testimonials/getPostedTestimonials');
        setTestimonials(response.data);
      } catch (error) {
        console.error('Eroare la preluarea testimonialelor:', error);
      }
    };
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) {
      setMessage('Te rugăm să scrii ceva.');
      return;
    }

    try {
      await api.post('/Testimonials/addTestimonial', JSON.stringify(content), {
        headers: { 'Content-Type': 'application/json' }
      });

      setMessage('Testimonial adăugat cu succes! Așteaptă aprobarea.');
      setContent('');
      setShowForm(false);
    } catch (error: unknown) {
      console.error('Eroare:', error);
      const errMessage = parseError(error); 
      setMessage(errMessage);
    }
  };

  return (
    <section id="testimonials" className="py-16 bg-gray-100 dark:bg-gray-900 relative">
      <h2 className="text-3xl font-bold text-center mb-2">🗣 Ce spun clienții noștri?</h2>
      
      { user?.role !== "0" && (
      <div className="text-center mb-10">
        <span
          onClick={() => setShowForm(true)}
          className="text-blue-600 hover:underline cursor-pointer text-sm"
        >
          ➕ Adaugă opinia ta
        </span>
      </div> 
      )}

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {testimonials.length > 0 ? (
          testimonials.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <p className="italic mb-4">"{item.content}"</p>
              <p className="font-bold">{item.authorName}</p>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-600 dark:text-gray-400">Nu există testimoniale aprobate încă.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Scrie opinia ta (poți adăuga o singură dată)</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-32 p-2 border rounded mb-4"
                placeholder="Scrie aici..."
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Anulează</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Trimite</button>
              </div>
            </form>
            {message && <p className="mt-2 text-center text-red-500">{message}</p>}
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
