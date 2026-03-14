create extension if not exists pgcrypto;

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  constraint appointments_time_range check (start_time < end_time)
);

create index if not exists idx_appointments_date_start
  on public.appointments (date, start_time);

alter table public.patients enable row level security;
alter table public.appointments enable row level security;

drop policy if exists patients_select on public.patients;
drop policy if exists patients_insert on public.patients;
drop policy if exists patients_update on public.patients;
drop policy if exists patients_delete on public.patients;

drop policy if exists appointments_select on public.appointments;
drop policy if exists appointments_insert on public.appointments;
drop policy if exists appointments_update on public.appointments;
drop policy if exists appointments_delete on public.appointments;

create policy patients_select on public.patients
for select to authenticated
using (true);

create policy patients_insert on public.patients
for insert to authenticated
with check (true);

create policy patients_update on public.patients
for update to authenticated
using (true)
with check (true);

create policy patients_delete on public.patients
for delete to authenticated
using (true);

create policy appointments_select on public.appointments
for select to authenticated
using (true);

create policy appointments_insert on public.appointments
for insert to authenticated
with check (true);

create policy appointments_update on public.appointments
for update to authenticated
using (true)
with check (true);

create policy appointments_delete on public.appointments
for delete to authenticated
using (true);

insert into public.patients (full_name, phone)
select 'Paciente de prueba', '+34 600 000 000'
where not exists (
  select 1 from public.patients where full_name = 'Paciente de prueba'
);
