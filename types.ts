
export interface ToolStats {
  words: number;
  characters: number;
  sentences: number;
  paragraphs: number;
}

export interface KeywordInfo {
  word: string;
  count: number;
  density: number;
}

export interface MetaData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  robots: string;
}

export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface BlogComment {
  id: string;
  blogId: string;
  userId: string;
  userName: string;
  content: string;
  date: string;
  parentId?: string; // ID of the comment this is replying to
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  author: string;
  date: string;
  status: 'draft' | 'published';
  category: string;
  tags: string[];
  image: string;
  seoTitle: string;
  seoDescription: string;
}

export interface AppSettings {
  enabledTools: string[]; // paths like '/word-counter'
}
