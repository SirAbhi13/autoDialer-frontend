'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContactListDialer from './ContactListDialer';

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

const SpecificContactList = ({ id }) => {
  const [contactList, setContactList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContactList = async () => {
      try {
        const response = await authenticatedFetch(`http://127.0.0.1:8000/api/contact-lists/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch contact list');
        }
        const data = await response.json();
        setContactList(data);
        setIsLoading(false);
      } catch (err) {
        if (err.message === 'Session expired') {
          router.push('/login');
        } else {
          setError('An error occurred while fetching data');
          setIsLoading(false);
        }
      }
    };

    fetchContactList();
  }, [id, router]);

  if (isLoading) {
    return <div className="text-center py-4">Loading contact list...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!contactList) {
    return <div className="text-center py-4">Contact list not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{contactList.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {contactList.contacts.map((contact) => (
          <div key={contact.id} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{`${contact.first_name} ${contact.last_name}`}</h2>
            <p className="text-gray-600 mb-1">{contact.city}</p>
            <p className="text-gray-600">{contact.phone_number}</p>
          </div>
        ))}
      </div>
      <ContactListDialer contactListId={id} contactListName={contactList.name} />
    </div>
  );
};

export default SpecificContactList;