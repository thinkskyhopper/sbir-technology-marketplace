
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export const useAdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('*');

        if (error) {
          console.error('Error fetching admin settings:', error);
          return;
        }

        // Convert array to key-value object
        const settingsMap = data.reduce((acc, setting: AdminSetting) => {
          acc[setting.setting_key] = setting.setting_value;
          return acc;
        }, {} as Record<string, string>);

        setSettings(settingsMap);
      } catch (error) {
        console.error('Error fetching admin settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};
