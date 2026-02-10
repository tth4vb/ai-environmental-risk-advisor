# 🧠 Braintrust

An organizational knowledge intelligence system with provenance tracking.

## Features

- **Document Management**: Upload files (PDF, DOCX, XLSX) or create manual entries
- **Full-Text Search**: PostgreSQL-powered search across all documents
- **Provenance Tracking**: Every document shows who contributed it, when, and from what source
- **Knowledge Map**: Visual representation of all contributors and their knowledge
- **Tag-Based Organization**: Browse and filter documents by tags

## Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **Search**: PostgreSQL full-text search
- **Processing**: Server-side document extraction (pdf-parse, mammoth, xlsx)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
braintrust_mvp/
├── app/                      # Next.js App Router pages
│   ├── add/                  # Document creation (manual/upload)
│   ├── api/                  # API routes
│   ├── auth/                 # Auth callback
│   ├── browse/               # Browse with tags
│   ├── documents/[id]/       # Document detail
│   ├── login/                # Authentication
│   ├── map/                  # Knowledge map
│   └── search/               # Search results
├── components/               # React components
│   ├── auth/                 # Auth forms
│   ├── documents/            # Document UI
│   ├── knowledge-map/        # Map visualization
│   ├── layout/               # Navbar
│   ├── profile/              # Profile setup
│   ├── provenance/           # Provenance panel
│   ├── search/               # Search bar
│   └── ui/                   # shadcn/ui components
├── lib/                      # Utilities
│   ├── document-processing/  # Text extraction
│   ├── hooks/                # React hooks
│   ├── supabase/             # Supabase clients
│   └── types/                # TypeScript types
└── supabase/                 # Database migrations
    └── migrations/           # SQL schema files
```

## License

MIT
