export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Loose type to avoid "Property X does not exist on type 'never'" cascade.
// We cast manually where needed in app code.
export interface Database {
  public: {
    Tables: {
      [k: string]: {
        Row: { [key: string]: any };
        Insert: { [key: string]: any };
        Update: { [key: string]: any };
      };
    };
    Views: { [k: string]: any };
    Functions: { [k: string]: any };
    Enums: { [k: string]: any };
  };
}