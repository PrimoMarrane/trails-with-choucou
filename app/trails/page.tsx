import { fetchTrails } from '@/lib/data';
import TrailsContent from '@/components/TrailsContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Trails | Trails with Chouchou',
  description: 'Browse, filter and map all your hiking trails.',
};

export default async function TrailsPage() {
  const trails = await fetchTrails();

  return (
    <div className="min-h-screen bg-gray-50">
      <TrailsContent initialTrails={trails} />
    </div>
  );
}
