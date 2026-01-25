# Quick Start Guide

## Step 1: Set Up Your Database

You have two options:

### Option A: Supabase (Recommended - Free Tier)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to **Settings** > **Database**
4. Copy the **Connection String** (URI format)
5. Create a `.env` file in your project root:
   ```bash
   DATABASE_URL="your-connection-string-here"
   ```

### Option B: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
   ```bash
   createdb trails
   ```
3. Create `.env` file:
   ```bash
   DATABASE_URL="postgresql://your-username:your-password@localhost:5432/trails?schema=public"
   ```

## Step 2: Initialize the Database

Run the following command to create the database tables:

```bash
npx prisma db push
```

This will create the `Trail` and `TrackPoint` tables in your database.

## Step 3: Start the Development Server

```bash
npm run dev
```

Your app will be available at [http://localhost:3000](http://localhost:3000)

## Step 4: Upload Your First Trail

1. Open your browser to `http://localhost:3000`
2. Click **"Upload Trail"**
3. Select a GPX file from your computer
4. Fill in optional details (name, description, difficulty)
5. Click **"Upload Trail"**

## Next Steps

- **View all trails**: Navigate to `/trails` to see your trail collection
- **View analytics**: Navigate to `/analytics` to see statistics and charts
- **Explore map view**: Switch to map view in the trails page to see all trails on a map

## Where to Get GPX Files

You can export GPX files from:
- Strava (Activity > Export GPX)
- Garmin Connect (Activity > Export > GPX)
- Komoot (Tour > Share > Export as GPX)
- Apple Health / Google Fit
- Most GPS devices

## Troubleshooting

### Can't connect to database
- Double-check your `DATABASE_URL` in `.env`
- Make sure PostgreSQL is running (if using local)
- Try pinging your Supabase/Railway instance

### Upload fails
- Ensure the file is a valid GPX format (XML structure)
- Check that `/public/gpx/` folder exists and is writable (for local storage)
- Look at the browser console for specific errors

### Map doesn't show
- Check that the trail has valid GPS coordinates
- Open browser console to see any JavaScript errors
- Try refreshing the page

## Production Deployment (Vercel)

When you're ready to deploy:

1. Push your code to GitHub
2. Import to Vercel at [vercel.com](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL` (from Supabase/Railway)
   - `BLOB_READ_WRITE_TOKEN` (create Blob storage in Vercel)
4. Deploy!

Your trail management system will be live on the web.

## Need Help?

Check the full [README.md](./README.md) for detailed documentation.
