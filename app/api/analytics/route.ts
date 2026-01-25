import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Total statistics
    const totalTrails = await prisma.trail.count();
    
    const aggregates = await prisma.trail.aggregate({
      _sum: {
        distanceKm: true,
        elevationGainM: true,
      },
      _avg: {
        distanceKm: true,
        elevationGainM: true,
      },
    });
    
    // Difficulty distribution
    const difficultyDistribution = await prisma.trail.groupBy({
      by: ['difficulty'],
      _count: true,
    });
    
    // Trails per month (last 12 months)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const trailsOverTime = await prisma.trail.findMany({
      where: {
        dateCompleted: {
          gte: oneYearAgo,
        },
      },
      select: {
        dateCompleted: true,
        distanceKm: true,
      },
      orderBy: {
        dateCompleted: 'asc',
      },
    });
    
    // Group by month
    const monthlyData: { [key: string]: { count: number; distance: number } } = {};
    
    trailsOverTime.forEach(trail => {
      if (trail.dateCompleted) {
        const monthKey = trail.dateCompleted.toISOString().substring(0, 7); // YYYY-MM
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { count: 0, distance: 0 };
        }
        monthlyData[monthKey].count += 1;
        monthlyData[monthKey].distance += trail.distanceKm || 0;
      }
    });
    
    const monthlyStats = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      count: data.count,
      distance: Math.round(data.distance * 100) / 100,
    }));
    
    return NextResponse.json({
      summary: {
        totalTrails,
        totalDistanceKm: Math.round((aggregates._sum.distanceKm || 0) * 100) / 100,
        totalElevationGainM: Math.round(aggregates._sum.elevationGainM || 0),
        avgDistanceKm: Math.round((aggregates._avg.distanceKm || 0) * 100) / 100,
        avgElevationGainM: Math.round(aggregates._avg.elevationGainM || 0),
      },
      difficultyDistribution: difficultyDistribution.map(d => ({
        difficulty: d.difficulty || 'Unknown',
        count: d._count,
      })),
      monthlyStats,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
