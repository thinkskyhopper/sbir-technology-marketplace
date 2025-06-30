
import { supabase } from '@/integrations/supabase/client';

export const notificationService = {
  async getJobRuns() {
    const { data, error } = await supabase
      .from('notification_job_runs')
      .select('*')
      .order('run_date', { ascending: false })
      .limit(30);

    if (error) throw error;
    return data;
  },

  async triggerManualNotification() {
    const { data, error } = await supabase.functions.invoke('send-daily-notifications', {
      body: { manual_run: true }
    });

    if (error) throw error;
    return data;
  },

  async getUserNotificationStats() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, notification_categories')
      .not('notification_categories', 'is', null)
      .neq('notification_categories', '[]');

    if (error) throw error;
    return data;
  },

  async getNotificationBatches(limit = 100) {
    const { data, error } = await supabase
      .from('notification_batches')
      .select(`
        *,
        profiles!inner(email, full_name),
        sbir_listings!inner(title, category)
      `)
      .order('sent_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
};
