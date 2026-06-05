"use client"
import dynamic from 'next/dynamic';

const DynamicLeafletMap = dynamic(() => import('./LeafletMap'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center font-medium">Booting Live Satellites...</div>
});

interface HotspotMapProps {
  locations: { name: string, lat: number, lng: number, score: number, reason: string }[];
}

export default function HotspotMap({ locations }: HotspotMapProps) {
  if (!locations || locations.length === 0) return <div className="h-[400px] w-full bg-slate-50 border rounded-lg flex items-center justify-center text-muted-foreground">No geospatial data found.</div>;
  
  return <DynamicLeafletMap locations={locations} />;
}
