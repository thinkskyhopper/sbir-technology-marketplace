
import type { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  display_email: string | null;
  company_name: string | null;
  bio: string | null;
  role: 'admin' | 'user' | 'consultant' | 'verified';
  notification_categories: string[];
  marketing_emails_enabled: boolean;
  email_notifications_enabled: boolean;
  listing_email_notifications_enabled: boolean;
  category_email_notifications_enabled: boolean;
  can_submit_listings: boolean;
  account_deleted: boolean;
  account_deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  signUp: (email: string, password: string, fullName?: string, marketingEmails?: boolean) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  isAdmin: boolean;
}
