import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePublicSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('setting_key, setting_value')
          .eq('is_public', true);

        if (error) {
          console.error('Error fetching public settings:', error);
          return;
        }

        // Convert array to key-value object
        const settingsMap = data.reduce((acc, setting) => {
          acc[setting.setting_key] = setting.setting_value;
          return acc;
        }, {} as Record<string, string>);

        setSettings(settingsMap);
      } catch (error) {
        console.error('Error fetching public settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicSettings();
  }, []);

  return { settings, loading };
};