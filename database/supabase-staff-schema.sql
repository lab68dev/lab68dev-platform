-- Lab68 Dev Platform - Staff Portal Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Staff Users Table
CREATE TABLE IF NOT EXISTS staff_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'support', 'moderator')),
  department TEXT NOT NULL,
  employee_id TEXT UNIQUE NOT NULL,
  phone TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  is_pending BOOLEAN DEFAULT TRUE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  backup_codes TEXT[], -- Array of backup codes for 2FA
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Approval Requests Table
CREATE TABLE IF NOT EXISTS staff_approval_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES staff_users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES staff_users(id),
  rejection_reason TEXT
);

-- Staff Activity Log Table
CREATE TABLE IF NOT EXISTS staff_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES staff_users(id) ON DELETE SET NULL,
  staff_name TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Sessions Table (for JWT tracking)
CREATE TABLE IF NOT EXISTS staff_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES staff_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password Reset Tokens Table
CREATE TABLE IF NOT EXISTS staff_password_resets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES staff_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate Limiting Table (for persistent rate limiting)
CREATE TABLE IF NOT EXISTS staff_rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL, -- email or IP address
  attempt_count INTEGER DEFAULT 1,
  reset_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_staff_users_email ON staff_users(email);
CREATE INDEX IF NOT EXISTS idx_staff_users_employee_id ON staff_users(employee_id);
CREATE INDEX IF NOT EXISTS idx_staff_users_role ON staff_users(role);
CREATE INDEX IF NOT EXISTS idx_staff_users_is_active ON staff_users(is_active);
CREATE INDEX IF NOT EXISTS idx_staff_activity_log_staff_id ON staff_activity_log(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_activity_log_created_at ON staff_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_staff_sessions_staff_id ON staff_sessions(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_sessions_token ON staff_sessions(token);
CREATE INDEX IF NOT EXISTS idx_staff_password_resets_token ON staff_password_resets(token);
CREATE INDEX IF NOT EXISTS idx_staff_rate_limits_identifier ON staff_rate_limits(identifier);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_staff_users_updated_at
  BEFORE UPDATE ON staff_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM staff_sessions WHERE expires_at < NOW();
  DELETE FROM staff_password_resets WHERE expires_at < NOW() OR used = TRUE;
  DELETE FROM staff_rate_limits WHERE reset_time < NOW();
END;
$$ LANGUAGE plpgsql;

-- Insert default admin user (only if no admin exists)
INSERT INTO staff_users (
  email,
  name,
  password_hash,
  role,
  department,
  employee_id,
  is_active,
  is_pending
)
SELECT
  'admin@lab68dev.com',
  'System Administrator',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYjYQYnXMWW', -- Password: Admin@123456
  'admin',
  'management',
  'ADMIN001',
  TRUE,
  FALSE
WHERE NOT EXISTS (
  SELECT 1 FROM staff_users WHERE role = 'admin' LIMIT 1
);

-- Row Level Security (RLS) Policies
ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_sessions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated staff to read their own data
CREATE POLICY "Staff can view own profile"
  ON staff_users
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Allow admin to view all staff
CREATE POLICY "Admin can view all staff"
  ON staff_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff_users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- Allow admin to update staff
CREATE POLICY "Admin can update staff"
  ON staff_users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM staff_users
      WHERE id::text = auth.uid()::text
      AND role = 'admin'
    )
  );

-- Activity log policies
CREATE POLICY "Staff can view activity log"
  ON staff_activity_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff_users
      WHERE id::text = auth.uid()::text
      AND (role = 'admin' OR role = 'moderator')
    )
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Comments for documentation
COMMENT ON TABLE staff_users IS 'Staff members with access to the admin portal';
COMMENT ON TABLE staff_activity_log IS 'Audit trail of all staff actions';
COMMENT ON TABLE staff_sessions IS 'Active JWT sessions for staff members';
COMMENT ON TABLE staff_password_resets IS 'Password reset tokens';
COMMENT ON TABLE staff_rate_limits IS 'Rate limiting records to prevent brute force attacks';
