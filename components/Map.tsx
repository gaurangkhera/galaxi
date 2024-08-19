import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapProps {
  fromCoordinates: { x: number; y: number; z: number };
  toCoordinates: { x: number; y: number; z: number };
  currentLocation: [number, number] | null;
  fromName: string;
  toName: string;
}

const Map: React.FC<MapProps> = ({ fromCoordinates, toCoordinates, currentLocation, fromName, toName }) => {
  // Convert 3D coordinates to 2D for display purposes
  const from2D: [number, number] = [fromCoordinates.x, fromCoordinates.y];
  const to2D: [number, number] = [toCoordinates.x, toCoordinates.y];

  const bounds = L.latLngBounds([from2D, to2D]);
  if (currentLocation) {
    bounds.extend(currentLocation);
  }

  return (
    <MapContainer
      bounds={bounds}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={from2D}>
        <Popup>Departure: {toName}</Popup>
      </Marker>
      <Marker position={to2D}>
        <Popup>Arrival: {fromName}</Popup>
      </Marker>
      {currentLocation && (
        <Marker position={currentLocation}>
          <Popup>Current Location</Popup>
        </Marker>
      )}
      <Polyline positions={[from2D, to2D]} />
    </MapContainer>
  );
};

export default Map;