-- Run this in the Supabase SQL editor to set up scene storage.

create table if not exists courtroom_scenes (
  id uuid primary key,
  name text not null,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  owner_id uuid references auth.users(id)
);

alter table courtroom_scenes enable row level security;

create policy "Users manage their own scenes"
  on courtroom_scenes
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- Storage bucket for evidence uploads (images, pdf, video, audio, glb)
insert into storage.buckets (id, name, public)
values ('courtroom-evidence', 'courtroom-evidence', true)
on conflict (id) do nothing;

create policy "Public read access to evidence"
  on storage.objects for select
  using (bucket_id = 'courtroom-evidence');

create policy "Authenticated users can upload evidence"
  on storage.objects for insert
  with check (bucket_id = 'courtroom-evidence' and auth.role() = 'authenticated');
