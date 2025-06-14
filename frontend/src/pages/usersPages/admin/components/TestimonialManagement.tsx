import React, { useEffect, useState } from 'react';
import api from '../../../../api';
import { parseError } from '../../../../utils/parseError';

interface Testimonial {
  id: string;
  authorName: string;
  content: string;
  posted: boolean;
}

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'posted' | 'unposted'>('all');

  useEffect(() => {
    api.get('/Testimonials/getAllTestimonials')
      .then(res => setTestimonials(res.data))
      .catch(console.error);
  }, []);

  const handlePost = (id: string) => {
    api.patch(`/Testimonials/postTestimonial?testimonialId=${id}`)
      .then(() => {
        setTestimonials(prev => prev.map(t => t.id === id ? { ...t, posted: true } : t));
        setErrorMessage(null);
      })
      .catch(err => {
        const message = parseError(err);
        if (message === "MAX_THREE_POSTED_TESTIMONIALS") {
          setErrorMessage("Poți adăuga doar 3 testimoniale.");
        } else {
          setErrorMessage(message);
        }
      });
  };

  const handleUnpost = (id: string) => {
    api.patch(`/Testimonials/unpostTestimonial?testimonialId=${id}`)
      .then(() => setTestimonials(prev => prev.map(t => t.id === id ? { ...t, posted: false } : t)))
      .catch(console.error);
  };

  const handleDelete = (id: string) => {
    api.delete(`/Testimonials/deleteTestimonial?testimonialId=${id}`)
      .then(() => setTestimonials(prev => prev.filter(t => t.id !== id)))
      .catch(console.error);
  };

  const filteredTestimonials = testimonials.filter(t =>
    (filterStatus === 'all' || (filterStatus === 'posted' ? t.posted : !t.posted)) &&
    (t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
     t.authorName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Testimoniale (Alege maxim 3 pentru a fi afișate pe pagina Acasă)</h2>

      {errorMessage && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{errorMessage}</div>
      )}

      <div className="mb-4 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Caută după conținut sau nume autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'posted' | 'unposted')}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="all">Toate</option>
          <option value="posted">Postate</option>
          <option value="unposted">Nepostate</option>
        </select>
      </div>

      {filteredTestimonials.length === 0 ? (
        <p>Nu există testimoniale disponibile.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTestimonials.map((t) => (
            <div key={t.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 flex flex-col justify-between">
              <p className="italic mb-4">"{t.content}"</p>
              <p className="font-bold">{t.authorName}</p>
              <div className="flex justify-end space-x-2 mt-4">
                {t.posted ? (
                  <button
                    onClick={() => handleUnpost(t.id)}
                    className="text-yellow-600 hover:text-yellow-800 text-sm"
                  >
                    Șterge postarea
                  </button>
                ) : (
                  <button
                    onClick={() => handlePost(t.id)}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    Postează
                  </button>
                )}
                {confirmDeleteId === t.id ? (
                  <div className="absolute bg-yellow-100 text-yellow-800 p-2 rounded shadow">
                    <p>Ești sigur că vrei să ștergi?</p>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                      >
                        Da
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 text-xs"
                      >
                        Nu
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(t.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Șterge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialManagement;
