CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.users (
  id serial4 NOT NULL,
  email varchar(255) NOT NULL,
  "password" varchar(255) NULL,
  "role" varchar(50) DEFAULT 'clinico' NULL,
  "name" varchar(100) NOT NULL,
  active bool DEFAULT false NULL,
  CONSTRAINT check_valid_role CHECK ("role" IN ('admin', 'clinico')),
  CONSTRAINT users_email_check CHECK (email LIKE '%@sergas.es'),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.reports (
  id serial4 NOT NULL,
  report_uuid uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id int4 NOT NULL,
  patient_code varchar(64) NOT NULL,
  diagnosis text NULL,
  surgery text NULL,
  decision varchar(50) NULL,
  list_date date NULL,
  pdf_filename varchar(255) NULL,
  pdf_path text NULL,
  form_data jsonb NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  status varchar(20) DEFAULT 'completed' NULL,
  CONSTRAINT reports_pkey PRIMARY KEY (id),
  CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users(id) ON DELETE CASCADE
);

INSERT INTO users (
  email,
  password,
  role,
  name,
  active
)
VALUES (
  'admin@sergas.es',
  '$2b$10$AMzf9XY2NWWdLIAV1nXohO0TuKiVSbzheuTvU6F4378vJsIht3Awq',
  'admin',
  'Administrador',
  true
)
ON CONFLICT (email) DO NOTHING;