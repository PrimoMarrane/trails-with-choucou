'use client';

import Link from 'next/link';
import { format } from 'date-fns';

interface TrailCardProps {
  trail: {
    id: string;
    name: string;
    description?: string | null;
    difficulty?: string | null;
    dateCompleted?: Date | string | null;
    distanceKm?: number | null;
    elevationGainM?: number | null;
    location?: string | null;
    tags: string[];
  };
}

const difficultyColors: { [key: string]: string } = {
  Easy: 'bg-green-100 text-green-800',
  Moderate: 'bg-blue-100 text-blue-800',
  Hard: 'bg-orange-100 text-orange-800',
  Expert: 'bg-red-100 text-red-800',
};

export default function TrailCard({ trail }: TrailCardProps) {
  return (
    <Link href={`/trails/${trail.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900">{trail.name}</h3>
          {trail.difficulty && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[trail.difficulty] || 'bg-gray-100 text-gray-800'}`}>
              {trail.difficulty}
            </span>
          )}
        </div>
        
        {trail.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {trail.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-3">
          {trail.distanceKm !== null && trail.distanceKm !== undefined && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {trail.distanceKm.toFixed(1)} km
            </div>
          )}
          
          {trail.elevationGainM !== null && trail.elevationGainM !== undefined && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {trail.elevationGainM.toFixed(0)} m
            </div>
          )}
          
          {trail.location && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {trail.location}
            </div>
          )}
        </div>
        
        {trail.dateCompleted && (
          <div className="text-xs text-gray-500">
            Completed: {format(new Date(trail.dateCompleted), 'MMM d, yyyy')}
          </div>
        )}
        
        {trail.tags && trail.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {trail.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
