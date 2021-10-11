create table links (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    url text check (char_length(url) <= 2083) not null,
    slug varchar(50) check (char_length(url) > 0) unique not null,
    meta json default '{}' not null,
    updated_at timestamp with time zone default timezone('utc' :: text, now()) not null,
    inserted_at timestamp with time zone default timezone('utc' :: text, now()) not null
);

alter table
    links enable row level security;

create policy "Users can create their own links." on links for
insert
    with check (auth.uid() = user_id);

create policy "Users can only view their own links. " on links for
select
    using (auth.uid() = user_id);

create policy "Users can only update their own links." on links for
update
    using (auth.uid() = user_id);

create policy "Users can only delete their own links." on links for delete using (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_modified_column()   
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;   
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_modtime BEFORE UPDATE ON links FOR EACH ROW EXECUTE PROCEDURE  update_modified_column();