'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    throw new Error('Session expired');
  }

  return response;
};

const SpecificContact = ({ id }) => {
  const [contact, setContact] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await authenticatedFetch(`http://127.0.0.1:8000/api/contacts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch contact');
        }
        const data = await response.json();
        setContact(data);
        setIsLoading(false);
      } catch (err) {
        if (err.message === 'Session expired') {
          router.push('/login');
        } else {
          setError('An error occurred while fetching the contact');
          setIsLoading(false);
        }
      }
    };

    fetchContact();
  }, [id, router]);

  if (isLoading) {
    return <div className="text-center py-4">Loading contact...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!contact) {
    return <div className="text-center py-4">Contact not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">{`${contact.first_name} ${contact.last_name}`}</h1>
        <div className="space-y-2">
          <p><span className="font-semibold">ID:</span> {contact.id}</p>
          <p><span className="font-semibold">City:</span> {contact.city}</p>
          <p><span className="font-semibold">Phone Number:</span> {contact.phone_number}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default SpecificContact;