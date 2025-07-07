
export interface UserWithStats {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  listing_count: number;
  can_submit_listings: boolean;
  notification_categories: string[] | null;
  marketing_emails_enabled: boolean;
}

export interface AdminUsersTableProps {
  users: UserWithStats[] | undefined;
}
