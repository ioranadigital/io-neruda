# Configuración de Supabase para io-neruda

## Paso 1: Ejecutar la Migración SQL

1. Ve a [Supabase Console](https://app.supabase.com)
2. Selecciona tu proyecto: `zvehtloitnuglyjtxwye`
3. Ve a **SQL Editor** en el panel izquierdo
4. Crea una nueva query y copia el contenido de `supabase_migration_clients.sql`
5. Haz clic en **Run**

Esto creará:
- Tabla `io_neruda_clients` con estructura completa
- Índices para optimización
- RLS policies para acceso
- Datos iniciales: Surfvintage (id: 5) y Esgarden (id: 6)

## Paso 2: Verificar la Tabla

En **Table Editor** deberías ver:
- `io_neruda_clients` con 2 filas (Surfvintage, Esgarden)
- Todos los campos correctamente mapeados

## Paso 3: Actualizar la App

Reinicia el servidor frontend:
```bash
cd frontend && npm run dev
```

La app ahora cargará los clientes desde Supabase en lugar de localStorage.

## Cambios en la Lógica

### Antes (localStorage)
```
App inicia → LoadClientsFromStorage() → MOCK_CLIENTS como fallback
Editar cliente → Guardar en localStorage (+ intento Supabase)
```

### Después (Supabase)
```
App inicia → LoadClientsFromSupabase() → Supabase es la fuente de verdad
Editar cliente → Guardar solo en Supabase
```

## Troubleshooting

**Error: "Missing Supabase environment variables"**
- Verifica que `.env.local` tiene `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Estos están en `master.env` (E:\master.env)

**Error: "Relation 'io_neruda_clients' does not exist"**
- La migración SQL no se ejecutó
- Ve a SQL Editor y ejecuta `supabase_migration_clients.sql`

**Error: "Permission denied for schema public"**
- Verifica que RLS policies están habilitadas (incluidas en la migración)
- Asegúrate de usar la ANON KEY (no la service role key)
