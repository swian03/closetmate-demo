export type ClothingCategory = 'top' | 'bottom' | 'outerwear' | 'dress' | 'shoes' | 'accessory';
export type ClothingStatus = 'active' | 'idle' | 'laundry' | 'damaged' | 'hidden';
export type Occasion = 'commute' | 'date' | 'casual' | 'sport' | 'formal';
export type StyleTag = 'minimal' | 'vintage' | 'sweetcool' | 'casual' | 'elegant';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type CityKey = 'shanghai' | 'beijing' | 'guangzhou' | 'shenzhen' | 'hangzhou';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  color: string;
  material?: string;
  size?: string;
  brand?: string;
  price?: number;
  occasions: Occasion[];
  seasons: Season[];
  styleTags: StyleTag[];
  status: ClothingStatus;
  favorite: boolean;
  imageUri?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  wornCount: number;
  lastWornAt?: string;
}

export interface Outfit {
  id: string;
  name: string;
  itemIds: string[];
  occasion: Occasion;
  style: StyleTag;
  score: number;
  note: string;
  weatherHint: string;
  source: 'generated' | 'manual';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  lastWornAt?: string;
  isTodayLook?: boolean;
}

export interface UserProfile {
  nickname: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  skinTone?: string;
  preferredStyles: StyleTag[];
  city: CityKey;
  reminderTime: string;
}

export interface WeatherSnapshot {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  windSpeed: number;
  description: string;
  advice: string;
  fetchedAt: string;
}

export interface GeneratedOutfit {
  id: string;
  title: string;
  itemIds: string[];
  occasion: Occasion;
  style: StyleTag;
  score: number;
  summary: string;
  weatherHint: string;
}
