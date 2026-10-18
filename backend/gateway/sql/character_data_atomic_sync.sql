-- Required before deploying the gateway's single-character cloud sync changes.
-- Existing character_data must have a unique user_id and a JSONB data column.
-- The gateway service role is the only caller; browsers cannot invoke this RPC.
begin;
set local lock_timeout = '3s';
set local statement_timeout = '30s';

create or replace function public.merge_character_cloud_data(
  target_user_id uuid,
  target_character_id text,
  character_payload jsonb
)
returns timestamptz
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved_data jsonb;
  saved_at timestamptz;
begin
  if target_character_id is null or target_character_id !~ '^[a-z0-9_]{1,80}$'
     or character_payload is null or jsonb_typeof(character_payload) <> 'object' then
    raise exception 'invalid character data' using errcode = '22023';
  end if;

  -- ON CONFLICT locks the current row and merges against its latest value.
  -- Concurrent saves for different characters cannot overwrite each other.
  insert into public.character_data as existing (user_id, data, updated_at)
  values (target_user_id, jsonb_build_object(target_character_id, character_payload), clock_timestamp())
  on conflict (user_id) do update
  set data = coalesce(existing.data, '{}'::jsonb) || jsonb_build_object(target_character_id, character_payload),
      updated_at = clock_timestamp()
  returning data, updated_at into saved_data, saved_at;

  if octet_length(saved_data::text) > 2 * 1024 * 1024 then
    -- The exception rolls back the whole statement, including the insert/update.
    raise exception 'character data is too large' using errcode = '22001';
  end if;
  return saved_at;
end;
$$;

revoke all on function public.merge_character_cloud_data(uuid, text, jsonb) from public, anon, authenticated;
grant execute on function public.merge_character_cloud_data(uuid, text, jsonb) to service_role;
commit;
