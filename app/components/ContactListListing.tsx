'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

const ContactListComponent = () => {
  const [contactLists, setContactLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContactLists = async () => {
      try {
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/contact-lists/');
        if (!response.ok) {
          throw new Error('Failed to fetch contact lists');
        }
        const data = await response.json();
        setContactLists(data);
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

    fetchContactLists();
  }, [router]);

  if (isLoading) {
    return <div className="text-center py-4">Loading contact lists...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Contact Lists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contactLists.map((list) => (
          <Link href={`/contactlists/${list.id}`} key={list.id}>
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">{list.name}</h2>
              <p className="text-gray-600">{list.contacts.length} contacts</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContactListComponent;