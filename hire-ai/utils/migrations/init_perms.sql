insert into
  public.role_permissions (role, permission)
values
  ('recruiter', 'jobs.create'),
  ('recruiter', 'jobs.read'),
  ('recruiter', 'jobs.update'),
  ('recruiter', 'jobs.delete'),
  ('recruiter', 'applications.read'),
  ('candidate', 'applications.create'),
  ('candidate', 'applications.read'),
  ('candidate', 'applications.update'),
  ('candidate', 'applications.delete');