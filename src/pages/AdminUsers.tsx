
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminUsersHeader from "@/components/AdminUsers/AdminUsersHeader";
import AdminUsersStats from "@/components/AdminUsers/AdminUsersStats";
import AdminUsersTable from "@/components/AdminUsers/AdminUsersTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserWithStats } from "@/components/AdminUsers/types";
import { useEffect } from "react";

const AdminUsers = () => {
  const { user } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching admin users data...');
      
      // Get all users with their listing counts and submission permissions
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          role,
          created_at,
          can_submit_listings,
          notification_categories,
          marketing_emails_enabled
        `)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Fetched profiles:', profiles?.length);

      // Get listing counts for each user and properly type the notification_categories
      const usersWithStats: UserWithStats[] = await Promise.all(
        profiles.map(async (profile) => {
          const { count } = await supabase
            .from('sbir_listings')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id);

          // Properly cast notification_categories from Json to string[] | null
          const notificationCategories = profile.notification_categories 
            ? (Array.isArray(profile.notification_categories) 
                ? profile.notification_categories as string[]
                : [])
            : null;

          return {
            ...profile,
            listing_count: count || 0,
            notification_categories: notificationCategories
          };
        })
      );

      console.log('Users with stats:', usersWithStats.length);
      return usersWithStats;
    },
    refetchOnWindowFocus: true,
    staleTime: 0, // Always refetch when invalidated
  });

  const totalUsers = users?.length || 0;
  const adminUsers = users?.filter(user => user.role === 'admin').length || 0;
  const affiliateUsers = users?.filter(user => user.role === 'affiliate').length || 0;
  const regularUsers = users?.filter(user => user.role === 'user').length || 0;
  const marketingSubscribers = users?.filter(user => user.marketing_emails_enabled).length || 0;

  if (isLoading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1">
          <div className="mb-6 sm:mb-8">
            <AdminUsersHeader />
            <AdminUsersStats
              totalUsers={totalUsers}
              adminUsers={adminUsers}
              affiliateUsers={affiliateUsers}
              regularUsers={regularUsers}
              marketingSubscribers={marketingSubscribers}
            />
          </div>

          <AdminUsersTable users={users} />
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AdminUsers;
