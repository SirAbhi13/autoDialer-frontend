'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import {Contacttype} from '../types'

// Define the shape of a contact
// interface Contact {
//   id: number;
//   first_name: string;
//   last_name: string;
//   city: string;
//   phone_number: string;
// }

// Utility function for authenticated API calls
const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Token might be expired
    localStorage.removeItem('accessToken');
    throw new Error('Session expired');
  }

  return response;
};

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contacttype[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await authenticatedFetch('http://127.0.0.1:8000/api/contacts/');
        if (!response.ok) {
          throw new Error('Failed to fetch contacts');
        }
        const data: Contacttype[] = await response.json();
        setContacts(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error && err.message === 'Session expired') {
          // Redirect to login page if session expired
          router.push('/login');
        } else {
          setError('An error occurred while fetching contacts');
          setIsLoading(false);
        }
      }
    };

    fetchContacts();
  }, [router]);

  if (isLoading) {
    return <div className="text-center py-4">Loading contacts...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Contacts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <Link href={`/contacts/${contact.id}`} key={contact.id}>
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">{`${contact.first_name} ${contact.last_name}`}</h2>
              <p className="text-gray-600 mb-1">{contact.city}</p>
              <p className="text-gray-600">{contact.phone_number}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContactList;