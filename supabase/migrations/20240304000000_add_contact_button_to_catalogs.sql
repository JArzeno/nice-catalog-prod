-- Add contact button fields to catalogs table
ALTER TABLE catalogs
  ADD COLUMN IF NOT EXISTS contact_button_label TEXT,
  ADD COLUMN IF NOT EXISTS contact_button_url TEXT;
