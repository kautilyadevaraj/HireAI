create table public.applications (
  application_id uuid primary key default gen_random_uuid (),
  applicant uuid not null references auth.users (id) on delete CASCADE,
  job_id uuid not null references public.jobs (job_id) on delete cascade,
  resume_url text
);