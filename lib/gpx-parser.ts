import { DOMParser } from '@xmldom/xmldom';
import * as toGeoJSON from '@tmcw/togeojson';
import * as turf from '@turf/turf';

export interface ParsedGPX {
  name?: string;
  description?: string;
  coordinates: [number, number, number?][]; // [lng, lat, elevation?]
  distanceKm: number;
  elevationGainM: number;
  elevationLossM: number;
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  startPoint: { lat: number; lng: number };
  endPoint: { lat: number; lng: number };
  timestamps?: Date[];
}

export function parseGPX(gpxContent: string): ParsedGPX {
  // Parse XML
  const parser = new DOMParser();
  const gpxDoc = parser.parseFromString(gpxContent, 'text/xml');
  
  // Convert to GeoJSON
  const geoJson = toGeoJSON.gpx(gpxDoc);
  
  // Extract track data
  let coordinates: [number, number, number?][] = [];
  let timestamps: Date[] = [];
  
  if (geoJson.features && geoJson.features.length > 0) {
    const feature = geoJson.features[0];
    
    if (feature.geometry.type === 'LineString') {
      coordinates = feature.geometry.coordinates as [number, number, number?][];
    } else if (feature.geometry.type === 'MultiLineString') {
      // Flatten multiple line strings
      coordinates = (feature.geometry.coordinates as [number, number, number?][][]).flat();
    }
    
    // Extract timestamps if available
    if (feature.properties?.coordinateProperties?.times) {
      timestamps = feature.properties.coordinateProperties.times.map((t: string) => new Date(t));
    }
  }
  
  if (coordinates.length === 0) {
    throw new Error('No valid track data found in GPX file');
  }
  
  // Calculate distance using Turf.js
  const line = turf.lineString(coordinates);
  const distanceKm = turf.length(line, { units: 'kilometers' });
  
  // Calculate elevation gain and loss
  let elevationGain = 0;
  let elevationLoss = 0;
  
  for (let i = 1; i < coordinates.length; i++) {
    const prevElevation = coordinates[i - 1][2] ?? 0;
    const currentElevation = coordinates[i][2] ?? 0;
    const diff = currentElevation - prevElevation;
    
    if (diff > 0) {
      elevationGain += diff;
    } else {
      elevationLoss += Math.abs(diff);
    }
  }
  
  // Calculate bounds
  const bbox = turf.bbox(line);
  const [minLng, minLat, maxLng, maxLat] = bbox;
  
  // Extract metadata
  const nameElement = gpxDoc.getElementsByTagName('name')[0];
  const descElement = gpxDoc.getElementsByTagName('desc')[0];
  
  const name = nameElement?.textContent || undefined;
  const description = descElement?.textContent || undefined;
  
  return {
    name,
    description,
    coordinates,
    distanceKm: Math.round(distanceKm * 100) / 100,
    elevationGainM: Math.round(elevationGain),
    elevationLossM: Math.round(elevationLoss),
    bounds: {
      minLat,
      maxLat,
      minLng,
      maxLng,
    },
    startPoint: {
      lat: coordinates[0][1],
      lng: coordinates[0][0],
    },
    endPoint: {
      lat: coordinates[coordinates.length - 1][1],
      lng: coordinates[coordinates.length - 1][0],
    },
    timestamps: timestamps.length > 0 ? timestamps : undefined,
  };
}

export function getElevationProfile(coordinates: [number, number, number?][]): { distance: number; elevation: number }[] {
  const profile: { distance: number; elevation: number }[] = [];
  let cumulativeDistance = 0;
  
  for (let i = 0; i < coordinates.length; i++) {
    if (i > 0) {
      const from = turf.point(coordinates[i - 1].slice(0, 2) as [number, number]);
      const to = turf.point(coordinates[i].slice(0, 2) as [number, number]);
      cumulativeDistance += turf.distance(from, to, { units: 'kilometers' });
    }
    
    profile.push({
      distance: Math.round(cumulativeDistance * 100) / 100,
      elevation: Math.round(coordinates[i][2] ?? 0),
    });
  }
  
  return profile;
}
