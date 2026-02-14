import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trails with Chouchou',
  description:
    'Your personal trail management system. Upload, visualize, and analyze your hiking adventures.',
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-5xl font-bold mb-6">Trails with Chouchou</h1>
          <p className="text-xl mb-8 text-primary-100">
            Your personal trail management system. Upload, visualize, and analyze your hiking adventures.
          </p>
          <div className="flex gap-4">
            <Link
              href="/trails/upload"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Upload Trail
            </Link>
            <Link
              href="/trails"
              className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors border border-primary-500"
            >
              View All Trails
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Maps</h3>
            <p className="text-gray-600">
              Visualize your trails on beautiful interactive maps powered by OpenStreetMap
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Trail Analytics</h3>
            <p className="text-gray-600">
              Track your progress with detailed statistics and beautiful charts
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
            <p className="text-gray-600">
              Find trails quickly with powerful search and filtering options
            </p>
          </div>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/analytics" className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4">View Analytics</h3>
              <p className="text-gray-600 mb-4">
                See your trail statistics, monthly progress, and difficulty distribution
              </p>
              <span className="text-primary-600 font-semibold">View Dashboard →</span>
            </Link>
            
            <Link href="/trails" className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4">Browse Trails</h3>
              <p className="text-gray-600 mb-4">
                Explore your trail collection with interactive maps and filters
              </p>
              <span className="text-primary-600 font-semibold">View Trails →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
