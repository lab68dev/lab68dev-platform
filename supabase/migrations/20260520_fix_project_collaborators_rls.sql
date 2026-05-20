begin;

create extension if not exists pgcrypto;

alter table public.project_collaborators enable row level security;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'project_collaborators'
  loop
    execute format(
      'drop policy if exists %I on public.project_collaborators',
      policy_record.policyname
    );
  end loop;
end
$$;

create or replace function public.is_project_owner(project_uuid uuid, actor uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.projects p
    where p.id = project_uuid
      and p.user_id = actor
  );
$$;

create or replace function public.get_project_collaborator_role(project_uuid uuid, actor uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select pc.role
  from public.project_collaborators pc
  where pc.project_id = project_uuid
    and pc.user_id = actor
  limit 1;
$$;

revoke all on function public.is_project_owner(uuid, uuid) from public;
revoke all on function public.get_project_collaborator_role(uuid, uuid) from public;
grant execute on function public.is_project_owner(uuid, uuid) to authenticated;
grant execute on function public.get_project_collaborator_role(uuid, uuid) to authenticated;

create policy "project_collaborators_select_access"
on public.project_collaborators
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_project_owner(project_id, auth.uid())
  or public.get_project_collaborator_role(project_id, auth.uid()) in ('admin', 'editor', 'viewer')
);

create policy "project_collaborators_insert_manage"
on public.project_collaborators
for insert
to authenticated
with check (
  public.is_project_owner(project_id, auth.uid())
  or public.get_project_collaborator_role(project_id, auth.uid()) = 'admin'
);

create policy "project_collaborators_update_manage"
on public.project_collaborators
for update
to authenticated
using (
  public.is_project_owner(project_id, auth.uid())
  or public.get_project_collaborator_role(project_id, auth.uid()) = 'admin'
)
with check (
  public.is_project_owner(project_id, auth.uid())
  or public.get_project_collaborator_role(project_id, auth.uid()) = 'admin'
);

create policy "project_collaborators_delete_manage"
on public.project_collaborators
for delete
to authenticated
using (
  public.is_project_owner(project_id, auth.uid())
  or public.get_project_collaborator_role(project_id, auth.uid()) = 'admin'
);

commit;
