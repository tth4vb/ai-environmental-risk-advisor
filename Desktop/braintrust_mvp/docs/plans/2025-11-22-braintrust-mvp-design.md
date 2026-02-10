# Braintrust MVP - Product Design Document

**Date:** November 22, 2025
**Status:** Approved Design
**Timeline:** 1 month MVP

## Executive Summary

Braintrust is an organizational knowledge intelligence system that captures, surfaces, and verifies knowledge across an organization. The core differentiator is **provenance-first design** - every piece of knowledge shows who contributed it, when, and from what source, enabling teams to trust and leverage collective organizational intelligence.

**MVP Success Criteria:**
- Users can discover what the org knows about a topic (search/browse)
- Contributors can easily add knowledge (low friction input)
- All knowledge shows clear provenance (who, when, source)
- Visual representation of "the Braintrust" (contributor map)

## Problem Statement

Organizations struggle with three interconnected problems:

1. **Discovery**: "Where do we know something about X?"
2. **Trust**: "Can I trust this information?"
3. **Contribution friction**: "Adding knowledge is harder than Slack/email"

Braintrust solves all three by treating knowledge as **documents with attribution**, making organizational intelligence searchable, trustworthy, and easy to contribute to.

## User Profile

**MVP Users:** Solo testing/validation (expandable to small teams)

**User Profile Model:**
- Name
- Job title
- Team
- Avatar (optional)

Profile creation happens on first contribution to ensure proper attribution.

---

## Architecture

### Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API routes + Supabase
- **Database:** PostgreSQL (via Supabase)
- **Storage:** Supabase Storage
- **Auth:** Supabase Auth
- **Search:** PostgreSQL full-text search (extensible to pgvector later)
- **Processing:** Server-side document extraction

### Architectural Approach: Hybrid Progressive

Start with **metadata + keyword search** foundation, architecture designed to add **vector/semantic search** later without rewriting.

**Three Core Subsystems:**

1. **Knowledge Capture**
   - User uploads file or creates manual entry
   - Server processes → extracts text + metadata
   - Stores in Supabase with provenance

2. **Knowledge Discovery**
   - User searches or browses
   - PostgreSQL queries with full-text search
   - Returns ranked results with provenance

3. **Knowledge Graph** (future)
   - Visual map of contributors and knowledge connections
   - Shows "the Braintrust" at a glance

---

## Data Model

### Core Tables

#### `documents` (Primary Knowledge Container)

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT, -- Extracted text from file or manual entry
  source_type TEXT NOT NULL CHECK (source_type IN ('file_upload', 'manual_entry', 'survey')),
  file_type TEXT, -- pdf, docx, pptx, xlsx, code, etc.
  file_url TEXT, -- Supabase Storage path if uploaded file
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}', -- Flexible for tags, categories, custom fields
  search_vector TSVECTOR, -- For PostgreSQL full-text search
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'complete', 'failed'))
);

-- Full-text search index
CREATE INDEX documents_search_idx ON documents USING GIN (search_vector);

-- Auto-update search vector
CREATE TRIGGER documents_search_vector_update
BEFORE INSERT OR UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION
tsvector_update_trigger(search_vector, 'pg_catalog.english', title, content);
```

#### `users` (Profile Extension)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT NOT NULL,
  job_title TEXT,
  team TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `document_tags` (Many-to-Many)

```sql
CREATE TABLE document_tags (
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (document_id, tag)
);

CREATE INDEX document_tags_tag_idx ON document_tags(tag);
```

#### `surveys` (Future - Q&A Generation)

```sql
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  questions JSONB NOT NULL, -- Array of question objects
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## User Flows

### Flow 1: Upload Document

1. User clicks "Add to Braintrust" button
2. **First-time users:** Prompted to create profile (name, job title, team)
3. Drag-drop or select file (PDF, DOCX, PPTX, XLSX, code files)
4. Optional: Add title, tags, notes
5. Submit → File uploads to Supabase Storage
6. Background job processes file (extract text, create search vector)
7. User sees "Processing..." → "Complete!" notification
8. Document now searchable and browsable

### Flow 2: Manual Entry

1. User clicks "New Entry"
2. **First-time users:** Prompted to create profile (name, job title, team)
3. Fill form: title, content (rich text editor), tags
4. Submit → Creates document record directly (no file processing needed)
5. Document instantly searchable

### Flow 3: Search & Discovery

1. User types question/keywords in "Ask the Braintrust" search bar
2. Real-time search across document titles + content (debounced)
3. Results show:
   - Document title + snippet (highlighted match)
   - Provenance badge: contributor avatar, name, team, date
   - Source type icon (file/manual/survey)
   - Tags
4. Click result → Full document view

### Flow 4: Browse & Visualize Knowledge

1. Home page shows:
   - Recent documents (card grid)
   - Popular tags (badge list)
   - Quick stats (X documents, Y contributors)
2. **"View the Braintrust" button** → Knowledge map view
3. **Knowledge map displays:**
   - Grid or graph visualization of all contributors
   - Avatar, name, team, document count for each
   - Click person → Filter to their contributions
   - Visual representation of organizational knowledge distribution
4. Alternative browse options:
   - Browse by tags
   - Sort by newest/most relevant/source type
   - Filter by contributor, date range

### Flow 5: View Document Detail

1. Full content display (formatted text or file preview)
2. **Provenance panel** (prominent):
   - Contributor: avatar, name, job title, team
   - Upload date
   - Source file/type
   - Tags (clickable to browse)
   - Download original file (if applicable)
3. Related documents section (by matching tags)
4. Future: "Show in knowledge map" button

---

## Document Processing Pipeline

### Upload → Process → Store Flow

**1. Upload Phase**
- Client uploads file via Next.js API route to Supabase Storage
- Create document record with `status='processing'`
- Return immediately to user with processing indicator
- Store file metadata (filename, size, type)

**2. Processing Phase (Server-side)**

Trigger background processing (API route or Edge Function):

**Text Extraction by File Type:**
- **PDF:** `pdf-parse` or `pdfjs-dist`
- **DOCX:** `mammoth` (converts to HTML/text)
- **PPTX:** `pptxtojson` or similar library
- **XLSX:** `xlsx` library (extract cell contents)
- **Code files:** Read as plain text with syntax preserved

**Processing Steps:**
1. Download file from Supabase Storage
2. Extract text based on file type
3. Generate title if not user-provided (from filename or first line of content)
4. Create PostgreSQL full-text search vector (`tsvector`)
5. Optional: Basic keyword extraction for auto-tags (future: AI-based)

**3. Storage Phase**
- Update document record with extracted content
- Update `search_vector` for full-text search capability
- Set `status='complete'`
- Optional: Notify user via real-time subscription or email

**Error Handling:**
- Parsing failure → `status='failed'`, store error message, show user-friendly error
- Timeout (>30s) → Retry once, then mark failed
- Unsupported format → Clear error message with supported formats list

**Performance Notes:**
- **MVP:** Process synchronously in API route (simple, fast for testing)
- **Future:** Move to queued background jobs (Supabase Edge Functions + queue) for scale

---

## Search & Query Implementation

### Phase 1 (MVP): PostgreSQL Full-Text Search

**Search Query Pattern:**

```sql
SELECT
  id,
  title,
  content,
  uploaded_by,
  uploaded_at,
  source_type,
  file_type,
  metadata,
  ts_rank(search_vector, query) as relevance_rank
FROM documents,
  to_tsquery('english', 'search:* & terms:*') query
WHERE
  search_vector @@ query
  AND status = 'complete'
ORDER BY relevance_rank DESC
LIMIT 50;
```

**Search Features:**

- **Real-time search** as user types (300ms debounce)
- Searches both `title` and `content` with weighting:
  - Title matches ranked higher (use `setweight()` in trigger)
  - Content matches provide context snippets
- **Result display:**
  - Document title + snippet (highlighted match context)
  - Provenance: contributor name, team, upload date
  - Tags (badges)
  - Source type icon (file/manual/survey)
- **Filters:**
  - By tag (multi-select)
  - By contributor
  - By date range
  - By source type

**Search UX:**

- Empty state: Show recent documents + popular tags (guide discovery)
- "Ask the Braintrust" search bar prominent on home page (Command component)
- Search results page with filters in sidebar (Sheet component)
- Click result → Navigate to document detail

### Phase 2 (Future): Semantic Search

**When to add:**
- After validating MVP search works
- When users want "concept" search vs keyword matching

**Implementation:**
1. Add `embedding vector(1536)` column to documents
2. Generate OpenAI embeddings during processing pipeline
3. Use `pgvector` extension for similarity search
4. **Hybrid search:** Combine keyword + semantic results
5. UI toggle: "Keyword" vs "Semantic" vs "Hybrid" modes

---

## UI Structure & Pages

**Design System:** shadcn/ui components + Tailwind CSS

### Page Breakdown

#### 1. Home/Dashboard (`/`)

**Components:**
- Header with "Ask the Braintrust" search bar (Command component)
- Hero section: "Add to Braintrust" CTA button
- Quick stats cards: X documents, Y contributors
- Recent documents grid (Card components)
- Popular tags list (Badge components)
- "View the Braintrust" button → Navigate to knowledge map

**Empty State (No documents yet):**
- Onboarding message
- "Add your first document" CTA

#### 2. Search Results (`/search?q=...`)

**Layout:**
- Persistent search bar at top
- Filters sidebar (Sheet component):
  - Tags (multi-select checkboxes)
  - Contributors (searchable list)
  - Date range picker
  - Source type (file/manual/survey)
- Results list (main area):
  - Each result: Card with title, snippet, provenance badge, tags
  - Click card → Navigate to document detail
- Empty state: "No results for '[query]'" + suggestions

#### 3. Document Detail (`/documents/[id]`)

**Layout:**
- Main content area: Full document display
  - Formatted text (for manual entries)
  - File preview (for PDFs) or extracted text
- **Provenance panel** (right sidebar on desktop, top card on mobile):
  - Contributor: Avatar + name + job title + team
  - Upload date (human-friendly: "2 days ago")
  - Source: "Uploaded PDF" or "Manual entry"
  - Tags (clickable badges)
  - Download original button (if file exists)
- Related documents section (bottom): "Other documents tagged with [tag]"
- Future: "Show in knowledge map" button

#### 4. Add Knowledge (`/add`)

**Two tabs:**

**Tab 1: Upload File**
- Drag-drop zone (accept PDF, DOCX, PPTX, XLSX, code)
- File type indicators and size limits
- Optional fields:
  - Title (auto-filled from filename, editable)
  - Tags (multi-input)
  - Notes (textarea)
- "Upload to Braintrust" button

**Tab 2: Write Entry**
- Title input (required)
- Rich text editor (Tiptap or similar, supports basic formatting)
- Tags input (multi-input with suggestions)
- "Add to Braintrust" button

**First-Time User Flow:**
- On first "Add" action, show profile setup dialog BEFORE showing add form

#### 5. Profile Setup (Modal/Dialog)

**Triggered:** First contribution attempt (upload or manual entry)

**Fields:**
- Display name (required)
- Job title (optional)
- Team (optional)
- Avatar upload (optional, defaults to initials)

**CTA:** "Create Profile" → Proceeds to add knowledge flow

#### 6. Knowledge Map (`/map`)

**Visualization:**
- Grid layout showing all contributors as cards:
  - Avatar (large)
  - Name + job title + team
  - Document count badge
  - Hover: Show preview of recent contributions
- Click contributor card → Filter documents to that person
- Search/filter within map by name, team, or document count

**Alternative View (Future):**
- Graph visualization showing connections between contributors via shared tags
- Force-directed graph using D3.js or similar

#### 7. Browse (`/browse`)

**Three tabs:**
- **By Tag:** Tag cloud or list, click tag → filtered documents
- **By Contributor:** List of contributors with counts, click → filter
- **By Date:** Timeline view of recent contributions

---

## Component Architecture

### Component Organization

**Directory Structure:**
```
/components
  /braintrust
    /search
      - SearchCommand.tsx
      - SearchResults.tsx
      - FilterSidebar.tsx
    /documents
      - DocumentCard.tsx
      - DocumentViewer.tsx
      - AddKnowledgeDialog.tsx
      - FileUploadZone.tsx
      - ManualEntryForm.tsx
    /provenance
      - ProvenancePanel.tsx
      - ProvenanceBadge.tsx
      - ContributorCard.tsx
      - SourceTypeIcon.tsx
    /knowledge-map
      - KnowledgeMap.tsx
      - ContributorNode.tsx
      - MapFilters.tsx
    /profile
      - ProfileSetupDialog.tsx
      - ProfileForm.tsx
  /ui (shadcn/ui components)
    - button.tsx
    - card.tsx
    - badge.tsx
    - avatar.tsx
    - input.tsx
    - dialog.tsx
    - command.tsx
    - sheet.tsx
    - tabs.tsx
```

### Key Components

#### Search & Discovery

**`SearchCommand`**
- Command palette component (shadcn Command)
- Real-time search with 300ms debounce
- Shows recent searches and suggestions
- Keyboard shortcuts (Cmd+K to open)

**`SearchResults`**
- List of DocumentCard components
- Pagination or infinite scroll
- Loading states

**`FilterSidebar`**
- Sheet component with filters
- Tag multi-select
- Contributor search
- Date range picker
- Apply/clear buttons

**`DocumentCard`**
- Reusable card showing document preview
- Props: document, showProvenance, onClick
- Used in search results, browse, home

#### Document Management

**`AddKnowledgeDialog`**
- Dialog/modal with tabs
- Tabs: "Upload File" | "Write Entry"
- First-time users see ProfileSetupDialog first

**`FileUploadZone`**
- Drag-drop area with file validation
- Shows file type icons and accepted formats
- Progress indicator during upload

**`ManualEntryForm`**
- Form with title input + rich text editor
- Tags input with autocomplete from existing tags
- Submit handler

**`DocumentViewer`**
- Displays document content based on type
- For manual entries: Formatted HTML
- For files: Extracted text with formatting
- Future: Embedded PDF viewer

#### Provenance & Attribution

**`ProvenancePanel`**
- Sidebar or card showing full provenance
- Contributor info (avatar, name, title, team)
- Source details (date, type, file link)
- Tags (clickable)

**`ProvenanceBadge`**
- Compact inline provenance display
- Avatar + name (no title/team)
- Used in search results, cards

**`ContributorCard`**
- Full contributor profile card
- Shows stats (document count)
- Used in knowledge map and browse

**`SourceTypeIcon`**
- Icon component for source type indication
- File upload: 📄
- Manual entry: ✏️
- Survey: 📋

#### Knowledge Map

**`KnowledgeMap`**
- Grid of ContributorNode components
- Search and filter controls
- Responsive layout (grid adjusts for mobile)

**`ContributorNode`**
- Card with avatar, name, team, stats
- Interactive (hover effects, click to filter)

### State Management

**Server State (React Query):**
- Documents fetching/caching
- Search results
- User profiles
- Real-time updates via Supabase subscriptions

**UI State (Zustand or Context):**
- Search filters
- Modal/dialog open states
- Active tabs
- Loading indicators

**Real-time Features (Supabase Subscriptions):**
- Document processing status updates
- New document notifications (future)

### API Routes

**Next.js API Routes (`/app/api/`):**

- **`/api/documents`** - GET (list), POST (create manual entry)
- **`/api/documents/[id]`** - GET (detail), PATCH (update), DELETE
- **`/api/upload`** - POST (file upload handler)
- **`/api/process`** - POST (trigger document processing)
- **`/api/search`** - GET (search endpoint with filters)
- **`/api/profile`** - POST (create profile), PATCH (update)

---

## Authentication & Permissions

### Auth Strategy

**Using Supabase Auth:**

- **Sign up/Login:** Email + password (simple for MVP)
- **Session management:** Supabase client handles tokens/refresh
- **Route protection:** Next.js middleware checks auth state
- **Email verification:** Optional for MVP (enable in future)

**User Flow:**
1. First visit → Redirect to `/login`
2. Sign up with email/password
3. On first contribution → Profile setup dialog
4. Session persists across visits

### Permissions (MVP - Simple Model)

**Authenticated Users Can:**
- View all documents (org-wide knowledge is open by default)
- Search and browse
- Add documents (upload files or create manual entries)
- Edit their own profile
- View contributor profiles

**Authenticated Users Cannot:**
- Edit others' documents (only their own in future)
- Delete any documents (admin feature in future)
- Change others' profiles
- Access admin features

### Row Level Security (RLS)

**Supabase RLS Policies:**

```sql
-- Enable RLS on tables
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_tags ENABLE ROW LEVEL SECURITY;

-- Documents: All authenticated users can read
CREATE POLICY "Documents are viewable by authenticated users"
ON documents FOR SELECT
TO authenticated
USING (true);

-- Documents: Users can only insert as themselves
CREATE POLICY "Users can insert their own documents"
ON documents FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploaded_by);

-- Users: All authenticated users can read profiles
CREATE POLICY "User profiles are viewable by authenticated users"
ON users FOR SELECT
TO authenticated
USING (true);

-- Users: Users can only update their own profile
CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Tags: All authenticated users can read
CREATE POLICY "Tags are viewable by authenticated users"
ON document_tags FOR SELECT
TO authenticated
USING (true);

-- Tags: Users can add tags to their own documents
CREATE POLICY "Users can tag their own documents"
ON document_tags FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM documents
    WHERE id = document_id
    AND uploaded_by = auth.uid()
  )
);
```

### Future Permission Enhancements

- **Team-based access:** Some documents private to specific teams
- **Document ownership:** Edit/delete your own documents
- **Admin roles:** Manage all documents, moderate content
- **Draft mode:** Save unpublished documents
- **Sharing controls:** Public/team/private visibility per document

---

## Future Enhancements (Post-MVP)

### Phase 2 Features

1. **Semantic Search (Vector Embeddings)**
   - OpenAI embeddings for documents
   - pgvector for similarity search
   - Hybrid keyword + semantic search

2. **Survey System**
   - Create Q&A surveys
   - Distribute to team
   - Compile responses into survey documents

3. **Slack Integration**
   - Post documents to Slack
   - Slackbot for searching Braintrust
   - Import Slack threads as documents

4. **Knowledge Graph Visualization**
   - Interactive force-directed graph
   - Show connections via shared tags/topics
   - Visual clustering of related knowledge

5. **AI-Powered Features**
   - Auto-summarization of documents
   - Smart tagging suggestions
   - Related document recommendations
   - "Ask the Braintrust" with LLM-generated answers

6. **Collaboration Features**
   - Comments on documents
   - Upvoting/endorsing knowledge
   - Document version history
   - Co-authoring

7. **Integrations**
   - Google Drive/Docs import
   - Linear/Jira ticket linking
   - Calendar event notes capture
   - Browser extension for "right-click to add"

8. **MCP (Model Context Protocol)**
   - Expose Braintrust as context source for AI tools
   - Claude Desktop integration
   - API for external AI systems

---

## Technical Risks & Mitigations

### Risk 1: Document Processing Complexity

**Risk:** Parsing diverse file formats (PDF, PPTX, XLSX) is unreliable.

**Mitigation:**
- Use established libraries with good track records
- Extensive error handling and fallbacks
- Allow manual text paste if parsing fails
- Future: Offer manual text extraction workflow

### Risk 2: Search Quality

**Risk:** PostgreSQL full-text search may not be "smart" enough.

**Mitigation:**
- Architecture supports adding semantic search without rewrite
- Start with good metadata (tags, titles) to augment keyword search
- Iteratively improve based on user feedback
- Plan for hybrid search from the start

### Risk 3: Scale/Performance

**Risk:** As document count grows, search/processing slows.

**Mitigation:**
- MVP is single-user testing (scale not critical yet)
- Database indexes on search_vector, tags, uploaded_at
- Pagination on all list views
- Future: Move processing to background queue

### Risk 4: File Storage Costs

**Risk:** Large files consume Supabase storage quota.

**Mitigation:**
- Set file size limits (e.g., 10MB per file)
- Store extracted text, optionally discard original file
- Monitor storage usage in Supabase dashboard
- Future: S3 integration for larger deployments

---

## Success Metrics (Post-Launch)

**Usage Metrics:**
- Number of documents added per user
- Search queries per session
- Time spent on document detail pages
- Knowledge map views

**Quality Metrics:**
- Search result click-through rate
- Documents tagged/organized
- Contributor profiles completed

**Outcome Metrics:**
- User reports "learned something new from Braintrust"
- User successfully found answer they were looking for
- Time saved vs asking in Slack/email

---

## MVP Development Phases

### Phase 1: Foundation (Week 1)
- Next.js + Supabase setup
- Auth flow (login/signup)
- Database schema + RLS policies
- Profile setup flow

### Phase 2: Core Features (Week 2)
- Manual entry form
- File upload (basic)
- Document detail view
- Simple search (keyword)

### Phase 3: Polish & Discovery (Week 3)
- Document processing pipeline (PDF, DOCX)
- Enhanced search UI
- Browse by tags
- Provenance display refinement

### Phase 4: Knowledge Map & Testing (Week 4)
- Knowledge map visualization
- End-to-end testing
- Bug fixes and UX polish
- Documentation

---

## Conclusion

Braintrust MVP delivers a complete cycle of **capture → discover → trust** organizational knowledge in a 1-month timeline. The hybrid progressive architecture balances shipping speed with future AI capabilities, while provenance-first design ensures every piece of knowledge is trustworthy and attributed.

The system is designed for iterative enhancement: start with solid metadata and search foundations, then layer on semantic search, surveys, integrations, and AI features as usage validates the core value proposition.

**Next Steps:**
1. Review and approve this design
2. Set up development worktree
3. Create detailed implementation plan
4. Begin Phase 1 development
