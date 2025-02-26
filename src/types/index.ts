export interface SiteSettings {
  id: string;
  logo_url: string;
  company_name: string;
  primary_color: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  social_facebook: string;
  social_instagram: string;
  social_whatsapp: string;
  whatsapp_message: string;
  stats_customers: string;
  stats_projects: string;
  stats_experience: string;
  stats_support: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url?: string;
  price?: number;
  features: string[];
  created_at: string;
}

export interface ContactForm {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  service_type: string;
  status: 'pending' | 'contacted' | 'completed';
  notes?: string[];
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  features: string[];
  is_featured: boolean;
  featured_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  created_at: string;
  updated_at: string;
}