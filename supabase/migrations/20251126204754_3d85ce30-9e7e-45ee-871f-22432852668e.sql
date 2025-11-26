-- Fix cron job authentication to use CRON_SECRET

-- Try to unschedule the existing cron job if it exists (ignore error if it doesn't)
DO $$
BEGIN
  PERFORM cron.unschedule('send-daily-notifications');
EXCEPTION WHEN OTHERS THEN
  NULL; -- Ignore error if job doesn't exist
END $$;

-- Create a function that sends the daily notifications with proper authentication
CREATE OR REPLACE FUNCTION send_daily_notifications_cron()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cron_secret_value TEXT;
  response_id BIGINT;
BEGIN
  -- Fetch the CRON_SECRET from admin_settings
  SELECT setting_value INTO cron_secret_value 
  FROM admin_settings 
  WHERE setting_key = 'cron_secret';
  
  -- Only proceed if the secret exists
  IF cron_secret_value IS NOT NULL THEN
    SELECT net.http_post(
      url := 'https://amhznlnhrrugxatbeayo.supabase.co/functions/v1/send-daily-notifications',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || cron_secret_value
      ),
      body := jsonb_build_object('time', now())
    ) INTO response_id;
  ELSE
    RAISE WARNING 'CRON_SECRET not found in admin_settings. Skipping notification send.';
  END IF;
END;
$$;

-- Schedule the cron job to call the function
SELECT cron.schedule(
  'send-daily-notifications',
  '0 9 * * *', -- 9 AM daily
  'SELECT send_daily_notifications_cron();'
);

-- Add a comment for admins
COMMENT ON FUNCTION send_daily_notifications_cron IS 'Sends daily notifications using the CRON_SECRET stored in admin_settings. Admins must insert the secret: INSERT INTO admin_settings (setting_key, setting_value, is_public) VALUES (''cron_secret'', ''your-secret'', false) ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;';