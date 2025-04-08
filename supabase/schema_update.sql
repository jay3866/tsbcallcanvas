-- Add area_code, phone_number, and onboarding_completed fields to the profiles table
ALTER TABLE profiles 
ADD COLUMN area_code TEXT,
ADD COLUMN phone_number TEXT,
ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
