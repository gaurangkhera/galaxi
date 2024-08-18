import React from 'react';
import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
      <nav className="w-full py-4 px-8 flex justify-between items-center bg-opacity-50 bg-black backdrop-blur-md shadow-md">
        <div className="text-2xl font-bold bold">Galaxi</div>
        <div className="space-x-4">
          <a href="#about" className="hover:underline">About</a>
          <a href="#services" className="hover:underline">Services</a>
          <a href="#contact" className="hover:underline">Contact</a>
          <a href="#booking" className="hover:underline">Ticket Book</a>
          <a href="#3dmodel" className="hover:underline">3D Models</a>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center flex-1 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-fade-in">
          <span className="hover:text-indigo-500 transition-all duration-300 transform hover:scale-105 hover:tracking-wide">
            Explore the Universe with
          </span>{' '}
          <span className="bold text-indigo-500 hover:text-indigo-300 transition-all duration-300 transform hover:scale-110">
            Galaxi
          </span>
        </h1>
        <p className="text-lg md:text-2xl mb-8 max-w-2xl text-gray-300 hover:text-blue-500 transition-colors duration-300">
          Your gateway to intergalactic travel using cutting-edge wormhole technology.
        </p>

        <SignInButton>
          <Button className="px-6 py-3 text-lg bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-transform transform hover:scale-105">
            Sign In
          </Button>
        </SignInButton>
      </main>

      <footer className="w-full py-4 text-center text-sm bg-opacity-50 bg-black backdrop-blur-md shadow-md">
        team projectbeta.
      </footer>
    </div>
  );
};

export default LandingPage;
