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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action_type: Database["public"]["Enums"]["admin_action_type"]
          admin_id: string
          changes_made: Json | null
          created_at: string
          id: string
          internal_notes: string | null
          listing_agency: string
          listing_id: string | null
          listing_title: string
          user_notes: string | null
          user_notified: boolean
        }
        Insert: {
          action_type: Database["public"]["Enums"]["admin_action_type"]
          admin_id: string
          changes_made?: Json | null
          created_at?: string
          id?: string
          internal_notes?: string | null
          listing_agency: string
          listing_id?: string | null
          listing_title: string
          user_notes?: string | null
          user_notified?: boolean
        }
        Update: {
          action_type?: Database["public"]["Enums"]["admin_action_type"]
          admin_id?: string
          changes_made?: Json | null
          created_at?: string
          id?: string
          internal_notes?: string | null
          listing_agency?: string
          listing_id?: string | null
          listing_title?: string
          user_notes?: string | null
          user_notified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_audit_logs_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "sbir_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_settings: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_public: boolean
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_public?: boolean
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_public?: boolean
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
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
          {
            foreignKeyName: "listing_change_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          related_id: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          related_id?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          related_id?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_deleted: boolean
          account_deleted_at: string | null
          account_locked: boolean
          account_locked_at: string | null
          account_locked_until: string | null
          bio: string | null
          can_submit_listings: boolean
          category_email_notifications_enabled: boolean
          company_name: string | null
          created_at: string
          display_email: string | null
          email: string
          email_notifications_enabled: boolean
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          listing_email_notifications_enabled: boolean
          lock_reason: string | null
          marketing_emails_enabled: boolean
          notification_categories: Json | null
          photo_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          account_deleted?: boolean
          account_deleted_at?: string | null
          account_locked?: boolean
          account_locked_at?: string | null
          account_locked_until?: string | null
          bio?: string | null
          can_submit_listings?: boolean
          category_email_notifications_enabled?: boolean
          company_name?: string | null
          created_at?: string
          display_email?: string | null
          email: string
          email_notifications_enabled?: boolean
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          listing_email_notifications_enabled?: boolean
          lock_reason?: string | null
          marketing_emails_enabled?: boolean
          notification_categories?: Json | null
          photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          account_deleted?: boolean
          account_deleted_at?: string | null
          account_locked?: boolean
          account_locked_at?: string | null
          account_locked_until?: string | null
          bio?: string | null
          can_submit_listings?: boolean
          category_email_notifications_enabled?: boolean
          company_name?: string | null
          created_at?: string
          display_email?: string | null
          email?: string
          email_notifications_enabled?: boolean
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          listing_email_notifications_enabled?: boolean
          lock_reason?: string | null
          marketing_emails_enabled?: boolean
          notification_categories?: Json | null
          photo_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      rate_limit_attempts: {
        Row: {
          action_type: string
          attempted_at: string
          id: string
          identifier: string
          ip_address: string | null
        }
        Insert: {
          action_type: string
          attempted_at?: string
          id?: string
          identifier: string
          ip_address?: string | null
        }
        Update: {
          action_type?: string
          attempted_at?: string
          id?: string
          identifier?: string
          ip_address?: string | null
        }
        Relationships: []
      }
      sbir_listings: {
        Row: {
          address: string | null
          agency: string
          agency_tracking_number: string | null
          approved_at: string | null
          approved_by: string | null
          bc_email: string | null
          bc_phone: string | null
          business_contact_name: string | null
          category: string
          company: string | null
          contract: string | null
          contract_end_date: string | null
          created_at: string
          date_sold: string | null
          deadline: string | null
          description: string
          description_backup: string | null
          id: string
          internal_description: string | null
          internal_title: string | null
          listing_type: Database["public"]["Enums"]["listing_type"]
          phase: Database["public"]["Enums"]["sbir_phase"]
          photo_url: string | null
          pi_email: string | null
          pi_phone: string | null
          primary_investigator_name: string | null
          proposal_award_date: string | null
          recommended_affiliate_1_id: string | null
          recommended_affiliate_2_id: string | null
          status: Database["public"]["Enums"]["listing_status"]
          submitted_at: string
          technology_summary: string | null
          title: string
          title_backup: string | null
          topic_code: string | null
          updated_at: string
          user_id: string
          value: number
        }
        Insert: {
          address?: string | null
          agency: string
          agency_tracking_number?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bc_email?: string | null
          bc_phone?: string | null
          business_contact_name?: string | null
          category: string
          company?: string | null
          contract?: string | null
          contract_end_date?: string | null
          created_at?: string
          date_sold?: string | null
          deadline?: string | null
          description: string
          description_backup?: string | null
          id?: string
          internal_description?: string | null
          internal_title?: string | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          phase: Database["public"]["Enums"]["sbir_phase"]
          photo_url?: string | null
          pi_email?: string | null
          pi_phone?: string | null
          primary_investigator_name?: string | null
          proposal_award_date?: string | null
          recommended_affiliate_1_id?: string | null
          recommended_affiliate_2_id?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          submitted_at?: string
          technology_summary?: string | null
          title: string
          title_backup?: string | null
          topic_code?: string | null
          updated_at?: string
          user_id: string
          value: number
        }
        Update: {
          address?: string | null
          agency?: string
          agency_tracking_number?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bc_email?: string | null
          bc_phone?: string | null
          business_contact_name?: string | null
          category?: string
          company?: string | null
          contract?: string | null
          contract_end_date?: string | null
          created_at?: string
          date_sold?: string | null
          deadline?: string | null
          description?: string
          description_backup?: string | null
          id?: string
          internal_description?: string | null
          internal_title?: string | null
          listing_type?: Database["public"]["Enums"]["listing_type"]
          phase?: Database["public"]["Enums"]["sbir_phase"]
          photo_url?: string | null
          pi_email?: string | null
          pi_phone?: string | null
          primary_investigator_name?: string | null
          proposal_award_date?: string | null
          recommended_affiliate_1_id?: string | null
          recommended_affiliate_2_id?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          submitted_at?: string
          technology_summary?: string | null
          title?: string
          title_backup?: string | null
          topic_code?: string | null
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
          {
            foreignKeyName: "sbir_listings_recommended_affiliate_1_id_fkey"
            columns: ["recommended_affiliate_1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sbir_listings_recommended_affiliate_2_id_fkey"
            columns: ["recommended_affiliate_2_id"]
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
      user_bookmarks: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "sbir_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_unlock_user_account: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      change_user_role: {
        Args: {
          new_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: boolean
      }
      cleanup_old_rate_limit_attempts: { Args: never; Returns: undefined }
      current_user_is_admin: { Args: never; Returns: boolean }
      current_user_not_deleted: { Args: never; Returns: boolean }
      get_profile_listings: {
        Args: { target_user_id: string }
        Returns: {
          agency: string
          approved_at: string
          category: string
          created_at: string
          date_sold: string
          deadline: string
          description: string
          id: string
          listing_type: Database["public"]["Enums"]["listing_type"]
          phase: Database["public"]["Enums"]["sbir_phase"]
          photo_url: string
          status: Database["public"]["Enums"]["listing_status"]
          submitted_at: string
          technology_summary: string
          title: string
          updated_at: string
          user_id: string
          value: number
        }[]
      }
      get_public_featured_listings: {
        Args: never
        Returns: {
          agency: string
          approved_at: string
          category: string
          date_sold: string
          deadline: string
          description: string
          display_order: number
          id: string
          listing_created_at: string
          listing_id: string
          listing_type: Database["public"]["Enums"]["listing_type"]
          listing_updated_at: string
          phase: Database["public"]["Enums"]["sbir_phase"]
          photo_url: string
          status: Database["public"]["Enums"]["listing_status"]
          submitted_at: string
          technology_summary: string
          title: string
          user_id: string
          value: number
        }[]
      }
      get_public_listing_data: {
        Args: {
          listing_row: Database["public"]["Tables"]["sbir_listings"]["Row"]
        }
        Returns: {
          agency: string
          approved_at: string
          category: string
          created_at: string
          date_sold: string
          deadline: string
          description: string
          id: string
          phase: Database["public"]["Enums"]["sbir_phase"]
          photo_url: string
          status: Database["public"]["Enums"]["listing_status"]
          submitted_at: string
          technology_summary: string
          title: string
          updated_at: string
          user_id: string
          value: number
        }[]
      }
      get_public_listings: {
        Args: never
        Returns: {
          agency: string
          approved_at: string
          category: string
          created_at: string
          date_sold: string
          deadline: string
          description: string
          id: string
          listing_type: Database["public"]["Enums"]["listing_type"]
          phase: Database["public"]["Enums"]["sbir_phase"]
          photo_url: string
          status: Database["public"]["Enums"]["listing_status"]
          submitted_at: string
          technology_summary: string
          title: string
          updated_at: string
          user_id: string
          value: number
        }[]
      }
      get_public_listings_with_profiles: {
        Args: never
        Returns: {
          agency: string
          approved_at: string
          category: string
          created_at: string
          date_sold: string
          deadline: string
          description: string
          id: string
          listing_type: Database["public"]["Enums"]["listing_type"]
          phase: Database["public"]["Enums"]["sbir_phase"]
          photo_url: string
          profile_bio: string
          profile_company_name: string
          profile_first_name: string
          profile_full_name: string
          profile_last_name: string
          profile_role: Database["public"]["Enums"]["user_role"]
          recommended_affiliate_1_full_name: string
          recommended_affiliate_1_id: string
          recommended_affiliate_2_full_name: string
          recommended_affiliate_2_id: string
          status: Database["public"]["Enums"]["listing_status"]
          submitted_at: string
          technology_summary: string
          title: string
          updated_at: string
          user_id: string
          value: number
        }[]
      }
      get_public_profile: {
        Args: { profile_user_id: string }
        Returns: {
          bio: string
          company_name: string
          created_at: string
          first_name: string
          full_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["user_role"]
        }[]
      }
      get_user_role:
        | { Args: never; Returns: string }
        | { Args: { user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin:
        | { Args: { user_id: string }; Returns: boolean }
        | { Args: never; Returns: boolean }
      restore_user_account: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      send_daily_notifications_cron: { Args: never; Returns: undefined }
      soft_delete_user_account: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      unlock_user_account: { Args: { user_id_param: string }; Returns: boolean }
    }
    Enums: {
      admin_action_type: "approval" | "denial" | "edit" | "deletion"
      app_role: "admin" | "user" | "affiliate" | "verified"
      change_request_status: "pending" | "approved" | "rejected"
      change_request_type: "change" | "deletion"
      listing_status: "Active" | "Pending" | "Sold" | "Rejected" | "Hidden"
      listing_type: "Contract" | "IP" | "Contract & IP"
      sbir_phase: "Phase I" | "Phase II" | "Phase III"
      user_role: "admin" | "user" | "affiliate" | "verified"
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
    Enums: {
      admin_action_type: ["approval", "denial", "edit", "deletion"],
      app_role: ["admin", "user", "affiliate", "verified"],
      change_request_status: ["pending", "approved", "rejected"],
      change_request_type: ["change", "deletion"],
      listing_status: ["Active", "Pending", "Sold", "Rejected", "Hidden"],
      listing_type: ["Contract", "IP", "Contract & IP"],
      sbir_phase: ["Phase I", "Phase II", "Phase III"],
      user_role: ["admin", "user", "affiliate", "verified"],
    },
  },
} as const
