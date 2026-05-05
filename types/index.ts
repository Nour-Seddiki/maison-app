// ============================================================
// MAISON & CO. — TYPE DEFINITIONS
// ============================================================

export type UserRole = 'client' | 'seller' | 'admin';
export type PropertyStatus = 'draft' | 'pending_review' | 'active' | 'sold' | 'rented' | 'off_market';
export type PropertyType = 'penthouse' | 'townhouse' | 'villa' | 'apartment' | 'estate' | 'mews' | 'manor';
export type ListingType = 'sale' | 'rent' | 'off_market';
export type InquiryStatus = 'new' | 'contacted' | 'viewing_scheduled' | 'negotiating' | 'closed' | 'declined';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  nationality: string | null;
  national_id: string | null;
  national_id_image_url: string | null;
  preferred_currency: string;
  bio: string | null;
  location: string | null;
  company_name: string | null;
  license_number: string | null;
  is_verified: boolean;
  is_banned: boolean | null;
  nda_signed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string | null;
  cover_image_url: string | null;
  slug: string;
  created_at: string;
}

export interface Property {
  id: string;
  seller_id: string;
  title: string;
  slug: string;
  property_type: PropertyType;
  listing_type: ListingType;
  status: PropertyStatus;
  full_address: string;
  city: string;
  postcode: string | null;
  neighborhood_id: string | null;
  latitude: number | null;
  longitude: number | null;
  price: number;
  price_per_week: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sq_ft: number | null;
  floors: number | null;
  year_built: number | null;
  is_freehold: boolean;
  is_grade_listed: boolean;
  grade_listing: string | null;
  description: string | null;
  narrative: string | null;
  editorial_accent_color: string;
  cover_image_url: string | null;
  features: string[];
  view_count: number;
  is_featured: boolean;
  is_off_market: boolean;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  images?: PropertyImage[];
  neighborhood?: Neighborhood;
  seller?: Profile;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  alt_text: string | null;
  caption: string | null;
  display_order: number;
  is_cover: boolean;
  created_at: string;
}

export interface SavedProperty {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  property?: Property;
}

export interface Inquiry {
  id: string;
  property_id: string;
  client_id: string | null;
  seller_id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  message: string | null;
  preferred_viewing_date: string | null;
  status: InquiryStatus;
  seller_notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  property?: Property;
  client?: Profile;
}

export interface Concierge {
  id: string;
  profile_id: string | null;
  name: string;
  title: string;
  specialization: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface MarketInsight {
  id: string;
  author_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category: string | null;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  is_confirmed: boolean;
  subscribed_at: string;
}

// API/Filter types
export interface PropertyFilters {
  location?: string;
  property_type?: PropertyType;
  listing_type?: ListingType;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  neighborhood_id?: string;
  status?: PropertyStatus;
  is_featured?: boolean;
  is_off_market?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Component prop types
export interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  pricePerWeek?: number;
  listingType: ListingType;
  status?: PropertyStatus;
  bedrooms: number | null;
  sqFt: number | null;
  coverImage: string;
  neighborhoodBadge?: string;
  isGradeListed?: boolean;
  gradeListing?: string;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}
