-- Add employee-specific fields to team_members table
ALTER TABLE team_members
ADD COLUMN position VARCHAR(100),
ADD COLUMN department VARCHAR(100),
ADD COLUMN phone VARCHAR(20),
ADD COLUMN address TEXT,
ADD COLUMN hire_date TIMESTAMP,
ADD COLUMN emergency_contact TEXT,
ADD COLUMN skills JSONB DEFAULT '[]',
ADD COLUMN certifications JSONB DEFAULT '[]'; 