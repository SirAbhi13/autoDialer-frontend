'use client';

import React from 'react';


const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to AutoDialer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Streamline your contact management and automate your calling process.
          </p>
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Get Started
            </h2>
            <p className="text-gray-600 mb-6">
              AutoDialer helps you manage your contacts and automate your outreach. 
              Create contact lists, schedule calls, and improve your communication efficiency.
            </p>
            <a 
              href="/contactlists" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              View Contact Lists
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;