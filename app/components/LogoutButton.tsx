'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear the access token from localStorage
      localStorage.removeItem('accessToken');

      // If you have a refresh token, clear that too
      localStorage.removeItem('refreshToken');

      // Optionally, you can make a call to a logout endpoint on your server
      // This depends on your backend implementation
      // const response = await fetch('http://127.0.0.1:8000/api/logout/', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   }
      // });

      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;