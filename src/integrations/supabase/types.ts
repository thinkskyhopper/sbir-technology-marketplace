export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contact_inquiries: {
        Row: {
          created_at: string
          id: string
          inquirer_id: string
          listing_id: string
          message: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          inquirer_id: string
          listing_id: string
          message: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          inquirer_id?: string
          listing_id?: string
          message?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_inquiries_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "sbir_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_listings: {
        Row: {
          created_at: string
          created_by: string
          display_order: number
          id: string
          listing_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          display_order?: number
          id?: string
          listing_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          display_order?: number
          id?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_listings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_listings_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "sbir_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_change_requests: {
        Row: {
          admin_notes: string | null
          admin_notes_for_user: string | null
          created_at: string
          id: string
          listing_agency: string | null
          listing_id: string | null
          listing_title: string | null
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          request_type: Database["public"]["Enums"]["change_request_type"]
          requested_changes: Json | null
          status: Database["public"]["Enums"]["change_request_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          admin_notes_for_user?: string | null
          created_at?: string
          id?: string
          listing_agency?: string | null
          listing_id?: string | null
          listing_title?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          request_type: Database["public"]["Enums"]["change_request_type"]
          requested_changes?: Json | null
          status?: Database["public"]["Enums"]["change_request_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          admin_notes_for_user?: string | null
          created_at?: string
          id?: string
          listing_agency?: string | null
          listing_id?: string | null
          listing_title?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          request_type?: Database["public"]["Enums"]["change_request_type"]
          requested_changes?: Json | null
          status?: Database["public"]["Enums"]["change_request_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_change_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "sbir_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_batches: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          sent_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          sent_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_batches_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "sbir_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_job_runs: {
        Row: {
          completed_at: string | null
          errors: Json | null
          id: string
          run_date: string
          started_at: string
          total_emails_sent: number | null
          total_users_processed: number | null
        }
        Insert: {
          completed_at?: string | null
          errors?: Json | null
          id?: string
          run_date: string
          started_at?: string
          total_emails_sent?: number | null
          total_users_processed?: number | null
        }
        Update: {
          completed_at?: string | null
          errors?: Json | null
          id?: string
          run_date?: string
          started_at?: string
          total_emails_sent?: number | null
          total_users_processed?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          can_submit_listings: boolean
          company_name: string | null
          created_at: string
          display_email: string | null
          email: string
          full_name: string | null
          id: string
          notification_categories: Json | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          bio?: string | null
          can_submit_listings?: boolean
          company_name?: string | null
          created_at?: string
          display_email?: string | null
          email: string
          full_name?: string | null
          id: string
          notification_categories?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          bio?: string | null
          can_submit_listings?: boolean
          company_name?: string | null
          created_at?: string
          display_email?: string | null
          email?: string
          full_name?: string | null
          id?: string
          notification_categories?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      sbir_listings: {
        Row: {
          agency: string
          approved_at: string | null
          approved_by: string | null
          category: string
          created_at: string
          date_sold: string | null
          deadline: string
          description: string
          id: string
          phase: Database["public"]["Enums"]["sbir_phase"]
          photo_url: string | null
          status: Database["public"]["Enums"]["listing_status"]
          submitted_at: string
          technology_summary: string | null
          title: string
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          agency: string
          approved_at?: string | null
          approved_by?: string | null
          category: string
          created_at?: string
          date_sold?: string | null
          deadline: string
          description: string
          id?: string
          phase: Database["public"]["Enums"]["sbir_phase"]
          photo_url?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          submitted_at?: string
          technology_summary?: string | null
          title: string
          updated_at?: string
          user_id: string
          value: number
        }
        Update: {
          agency?: string
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          created_at?: string
          date_sold?: string | null
          deadline?: string
          description?: string
          id?: string
          phase?: Database["public"]["Enums"]["sbir_phase"]
          photo_url?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          submitted_at?: string
          technology_summary?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_sbir_listings_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio: string
          created_at: string
          display_order: number
          id: string
          name: string
          photo_url: string | null
          promotion_description: string | null
          promotion_photo_url: string | null
          promotion_title: string | null
          promotions: Json | null
          updated_at: string
        }
        Insert: {
          bio: string
          created_at?: string
          display_order?: number
          id?: string
          name: string
          photo_url?: string | null
          promotion_description?: string | null
          promotion_photo_url?: string | null
          promotion_title?: string | null
          promotions?: Json | null
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          photo_url?: string | null
          promotion_description?: string | null
          promotion_photo_url?: string | null
          promotion_title?: string | null
          promotions?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      change_request_status: "pending" | "approved" | "rejected"
      change_request_type: "change" | "deletion"
      listing_status: "Active" | "Pending" | "Sold" | "Rejected" | "Hidden"
      sbir_phase: "Phase I" | "Phase II"
      user_role: "admin" | "user" | "consultant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      change_request_status: ["pending", "approved", "rejected"],
      change_request_type: ["change", "deletion"],
      listing_status: ["Active", "Pending", "Sold", "Rejected", "Hidden"],
      sbir_phase: ["Phase I", "Phase II"],
      user_role: ["admin", "user", "consultant"],
    },
  },
} as const
