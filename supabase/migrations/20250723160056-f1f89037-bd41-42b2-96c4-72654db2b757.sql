-- Drop and recreate the trigger to ensure it's working properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate trigger to automatically create profile when new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();