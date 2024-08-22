"use client";

import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, MapPin, Package, User, Clock } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import QRCode  from 'qrcode.react';

const BookingDetails: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as Id<"bookings">;

  const booking = useQuery(api.bookings.getBooking, { bookingId });
  const transitDetails = useQuery(api.transits.getTransitDetails, 
    booking ? { transitId: booking.transitId } : "skip"
  );

  const cancelBookingMutation = useMutation(api.bookings.cancelBooking);

  const handleCancelBooking = async () => {
    if (booking) {
      await cancelBookingMutation({ bookingId: booking._id });
      router.push('/dashboard');
    }
  };

  if (!booking || !transitDetails) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Loading Booking Details...</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const { fromPlanet, toPlanet, departureTime, arrivalTime } = transitDetails;
  const eta = Math.floor((arrivalTime - departureTime) / 3600000);
  const departureDate = new Date(departureTime);
  const arrivalDate = new Date(arrivalTime);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{fromPlanet.name} to {toPlanet.name}</span>
            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
              {booking.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>Estimated Travel Time: {eta} hours</span>
          </div>
          <div className="h-64 w-full flex flex-col items-center">
            <span className='mb-4 text-muted-foreground'>Tap your phone at the scanner at the boarding gate to enter the shuttle.</span>
            <QRCode
              value={`Booking ID: ${booking._id}\nFrom: ${fromPlanet.name}\nTo: ${toPlanet.name}\nDeparture: ${departureDate.toLocaleString()}\nArrival: ${arrivalDate.toLocaleString()}`}
              size={200}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={handleCancelBooking} className="w-full">
            Cancel Booking
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingDetails;
