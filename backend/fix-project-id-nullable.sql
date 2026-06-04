-- ====================================================================
-- Fix: Make project_id nullable in io_neruda_content_configurations
-- ====================================================================

-- Drop the current foreign key constraint
ALTER TABLE io_neruda_content_configurations
DROP CONSTRAINT io_neruda_content_configurations_project_id_fkey;

-- Make project_id nullable
ALTER TABLE io_neruda_content_configurations
ALTER COLUMN project_id DROP NOT NULL;

-- Re-add the foreign key constraint (now allowing NULL)
ALTER TABLE io_neruda_content_configurations
ADD CONSTRAINT io_neruda_content_configurations_project_id_fkey
FOREIGN KEY (project_id)
REFERENCES io_neruda_projects(id)
ON DELETE CASCADE;

-- Log the change
COMMENT ON COLUMN io_neruda_content_configurations.project_id
IS 'Foreign key to project, nullable to allow global configurations';
