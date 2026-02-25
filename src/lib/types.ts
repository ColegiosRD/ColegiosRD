export interface School {
  id: string;
  minerd_code: string | null;
  name: string;
  slug: string;
  province_id: number;
  province?: Province;
  type: 'Privado' | 'Público';
  level: string;
  prueba_nacional: number | null;
  enrollment: number | null;
  rating: number | null;
  students_per_class: number | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  logo_url: string | null;
  founded: number | null;
  tuition_min: number | null;
  tuition_max: number | null;
  extracurriculars: string[];
  languages: string[];
  certifications: string[];
  infrastructure: string[];
  photos: string[];
  video_url: string | null;
  social_links: Record<string, string>;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  subscription_tier: 'basico' | 'verificado' | 'premium' | 'elite';
  is_top_public: boolean;
  is_featured: boolean;
  hide_competitor_ads: boolean;
  created_at: string;
  updated_at: string;
}

export interface Province {
  id: number;
  name: string;
  zone: string;
}

export interface OpenHouseEvent {
  id: string;
  school_id: string;
  school?: School;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  description: string | null;
  is_featured: boolean;
}

export interface VerificationRequest {
  id: string;
  school_id: string;
  director_name: string;
  director_phone: string;
  requester_role: string;
  official_contact_email: string;
  email: string;
  email_type: 'institutional' | 'personal';
  documents: string[];
  status: 'pending' | 'verified' | 'rejected';
}

export interface ContactRequest {
  school_id: string;
  request_type: 'info' | 'visit' | 'openhouse';
  parent_name: string;
  parent_email: string;
  parent_phone?: string;
  message?: string;
}

export interface NewsletterSubscriber {
  email: string;
  name?: string;
  source?: string;
}

export interface AdInquiry {
  email: string;
  company_name?: string;
  inquiry_type?: string;
  message?: string;
}

// Filters for school listing
export interface SchoolFilters {
  search?: string;
  type?: 'Privado' | 'Público' | 'all';
  zone?: string;
  province?: string;
  sortBy?: 'rating' | 'prueba' | 'students' | 'name';
  page?: number;
  limit?: number;
}
