

# Fix: Grant Table Privileges on `featured_listings`

## Problem

The RLS policy on `featured_listings` is now correctly set to permissive, but the table has no table-level privileges granted. PostgreSQL requires both table grants AND passing RLS policies for any operation to succeed.

## Solution

Grant SELECT, INSERT, UPDATE, DELETE on the `featured_listings` table to the `authenticated` role. This is safe because the existing permissive RLS policy already restricts all operations to admin users only (via `current_user_is_admin() AND current_user_not_deleted()`).

Non-admin authenticated users will still be blocked by the RLS policy.

## How the two security layers work

```text
Request flow:
  User (authenticated) --> GRANT check (passes) --> RLS policy check
    - Admin user    --> current_user_is_admin() = true  --> ACCESS GRANTED
    - Regular user  --> current_user_is_admin() = false --> ACCESS DENIED
```

## Technical Details

SQL migration:

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON public.featured_listings TO authenticated;
```

No code changes are needed.

