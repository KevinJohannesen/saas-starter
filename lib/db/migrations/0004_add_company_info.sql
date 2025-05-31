-- Add company information fields to teams table
ALTER TABLE teams
ADD COLUMN company_name TEXT NOT NULL DEFAULT '',
ADD COLUMN company_address TEXT NOT NULL DEFAULT '',
ADD COLUMN company_phone TEXT NOT NULL DEFAULT '',
ADD COLUMN company_email TEXT NOT NULL DEFAULT '',
ADD COLUMN company_website TEXT,
ADD COLUMN company_org_number TEXT,
ADD COLUMN company_vat_number TEXT,
ADD COLUMN theme TEXT NOT NULL DEFAULT 'light',
ADD COLUMN logo TEXT,
ADD COLUMN primary_color TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN secondary_color TEXT NOT NULL DEFAULT '#ffffff',
ADD COLUMN timezone TEXT NOT NULL DEFAULT 'Europe/Oslo',
ADD COLUMN language TEXT NOT NULL DEFAULT 'no',
ADD COLUMN currency TEXT NOT NULL DEFAULT 'NOK',
ADD COLUMN date_format TEXT NOT NULL DEFAULT 'DD.MM.YYYY',
ADD COLUMN time_format TEXT NOT NULL DEFAULT '24';

-- Update existing teams with default values
UPDATE teams
SET company_name = name,
    company_address = '',
    company_phone = '',
    company_email = ''; 