export interface Chapter {
  id: string;
  title: string;
  content: string;
  summary: string | null; // Auto-generated summary for context
  lastModified: number;
}

export interface Book {
  id: string;
  title: string;
  premise: string; // The core idea/framework
  style: string; // Tone, writing style
  characters: string; // Character bios
  chapters: Chapter[];
  lastActiveChapterId: string | null;
}

export interface GenerationParams {
  prompt: string;
  wordCount: number;
  includeContext: boolean;
}

export enum AppView {
  EDITOR = 'EDITOR',
  SETTINGS = 'SETTINGS',
}