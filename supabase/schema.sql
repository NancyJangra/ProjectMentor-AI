-- Enable pgvector for vector similarity search.
create extension if not exists vector;

-- Projects table: stores the full analysis JSON and embedding for each saved project.
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  analysis jsonb not null,
  embedding vector(768) not null,
  created_at timestamptz not null default now()
);

-- HNSW index for fast cosine similarity search.
create index if not exists projects_embedding_hnsw_index
  on projects
  using hnsw (embedding vector_cosine_ops);

-- Postgres function for vector similarity search.
-- "<=>" is pgvector's cosine distance operator; we return 1 - distance as similarity.
create or replace function match_projects (
  query_embedding vector(768),
  match_count int
)
returns table (
  id uuid,
  title text,
  analysis jsonb,
  created_at timestamptz,
  similarity float
)
language sql stable
as $$
  select
    projects.id,
    projects.title,
    projects.analysis,
    projects.created_at,
    1 - (projects.embedding <=> query_embedding) as similarity
  from projects
  order by projects.embedding <=> query_embedding
  limit match_count;
$$;
