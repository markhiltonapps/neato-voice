-- 1. Create Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text default 'user',
  subscription_status text default 'inactive', -- 'active', 'past_due', 'canceled', 'trialing'
  subscription_tier text default 'free',      -- 'free', 'pro', 'enterprise'
  credits_balance numeric default 0,          -- For pay-as-you-go or internal tracking
  stripe_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Trigger to create profile on signup
create extension if not exists moddatetime;

create trigger handle_updated_at before update on public.profiles
  for each row execute procedure moddatetime (updated_at);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, credits_balance, subscription_tier, subscription_status)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    case 
        when new.email = 'mark.hilton@neatoventures.com' then 'admin' 
        else 'user' 
    end,
    case 
        when new.email = 'mark.hilton@neatoventures.com' then 999999 -- Admin gets unlimited
        else 15.00 -- Everyone else gets $15.00 worth of credits (Free Trial)
    end,
    case 
        when new.email = 'mark.hilton@neatoventures.com' then 'pro' 
        else 'free' 
    end,
    'active'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Usage Logs
create table public.usage_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  activity_type text, -- 'transcription', 'refinement'
  provider text,      -- 'deepgram', 'anthropic'
  duration_seconds integer,
  input_tokens integer,
  output_tokens integer,
  cost_estimated numeric,
  created_at timestamptz default now()
);

-- 4. Enable RLS
alter table public.profiles enable row level security;
alter table public.usage_logs enable row level security;

-- 5. Policies

-- Profiles: Users can read own
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

-- Profiles: Admins can view all
create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Usage Logs: Users can view own
create policy "Users can view own logs" on public.usage_logs
  for select using (auth.uid() = user_id);

-- Usage Logs: Admins can view all
create policy "Admins can view all logs" on public.usage_logs
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Usage Logs: Service Role / API Only for insert (No direct insert from client usually, but for now we'll allow auth users to insert if we do client-side logging, BETTER: Keep it Server Side)
-- We will ONLY allow inserts via Service Role (Next.js Backend), so no RLS policy for insert needed for 'authenticated' role if we use service role.
