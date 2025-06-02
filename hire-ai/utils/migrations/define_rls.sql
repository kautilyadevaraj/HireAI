create policy "Allow authorized delete access" on public.jobs for DELETE to authenticated using (
  (
    select
      authorize ('jobs.delete')
  )
);

create policy "Allow authorized create access" on public.jobs for INSERT to authenticated
with
  check (
    (
      select
        authorize ('jobs.create')
    )
  );

create policy "Allow authorized update access with user match" on public.jobs
for update
  to authenticated using (
    (
      select
        auth.uid ()
    ) = posted_by
  )
with
  check (
    (
      select
        auth.uid ()
    ) = posted_by
  );

create policy "Allow authorized read access" on public.jobs for
select
  to authenticated using (
    (
      select
        authorize ('jobs.read')
    )
  );

create policy "Allow authorized delete access" on public.applications for DELETE to authenticated using (
  (
    select
      authorize ('applications.delete')
  )
);

create policy "Allow authorized create access" on public.applications for INSERT to authenticated
with
  check (
    (
      select
        authorize ('applications.create')
    )
  );

create policy "Allow authorized update access" on public.applications
for update
  to authenticated using (
    (
      select
        authorize ('applications.update')
    )
  )
with
  check (
    (
      select
        authorize ('applications.update')
    )
  );

create policy "Allow authorized read access" on public.applications for
select
  to authenticated using (
    (
      select
        authorize ('applications.read'::app_permission) as authorize
    )
    and case
      when (
        ((auth.jwt () ->> 'user_role'::text))::app_role = 'candidate'::app_role
      ) then (applicant = auth.uid ())
      else true
    end
  )