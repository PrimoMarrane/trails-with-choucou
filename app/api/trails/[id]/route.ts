import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single trail by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trail = await prisma.trail.findUnique({
      where: { id: params.id },
      include: {
        trackPoints: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
    
    if (!trail) {
      return NextResponse.json(
        { error: 'Trail not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ trail });
  } catch (error) {
    console.error('Error fetching trail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trail' },
      { status: 500 }
    );
  }
}

// PATCH update trail
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, difficulty, dateCompleted, tags, location } = body;
    
    const trail = await prisma.trail.update({
      where: { id: params.id },
      data: {
        name,
        description,
        difficulty,
        dateCompleted: dateCompleted ? new Date(dateCompleted) : null,
        tags,
        location,
      },
    });
    
    return NextResponse.json({ trail });
  } catch (error) {
    console.error('Error updating trail:', error);
    return NextResponse.json(
      { error: 'Failed to update trail' },
      { status: 500 }
    );
  }
}

// DELETE trail
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete from storage if needed (implement based on storage solution)
    const trail = await prisma.trail.findUnique({
      where: { id: params.id },
    });
    
    if (!trail) {
      return NextResponse.json(
        { error: 'Trail not found' },
        { status: 404 }
      );
    }
    
    // If using local storage, delete the file
    if (!process.env.BLOB_READ_WRITE_TOKEN && trail.gpxFileUrl.startsWith('/gpx/')) {
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', trail.gpxFileUrl);
      
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    
    await prisma.trail.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trail:', error);
    return NextResponse.json(
      { error: 'Failed to delete trail' },
      { status: 500 }
    );
  }
}
