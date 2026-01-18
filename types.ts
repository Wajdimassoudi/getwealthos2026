
export enum MarketType {
  REAL_ESTATE = 'REAL_ESTATE',
  CRYPTO = 'CRYPTO',
  JOBS = 'JOBS',
  FREELANCE = 'FREELANCE',
  ECOMMERCE = 'ECOMMERCE',
  TRAVEL = 'TRAVEL',
  CARS = 'CARS'
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  profession?: string;
  cv_url?: string;
  bio?: string;
  is_public: boolean;
  country: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
  rate: number;
}

export interface Listing {
  id: string;
  user_id: string;
  type: MarketType;
  sub_type?: string; // شقة، محل، سيارة دفع رباعي، إلخ
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[]; // مصفوفة لـ 6 صور
  specs?: any; // تفاصيل إضافية (سنة، مساحة، إلخ)
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  seller: string;
}

export interface Freelancer {
  id: string;
  name: string;
  role: string;
  skills: string[];
  rating: number;
  hourlyRate: number;
  avatar: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface TranslationStrings {
  [key: string]: {
    en: string;
    ar: string;
    fr: string;
    es: string;
  };
}
