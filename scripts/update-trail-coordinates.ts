import { prisma } from '../lib/prisma';
import { parseGPX } from '../lib/gpx-parser';
import * as fs from 'fs/promises';
import * as path from 'path';

async function updateTrailCoordinates() {
  console.log('🔄 Starting to update trail coordinates...\n');

  // Get all trails
  const trails = await prisma.trail.findMany({
    select: {
      id: true,
      name: true,
      gpxFileUrl: true,
      startLat: true,
      startLng: true,
    },
  });

  console.log(`Found ${trails.length} trails in database\n`);

  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const trail of trails) {
    try {
      // Skip if coordinates already exist
      if (trail.startLat !== null && trail.startLng !== null) {
        console.log(`✓ Skipping "${trail.name}" - coordinates already exist`);
        skippedCount++;
        continue;
      }

      // Read GPX file
      let gpxContent: string;
      if (trail.gpxFileUrl.startsWith('/gpx/')) {
        // Local file
        const filePath = path.join(process.cwd(), 'public', trail.gpxFileUrl);
        gpxContent = await fs.readFile(filePath, 'utf-8');
      } else {
        // Remote file (Vercel Blob)
        const response = await fetch(trail.gpxFileUrl);
        gpxContent = await response.text();
      }

      // Parse GPX
      const parsedData = parseGPX(gpxContent);

      // Update trail with coordinates
      await prisma.trail.update({
        where: { id: trail.id },
        data: {
          startLat: parsedData.startPoint.lat,
          startLng: parsedData.startPoint.lng,
          endLat: parsedData.endPoint.lat,
          endLng: parsedData.endPoint.lng,
          minLat: parsedData.bounds.minLat,
          maxLat: parsedData.bounds.maxLat,
          minLng: parsedData.bounds.minLng,
          maxLng: parsedData.bounds.maxLng,
          distanceKm: parsedData.distanceKm,
          elevationGainM: parsedData.elevationGainM,
          elevationLossM: parsedData.elevationLossM,
        },
      });

      console.log(`✅ Updated "${trail.name}" with coordinates`);
      updatedCount++;
    } catch (error) {
      console.error(`❌ Error updating "${trail.name}":`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`  ✅ Updated: ${updatedCount}`);
  console.log(`  ⏭️  Skipped: ${skippedCount}`);
  console.log(`  ❌ Errors: ${errorCount}`);
  console.log(`  📍 Total: ${trails.length}`);

  await prisma.$disconnect();
}

updateTrailCoordinates()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
