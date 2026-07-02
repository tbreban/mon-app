-- Contact form hardening for the public `contacts` table (security audit #2).
--
-- Run this ONCE in the Supabase SQL editor (it runs as the `postgres` role, so
-- the SECURITY DEFINER trigger below can bypass RLS to count rows).
--
-- It is idempotent: safe to re-run, and safe to re-run after tuning the limits.
--
-- What it does:
--   1. Adds `created_at` and `ip` columns if missing (needed for rate limiting).
--   2. Adds CHECK constraints bounding field lengths + a light email format check
--      (the authoritative server-side counterpart to the client `maxLength`).
--   3. Adds a BEFORE INSERT trigger that rejects inserts when:
--        - more than N rows were inserted table-wide in the last minute
--          (RELIABLE flood ceiling — cannot be bypassed), or
--        - the same client IP inserted too many rows recently
--          (BEST-EFFORT — the browser talks to Supabase directly, so
--           X-Forwarded-For is somewhat spoofable; treat this as secondary).
--
-- This complements, and does NOT replace, the insert-only RLS policy already in
-- place. Tune the three limits in the function to taste.
--
-- Privacy note: `ip` is personal data (GDPR). It is stored only for abuse
-- prevention (legitimate interest). Consider a retention cleanup, e.g. a
-- scheduled job that nulls `ip` on rows older than 30 days.

-- 1. Columns -----------------------------------------------------------------
alter table public.contacts
  add column if not exists created_at timestamptz not null default now();
alter table public.contacts
  add column if not exists ip text;
alter table public.contacts
  add column if not exists message text;

-- 2. Validation constraints --------------------------------------------------
alter table public.contacts drop constraint if exists contacts_len_chk;
alter table public.contacts add constraint contacts_len_chk check (
      char_length(nom)      between 1 and 100
  and char_length(prenom)   between 1 and 100
  and char_length(portable) between 1 and 30
  and char_length(email)    between 3 and 254
  and char_length(motif)    between 1 and 50
  -- message is nullable for pre-existing rows; when present it must be 1..5000
  and (message is null or char_length(message) between 1 and 5000)
);

alter table public.contacts drop constraint if exists contacts_email_chk;
alter table public.contacts add constraint contacts_email_chk check (
  email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);

-- 3. Rate-limit trigger ------------------------------------------------------
create or replace function public.contacts_rate_limit()
  returns trigger
  language plpgsql
  security definer
  set search_path = public, pg_temp
as $func$
declare
  v_ip            text;
  v_count         int;
  -- Tunables: a human filling in the form never approaches these.
  c_global_per_min constant int := 30;  -- table-wide flood ceiling
  c_ip_per_min     constant int := 3;   -- per client IP, 1 minute window
  c_ip_per_hour    constant int := 10;  -- per client IP, 1 hour window
begin
  -- Best-effort client IP (first hop of X-Forwarded-For).
  v_ip := nullif(
    split_part(
      coalesce(current_setting('request.headers', true), '{}')::json ->> 'x-forwarded-for',
      ',', 1
    ),
    ''
  );

  -- Reliable global flood ceiling.
  select count(*) into v_count
  from public.contacts
  where created_at > now() - interval '1 minute';
  if v_count >= c_global_per_min then
    raise exception 'contact rate limit exceeded' using errcode = 'check_violation';
  end if;

  -- Best-effort per-IP limits.
  if v_ip is not null then
    select count(*) into v_count
    from public.contacts
    where ip = v_ip and created_at > now() - interval '1 minute';
    if v_count >= c_ip_per_min then
      raise exception 'contact rate limit exceeded' using errcode = 'check_violation';
    end if;

    select count(*) into v_count
    from public.contacts
    where ip = v_ip and created_at > now() - interval '1 hour';
    if v_count >= c_ip_per_hour then
      raise exception 'contact rate limit exceeded' using errcode = 'check_violation';
    end if;

    new.ip := v_ip;
  end if;

  return new;
end;
$func$;

drop trigger if exists contacts_rate_limit_trg on public.contacts;
create trigger contacts_rate_limit_trg
  before insert on public.contacts
  for each row execute function public.contacts_rate_limit();

-- 4. IP retention cleanup (pg_cron) ------------------------------------------
-- Nulls the `ip` column on rows older than the retention window, since IP is
-- only needed while abuse is fresh. Requires the pg_cron extension (available
-- on Supabase; this enables it if not already on). Runs daily at 03:00 UTC.
-- Adjust the interval / schedule to taste. Idempotent: re-running replaces the
-- existing job.
create extension if not exists pg_cron;

-- Remove any prior version of the job (no-op if it doesn't exist yet).
select cron.unschedule(jobid)
from cron.job
where jobname = 'contacts-ip-retention';

select cron.schedule(
  'contacts-ip-retention',
  '0 3 * * *',
  $job$
    update public.contacts
    set ip = null
    where ip is not null
      and created_at < now() - interval '30 days'
  $job$
);
