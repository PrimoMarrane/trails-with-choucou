import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all trails with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const difficulty = searchParams.get('difficulty');
    const minDistance = searchParams.get('minDistance');
    const maxDistance = searchParams.get('maxDistance');
    const sortBy = searchParams.get('sortBy') || 'dateCreated';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
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
      },
    });
    
    return NextResponse.json({ trails });
  } catch (error) {
    console.error('Error fetching trails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trails' },
      { status: 500 }
    );
  }
}
