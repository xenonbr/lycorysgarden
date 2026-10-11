export interface VRChatEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  vrchat_world: string;
  world_url?: string;
  image_url?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommentItem {
  id: string;
  image_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  author: string;
  vrchat_world?: string;
  likes: number;
  created_at: string;
  comments?: CommentItem[];
}

export interface Supporter {
  name: string;
  url: string;
  tagline: string;
  role: string;
  avatar?: string;
}
