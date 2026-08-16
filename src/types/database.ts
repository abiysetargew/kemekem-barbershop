export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "in_service"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Branch {
  id: string;
  shop_id: string | null;
  name: string;
  address: string;
  city: string | null;
  phone: string | null;
  maps_url: string | null;
  working_hours: WorkingHours;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  shop_id: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  duration_minutes: number;
  price: number;
  category: string | null;
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Barber {
  id: string;
  shop_id: string | null;
  name: string;
  bio: string | null;
  photo_url: string | null;
  experience_years: number;
  branch_id: string | null;
  working_days: string[];
  working_hours: WorkingHours;
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  shop_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  birthday: string | null; // YYYY-MM-DD
  visit_count: number;
  last_visit_at: string | null;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = "unpaid" | "paid";
export type PaymentMethod = "cash" | "card" | "telebirr" | "transfer" | "other";
export type CancelReason =
  | "customer_no_show"
  | "customer_canceled"
  | "barber_unavailable"
  | "shop_closed"
  | "other";

export interface Appointment {
  id: string;
  shop_id: string | null;
  appointment_number: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  notes: string | null;
  branch_id: string;
  service_id: string;
  barber_id: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm:ss
  end_time: string; // HH:mm:ss
  status: AppointmentStatus;
  cancel_token: string;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | null;
  paid_at: string | null;
  paid_amount: number | null;
  cancel_reason: CancelReason | null;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  shop_id: string | null;
  image_url: string;
  category: string;
  title: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  shop_id: string | null;
  customer_name: string;
  rating: number;
  content: string | null;
  avatar_url: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface BusinessSettings {
  shop_id: string;
  business_name: string;
  tagline: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  hero_image_url: string | null;
  hero_video_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  maps_url: string | null;
  business_hours: WorkingHours;
  primary_color: string;
  booking_interval_minutes: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image_url: string | null;
  footer_text: string | null;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  shop_id: string | null;
  platform:
    | "instagram"
    | "facebook"
    | "tiktok"
    | "telegram"
    | "youtube"
    | "x"
    | "whatsapp";
  url: string;
  display_order: number;
}

export interface WorkingHours {
  open: string;
  close: string;
  days?: string;
}

export interface BookingFormData {
  branch_id: string;
  service_id: string;
  barber_id: string;
  date: string;
  start_time: string;
  customer_name: string;
  customer_phone: string;
  notes?: string;
  referred_by?: string;
}