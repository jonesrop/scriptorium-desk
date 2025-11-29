export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      authors: {
        Row: {
          biography: string | null
          birth_date: string | null
          created_at: string
          first_name: string
          id: string
          last_name: string
          nationality: string | null
          updated_at: string
        }
        Insert: {
          biography?: string | null
          birth_date?: string | null
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          nationality?: string | null
          updated_at?: string
        }
        Update: {
          biography?: string | null
          birth_date?: string | null
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          nationality?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      book_authors: {
        Row: {
          author_id: string
          book_id: string
          id: string
        }
        Insert: {
          author_id: string
          book_id: string
          id?: string
        }
        Update: {
          author_id?: string
          book_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_authors_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_authors_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_copies: {
        Row: {
          book_id: string
          condition: string
          copy_number: string
          created_at: string
          id: string
          is_available: boolean
          last_maintenance: string | null
          location: string | null
          updated_at: string
        }
        Insert: {
          book_id: string
          condition?: string
          copy_number: string
          created_at?: string
          id?: string
          is_available?: boolean
          last_maintenance?: string | null
          location?: string | null
          updated_at?: string
        }
        Update: {
          book_id?: string
          condition?: string
          copy_number?: string
          created_at?: string
          id?: string
          is_available?: boolean
          last_maintenance?: string | null
          location?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_copies_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_favorites: {
        Row: {
          book_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_favorites_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_recommendations: {
        Row: {
          book_id: string
          created_at: string
          id: string
          reason: string | null
          score: number
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          reason?: string | null
          score?: number
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          reason?: string | null
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_recommendations_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_reservations: {
        Row: {
          book_id: string
          created_at: string
          id: string
          request_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          request_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          request_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_reservations_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_reviews: {
        Row: {
          book_id: string
          created_at: string
          id: string
          is_approved: boolean
          rating: number
          review_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          is_approved?: boolean
          rating: number
          review_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          rating?: number
          review_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string
          available_copies: number
          borrow_count: number
          call_number: string
          category_id: string | null
          created_at: string
          description: string | null
          genre: string
          id: string
          isbn: string | null
          publication_year: number | null
          publisher: string
          publisher_id: string | null
          title: string
          total_copies: number
          updated_at: string
        }
        Insert: {
          author: string
          available_copies?: number
          borrow_count?: number
          call_number: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          genre: string
          id?: string
          isbn?: string | null
          publication_year?: number | null
          publisher: string
          publisher_id?: string | null
          title: string
          total_copies?: number
          updated_at?: string
        }
        Update: {
          author?: string
          available_copies?: number
          borrow_count?: number
          call_number?: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          genre?: string
          id?: string
          isbn?: string | null
          publication_year?: number | null
          publisher?: string
          publisher_id?: string | null
          title?: string
          total_copies?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "publishers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      fines: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          id: string
          issued_book_id: string | null
          paid_date: string | null
          reason: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          issued_book_id?: string | null
          paid_date?: string | null
          reason: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          issued_book_id?: string | null
          paid_date?: string | null
          reason?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fines_issued_book_id_fkey"
            columns: ["issued_book_id"]
            isOneToOne: false
            referencedRelation: "issued_books"
            referencedColumns: ["id"]
          },
        ]
      }
      issued_books: {
        Row: {
          book_id: string
          created_at: string
          due_date: string
          fine_amount: number
          id: string
          issue_date: string
          max_renewals: number
          renewal_count: number
          return_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          due_date: string
          fine_amount?: number
          id?: string
          issue_date?: string
          max_renewals?: number
          renewal_count?: number
          return_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          due_date?: string
          fine_amount?: number
          id?: string
          issue_date?: string
          max_renewals?: number
          renewal_count?: number
          return_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "issued_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      library_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          contact_number: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          role: string
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          contact_number?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean
          last_name: string
          role?: string
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          contact_number?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
          role?: string
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      publishers: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      reading_goals: {
        Row: {
          created_at: string
          current_value: number
          end_date: string
          goal_type: string
          id: string
          start_date: string
          status: string
          target_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number
          end_date: string
          goal_type?: string
          id?: string
          start_date: string
          status?: string
          target_value: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number
          end_date?: string
          goal_type?: string
          id?: string
          start_date?: string
          status?: string
          target_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_history: {
        Row: {
          book_id: string
          created_at: string
          id: string
          notes: string | null
          reading_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          notes?: string | null
          reading_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          reading_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_history_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_renew_book: { Args: { issued_book_id: string }; Returns: boolean }
      renew_book: {
        Args: { issued_book_id: string; renewal_days?: number }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
