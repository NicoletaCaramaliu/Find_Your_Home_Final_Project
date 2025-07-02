import React, { useState } from 'react';
import MainNavBar from '../../../components/MainNavBar';
import Sidebar from './components/Sidebar';
import UserManagement from './components/UserManagement';
import PropertyManagement from './components/PropertyManagement';
import ReviewManagement from './components/ReviewManagement';
import TestimonialManagement from './components/TestimonialManagement';
import QuestionManagement from './components/QuestionManagement';

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState('users');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
      <MainNavBar />

      <div className="flex flex-1">
        <Sidebar onSelect={setSelectedSection} />

        <main className="flex-1 p-6 bg-white dark:bg-gray-600 rounded-lg shadow-md mx-4 my-4">
          {selectedSection === 'users' && <UserManagement />}
          {selectedSection === 'properties' && <PropertyManagement />}
          {selectedSection === 'reviews' && <ReviewManagement />}
          {selectedSection === 'testimonials' && <TestimonialManagement />}
          {selectedSection === 'questions' && <QuestionManagement />}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
