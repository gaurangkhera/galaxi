"use client";

import React from 'react';
import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Navbar from '@/app/navbar';
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
         <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-black hover:text-red-300 transition-colors duration-300">
  Explore the Universe with Galaxi
</h1>

          <p className="text-lg md:text-xl mb-8 text-black">
            Your gateway to intergalactic travel using cutting-edge wormhole technology.
          </p>
          <SignInButton>
            <Button size="lg" className="font-semibold">
              Begin Your Journey
            </Button>
          </SignInButton>
        </motion.div>
      </main>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="flex justify-center pb-8"
      >
        <ChevronDown size={30} className="animate-bounce text-gray-400" />
      </motion.div>

      <footer className="w-full py-4 text-center text-sm bg-black text-white">
  Crafted by team <a href="https://www.projectbeta.club/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">projectbeta</a>
</footer>

    </div>
  );
};

export default LandingPage;
