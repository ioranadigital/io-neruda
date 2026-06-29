# Configuración de Supabase para IO Neruda

## Paso 1: Crear la tabla `clients` en Supabase

1. Ve a [Supabase Console](https://app.supabase.com/)
2. Selecciona tu proyecto
3. Ve a **SQL Editor** en el menú izquierdo
4. Haz clic en **New Query**
5. Copia todo el contenido de `SETUP-SUPABASE-CLIENTS.sql` en el editor
6. Haz clic en **Run** (ícono de play)

## Paso 2: Verificar que la tabla se creó

1. Ve a **Database** → **Tables**
2. Deberías ver la tabla `clients` en la lista
3. Verifica que los campos se crearon correctamente

## Paso 3: Importar datos existentes (Opcional)

Si tienes clientes en localStorage que quieres migrar a Supabase:

1. Abre la consola del navegador (F12)
2. Copia y pega en la consola:
```javascript
const clients = JSON.parse(localStorage.getItem('io-neruda-clients') || '[]');
console.log('Clientes a importar:', clients);
// Copia el JSON y úsalo en Supabase
```

3. En Supabase, ve a **Database** → **Tables** → **clients**
4. Haz clic en **Insert** y pega los datos

## Paso 4: Verificar la integración

1. Recarga la aplicación en http://localhost:3003
2. Edita un cliente y guarda cambios
3. Ve a Supabase → **Database** → **clients** → verifica que los datos estén actualizados

## Notas Importantes

- Los datos ahora se guardan tanto en **localStorage** como en **Supabase**
- La aplicación funciona offline usando localStorage como caché
- Cuando hay conexión, los cambios se sincronizan con Supabase
- El RLS (Row Level Security) está configurado para permitir acceso a todos (cambiar según tus necesidades)

## Troubleshooting

**Si los datos no se guardan en Supabase:**
- Verifica que las credenciales de Supabase en `.env.local` sean correctas
- Revisa la consola del navegador para errores
- Asegúrate de que la tabla `clients` existe en Supabase

**Si los datos no se cargan:**
- Verifica que RLS está habilitado pero con políticas permisivas
- Comprueba que el JWT token es válido
