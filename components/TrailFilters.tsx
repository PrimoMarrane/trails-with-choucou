'use client';

import { useState } from 'react';

interface TrailFiltersProps {
  onFilterChange: (filters: {
    search: string;
    difficulty: string;
    minDistance: string;
    maxDistance: string;
    sortBy: string;
    sortOrder: string;
  }) => void;
}

export default function TrailFilters({ onFilterChange }: TrailFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    minDistance: '',
    maxDistance: '',
    sortBy: 'dateCreated',
    sortOrder: 'desc',
  });

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      difficulty: '',
      minDistance: '',
      maxDistance: '',
      sortBy: 'dateCreated',
      sortOrder: 'desc',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Filters</h2>
        <button
          onClick={handleReset}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Reset
        </button>
      </div>
      
      {/* Search */}
      <div>
        <label className="block text-sm font-medium mb-2">Search</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          placeholder="Search trails..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium mb-2">Difficulty</label>
        <select
          value={filters.difficulty}
          onChange={(e) => handleChange('difficulty', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Hard">Hard</option>
          <option value="Expert">Expert</option>
        </select>
      </div>
      
      {/* Distance Range */}
      <div>
        <label className="block text-sm font-medium mb-2">Distance (km)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={filters.minDistance}
            onChange={(e) => handleChange('minDistance', e.target.value)}
            placeholder="Min"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="number"
            value={filters.maxDistance}
            onChange={(e) => handleChange('maxDistance', e.target.value)}
            placeholder="Max"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      
      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium mb-2">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="dateCreated">Date Added</option>
          <option value="dateCompleted">Date Completed</option>
          <option value="name">Name</option>
          <option value="distanceKm">Distance</option>
          <option value="elevationGainM">Elevation Gain</option>
        </select>
      </div>
      
      {/* Sort Order */}
      <div>
        <label className="block text-sm font-medium mb-2">Order</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleChange('sortOrder', 'asc')}
            className={`flex-1 py-2 px-4 rounded-lg ${
              filters.sortOrder === 'asc'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ascending
          </button>
          <button
            onClick={() => handleChange('sortOrder', 'desc')}
            className={`flex-1 py-2 px-4 rounded-lg ${
              filters.sortOrder === 'desc'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Descending
          </button>
        </div>
      </div>
    </div>
  );
}
