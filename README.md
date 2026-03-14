

# Sistema de Reservas para Psicologo

Sistema web para gestion de citas de consultorio psicologico (MVP Fase 1), con React + TypeScript.

## Que incluye este MVP

- Autenticacion por correo y contrasena
- Registro de pacientes
- Agendamiento de citas con validacion de conflictos
- Vista de calendario (semanal en desktop y diaria/lista en movil)
- Detalle y cancelacion de citas
- Diseno responsive

## Requisitos

- Node.js 18 o superior
- npm

## Instalacion y ejecucion

1. Instala dependencias:

```bash
npm i
```

2. Inicia el servidor de desarrollo:

```bash
npm run dev
```

## Modos de funcionamiento

- Modo local (mock): si no configuras variables de Supabase, la app funciona con datos en memoria.
- Modo Supabase: si configuras `.env` y ejecutas el SQL inicial, la app usa persistencia real.

## Configuracion de Supabase (desde cero)

Si en Supabase solo tienes el proyecto creado, sigue estos pasos.

### 1) Configura `.env`

En Supabase, abre `Project Settings > API` y copia:

- Project URL
- Publishable key (recomendado) o anon public key

Luego, en este proyecto, crea `.env` a partir de `.env.example` y deja algo asi:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=TU_PUBLISHABLE_KEY
# Alternativa soportada:
# VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
```

### 2) Crea tablas y policies

1. En Supabase, abre `SQL Editor`.
2. Crea una nueva query.
3. Copia y pega todo el contenido de `supabase/init.sql`.
4. Ejecuta la query.

Si no ejecutas este paso, la app mostrara error en `public.patients`.

### 3) Crea el usuario unico de acceso

1. En Supabase, abre `Authentication > Users`.
2. Crea un usuario con estos datos:
	- Email: `psicologoLoquero@gmail.com`
	- Password: `12345678910`
	- Auto Confirm User: activado
3. En `Authentication > Providers > Email`, desactiva `Enable email signups` para bloquear nuevos registros.

### 4) Reinicia la app

```bash
npm run dev
```

### 5) Validacion rapida

- En `Table Editor` deben existir `patients` y `appointments`.
- Al crear un paciente desde la app, debe insertarse en Supabase.
- Solo debe iniciar sesion el usuario `psicologoLoquero@gmail.com` en modo Supabase.

## Acceso al sistema

- En modo local (mock): acepta cualquier correo/contrasena para demostracion.
- En modo Supabase: usa el usuario unico configurado en Authentication.

## Rutas del sistema

- `/` -> Login
- `/calendar` -> Calendario principal
- `/appointments/new` -> Nueva cita
- `/appointments/:id` -> Detalle de cita
- `/patients` -> Directorio de pacientes
- `/patients/new` -> Nuevo paciente

## Funcionalidades clave

- Prevencion de doble agendamiento por solapamiento de horario
- Validacion de horario laboral (08:00 - 18:00)
- Confirmaciones visuales con toast
- Navegacion sin recarga de pagina (SPA)

## Stack tecnico

- React 18 + TypeScript
- React Router v7 (Data Mode)
- Tailwind CSS v4
- Radix UI + shadcn/ui
- Sonner
- date-fns
- Context API (simula backend local)

