

# Fix: Featured Listings Permission Denied Error

## Problem

The `featured_listings` table has a single RLS policy ("Admins can manage featured listings") that is set as **restrictive** instead of **permissive**. PostgreSQL requires at least one permissive policy to grant access. Restrictive policies can only further limit access granted by permissive policies. Since no permissive policy exists, all write operations (INSERT, UPDATE, DELETE) are denied -- even for admins.

## Solution

Run a database migration to drop the existing restrictive policy and recreate it as a **permissive** policy with the same conditions.

## Technical Details

SQL migration:

```sql
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admins can manage featured listings" ON featured_listings;

-- Recreate as a permissive policy (default behavior)
CREATE POLICY "Admins can manage featured listings"
  ON featured_listings
  FOR ALL
  TO authenticated
  USING (current_user_is_admin() AND current_user_not_deleted())
  WITH CHECK (current_user_is_admin() AND current_user_not_deleted());
```

No code changes are needed -- the service layer and UI code are correct. This is purely a database policy configuration issue.

