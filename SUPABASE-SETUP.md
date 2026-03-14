# Configuración de Supabase (desde cero)

Si en Supabase solo tienes el proyecto creado, este flujo es el correcto.

## 1) Configura `.env` en este proyecto

En Supabase:

1. Ve a **Project Settings > API**.
2. Copia:
   - `Project URL`
   - `Publishable key` (recomendado) o `anon public key`

Luego, en este proyecto:

1. Crea `.env` copiando `.env.example`.
2. Deja algo así:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=TU_PUBLISHABLE_KEY
# Alternativa soportada:
# VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
```

## 2) Crea tablas y policies (obligatorio)

1. En Supabase, entra a **SQL Editor**.
2. Pulsa **New query**.
3. Copia y pega todo el contenido de [supabase/init.sql](supabase/init.sql).
4. Ejecuta con **Run**.

Si este paso no se ejecuta, la app mostrará el error de `public.patients`.

## 3) Crea el usuario único de acceso (obligatorio)

1. En Supabase, entra a **Authentication > Users**.
2. Pulsa **Add user**.
3. Crea exactamente este usuario:
   - Email: `psicologoLoquero@gmail.com`
   - Password: `12345678910`
   - Auto Confirm User: activado
4. En **Authentication > Providers > Email**, desactiva `Enable email signups` para que no se creen más usuarios.

## 4) Reinicia la app

```bash
npm run dev
```

## 5) Validación rápida

- En Supabase > **Table Editor** deben aparecer las tablas `patients` y `appointments`.
- Al guardar un paciente desde la app, debe insertarse también en Supabase.
- Solo debe poder iniciar sesión el usuario `psicologoLoquero@gmail.com`.

## Nota

Para producción, cambia estas policies abiertas por reglas con autenticación real por usuario.
