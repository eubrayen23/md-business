export type UserRole = 'buyer' | 'seller' | 'admin';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role?: UserRole;
  push_token?: string;
  created_at?: string;
};

export type PropertyStatus = 'draft' | 'published' | 'archived';

export type PropertyType = 'casa' | 'apartamento' | 'terreno' | 'outro';

export type Property = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price_kz: number;
  location: string;
  city?: string;
  property_type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area_m2: number;
  status: PropertyStatus;
  created_at?: string;
  updated_at?: string;
  images?: PropertyImage[];
  owner?: AppUser;
  favorites?: { user_id: string }[];
  is_favorite?: boolean;
};

export type PropertyImage = {
  id: string;
  property_id: string;
  image_url: string;
  created_at?: string;
};

export type Chat = {
  id: string;
  buyer_id: string;
  seller_id: string;
  property_id: string;
  created_at: string;
  property?: Property;
};

export type MessageType = 'text' | 'ai_suggestion';

export type Message = {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  type: MessageType;
  metadata?: Record<string, unknown>;
};
