-- ============================================
-- Resume Editor - Database Schema
-- ============================================

-- RESUMES TABLE
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  template TEXT NOT NULL DEFAULT 'modern',
  
  -- Personal Information
  personal_info JSONB DEFAULT '{
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "linkedin": "",
    "photoUrl": ""
  }'::jsonb,
  
  -- Summary
  summary TEXT DEFAULT '',
  
  -- Experience (array of experience objects)
  experience JSONB DEFAULT '[]'::jsonb,
  
  -- Education (array of education objects)
  education JSONB DEFAULT '[]'::jsonb,
  
  -- Skills (array of skill objects)
  skills JSONB DEFAULT '[]'::jsonb,
  
  -- Certifications (array of strings)
  certifications JSONB DEFAULT '[]'::jsonb,
  
  -- Section Order & Visibility
  section_order JSONB DEFAULT '[
    {"id": "personalInfo", "visible": true},
    {"id": "summary", "visible": true},
    {"id": "experience", "visible": true},
    {"id": "education", "visible": true},
    {"id": "skills", "visible": true},
    {"id": "certifications", "visible": true}
  ]'::jsonb,
  
  -- Style Settings
  style_settings JSONB DEFAULT '{
    "primaryColor": "#3b82f6",
    "secondaryColor": "#1e40af",
    "fontFamily": "Inter",
    "fontSize": "medium"
  }'::jsonb,
  
  -- Metadata
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_updated_at ON resumes(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Users can view their own resumes
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own resumes
CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own resumes
CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own resumes
CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Public resumes can be viewed by anyone
CREATE POLICY "Anyone can view public resumes"
  ON resumes FOR SELECT
  USING (is_public = true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
