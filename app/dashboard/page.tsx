"use client";

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { CalendarDays, MapPin, Package, User } from 'lucide-react';

interface Planet {
  _id: Id<"planets">;
  name: string;
}

interface Transit {
  _id: Id<"transits">;
  departureTime: number;
  arrivalTime: number;
  fromPlanetId: Id<"planets">;
  toPlanetId: Id<"planets">;
}

interface Booking {
  _id: Id<"bookings">;
  status: string;
  bookingType: string;
  quantity: number;
  transitId: Id<"transits">;
}

const BookingCard: React.FC<{ booking: Booking; transit: Transit; fromPlanet: Planet; toPlanet: Planet }> = ({ booking, transit, fromPlanet, toPlanet }) => {
  const departureDate = new Date(transit.departureTime);
  const arrivalDate = new Date(transit.arrivalTime);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{fromPlanet.name} to {toPlanet.name}</span>
          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
            {booking.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>Departure: {departureDate.toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4" />
          <span>Arrival: {arrivalDate.toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          {booking.bookingType === 'passenger' ? (
            <User className="mr-2 h-4 w-4" />
          ) : (
            <Package className="mr-2 h-4 w-4" />
          )}
          <span>{booking.bookingType}: {booking.quantity}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/booking/${booking._id}`} passHref>
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const BookingCardSkeleton: React.FC = () => (
  <Card className="w-full max-w-md">
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-20" />
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

export default function Dashboard() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  const currentUser = useQuery(api.users.getUserByEmail, 
    isUserLoaded && userEmail ? { email: userEmail } : 'skip'
  );

  const userBookings = useQuery(api.bookings.listUserBookings, 
    currentUser ? { userId: currentUser._id } : 'skip'
  );

  const transitIds = userBookings?.map(booking => booking.transitId) ?? [];
  const transits = useQuery(api.transits.getTransits, { transitIds });
  
  const planetIds = transits?.flatMap(transit => [transit.fromPlanetId, transit.toPlanetId]) ?? [];
  const planets = useQuery(api.planets.getPlanets, { planetIds });

  const isLoading = !userBookings || !transits || !planets;

  const renderBookingCards = () => {
    if (isLoading) {
      return [...Array(3)].map((_, index) => <BookingCardSkeleton key={index} />);
    }

    if (userBookings.length === 0) {
      return (
        <div className="col-span-full text-center py-4">
          <p>No bookings found. Ready to plan your next interstellar adventure?</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>Book New Transit</Button>
          </Link>
        </div>
      );
    }

    return userBookings.map((booking) => {
      const transit = transits.find(t => t._id === booking.transitId);
      const fromPlanet = planets.find(p => p._id === transit?.fromPlanetId);
      const toPlanet = planets.find(p => p._id === transit?.toPlanetId);

      if (!transit || !fromPlanet || !toPlanet) {
        return null;
      }

      return (
        <BookingCard
          key={booking._id}
          booking={booking}
          transit={transit}
          fromPlanet={fromPlanet}
          toPlanet={toPlanet}
        />
      );
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Travel Dashboard</h1>
        <p className="text-lg mt-2">Your upcoming journeys at a glance</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderBookingCards()}
      </div>

      {!isLoading && userBookings && userBookings.length > 0 && (
        <div className="text-center mt-8">
          <Link href="/" className="inline-block">
            <Button variant="outline">Book New Transit</Button>
          </Link>
        </div>
      )}
    </div>
  );
}