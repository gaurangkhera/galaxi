"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


export default function TransitApp() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const router = useRouter();
  const currentUser = useQuery(api.users.getUserByEmail, 
    isUserLoaded && userEmail ? { email: userEmail } : 'skip'
  );
  const [selectedFromPlanet, setSelectedFromPlanet] = useState<Id<'planets'> | null>(null);
  const [selectedToPlanet, setSelectedToPlanet] = useState<Id<'planets'> | null>(null);
  const [selectedTransit, setSelectedTransit] = useState<Id<'transits'> | null>(null);
  const [bookingType, setBookingType] = useState<'passenger' | 'cargo'>('passenger');
  const [quantity, setQuantity] = useState(1);

  const planets = useQuery(api.planets.listPlanets);
  const transits = useQuery(api.transits.listTransits, { 
    fromPlanetId: selectedFromPlanet || undefined,
    toPlanetId: selectedToPlanet || undefined 
  });
  const userBookings = useQuery(api.bookings.listUserBookings, 
    currentUser ? { userId: currentUser._id as Id<'users'> } : 'skip'
  );

  const createBooking = useMutation(api.bookings.createBooking);
  const cancelBooking = useMutation(api.bookings.cancelBooking);
  
  const getPlanetName = (planetId: Id<'planets'>) => {
    return planets?.find(planet => planet._id === planetId)?.name || 'Unknown';
  };

  const handleCreateBooking = async () => {

    //@ts-ignore
    if(!currentUser.stripeId) {

      await router.push('/pricing');
      return;
    }

    if (selectedTransit) {
      const promise = createBooking({
        //@ts-ignore
        userId: currentUser._id as Id<"users">,
        transitId: selectedTransit,
        bookingType,
        quantity
      });

      toast.promise(promise, {
        success: "Transit booked successfully.",
        error: "Failed to book transit",
        loading: "Booking transit..."
      })

      router.push('/dashboard')
      
    }
  };

  const handleCancelBooking = (bookingId: Id<'bookings'>) => {
    cancelBooking({ bookingId });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Intergalactic Transit Booking System</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Search Transits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-2">
            <Select onValueChange={(value) => setSelectedFromPlanet(value as Id<'planets'>)}>
              <SelectTrigger>
                <SelectValue placeholder="From Planet" />
              </SelectTrigger>
              <SelectContent>
                {planets?.map((planet: any) => (
                  <SelectItem key={planet._id} value={planet._id}>
                    {planet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setSelectedToPlanet(value as Id<'planets'>)}>
              <SelectTrigger>
                <SelectValue placeholder="To Planet" />
              </SelectTrigger>
              <SelectContent>
                {planets?.map((planet: any) => (
                  <SelectItem key={planet._id} value={planet._id}>
                    {planet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Available Transits</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Available Seats</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transits?.map((transit: any) => (
                <TableRow key={transit._id}>
                  <TableCell>{getPlanetName(transit.fromPlanetId)}</TableCell>
                  <TableCell>{getPlanetName(transit.toPlanetId)}</TableCell>
                  <TableCell>{new Date(transit.departureTime).toLocaleString()}</TableCell>
                  <TableCell>{new Date(transit.arrivalTime).toLocaleString()}</TableCell>
                  <TableCell>{transit.availableSeats}</TableCell>
                  <TableCell>
                  {selectedTransit === transit._id ? (
  <Button onClick={() => setSelectedTransit(null)}>Deselect</Button>
) : (
  <Button onClick={() => setSelectedTransit(transit._id)}>Select</Button>
)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Create Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-2">
            <Select value={bookingType} onValueChange={(value) => setBookingType(value as 'passenger' | 'cargo')}>
              <SelectTrigger>
                <SelectValue placeholder="Booking Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passenger">Passenger</SelectItem>
                <SelectItem value="cargo">Cargo</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <Button onClick={handleCreateBooking} disabled={!selectedTransit}>
              Create Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}