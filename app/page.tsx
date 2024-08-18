"use client";

import React from 'react';
import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full py-4 px-8 flex justify-between items-center">
        <div className="text-2xl font-bold">Galaxi</div>
        <div className="space-x-4">
          <a href="#about" className="hover:underline">About</a>
          <a href="#services" className="hover:underline">Services</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                Explore the Universe with Galaxi
              </h1>
              <p className="text-lg md:text-xl mb-8">
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
        <ChevronDown size={30} className="animate-bounce" />
      </motion.div>

      <footer className="w-full py-4 text-center text-sm">
        Crafted by team projectbeta
      </footer>
    </div>
  );
};

export default LandingPage;