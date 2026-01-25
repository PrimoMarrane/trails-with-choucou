'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import TrailCard from '@/components/TrailCard';
import TrailFilters from '@/components/TrailFilters';

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center">Loading map...</div>,
});

interface Trail {
  id: string;
  name: string;
  description?: string | null;
  difficulty?: string | null;
  dateCompleted?: Date | null;
  distanceKm?: number | null;
  elevationGainM?: number | null;
  location?: string | null;
  tags: string[];
  startLat?: number | null;
  startLng?: number | null;
  endLat?: number | null;
  endLng?: number | null;
  minLat?: number | null;
  maxLat?: number | null;
  minLng?: number | null;
  maxLng?: number | null;
}

export default function TrailsPage() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    minDistance: '',
    maxDistance: '',
    sortBy: 'dateCreated',
    sortOrder: 'desc',
  });

  useEffect(() => {
    fetchTrails();
  }, [filters]);

  const fetchTrails = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`/api/trails?${params.toString()}`);
      const data = await response.json();
      setTrails(data.trails);
    } catch (error) {
      console.error('Error fetching trails:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Trails</h1>
              <p className="text-gray-600 mt-1">
                {trails.length} {trails.length === 1 ? 'trail' : 'trails'} found
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded ${
                    viewMode === 'grid'
                      ? 'bg-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded ${
                    viewMode === 'map'
                      ? 'bg-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Map
                </button>
              </div>
              <Link
                href="/trails/upload"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Upload Trail
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <TrailFilters onFilterChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading trails...</p>
                </div>
              </div>
            ) : trails.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No trails found</h3>
                <p className="mt-1 text-gray-500">
                  Get started by uploading your first trail.
                </p>
                <div className="mt-6">
                  <Link
                    href="/trails/upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Upload Trail
                  </Link>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 gap-6">
                {trails.map((trail) => (
                  <TrailCard key={trail.id} trail={trail} />
                ))}
              </div>
            ) : (
              <div className="h-[calc(100vh-300px)] rounded-lg overflow-hidden shadow-lg">
                <MapView trails={trails} onTrailClick={(id) => window.location.href = `/trails/${id}`} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
