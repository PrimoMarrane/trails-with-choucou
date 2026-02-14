import { notFound } from 'next/navigation';
import { fetchTrailById } from '@/lib/data';
import TrailDetailClient from '@/components/TrailDetailClient';
import type { Metadata } from 'next';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trail = await fetchTrailById(params.id);
  if (!trail) return { title: 'Trail not found' };
  return {
    title: `${trail.name} | Trails with Chouchou`,
    description: trail.description ?? `Details for ${trail.name}`,
  };
}

export default async function TrailDetailPage({ params }: Props) {
  const trail = await fetchTrailById(params.id);
  if (!trail) notFound();

  return <TrailDetailClient initialTrail={trail} />;
}
