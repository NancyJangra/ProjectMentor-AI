-- Auth migration: run this after schema.sql.
-- Safe to run multiple times (uses IF NOT EXISTS / CREATE OR REPLACE).

-- Add user_id column to tie each project to a Supabase Auth user.
alter table projects
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Index for fast per-user queries.
create index if not exists projects_user_id_index
  on projects (user_id);

-- Row Level Security: users can only access their own rows.
alter table projects enable row level security;

create policy "users can read their own projects"
  on projects for select
  using (user_id = auth.uid());

create policy "users can insert their own projects"
  on projects for insert
  with check (user_id = auth.uid());

create policy "users can delete their own projects"
  on projects for delete
  using (user_id = auth.uid());

-- Updated match_projects function with per-user filtering.
-- filter_user_id avoids naming collision with the user_id column.
create or replace function match_projects (
  query_embedding vector(768),
  match_count int,
  filter_user_id uuid
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
  where projects.user_id = filter_user_id
  order by projects.embedding <=> query_embedding
  limit match_count;
$$;
