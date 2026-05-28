export interface MemeImage {
  id: number;
  url: string;
  alt: string;
}

export interface RoadmapItem {
  phase: string;
  title: string;
  description: string;
  status: 'burned' | 'smoking' | 'unlit';
  icon: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; points: number }[];
}

export interface QuoteItem {
  id: number;
  text: string;
  author: string;
}
