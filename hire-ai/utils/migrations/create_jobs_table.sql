create table jobs (
  job_id uuid primary key default gen_random_uuid (),
  job_title text not null,
  job_desc text not null,
  company text not null,
  location text not null,
  skills text[] not null,
  min_exp integer not null,
  max_exp integer,
  min_comp integer,
  max_comp integer,
  posted_by uuid references auth.users on delete set null
);