-- Supabase RPC Support
-- For creating or managing tables programmatically (e.g., adding columns or creating a new table), 
-- you may need to create custom RPC functions in Supabase to handle advanced schema management. 
-- Here's an example SQL function:

create or replace function create_table(name text)
returns void as $$
begin
    execute format('create table %I (id serial primary key)', name);
end;
$$ language plpgsql;
