'use client';

import React from 'react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link href="/">Contact Manager</Link>
        </div>
        <div className="flex items-center">
          <Link href="/contactlists" className="text-white mr-4 hover:text-gray-300">
            Contact Lists
          </Link>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;