// Core Entity Interfaces
export interface Destination {
  title: string;
  slug: string;
  subtitle?: string;
  imageUrls?: string[];
  image?: string;
}

export interface TourPackage {
  duration: any;
  _id: string;
  title: string;
  description: string;
  overview?: string;
  highlights?: string[];
  quickfacts?: string[];
  inclusions: string[];
  exclusions: string[];
  gallery: string[]; // image URLs

  location: {
    city: string;
    country?: string;
  };

  basePrice: number;
  currency?: string;
  googleMapUrl?: string;

  feature?: {
    groupSize?: { min: number; max?: number };
    tripDuration?: string;
    tripDifficulty?: string;
    meals?: string[];
    activities?: string[];
    accommodation?: string[];
    maxAltitude?: string | number;
    bestSeason?: string[];
    startEndPoint?: string;
  };

  itinerary: {
    day: number;
    title: string;
    description: string;
    image?: string;
  }[];
}

export interface Activity {
  title: string;
  slug: string;
  subtitle?: string;
  imageUrls?: string[];
  image?: string;
  name?: string;
  _id?: string;
}

export interface ContactInfo {
  whatsappNumber: string;
  phones: string[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// ✅ Alias Array Types for Easier Usage
export type Destinations = Destination[];
export type TourPackages = TourPackage[];
export type Activities = Activity[];

// ✅ Generic API Response Type
export interface APIResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

