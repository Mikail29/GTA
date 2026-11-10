export type UserRole = "user" | "moderator" | "admin";

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  is_banned?: boolean;
  created_at: string;
}

export interface QuestionAuthor {
  username: string;
  avatar_url: string | null;
}

export interface Answer {
  id: string;
  question_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
  updated_at: string | null;
  likes_count: number;
  author: QuestionAuthor | null;
}

export interface Question {
  id: string;
  author_id: string | null;
  title: string;
  body: string;
  category: string;
  status: "offen" | "beantwortet" | "geschlossen";
  is_hidden: boolean;
  created_at: string;
  updated_at: string | null;
  likes_count: number;
  answers_count: number;
  /** Oben angeheftet (z. B. Starter-Threads). */
  is_pinned?: boolean;
  /** Offizieller Beitrag des GTA6-Kompass-Teams. */
  is_official?: boolean;
  author: QuestionAuthor | null;
  /** true für statische Beispieldaten (keine Datenbank verbunden). */
  demo?: boolean;
}

export interface CommunityCategory {
  slug: string;
  name: string;
  description: string;
}

export interface Comment {
  id: string;
  answer_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
  author: QuestionAuthor | null;
}
