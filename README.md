# ProjectMentor AI

Check it out at [ProjectMentor AI](https://projectmentor-ai-full.vercel.app/)

A Next.js app that analyzes your projects and prepares you for technical interviews. Upload a resume, drop a GitHub repo URL, or zip up a codebase — the app generates interview questions, readiness scores, weakness analysis, resume bullets, and a semantic project library you can search across.

## Features

- **Project analysis** — upload a PDF/DOCX resume or paste a GitHub repo URL to get structured interview prep material
- **Codebase analysis** — upload a zip of your source code; the app chunks and embeds it to generate code-specific questions
- **Interview questions** — grouped by difficulty (easy / medium / hard)
- **Readiness score** — per-category scores with a visual ring indicator
- **Weakness analysis** — identifies gaps with improvement suggestions and a learning roadmap
- **Follow-up practice** — interactive follow-up questions for each interview question
- **Resume bullets** — AI-generated bullet points you can copy straight into your CV
- **Project library** — saves analyzed projects to Supabase; semantic search finds similar ones using pgvector
- **Auth** — email/password + Google and GitHub OAuth via Supabase Auth

## Tech stack

- [Next.js](https://nextjs.org/) 14+ (App Router, TypeScript)
- [OpenAI](https://platform.openai.com/) — `gpt-4o-mini` for generation, `text-embedding-3-small` for embeddings
- [Supabase](https://supabase.com/) — Postgres + pgvector for storage and semantic search, Auth for sign-in
- [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- [pdfjs-dist](https://github.com/mozilla/pdfjs-dist) for PDF parsing, [mammoth](https://github.com/mwilliamson/mammoth.js) for DOCX

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/projectmentor-ai.git
cd projectmentor-ai
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. In the SQL Editor, run `supabase/schema.sql`, then `supabase/add-auth.sql`
3. In **Authentication → Providers**, enable Google and/or GitHub and paste in their client ID + secret
4. Set the OAuth callback URL to `http://localhost:3000/auth/callback` (and your production domain when deploying)

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
OPENAI_API_KEY=sk-...

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/              # Next.js App Router pages and API routes
  components/       # React components (results, library, auth, upload)
  lib/
    ai/             # OpenAI generation functions (questions, scores, bullets, etc.)
    code-analysis/  # Code chunking, embedding, and retrieval
    file-parsing/   # PDF, DOCX, and plain-text extractors
    github/         # GitHub repo URL parsing and zip fetching
    supabase/       # Database and auth helpers
  types/            # Shared TypeScript types
supabase/
  schema.sql        # Initial schema (projects table + pgvector index)
  add-auth.sql      # Auth migration (user_id column + RLS policies)
```

