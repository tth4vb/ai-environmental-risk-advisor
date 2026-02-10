CREATE OR REPLACE FUNCTION search_documents(search_query TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  source_type TEXT,
  file_type TEXT,
  file_url TEXT,
  uploaded_by UUID,
  uploaded_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  metadata JSONB,
  status TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.title,
    d.content,
    d.source_type,
    d.file_type,
    d.file_url,
    d.uploaded_by,
    d.uploaded_at,
    d.updated_at,
    d.metadata,
    d.status,
    ts_rank(d.search_vector, to_tsquery('english', search_query || ':*')) as rank
  FROM documents d
  WHERE d.search_vector @@ to_tsquery('english', search_query || ':*')
    AND d.status = 'complete'
  ORDER BY rank DESC, d.uploaded_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;
