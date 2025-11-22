-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  job_title TEXT,
  team TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('file_upload', 'manual_entry', 'survey')),
  file_type TEXT,
  file_url TEXT,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  search_vector TSVECTOR,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'complete', 'failed'))
);

-- Document tags (many-to-many)
CREATE TABLE public.document_tags (
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (document_id, tag)
);

-- Surveys table (future)
CREATE TABLE public.surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  questions JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX documents_search_idx ON public.documents USING GIN (search_vector);
CREATE INDEX documents_uploaded_by_idx ON public.documents(uploaded_by);
CREATE INDEX documents_status_idx ON public.documents(status);
CREATE INDEX documents_created_at_idx ON public.documents(uploaded_at DESC);
CREATE INDEX document_tags_tag_idx ON public.document_tags(tag);

-- Full-text search trigger
CREATE OR REPLACE FUNCTION documents_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER documents_search_vector_update
  BEFORE INSERT OR UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION documents_search_trigger();

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users
CREATE POLICY "Users are viewable by authenticated users"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies: Documents
CREATE POLICY "Documents are viewable by authenticated users"
  ON public.documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own documents"
  ON public.documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own documents"
  ON public.documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- RLS Policies: Document Tags
CREATE POLICY "Tags are viewable by authenticated users"
  ON public.document_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can tag their own documents"
  ON public.document_tags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE id = document_id
      AND uploaded_by = auth.uid()
    )
  );

-- RLS Policies: Surveys
CREATE POLICY "Surveys are viewable by authenticated users"
  ON public.surveys FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own surveys"
  ON public.surveys FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);
