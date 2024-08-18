"use client";

import React from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav
      className="w-full py-4 px-8 flex justify-between items-center bg-gradient-to-r from-gray-900 via-black to-gray-900 backdrop-blur-md shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href="/" className="text-2xl font-bold bold text-indigo-500 hover:text-red-300">
        Galaxi
      </Link>
      <div className="space-x-4 flex items-center">
        <Link href="/transits" className="hover:text-gray-400 text-white">
          Travel
        </Link>
        <Link href="/dashboard" className="hover:text-gray-400 text-white">
          Dashboard
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </motion.nav>
  );
};

export default Navbar;

