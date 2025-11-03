export interface HandbookItem {
  id: string;
  title: string;
  content: string;
  category?: string;
}

export interface SearchResult {
  items: HandbookItem[];
  query: string;
}

export interface Club {
  id: string;
  name: string;
  type: 'academic' | 'sports' | 'cultural' | 'social';
  description: string;
  logo?: string;
  coverImage?: string;
  management?: Array<{
    position: string;
    name: string;
    term: string;
  }>;
  contact?: {
    email: string;
    fanpage?: string;
    phone?: string;
  };
  events?: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
  }>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'academic' | 'events' | 'clubs' | 'all';
  timestamp: Date;
  read: boolean;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  feedback?: 'liked' | 'disliked' | null;
}
