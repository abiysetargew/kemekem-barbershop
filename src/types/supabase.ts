export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      branches: { Row: any; Insert: any; Update: any };
      services: { Row: any; Insert: any; Update: any };
      barbers: { Row: any; Insert: any; Update: any };
      customers: { Row: any; Insert: any; Update: any };
      appointments: { Row: any; Insert: any; Update: any };
      gallery: { Row: any; Insert: any; Update: any };
      reviews: { Row: any; Insert: any; Update: any };
      business_settings: { Row: any; Insert: any; Update: any };
      social_links: { Row: any; Insert: any; Update: any };
      admin_users: { Row: any; Insert: any; Update: any };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}