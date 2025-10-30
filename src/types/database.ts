export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          name: string;
          brand: string;
          feature_image: string;
          additional_images: string[] | null;
          url: string;
          price: number | null;
          description: string;
          short_commentary: string | null;
          long_commentary: string | null;
          created_at: string;
          updated_at: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          brand: string;
          feature_image: string;
          additional_images?: string[] | null;
          url: string;
          price?: number | null;
          description: string;
          short_commentary?: string | null;
          long_commentary?: string | null;
          created_at?: string;
          updated_at?: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          brand?: string;
          feature_image?: string;
          additional_images?: string[] | null;
          url?: string;
          price?: number | null;
          description?: string;
          short_commentary?: string | null;
          long_commentary?: string | null;
          created_at?: string;
          updated_at?: string;
          published?: boolean;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

export type Post = Database['public']['Tables']['posts']['Row'];
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];