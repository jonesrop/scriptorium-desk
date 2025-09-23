-- Create test user accounts by inserting directly into auth.users
-- Note: This is typically done through the Supabase Auth API, but we can insert test data

-- Insert test admin user
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated', 
    'admin@library.edu',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"username": "admin", "first_name": "Library", "last_name": "Admin", "role": "admin"}',
    now(),
    now()
) ON CONFLICT (email) DO NOTHING;

-- Insert test student user  
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'student@library.edu', 
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"username": "student", "first_name": "Test", "last_name": "Student", "role": "student"}',
    now(),
    now()
) ON CONFLICT (email) DO NOTHING;