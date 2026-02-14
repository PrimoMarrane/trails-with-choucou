import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/* ---------- Trails list ---------- */

const ALLOWED_SORT_COLUMNS = [
  'dateCreated',
  'dateCompleted',
  'name',
  'distanceKm',
  'elevationGainM',
] as const;

type SortColumn = (typeof ALLOWED_SORT_COLUMNS)[number];

export interface TrailListFilters {
  search?: string;
  difficulty?: string;
  minDistance?: string;
  maxDistance?: string;
  sortBy?: string;
  sortOrder?: string;
}

export async function fetchTrails(filters: TrailListFilters = {}) {
  const { search, difficulty, minDistance, maxDistance } = filters;

  const sortBy: SortColumn = ALLOWED_SORT_COLUMNS.includes(
    filters.sortBy as SortColumn,
  )
    ? (filters.sortBy as SortColumn)
    : 'dateCreated';

  const sortOrder: 'asc' | 'desc' =
    filters.sortOrder === 'asc' ? 'asc' : 'desc';

  const where: Prisma.TrailWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (difficulty) {
    where.difficulty = difficulty;
  }

  if (minDistance || maxDistance) {
    where.distanceKm = {};
    if (minDistance) where.distanceKm.gte = parseFloat(minDistance);
    if (maxDistance) where.distanceKm.lte = parseFloat(maxDistance);
  }

  const trails = await prisma.trail.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    select: {
      id: true,
      name: true,
      description: true,
      difficulty: true,
      dateCreated: true,
      dateCompleted: true,
      distanceKm: true,
      elevationGainM: true,
      elevationLossM: true,
      startLat: true,
      startLng: true,
      endLat: true,
      endLng: true,
      minLat: true,
      maxLat: true,
      minLng: true,
      maxLng: true,
      tags: true,
      location: true,
      gpxFileUrl: true,
      trackPoints: {
        select: { lat: true, lng: true, orderIndex: true },
        orderBy: { orderIndex: 'asc' as const },
      },
    },
  });

  // Simplify track points for map display (max 50 per trail)
  return trails.map((trail) => {
    const points = trail.trackPoints;
    const maxPoints = 50;
    if (points.length <= maxPoints) return trail;
    const step = Math.ceil(points.length / maxPoints);
    return {
      ...trail,
      trackPoints: points.filter(
        (_, i) => i % step === 0 || i === points.length - 1,
      ),
    };
  });
}

export type TrailListItem = Awaited<ReturnType<typeof fetchTrails>>[number];

/* ---------- Single trail ---------- */

export async function fetchTrailById(id: string) {
  return prisma.trail.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      difficulty: true,
      dateCreated: true,
      dateCompleted: true,
      distanceKm: true,
      elevationGainM: true,
      elevationLossM: true,
      durationMinutes: true,
      startLat: true,
      startLng: true,
      endLat: true,
      endLng: true,
      minLat: true,
      maxLat: true,
      minLng: true,
      maxLng: true,
      tags: true,
      location: true,
      gpxFileUrl: true,
      createdAt: true,
      updatedAt: true,
      trackPoints: {
        orderBy: { orderIndex: 'asc' as const },
        select: { lat: true, lng: true, elevation: true, orderIndex: true },
      },
    },
  });
}

export type TrailDetail = NonNullable<Awaited<ReturnType<typeof fetchTrailById>>>;

/* ---------- Analytics ---------- */

export async function fetchAnalytics() {
  const totalTrails = await prisma.trail.count();

  const aggregates = await prisma.trail.aggregate({
    _sum: { distanceKm: true, elevationGainM: true },
    _avg: { distanceKm: true, elevationGainM: true },
  });

  const difficultyDistribution = await prisma.trail.groupBy({
    by: ['difficulty'],
    _count: true,
  });

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const trailsOverTime = await prisma.trail.findMany({
    where: { dateCompleted: { gte: oneYearAgo } },
    select: { dateCompleted: true, distanceKm: true },
    orderBy: { dateCompleted: 'asc' },
  });

  const monthlyData: Record<string, { count: number; distance: number }> = {};
  trailsOverTime.forEach((trail) => {
    if (trail.dateCompleted) {
      const key = trail.dateCompleted.toISOString().substring(0, 7);
      if (!monthlyData[key]) monthlyData[key] = { count: 0, distance: 0 };
      monthlyData[key].count += 1;
      monthlyData[key].distance += trail.distanceKm || 0;
    }
  });

  const monthlyStats = Object.entries(monthlyData).map(([month, d]) => ({
    month,
    count: d.count,
    distance: Math.round(d.distance * 100) / 100,
  }));

  return {
    summary: {
      totalTrails,
      totalDistanceKm:
        Math.round((aggregates._sum.distanceKm || 0) * 100) / 100,
      totalElevationGainM: Math.round(aggregates._sum.elevationGainM || 0),
      avgDistanceKm:
        Math.round((aggregates._avg.distanceKm || 0) * 100) / 100,
      avgElevationGainM: Math.round(aggregates._avg.elevationGainM || 0),
    },
    difficultyDistribution: difficultyDistribution.map((d) => ({
      difficulty: d.difficulty || 'Unknown',
      count: d._count,
    })),
    monthlyStats,
  };
}

export type AnalyticsData = Awaited<ReturnType<typeof fetchAnalytics>>;
