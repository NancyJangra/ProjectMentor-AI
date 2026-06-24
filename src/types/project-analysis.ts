import type { InterviewQuestionDifficultyLevel, ReadinessScoreCategory } from "@/lib/constants";

export interface ExtractedDocumentText {
  originalFileName: string;
  text: string;
}

export interface ProjectUnderstanding {
  title: string;
  objective: string;
  problemStatement: string;
  techStack: string[];
  architecture: string;
  methodology: string;
  results: string;
}

export interface InterviewIntroductions {
  thirtySecondPitch: string;
  oneMinutePitch: string;
  twoMinutePitch: string;
  hrFriendlyVersion: string;
  technicalVersion: string;
}

export interface ProjectExplanation {
  architectureOverview: string;
  workflow: string;
  dataFlow: string;
}

export interface InterviewQuestion {
  id: string;
  difficulty: InterviewQuestionDifficultyLevel;
  question: string;
}

export interface InterviewQuestionAnswer {
  questionId: string;
  answer: string;
}

export interface InterviewQuestionWithAnswer extends InterviewQuestion {
  answer: string;
}

export interface FollowUpQuestion {
  question: string;
}

export interface ProjectWeakness {
  id: string;
  area: string;
  description: string;
}

export interface ImprovementSuggestion {
  relatedWeaknessId: string;
  suggestion: string;
}

export interface ResumeBullets {
  bullets: string[];
}

export interface CodebaseSourceFile {
  filePath: string;
  content: string;
}

export type CodeAnalysisMethod = "direct" | "chunked-retrieval";

export interface CodeAnalysisResult {
  questions: InterviewQuestionWithAnswer[];
  analysisMethod: CodeAnalysisMethod;
  totalTokensInCodebase: number;
  numberOfFilesRead: number;
}

export interface EmbeddedCodeChunk {
  filePath: string;
  chunkText: string;
  embedding: number[];
}

export interface ReadinessScoreCategoryResult {
  category: ReadinessScoreCategory;
  score: number;
  justification: string;
}

export interface ReadinessScore {
  categories: ReadinessScoreCategoryResult[];
  overallScore: number;
}

export interface LearningRoadmapItem {
  category: ReadinessScoreCategory;
  recommendation: string;
}

export interface LearningRoadmap {
  items: LearningRoadmapItem[];
}

export interface ProjectAnalysis {
  projectUnderstanding: ProjectUnderstanding;
  introductions: InterviewIntroductions;
  explanation: ProjectExplanation;
  questionsWithAnswers: InterviewQuestionWithAnswer[];
  weaknesses: ProjectWeakness[];
  improvements: ImprovementSuggestion[];
  resumeBullets: ResumeBullets;
  readinessScore: ReadinessScore;
  roadmap: LearningRoadmap;
}

export interface GithubRepoAnalysisResult {
  /** e.g. "facebook/react" */
  repoFullName: string;
  /** null when the repository has no README file. */
  analysis: ProjectAnalysis | null;
  codeAnalysis: CodeAnalysisResult;
}

export interface SavedProject {
  id: string;
  title: string;
  analysis: ProjectAnalysis;
  createdAt: string;
}

export interface ProjectSearchResult {
  project: SavedProject;
  /** Cosine similarity to the search query, from 0 (unrelated) to 1 (identical). */
  similarity: number;
}

export interface ProjectSearchResponse {
  results: ProjectSearchResult[];
  explanation: string;
}
