-- Run once in the Supabase SQL editor. Server-only writes via the service role key.
create table if not exists signups (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  role text not null check (role in ('traveler','partner')),
  org text,
  ref text,
  created_at timestamptz not null default now()
);
create unique index if not exists signups_email_role on signups (lower(email), role);

create table if not exists events (
  id bigint generated always as identity primary key,
  event text not null,
  props jsonb not null default '{}',
  ref text,
  session text,
  created_at timestamptz not null default now()
);
create index if not exists events_event_created on events (event, created_at);

alter table signups enable row level security;
alter table events enable row level security;
-- No public policies: only the server (service role) can read or write.
