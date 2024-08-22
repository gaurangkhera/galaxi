import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

const Navbar = () => {

  return (
    <nav className="w-full py-4 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Galaxi.
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
          <Link href='/transits'>Available Transits</Link>
          <Link href='/dashboard'>Dashboard</Link>

          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode='modal'>
              <Button>
                Sign in
              </Button>
            </SignInButton>
          </SignedOut>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;