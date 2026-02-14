import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ALLOWED_SORT_COLUMNS = ['dateCreated', 'dateCompleted', 'name', 'distanceKm', 'elevationGainM'] as const;
type SortColumn = (typeof ALLOWED_SORT_COLUMNS)[number];

// GET all trails with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const difficulty = searchParams.get('difficulty');
    const minDistance = searchParams.get('minDistance');
    const maxDistance = searchParams.get('maxDistance');
    const rawSortBy = searchParams.get('sortBy') || 'dateCreated';
    const rawSortOrder = searchParams.get('sortOrder') || 'desc';

    // Whitelist sort inputs
    const sortBy: SortColumn = ALLOWED_SORT_COLUMNS.includes(rawSortBy as SortColumn)
      ? (rawSortBy as SortColumn)
      : 'dateCreated';
    const sortOrder: 'asc' | 'desc' = rawSortOrder === 'asc' ? 'asc' : 'desc';
    
    const where: any = {};
    
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
    
    const includeTrackPoints = searchParams.get('includeTrackPoints') === 'true';
    
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
        // Include simplified track points for map display
        trackPoints: includeTrackPoints ? {
          select: {
            lat: true,
            lng: true,
            orderIndex: true,
          },
          orderBy: { orderIndex: 'asc' },
        } : false,
      },
    });
    
    // Simplify track points (keep every Nth point) to reduce data size
    const simplifiedTrails = trails.map(trail => {
      if (!includeTrackPoints || !trail.trackPoints) {
        return trail;
      }
      
      const points = trail.trackPoints;
      const maxPoints = 50; // Maximum points per trail for map display
      
      if (points.length <= maxPoints) {
        return trail;
      }
      
      // Sample every Nth point
      const step = Math.ceil(points.length / maxPoints);
      const simplified = points.filter((_, index) => index % step === 0 || index === points.length - 1);
      
      return {
        ...trail,
        trackPoints: simplified,
      };
    });
    
    return NextResponse.json({ trails: simplifiedTrails });
  } catch (error) {
    console.error('Error fetching trails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trails' },
      { status: 500 }
    );
  }
}
