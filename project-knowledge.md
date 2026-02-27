# Street Surfers Passengers App — Project Knowledge

## What This App Is
A **passenger-facing transport app** for staff/scholar commuters in Johannesburg, Gauteng. Part of a larger Street Surfers platform that also has a **Driver's App** and an upcoming **Dispatcher/Admin Dashboard** — all sharing the **same Supabase project/database**.

- Passengers book and track their daily transport to/from work or school
- Drivers are managed separately (Driver's App)
- Admins/dispatchers will have their own dashboard

---

## Tech Stack
| Layer | Tech |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| UI | Shadcn UI + Tailwind CSS |
| Routing | React Router v6 |
| Data fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Backend | Supabase (auth + postgres + realtime) |
| Originally built with | Lovable.dev (migrated away) |

**Important:** `package.json` has `"type": "module"` — any Node.js scripts must use `.cjs` extension or ESM `import` syntax.

---

## Supabase Project (Shared with Driver's App)
| Key | Value |
|---|---|
| Project ref | `zatrlugytlierywmqswm` |
| URL | `https://zatrlugytlierywmqswm.supabase.co` |
| Anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphdHJsdWd5dGxpZXJ5d21xc3dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MzQ1OTYsImV4cCI6MjA4MjExMDU5Nn0.WwIxjrv_XH_HWLq4I4LEPHqGhP3Q8hTjRkiFFP_eem8` |
| Publishable key | `sb_publishable_JfzPBOP2rSvSCewPTFBFGA_Vy4pdh2H` |
| Postgres host | `db.zatrlugytlierywmqswm.supabase.co:5432` (IPv6 only — use SQL Editor, not psql) |

**Env file** (`.env` at project root — not committed):
```
VITE_SUPABASE_URL=https://zatrlugytlierywmqswm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_JfzPBOP2rSvSCewPTFBFGA_Vy4pdh2H
```

**MCP** configured in `~/.claude/settings.json` — postgres + fetch + filesystem servers. To add the official Supabase HTTP MCP:
```
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=zatrlugytlierywmqswm"
```

---

## Database Schema

### Shared Database — Important Context
This Supabase project is shared with the Driver's App, which had already created many tables with **different schemas** before the Passengers App migration. The strategy used:
- **Driver's App tables that exist** → extended with `ALTER TABLE ADD COLUMN IF NOT EXISTS`
- **Tables exclusive to Passengers App** → created fresh with `CREATE TABLE IF NOT EXISTS`

### Tables
| Table | Owner | Purpose |
|---|---|---|
| `profiles` | Driver's App (extended by us) | User display info. Driver's App uses `name`; we added `full_name` + `avatar_url` |
| `user_roles` | Driver's App (compatible) | Roles per user (`admin`, `driver`, `passenger`) |
| `passenger_profiles` | **Passengers App only** | Our user-account table. Named `passenger_profiles` because Driver's App already has a `passengers` table (a trip manifest with no `user_id`) |
| `drivers` | Driver's App (extended by us) | We added `user_id`, vehicle detail columns, `is_active`, `is_online` |
| `trips` | Driver's App (extended by us) | We added `trip_type`, `scheduled_date`, `pickup_time`, `origin_address`, `destination_address`, lat/lng columns |
| `trip_passengers` | Driver's App (extended by us) | We added `commuter_id` (→ passenger_profiles) + pickup/dropoff address/lat/lng columns. **Driver's App uses `passenger_id`; we use `commuter_id`** |
| `driver_locations` | Driver's App (extended by us) | We added `trip_id`, `accuracy`, `recorded_at` (Driver's App uses `last_updated`) |
| `status_logs` | **Passengers App only** | Event log: trip updates, SOS alerts, notifications |
| `availability_requests` | **Passengers App only** | Passenger schedule requests (day/time preferences) |
| `companies` | Driver's App (extended by us) | Work destinations. Driver's App schema: `id, name, address, contact_person, contact_phone, contact_email, is_school`. We added `verification_status` |
| `branches` | **Passengers App only** | Specific office locations per company |
| `schools` | **Passengers App only** | School destinations for scholar passengers |
| `scholar_profiles` | **Passengers App only** | Guardian contact info for minor passengers |

### Driver's App tables we do NOT touch
`passengers` (their trip manifest), `dispatch_logs`, `guardians`, `ride_requests`, `route_groups`, `safety_logs`, `trips_events`, `vehicles`

### Enums
`app_role`, `trip_type`, `trip_status`, `passenger_trip_status`, `status_log_type`

### Key Trigger
`handle_new_user` on `auth.users` INSERT — automatically creates:
1. `profiles` row (sets both `name` and `full_name`; also sets `is_online = false` which Driver's App requires NOT NULL)
2. `passenger_profiles` row (with `onboarding_completed = false`)
3. `user_roles` row (role = `passenger`)

Uses `WHERE NOT EXISTS` pattern throughout — safe for Driver's App signups (won't duplicate if records already exist).

### Key Functions
- `get_passenger_id(user_id)` — returns `passenger_profiles.id` for a user
- `get_driver_id(user_id)` — returns `drivers.id` for a user (via the `user_id` column we added to `drivers`)
- `has_role(user_id, role)` — checks user_roles

### passenger_profiles table — all columns
`id, user_id, employee_id, department, home_address, work_address, pickup_notes, emergency_contact_name, emergency_contact_phone, is_active, payment_status, account_status, ride_type, onboarding_completed, home_lat, home_lng, work_lat, work_lng, company, shift_type, company_id, home_house_number, home_street, home_suburb, home_city, home_province, address_confidence, branch_id, passenger_type, is_minor, school_id, school_address, school_lat, school_lng, school_street, school_suburb, school_city, school_province, created_at, updated_at`

---

## Key Source Files
```
src/
  integrations/supabase/
    client.ts          ← Supabase client (reads from .env)
    types.ts           ← Generated DB types — NEEDS REGENERATION after migration
  hooks/
    useAuth.tsx        ← Auth state (session, user, role) — queries passenger_profiles
    useTrips.tsx       ← Trip data fetching — uses commuter_id on trip_passengers
    useTripDetails.tsx ← Single trip details — uses commuter_id on trip_passengers
    useDriverLocation.tsx ← Live driver GPS — uses recorded_at
  pages/
    Auth.tsx           ← Login / signup
    Onboarding.tsx     ← New user setup — queries passenger_profiles
    Index.tsx          ← Home/dashboard
    MyTrips.tsx        ← Passenger's trip list
    Schedule.tsx       ← Availability/schedule management
    TripDetails.tsx    ← Single trip view with live map — uses commuter_id
    LiveMap.tsx        ← Real-time driver tracking map
    Profile.tsx        ← User profile management
supabase/
  config.toml          ← project_id = zatrlugytlierywmqswm
  migrations/          ← 8 SQL migration files (chronological history, reference only)
```

---

## Migration Status (as of 2026-02-27) — ✅ COMPLETE

### What was done
- `.env` created with new Supabase credentials ✓
- `supabase/config.toml` updated to new project ref ✓
- `MIGRATION_FULL.sql` fully rewritten to handle shared-DB schema conflicts ✓
- `DATA_IMPORT.sql` fixed to match Driver's App companies schema ✓
- Source code updated: `passengers` → `passenger_profiles`, `passenger_id` → `commuter_id` (in trip_passengers context) ✓
- Trigger check ran — no existing `on_auth_user_created` on auth.users (returned no rows) ✓
- `MIGRATION_FULL.sql` ran successfully on new Supabase project ✓
- `MIGRATION_FULL.sql` bug fixed: `EXCEPTION WHEN duplicate_object` → `WHEN others` for user_roles constraint block (42P07 vs 42710 error code mismatch)

### Remaining steps
- Run `DATA_IMPORT.sql` in SQL Editor (companies, branches, schools, historical trips)
- Regenerate `src/integrations/supabase/types.ts` from the Supabase dashboard (Settings → API → Generate TypeScript types)
- Users must re-register (user data not imported — `handle_new_user` trigger auto-creates their records on signup)
- New users go through `Onboarding.tsx` to enter their details

---

## Important Notes for Development

- **`passenger_profiles`** is our user-account table — do NOT confuse with the Driver's App `passengers` table (which is a trip manifest with `trip_id`, `full_name`, `phone`, no `user_id`)
- **`trip_passengers.commuter_id`** is our FK to `passenger_profiles`; Driver's App uses `trip_passengers.passenger_id` (→ their trip manifest). Both coexist on the same table
- **`profiles.full_name`** — we added this column; Driver's App uses `profiles.name`. Both are populated by `handle_new_user`
- **`driver_locations.recorded_at`** — we added this column; Driver's App uses `last_updated`. Both exist
- **SQL Editor is the only reliable way** to run SQL — direct postgres connection only resolves to IPv6 and Node.js can't connect to it
- **Windows curl needs `-k` flag** to bypass SSL revocation checking
- The app was originally on Lovable.dev's cloud Supabase (project `spzjvnkauxvvawjpmxeh`) — now fully migrated
- `src/integrations/supabase/types.ts` needs regeneration after migration completes
- The `database_backup.sql` at root is a backup from the old Lovable project (reference only)
