import Link from 'next/link';
import UploadForm from '@/components/UploadForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload Trail | Trails with Chouchou',
  description: 'Upload a GPX file to add a new trail to your collection.',
};

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/trails"
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Upload Trail</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Add a New Trail</h2>
            <p className="text-gray-600">
              Upload a GPX file to add a new trail to your collection. The system will automatically
              extract distance, elevation, and route information from the file.
            </p>
          </div>
          
          <UploadForm />
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Tips:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>GPX files can be exported from most GPS devices and apps like Strava, Garmin Connect, etc.</li>
              <li>If you don't provide a trail name, the system will use the name from the GPX file metadata.</li>
              <li>Tags help you organize and search for trails later (e.g., "hiking", "scenic", "challenging").</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
