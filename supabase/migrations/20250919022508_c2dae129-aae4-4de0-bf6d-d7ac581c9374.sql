-- Create a demo banner and improve user experience
-- Note: This doesn't create actual test users, just provides demo info

-- Add a demo notification for users about test credentials
COMMENT ON TABLE user_preferences IS 'User preferences table. Demo credentials: test@cloudcast.demo / demo123';

-- You can use these test credentials:
-- Email: test@cloudcast.demo
-- Password: demo123