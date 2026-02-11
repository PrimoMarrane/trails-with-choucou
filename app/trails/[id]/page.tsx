'use client';

import { useState, useEffect, useCallback } from 'react';
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
  dateCompleted?: Date | string | null;
  distanceKm?: number | null;
  elevationGainM?: number | null;
  elevationLossM?: number | null;
  location?: string | null;
  tags: string[];
  gpxFileUrl: string;
  startLat?: number | null;
  startLng?: number | null;
  endLat?: number | null;
  endLng?: number | null;
  minLat?: number | null;
  maxLat?: number | null;
  minLng?: number | null;
  maxLng?: number | null;
  trackPoints: {
    lat: number;
    lng: number;
    elevation?: number | null;
  }[];
}

const emptyEditForm = {
  name: '',
  description: '',
  difficulty: '',
  dateCompleted: '',
  tags: '',
  location: '',
};

export default function TrailDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trail, setTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState(emptyEditForm);

  const fetchTrail = useCallback(async () => {
    if (!params.id) return;
    try {
      const response = await fetch(`/api/trails/${params.id}`);
      const data = await response.json();
      const raw = data.trail;
      if (!raw) {
        setTrail(null);
        return;
      }
      // Normalize numeric fields (API may return numbers as strings)
      const num = (v: unknown): number | null =>
        v == null || v === '' ? null : typeof v === 'number' && !Number.isNaN(v) ? v : Number(v) || null;
      setTrail({
        ...raw,
        distanceKm: num(raw.distanceKm),
        elevationGainM: num(raw.elevationGainM),
        elevationLossM: num(raw.elevationLossM),
        trackPoints: Array.isArray(raw.trackPoints)
          ? raw.trackPoints.map((tp: { lat: number; lng: number; elevation?: number | null }) => ({
              lat: tp.lat,
              lng: tp.lng,
              elevation: tp.elevation ?? null,
            }))
          : [],
      });
    } catch (error) {
      console.error('Error fetching trail:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      fetchTrail();
    }
  }, [params.id, fetchTrail]);

  const startEditing = () => {
    if (!trail) return;
    setEditForm({
      name: trail.name,
      description: trail.description ?? '',
      difficulty: trail.difficulty ?? '',
      dateCompleted: trail.dateCompleted
        ? format(new Date(trail.dateCompleted), 'yyyy-MM-dd')
        : '',
      tags: trail.tags?.length ? trail.tags.join(', ') : '',
      location: trail.location ?? '',
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm(emptyEditForm);
  };

  const handleSave = async () => {
    if (!trail || saving) return;
    setSaving(true);
    try {
      const tags = editForm.tags
        ? editForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];
      const response = await fetch(`/api/trails/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name || trail.name,
          description: editForm.description || null,
          difficulty: editForm.difficulty || null,
          dateCompleted: editForm.dateCompleted || null,
          tags,
          location: editForm.location || null,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Update failed');
      }
      await fetchTrail();
      setIsEditing(false);
      setEditForm(emptyEditForm);
    } catch (error) {
      console.error('Error saving trail:', error);
      alert(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setSaving(false);
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
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEditing}
                    disabled={saving}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={startEditing}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEditing ? (
          /* Edit form */
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Edit trail</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe your trail..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={editForm.difficulty}
                onChange={(e) => setEditForm((f) => ({ ...f, difficulty: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date completed</label>
              <input
                type="date"
                value={editForm.dateCompleted}
                onChange={(e) => setEditForm((f) => ({ ...f, dateCompleted: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Swiss Alps"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                value={editForm.tags}
                onChange={(e) => setEditForm((f) => ({ ...f, tags: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="hiking, mountain, scenic (comma-separated)"
              />
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div key={`trail-map-${trail.id}`} className="h-96">
                  <MapView selectedTrail={{ trail, trackPoints: trail.trackPoints }} />
                </div>
              </div>

              {/* Description */}
              {trail.description && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{trail.description}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Trail Stats</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Difficulty</p>
                    <p className="text-lg font-semibold text-gray-900">{trail.difficulty || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {trail.distanceKm != null ? `${Number(trail.distanceKm).toFixed(2)} km` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Elevation Gain</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {trail.elevationGainM != null ? `${Number(trail.elevationGainM).toFixed(0)} m` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Elevation Loss</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {trail.elevationLossM != null ? `${Number(trail.elevationLossM).toFixed(0)} m` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {trail.dateCompleted
                        ? format(new Date(trail.dateCompleted), 'MMM d, yyyy')
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {trail.tags && trail.tags.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Tags</h2>
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
        )}
      </div>
    </div>
  );
}
