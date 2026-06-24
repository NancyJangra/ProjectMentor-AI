export const TEXT_GENERATION_MODEL = "gpt-4o-mini";
export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_OUTPUT_DIMENSIONS = 768;

export const ACCEPTED_DOCUMENT_FILE_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".txt",
  ".md",
] as const;

export const ACCEPTED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
] as const;

export const MAXIMUM_UPLOAD_FILE_SIZE_IN_BYTES = 10 * 1024 * 1024;

export const MAXIMUM_CODEBASE_ZIP_SIZE_IN_BYTES = 25 * 1024 * 1024;

export const SOURCE_CODE_FILE_EXTENSIONS = [
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".py", ".java", ".kt", ".go", ".rb", ".php",
  ".c", ".h", ".cpp", ".hpp", ".cs",
  ".html", ".css", ".scss",
  ".sql", ".json", ".yaml", ".yml",
  ".md", ".txt",
] as const;

export const CODEBASE_FOLDERS_TO_IGNORE = [
  "node_modules/",
  ".git/",
  ".next/",
  "dist/",
  "build/",
  "venv/",
  "__pycache__/",
  ".venv/",
] as const;

export const MAXIMUM_TOKENS_FOR_DIRECT_CODE_ANALYSIS = 100_000;

export const CODE_CHUNK_SIZE_IN_CHARACTERS = 4_000;

export const NUMBER_OF_CODE_CHUNKS_TO_RETRIEVE = 12;

export const THEMATIC_CODE_RETRIEVAL_QUERIES = [
  "architecture and major design decisions",
  "complex algorithms or non-obvious business logic",
  "how data flows between different parts of the system",
  "error handling and edge cases",
  "configuration, external services, and integrations",
] as const;

export const INTERVIEW_QUESTION_DIFFICULTY_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;

export type InterviewQuestionDifficultyLevel =
  (typeof INTERVIEW_QUESTION_DIFFICULTY_LEVELS)[number];

export const NUMBER_OF_QUESTIONS_PER_DIFFICULTY_LEVEL = 4;

export const READINESS_SCORE_CATEGORIES = [
  "Project Understanding",
  "Architecture Knowledge",
  "Scalability Knowledge",
  "Security Awareness",
] as const;

export type ReadinessScoreCategory = (typeof READINESS_SCORE_CATEGORIES)[number];

export const MAXIMUM_READINESS_SCORE = 100;

export const SUPABASE_PROJECTS_TABLE = "projects";
export const SUPABASE_MATCH_PROJECTS_FUNCTION = "match_projects";

export const NUMBER_OF_SEARCH_RESULTS_TO_RETURN = 3;

export const MAX_RETRY_ATTEMPTS = 6;
export const FALLBACK_RETRY_DELAY_MS = 10_000;

export const GITHUB_REQUEST_USER_AGENT = "ProjectMentor-AI";
