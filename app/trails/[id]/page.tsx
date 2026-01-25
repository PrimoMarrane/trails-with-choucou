'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="h-96 flex items-center justify-center">Loading map...</div>,
});

interface Trail {
  id: string;
  name: string;
  description?: string | null;
  difficulty?: string | null;
  dateCompleted?: Date | null;
  distanceKm?: number | null;
  elevationGainM?: number | null;
  elevationLossM?: number | null;
  location?: string | null;
  tags: string[];
  gpxFileUrl: string;
  trackPoints: {
    lat: number;
    lng: number;
    elevation?: number | null;
  }[];
}

export default function TrailDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trail, setTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchTrail();
    }
  }, [params.id]);

  const fetchTrail = async () => {
    try {
      const response = await fetch(`/api/trails/${params.id}`);
      const data = await response.json();
      setTrail(data.trail);
    } catch (error) {
      console.error('Error fetching trail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trail? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/trails/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/trails');
      }
    } catch (error) {
      console.error('Error deleting trail:', error);
      alert('Failed to delete trail');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trail...</p>
        </div>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trail not found</h1>
          <Link href="/trails" className="text-primary-600 hover:text-primary-700">
            Back to trails
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/trails" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{trail.name}</h1>
                {trail.location && (
                  <p className="text-gray-600 mt-1">{trail.location}</p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href={trail.gpxFileUrl}
                download
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Download GPX
              </a>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96">
                <MapView selectedTrail={{ trail, trackPoints: trail.trackPoints }} />
              </div>
            </div>

            {/* Description */}
            {trail.description && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{trail.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Trail Stats</h2>
              <div className="space-y-4">
                {trail.difficulty && (
                  <div>
                    <p className="text-sm text-gray-600">Difficulty</p>
                    <p className="text-lg font-semibold">{trail.difficulty}</p>
                  </div>
                )}
                
                {trail.distanceKm !== null && (
                  <div>
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="text-lg font-semibold">{trail.distanceKm.toFixed(2)} km</p>
                  </div>
                )}
                
                {trail.elevationGainM !== null && (
                  <div>
                    <p className="text-sm text-gray-600">Elevation Gain</p>
                    <p className="text-lg font-semibold">{trail.elevationGainM.toFixed(0)} m</p>
                  </div>
                )}
                
                {trail.elevationLossM !== null && (
                  <div>
                    <p className="text-sm text-gray-600">Elevation Loss</p>
                    <p className="text-lg font-semibold">{trail.elevationLossM.toFixed(0)} m</p>
                  </div>
                )}
                
                {trail.dateCompleted && (
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-lg font-semibold">
                      {format(new Date(trail.dateCompleted), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {trail.tags && trail.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {trail.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
