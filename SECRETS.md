# Secrets & Configuration Management

This document outlines all secrets and sensitive configuration in the project, how they're stored, and how to rotate them.

## Secrets Inventory

### 1. Supabase Configuration (Public)
- **Type**: Intentionally public API keys
- **Location**: `src/config/supabase.ts` (central source of truth)
- **Also used in**:
  - `src/integrations/supabase/client.ts`
  - `src/utils/networkDiagnostics.ts`
  - `public/embed.html` (requires manual update)
- **Purpose**: Client-side Supabase authentication (anon key is safe to expose)
- **Rotation**: Update `src/config/supabase.ts` and `public/embed.html`

### 2. Supabase Service Role Key (Private)
- **Type**: Server-side secret
- **Location**: Supabase edge function environment variable (`SUPABASE_SERVICE_ROLE_KEY`)
- **Purpose**: Admin operations in edge functions
- **Rotation**: Update in Supabase Dashboard → Settings → API → service_role key, then update secret

### 3. Resend API Key (Private)
- **Type**: Email service API key
- **Location**: Supabase edge function environment variable (`RESEND_API_KEY`)
- **Purpose**: Sending transactional emails
- **Rotation**: Generate new key at https://resend.com/api-keys, update secret

### 4. Cron Secret (Private)
- **Type**: Custom authentication secret
- **Location**: 
  - Supabase edge function environment variable (`CRON_SECRET`)
  - Database: `admin_settings` table (key: `cron_secret`, `is_public=false`)
- **Purpose**: Authenticating scheduled cron jobs to edge functions
- **Rotation**: 
  1. Generate a new secure random string
  2. Update edge function secret in Supabase Dashboard
  3. Update database: `UPDATE admin_settings SET setting_value = 'new-secret' WHERE setting_key = 'cron_secret'`

### 5. Database Connection URL (Private)
- **Type**: Database credentials
- **Location**: Supabase edge function environment variable (`SUPABASE_DB_URL`)
- **Purpose**: Direct database access (if needed)
- **Rotation**: Generate new connection string in Supabase Dashboard

## Security Best Practices

### ✅ Good Practices in This Project
- All private secrets stored as Supabase edge function environment variables
- Public anon key centralized in one configuration file
- No secrets checked into version control
- Cron job authentication uses database-stored secret instead of hardcoded values
- Server-side validation with service role key for protected operations

### ⚠️ Considerations
- `public/embed.html` contains the anon key inline and requires manual updates
- Supabase anon key is intentionally public but should still be rotated periodically
- Ensure all edge functions use `Deno.env.get()` for secrets (never hardcode)

## Secret Rotation Procedures

### Rotating Supabase Anon Key
1. Generate new anon key in Supabase Dashboard → Settings → API
2. Update `src/config/supabase.ts`
3. Update `public/embed.html` manually
4. Deploy changes
5. Old key remains valid for a grace period

### Rotating Cron Secret
1. Generate a secure random string: `openssl rand -base64 32`
2. Update in Supabase Dashboard → Project Settings → Edge Functions → Secrets
3. Update in database:
   ```sql
   UPDATE admin_settings 
   SET setting_value = 'your-new-secret-here' 
   WHERE setting_key = 'cron_secret';
   ```
4. Verify cron job runs successfully with new secret

### Rotating Resend API Key
1. Create new API key at https://resend.com/api-keys
2. Update in Supabase Dashboard → Project Settings → Edge Functions → Secrets
3. Test email sending functionality
4. Revoke old key in Resend dashboard

### Rotating Service Role Key
⚠️ **High Impact** - This requires careful coordination
1. Generate new service_role key in Supabase Dashboard
2. Update all edge functions that use it (check for `SUPABASE_SERVICE_ROLE_KEY`)
3. Test all admin operations thoroughly
4. Old key is immediately invalidated

## Files That Reference Secrets

### Source Code
- `src/config/supabase.ts` - Central Supabase configuration
- `src/integrations/supabase/client.ts` - Imports from config
- `src/utils/networkDiagnostics.ts` - Imports from config
- `public/embed.html` - Inline anon key (requires manual update)

### Edge Functions
All edge functions access secrets via `Deno.env.get()`:
- `validate-and-upload-image` - Uses `SUPABASE_SERVICE_ROLE_KEY`
- `send-daily-notifications` - Uses `CRON_SECRET`
- `send-*-email` functions - Use `RESEND_API_KEY`
- Various auth functions - Use `SUPABASE_SERVICE_ROLE_KEY`

### Database
- `admin_settings` table - Stores `cron_secret` for cron job authentication
- `send_daily_notifications_cron()` function - Fetches cron_secret from admin_settings

## Emergency Procedures

### If a Secret is Compromised
1. **Immediate**: Rotate the compromised secret using procedures above
2. **Investigate**: Check logs for unauthorized access
3. **Notify**: Inform relevant team members
4. **Monitor**: Watch for unusual activity post-rotation
5. **Document**: Record the incident and response

### If Service Role Key is Compromised
1. **URGENT**: Immediately generate and deploy new key
2. Check admin audit logs for unauthorized actions
3. Review all recent admin operations
4. Consider temporarily disabling admin functions during rotation

## Questions?
For security concerns, contact the project administrator immediately.
