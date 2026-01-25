'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: '',
    dateCompleted: '',
    tags: '',
    location: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a GPX file');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('difficulty', formData.difficulty);
      data.append('dateCompleted', formData.dateCompleted);
      data.append('tags', formData.tags);
      data.append('location', formData.location);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      
      const result = await response.json();
      router.push(`/trails/${result.trail.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">
          GPX File *
        </label>
        <input
          type="file"
          accept=".gpx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          Upload your trail GPX file
        </p>
      </div>
      
      {/* Trail Name */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Trail Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Leave empty to use GPX metadata"
        />
      </div>
      
      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Describe your trail experience..."
        />
      </div>
      
      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Difficulty
        </label>
        <select
          value={formData.difficulty}
          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Hard">Hard</option>
          <option value="Expert">Expert</option>
        </select>
      </div>
      
      {/* Date Completed */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Date Completed
        </label>
        <input
          type="date"
          value={formData.dateCompleted}
          onChange={(e) => setFormData({ ...formData, dateCompleted: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Location
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="e.g., Swiss Alps, Mont Blanc"
        />
      </div>
      
      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Tags
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="hiking, mountain, scenic (comma-separated)"
        />
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload Trail'}
      </button>
    </form>
  );
}
