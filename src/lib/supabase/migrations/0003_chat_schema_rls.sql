-- enums
do $$ begin
  create type public.conversation_type as enum ('direct', 'group');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.message_type as enum ('text', 'image', 'video', 'audio', 'file');
exception when duplicate_object then null;
end $$;

-- conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  type public.conversation_type not null default 'direct',
  title text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- participants
create table if not exists public.conversation_participants (
  conversation_id uuid references public.conversations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text,
  created_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

-- messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references auth.users(id) on delete set null,
  type public.message_type not null default 'text',
  text text,
  attachment_url text,
  attachment_meta jsonb,
  created_at timestamptz not null default now()
);

-- indexes (performance)
create index if not exists idx_participants_user on public.conversation_participants(user_id);
create index if not exists idx_messages_convo_time on public.messages(conversation_id, created_at desc);

-- RLS
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

-- helper: user is participant
create or replace function public.is_conversation_participant(convo_id uuid, uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.conversation_participants p
    where p.conversation_id = convo_id and p.user_id = uid
  );
$$;

-- conversations policies
drop policy if exists "conversations_select_participant" on public.conversations;
create policy "conversations_select_participant"
on public.conversations
for select
to authenticated
using (
  public.is_conversation_participant(id, auth.uid())
);

drop policy if exists "conversations_insert_authenticated" on public.conversations;
create policy "conversations_insert_authenticated"
on public.conversations
for insert
to authenticated
with check (auth.uid() = created_by);

-- participants policies
drop policy if exists "participants_select_own" on public.conversation_participants;
create policy "participants_select_own"
on public.conversation_participants
for select
to authenticated
using (user_id = auth.uid());

-- allow creator to add participants (MVP)
drop policy if exists "participants_insert_creator" on public.conversation_participants;
create policy "participants_insert_creator"
on public.conversation_participants
for insert
to authenticated
with check (
  public.is_conversation_participant(conversation_id, auth.uid())
);

-- messages policies
drop policy if exists "messages_select_participant" on public.messages;
create policy "messages_select_participant"
on public.messages
for select
to authenticated
using (
  public.is_conversation_participant(conversation_id, auth.uid())
);

drop policy if exists "messages_insert_sender_is_participant" on public.messages;
create policy "messages_insert_sender_is_participant"
on public.messages
for insert
to authenticated
with check (
  sender_id = auth.uid()
  and public.is_conversation_participant(conversation_id, auth.uid())
);
