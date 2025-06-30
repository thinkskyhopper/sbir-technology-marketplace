
-- Add table to track which listings have been included in notifications
CREATE TABLE public.notification_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.sbir_listings(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for performance
CREATE INDEX idx_notification_batches_user_sent ON public.notification_batches(user_id, sent_at);
CREATE INDEX idx_notification_batches_listing_sent ON public.notification_batches(listing_id, sent_at);

-- Enable RLS
ALTER TABLE public.notification_batches ENABLE ROW LEVEL SECURITY;

-- RLS policies (admin access only for management)
CREATE POLICY "Admins can manage notification batches" 
  ON public.notification_batches 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add a table to track notification job runs to prevent duplicate sends
CREATE TABLE public.notification_job_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_date DATE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_users_processed INTEGER DEFAULT 0,
  total_emails_sent INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb
);

-- Unique constraint to prevent duplicate runs for the same date
CREATE UNIQUE INDEX idx_notification_job_runs_date ON public.notification_job_runs(run_date);

-- Enable RLS
ALTER TABLE public.notification_job_runs ENABLE ROW LEVEL SECURITY;

-- RLS policy (admin access only)
CREATE POLICY "Admins can manage notification job runs" 
  ON public.notification_job_runs 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the daily notification job for 8 PM EST (1 AM UTC, accounting for EST)
-- Note: This assumes the database is in UTC timezone
SELECT cron.schedule(
  'daily-listing-notifications',
  '0 1 * * *', -- 1 AM UTC = 8 PM EST (9 PM EDT during daylight saving)
  $$
  SELECT
    net.http_post(
        url:='https://amhznlnhrrugxatbeayo.supabase.co/functions/v1/send-daily-notifications',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaHpubG5ocnJ1Z3hhdGJlYXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDA2NDUsImV4cCI6MjA2NTY3NjY0NX0.36_2NRiObrLxWx_ngeNzMvOSzxcFpeGXh-xKoW4irkk"}'::jsonb,
        body:='{"scheduled_run": true}'::jsonb
    ) as request_id;
  $$
);
