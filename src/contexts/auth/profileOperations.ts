
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './types';

export const fetchProfile = async (
  userId: string,
  setProfile: (profile: Profile | null) => void,
  setIsAdmin: (isAdmin: boolean) => void
) => {
  try {
    console.log('🔍 fetchProfile starting for user:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('📊 Profile query result:', { data, error });

    if (error) {
      console.error('❌ Error fetching profile:', error);
      
      // If profile doesn't exist, create one
      if (error.code === 'PGRST116') {
        console.log('📝 Profile not found, creating new profile...');
        const { data: userData } = await supabase.auth.getUser();
        console.log('👤 Current user data:', userData);
        
        if (userData.user) {
          const newProfileData = {
            id: userId,
            email: userData.user.email || '',
            full_name: userData.user.user_metadata?.full_name || null,
            display_email: userData.user.email || '',
            role: 'user' as const
          };
          
          console.log('📝 Creating profile with data:', newProfileData);
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfileData)
            .select()
            .single();

          console.log('📝 Profile creation result:', { newProfile, createError });

          if (createError) {
            console.error('❌ Error creating profile:', createError);
            // Don't throw here - set profile to null and continue
            setProfile(null);
            setIsAdmin(false);
            return;
          } else {
            console.log('✅ Profile created successfully:', newProfile);
            const transformedProfile: Profile = {
              ...newProfile,
              notification_categories: Array.isArray(newProfile.notification_categories) 
                ? newProfile.notification_categories as string[]
                : []
            };
            setProfile(transformedProfile);
            setIsAdmin(newProfile.role === 'admin');
            return;
          }
        } else {
          console.error('❌ No user data available for profile creation');
          setProfile(null);
          setIsAdmin(false);
          return;
        }
      }
      
      // For other errors, just set profile to null and continue
      console.error('❌ Profile fetch failed with error:', error);
      setProfile(null);
      setIsAdmin(false);
      return;
    }
    
    // Transform the data to match our Profile interface
    const transformedProfile: Profile = {
      ...data,
      notification_categories: Array.isArray(data.notification_categories) 
        ? data.notification_categories as string[]
        : []
    };
    
    console.log('✅ Profile fetched successfully:', transformedProfile);
    setProfile(transformedProfile);
    setIsAdmin(data?.role === 'admin');
  } catch (error) {
    console.error('💥 Fatal error in fetchProfile:', error);
    setProfile(null);
    setIsAdmin(false);
  }
};
