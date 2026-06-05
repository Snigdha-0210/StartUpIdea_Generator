"use client"
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icons in Next.js (though we are using CircleMarker)
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src
});
L.Marker.prototype.options.icon = DefaultIcon;

function BoundsFitter({ markers }: { markers: {lat: number, lng: number}[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, markers]);
  return null;
}

interface LeafletMapProps {
  locations: { name: string, lat: number, lng: number, score: number, reason: string }[];
}

export default function LeafletMap({ locations }: LeafletMapProps) {
  const defaultCenter: [number, number] = [20.5937, 78.9629]; // India

  return (
    <MapContainer 
      center={locations[0] ? [locations[0].lat, locations[0].lng] : defaultCenter} 
      zoom={4} 
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem', minHeight: '400px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc, i) => (
        <CircleMarker
          key={i}
          center={[loc.lat, loc.lng]}
          pathOptions={{ fillColor: '#ef4444', color: '#ef4444', weight: 2, fillOpacity: 0.4 }}
          radius={loc.score > 80 ? 30 : loc.score > 60 ? 20 : 10} // Size based on opportunity score!
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            <div className="font-sans text-sm p-1 max-w-[200px]">
              <strong className="block text-base">{loc.name}</strong>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded font-bold my-1 text-xs">Score: {loc.score}/100</span>
              <p className="text-gray-600 mt-1 text-xs whitespace-pre-wrap">{loc.reason}</p>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
      <BoundsFitter markers={locations} />
    </MapContainer>
  );
}
