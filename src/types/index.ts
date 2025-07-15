// Core Entity Interfaces
export interface Destination {
  title: string;
  slug: string;
  subtitle?: string;
  imageUrls?: string[];
  image?: string;
}

export interface TourPackage {
  _id: string;
  title: string;
  description: string;
  overview: string;
  location: {
    city: string;
    country: string;
  };
  basePrice: number;
  currency: string;
  gallery: string;
  duration: {
    days: number;
    nights: number;
  };
  imageUrls?: string[];
  category?: {
    _id: string;
    title: string;
    slug: string;
  };
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
