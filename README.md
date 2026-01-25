# Trails with Chouchou

A modern, personal trail management system for uploading, visualizing, and analyzing your hiking adventures.

## Features

- 📍 **Interactive Maps** - Visualize trails on beautiful OpenStreetMap-powered maps
- 📊 **Analytics Dashboard** - Track statistics, progress, and insights
- 🔍 **Smart Search & Filtering** - Find trails by name, difficulty, distance, and more
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🗂️ **GPX File Support** - Upload GPX files and automatically extract trail data
- 🏔️ **Elevation Profiles** - View elevation gain/loss for each trail

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase recommended)
- **Maps**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **Storage**: Vercel Blob (or local storage for development)

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- PostgreSQL database (or Supabase account)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd trails-with-choucou
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database connection:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/trails?schema=public"
   ```
   
   For production with Vercel Blob storage, add:
   ```
   BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
   ```

4. **Set up the database**
   
   Generate Prisma client:
   ```bash
   npx prisma generate
   ```
   
   Run database migrations:
   ```bash
   npx prisma db push
   ```
   
   (Optional) Open Prisma Studio to view your database:
   ```bash
   npx prisma studio
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Set up database**
   
   Option A: Supabase (Recommended)
   - Create a project at [supabase.com](https://supabase.com)
   - Go to Settings > Database
   - Copy the connection string
   - Add to Vercel environment variables as `DATABASE_URL`
   
   Option B: Railway
   - Create a PostgreSQL database at [railway.app](https://railway.app)
   - Copy the connection string
   - Add to Vercel environment variables

4. **Set up file storage**
   
   In your Vercel project:
   - Go to Storage tab
   - Create a Blob store
   - Copy the `BLOB_READ_WRITE_TOKEN`
   - Add to environment variables

5. **Deploy**
   
   Vercel will automatically build and deploy your app!

## Database Schema

The app uses two main tables:

- **Trail**: Stores trail metadata (name, description, difficulty, distance, elevation, bounds, etc.)
- **TrackPoint**: Stores individual GPS coordinates for each trail

## Local Development (Without External Services)

For local development without Vercel Blob:

1. The app will automatically save GPX files to `/public/gpx/` folder
2. Use PostgreSQL locally or SQLite (requires schema modification)
3. All features work the same way

## Usage

### Upload a Trail

1. Click "Upload Trail"
2. Select a GPX file from your device
3. Optionally add metadata (name, description, difficulty, tags)
4. Submit - the trail will be parsed and added to your collection

### View Trails

- **Grid View**: See all trails as cards with key stats
- **Map View**: Visualize all trails on an interactive map
- **Filters**: Search and filter by name, difficulty, distance range

### Trail Details

Click any trail to see:
- Interactive map with full route
- Complete statistics
- Elevation profile
- Tags and description
- Download original GPX file

### Analytics

View your analytics dashboard to see:
- Total trails, distance, elevation
- Difficulty distribution
- Monthly trail count
- Distance trends over time

## File Structure

```
/app
  /page.tsx                 # Home page
  /trails
    /page.tsx              # Trails list with filters
    /[id]/page.tsx         # Individual trail detail
    /upload/page.tsx       # Upload form
  /analytics/page.tsx      # Analytics dashboard
  /api
    /trails/route.ts       # GET trails with filtering
    /trails/[id]/route.ts  # GET/PATCH/DELETE single trail
    /upload/route.ts       # POST upload GPX
    /analytics/route.ts    # GET analytics data
/components
  /MapView.tsx            # Leaflet map component
  /TrailCard.tsx          # Trail list item
  /TrailFilters.tsx       # Filter controls
  /UploadForm.tsx         # Upload form
/lib
  /gpx-parser.ts          # GPX parsing utilities
  /prisma.ts              # Prisma client
/prisma
  /schema.prisma          # Database schema
```

## Troubleshooting

### "Module not found" errors
```bash
npm install
npx prisma generate
```

### Database connection issues
- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running (if local)
- Verify Supabase/Railway connection string

### Map not loading
- Check browser console for errors
- Ensure Leaflet CSS is imported
- Try clearing browser cache

### GPX upload fails
- Verify file is valid GPX format
- Check file size (max 10MB by default)
- Ensure write permissions for `/public/gpx/` folder (local dev)

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

## License

MIT
