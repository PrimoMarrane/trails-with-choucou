import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { parseGPX } from '@/lib/gpx-parser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const difficulty = formData.get('difficulty') as string | null;
    const dateCompleted = formData.get('dateCompleted') as string | null;
    const tags = formData.get('tags') as string | null;
    const location = formData.get('location') as string | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // --- File guards ---
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large (max 10 MB)' },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith('.gpx')) {
      return NextResponse.json(
        { error: 'Only .gpx files are accepted' },
        { status: 400 }
      );
    }
    
    // Read file content
    const gpxContent = await file.text();
    
    // Parse GPX to extract metadata
    let parsedData;
    try {
      parsedData = parseGPX(gpxContent);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid GPX file format' },
        { status: 400 }
      );
    }
    
    // Upload GPX file to Vercel Blob (or store locally for development)
    let gpxFileUrl: string;
    
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Production: Use Vercel Blob
      const blob = await put(file.name, file, {
        access: 'public',
      });
      gpxFileUrl = blob.url;
    } else {
      // Development: Save locally
      const fs = await import('fs/promises');
      const path = await import('path');
      const publicDir = path.join(process.cwd(), 'public', 'gpx');
      
      // Ensure directory exists
      await fs.mkdir(publicDir, { recursive: true });
      
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(publicDir, fileName);
      
      await fs.writeFile(filePath, gpxContent);
      gpxFileUrl = `/gpx/${fileName}`;
    }
    
    // Create trail in database
    const trail = await prisma.trail.create({
      data: {
        name: name || parsedData.name || file.name.replace('.gpx', ''),
        description: description || parsedData.description,
        difficulty,
        dateCompleted: dateCompleted ? new Date(dateCompleted) : null,
        gpxFileUrl,
        distanceKm: parsedData.distanceKm,
        elevationGainM: parsedData.elevationGainM,
        elevationLossM: parsedData.elevationLossM,
        startLat: parsedData.startPoint.lat,
        startLng: parsedData.startPoint.lng,
        endLat: parsedData.endPoint.lat,
        endLng: parsedData.endPoint.lng,
        minLat: parsedData.bounds.minLat,
        maxLat: parsedData.bounds.maxLat,
        minLng: parsedData.bounds.minLng,
        maxLng: parsedData.bounds.maxLng,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        location,
        trackPoints: {
          create: parsedData.coordinates.map((coord, index) => ({
            lat: coord[1],
            lng: coord[0],
            elevation: coord[2],
            timestamp: parsedData.timestamps?.[index],
            orderIndex: index,
          })),
        },
      },
    });
    
    return NextResponse.json({ trail }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}
