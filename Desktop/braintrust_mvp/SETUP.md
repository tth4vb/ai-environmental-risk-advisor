# Braintrust Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

## Step 1: Clone and Install

```bash
git clone <your-repo>
cd braintrust_mvp
npm install
```

## Step 2: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for project to finish provisioning

## Step 3: Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste contents of `supabase/migrations/20251122000001_initial_schema.sql`
4. Click **Run**
5. Copy and paste contents of `supabase/migrations/20251122000002_search_function.sql`
6. Click **Run**
7. Verify tables created in **Table Editor**

## Step 4: Create Storage Bucket

1. Navigate to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Name: `documents`
4. Make it **public**
5. Click **Create bucket**

## Step 5: Configure Environment

1. Copy `.env.local.example` to `.env.local`
2. Get your Supabase credentials:
   - Go to **Project Settings > API**
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Paste into `.env.local`

## Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 7: Create Your Account

1. Navigate to [http://localhost:3000/login](http://localhost:3000/login)
2. Click "Sign up"
3. Enter email and password
4. Check email for confirmation link (dev mode may skip this)
5. Complete your profile (name, job title, team)

## Step 8: Add Your First Knowledge

1. Click "Add to Braintrust"
2. Either:
   - Write a manual entry, OR
   - Upload a document (PDF, DOCX, XLSX, code files)
3. Add tags to organize
4. Submit!

## Troubleshooting

### "Unauthorized" errors
- Check `.env.local` has correct Supabase credentials
- Verify you're signed in at `/login`

### File upload fails
- Ensure storage bucket "documents" exists and is public
- Check file size (10MB limit)

### Search returns no results
- Verify search function migration ran successfully
- Check documents have `status='complete'`

### Processing stuck
- Check Supabase logs for errors
- Verify file type is supported

## Next Steps

- Invite team members to create accounts
- Add more documents
- Explore the knowledge map
- Use search to discover knowledge

## Features Overview

### Manual Entry
- Create knowledge directly in the app
- Add title, content, and tags
- Markdown support in content field

### File Upload
- Supported formats: PDF, DOCX, XLSX, TXT, MD, code files
- Automatic text extraction
- Searchable after processing

### Search
- Full-text search powered by PostgreSQL
- Searches titles and content
- Ranked results with relevance scoring

### Knowledge Map
- Visual representation of all contributors
- Shows document counts per person
- Sorted by activity level

### Browse
- View popular tags
- Browse recent documents
- Discover trending knowledge

### Provenance
- Every document shows:
  - Who contributed it
  - When it was added
  - Source (manual entry, file upload, survey)
  - Associated tags
