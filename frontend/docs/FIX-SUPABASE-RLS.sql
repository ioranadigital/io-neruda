-- Verificar y corregir permisos RLS en io_neruda_clients

-- 1. VERIFICAR que la tabla existe
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'io_neruda_clients';

-- 2. VERIFICAR RLS está habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'io_neruda_clients';

-- 3. LISTAR las políticas RLS actuales
SELECT policyname, qual, with_check
FROM pg_policies
WHERE tablename = 'io_neruda_clients';

-- 4. Si no hay políticas, CREAR políticas permisivas (IMPORTANTE: esto permite acceso a todos)
-- Ejecuta SOLO si no hay políticas:

-- Eliminar políticas antiguas si las hay
DROP POLICY IF EXISTS "Allow all access" ON io_neruda_clients;
DROP POLICY IF EXISTS "Enable all" ON io_neruda_clients;
DROP POLICY IF EXISTS "Enable select" ON io_neruda_clients;
DROP POLICY IF EXISTS "Enable insert" ON io_neruda_clients;
DROP POLICY IF EXISTS "Enable update" ON io_neruda_clients;

-- Crear nueva política permisiva
CREATE POLICY "Enable all access for all users"
ON io_neruda_clients
FOR ALL
USING (true)
WITH CHECK (true);

-- 5. VERIFICAR que la columna buyer_personas_list existe
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'io_neruda_clients'
AND column_name = 'buyer_personas_list';

-- 6. Si no existe, CREAR la columna
-- ALTER TABLE io_neruda_clients ADD COLUMN buyer_personas_list JSONB;

-- 7. PROBAR inserción (reemplaza el ID con uno real)
-- INSERT INTO io_neruda_clients (
--   id, name, slug, description, is_active, created_at, updated_at
-- ) VALUES (
--   'test-id-123',
--   'Test Client',
--   'test-client',
--   'Test description',
--   true,
--   NOW(),
--   NOW()
-- ) ON CONFLICT (id) DO UPDATE SET
--   updated_at = NOW();
