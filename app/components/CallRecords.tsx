'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  city: string;
  phone_number: string;
}

interface CallRecord {
  id: number;
  contact: Contact;
  created_at: string;
  phone_number: string;
  duration: number;
  cost: string;
  status: string;
  sid: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CallRecord[];
}

const CallRecords: React.FC = () => {
    const [records, setRecords] = useState<CallRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [contactNameInput, setContactNameInput] = useState('');
    const [phoneNumberInput, setPhoneNumberInput] = useState('');
    const [activeContactNameFilter, setActiveContactNameFilter] = useState('');
    const [activePhoneNumberFilter, setActivePhoneNumberFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();
  
    const fetchRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No access token found');
        }
  
        let url = `http://127.0.0.1:8000/api/call-records/?page=${currentPage}`;
        if (activeContactNameFilter) url += `&contact_name=${encodeURIComponent(activeContactNameFilter)}`;
        if (activePhoneNumberFilter) url += `&phone_number=${encodeURIComponent(activePhoneNumberFilter)}`;
  
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch call records');
        }
  
        const data: ApiResponse = await response.json();
        setRecords(data.results);
        setTotalPages(Math.ceil(data.count / 20)); // Assuming 20 items per page
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
        if (err instanceof Error && err.message === 'No access token found') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchRecords();
    }, [currentPage, activeContactNameFilter, activePhoneNumberFilter]);
  
    const handleFilter = (e: React.FormEvent) => {
      e.preventDefault();
      setCurrentPage(1);
      setActiveContactNameFilter(contactNameInput);
      setActivePhoneNumberFilter(phoneNumberInput);
    };
  
    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
    };
  
    if (loading) {
      return <div className="text-center py-4">Loading call records...</div>;
    }
  
    if (error) {
      return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Call Records</h1>
          
          <form onSubmit={handleFilter} className="mb-4 flex gap-4">
            <input
              type="text"
              value={contactNameInput}
              onChange={(e) => setContactNameInput(e.target.value)}
              placeholder="Filter by contact name"
              className="px-2 py-1 border rounded"
            />
            <input
              type="text"
              value={phoneNumberInput}
              onChange={(e) => setPhoneNumberInput(e.target.value)}
              placeholder="Filter by phone number"
              className="px-2 py-1 border rounded"
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Apply Filters
            </button>
          </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Phone Number</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Cost</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">SID</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b">
                <td className="px-4 py-2">{record.id}</td>
                <td className="px-4 py-2">
                  <Link href={`/contacts/${record.contact.id}`} className="text-blue-600 hover:underline">
                    {`${record.contact.first_name} ${record.contact.last_name}`}
                  </Link>
                </td>
                <td className="px-4 py-2">{new Date(record.created_at).toLocaleString()}</td>
                <td className="px-4 py-2">{record.phone_number}</td>
                <td className="px-4 py-2">{record.duration} seconds</td>
                <td className="px-4 py-2">${record.cost}</td>
                <td className="px-4 py-2">{record.status}</td>
                <td className="px-4 py-2">{record.sid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CallRecords;