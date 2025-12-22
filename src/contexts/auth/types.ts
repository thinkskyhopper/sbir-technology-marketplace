
import type { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  public_id: string | null;
  email: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  display_email: string | null;
  company_name: string | null;
  bio: string | null;
  photo_url: string | null;
  role: 'admin' | 'user' | 'affiliate' | 'verified';
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
  signUp: (email: string, password: string, fullName?: string, marketingEmails?: boolean) => Promise<{ error: any; isDuplicate?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any; accountDeleted?: boolean; isLocked?: boolean; lockedUntil?: string }>;
  signOut: () => Promise<{ error: any; wasStaleSession: boolean; }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any; accountDeleted?: boolean }>;
  resendVerificationEmail: (email: string) => Promise<{ error: any }>;
  isAdmin: boolean;
}
