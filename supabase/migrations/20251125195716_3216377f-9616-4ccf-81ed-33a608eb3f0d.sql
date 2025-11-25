-- Drop the existing trigger that fires on DELETE
DROP TRIGGER IF EXISTS sync_role_to_profiles_trigger ON public.user_roles;

-- Recreate trigger to only fire on INSERT and UPDATE (not DELETE)
-- This prevents NULL values from being synced when roles are temporarily deleted
CREATE TRIGGER sync_role_to_profiles_trigger
  AFTER INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION sync_role_to_profiles();