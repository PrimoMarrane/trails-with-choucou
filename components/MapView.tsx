'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Trail {
  id: string;
  name: string;
  distanceKm?: number | null;
  difficulty?: string | null;
  startLat?: number | null;
  startLng?: number | null;
  endLat?: number | null;
  endLng?: number | null;
  minLat?: number | null;
  maxLat?: number | null;
  minLng?: number | null;
  maxLng?: number | null;
}

interface TrackPoint {
  lat: number;
  lng: number;
  elevation?: number | null;
}

interface MapViewProps {
  trails?: Trail[];
  selectedTrail?: { trail: Trail; trackPoints: TrackPoint[] };
  onTrailClick?: (trailId: string) => void;
}

function MapBoundsUpdater({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  
  return null;
}

const difficultyColors: { [key: string]: string } = {
  Easy: '#22c55e',
  Moderate: '#3b82f6',
  Hard: '#f97316',
  Expert: '#ef4444',
};

export default function MapView({ trails, selectedTrail, onTrailClick }: MapViewProps) {
  // Calculate bounds for all trails or selected trail
  let bounds: L.LatLngBoundsExpression | null = null;
  
  if (selectedTrail && selectedTrail.trackPoints.length > 0) {
    const coords = selectedTrail.trackPoints.map(tp => [tp.lat, tp.lng] as [number, number]);
    bounds = coords;
  } else if (trails && trails.length > 0) {
    const validTrails = trails.filter(t => 
      t.minLat !== null && t.maxLat !== null && 
      t.minLng !== null && t.maxLng !== null
    );
    
    if (validTrails.length > 0) {
      const allLats = validTrails.flatMap(t => [t.minLat!, t.maxLat!]);
      const allLngs = validTrails.flatMap(t => [t.minLng!, t.maxLng!]);
      
      bounds = [
        [Math.min(...allLats), Math.min(...allLngs)],
        [Math.max(...allLats), Math.max(...allLngs)],
      ];
    }
  }
  
  const defaultCenter: [number, number] = [46.5, 6.5]; // Default to Switzerland
  const defaultZoom = 10;
  
  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {bounds && <MapBoundsUpdater bounds={bounds} />}
      
      {/* Render selected trail with track points */}
      {selectedTrail && selectedTrail.trackPoints.length > 0 && (
        <Polyline
          positions={selectedTrail.trackPoints.map(tp => [tp.lat, tp.lng])}
          color={difficultyColors[selectedTrail.trail.difficulty || ''] || '#3b82f6'}
          weight={4}
          opacity={0.8}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{selectedTrail.trail.name}</h3>
              {selectedTrail.trail.distanceKm && (
                <p className="text-sm">Distance: {selectedTrail.trail.distanceKm} km</p>
              )}
              {selectedTrail.trail.difficulty && (
                <p className="text-sm">Difficulty: {selectedTrail.trail.difficulty}</p>
              )}
            </div>
          </Popup>
        </Polyline>
      )}
      
      {/* Render all trails as simplified lines (without full track points) */}
      {!selectedTrail && trails && trails.map(trail => {
        if (!trail.startLat || !trail.startLng || !trail.endLat || !trail.endLng) {
          return null;
        }
        
        return (
          <Polyline
            key={trail.id}
            positions={[
              [trail.startLat, trail.startLng],
              [trail.endLat, trail.endLng],
            ]}
            color={difficultyColors[trail.difficulty || ''] || '#3b82f6'}
            weight={3}
            opacity={0.6}
            eventHandlers={{
              click: () => onTrailClick?.(trail.id),
            }}
          >
            <Popup>
              <div className="p-2 cursor-pointer" onClick={() => onTrailClick?.(trail.id)}>
                <h3 className="font-bold">{trail.name}</h3>
                {trail.distanceKm && <p className="text-sm">{trail.distanceKm} km</p>}
                <p className="text-xs text-blue-600">Click to view details</p>
              </div>
            </Popup>
          </Polyline>
        );
      })}
    </MapContainer>
  );
}
