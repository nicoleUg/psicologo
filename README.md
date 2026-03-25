

# Sistema de Reservas para Psicologo

Sistema web para gestion de citas de consultorio psicologico (MVP Fase 1) construido con React + TypeScript.

## Descripcion

Este proyecto permite gestionar pacientes y citas para un consultorio psicologico.
La aplicacion funciona como SPA (sin recargas de pagina) y es responsive para movil, tablet y desktop.

## Funcionalidades implementadas 

- Login con correo y contrasena
- Proteccion de rutas
- Registro de pacientes
- Agendamiento de citas con validacion de conflictos
- Validacion de horario laboral (08:00 - 18:00)
- Calendario semanal (desktop) y vista diaria/lista (movil)
- Detalle y cancelacion de citas
- Reprogramacion directa de citas (editar sin eliminar)
- Busqueda avanzada de pacientes (filtros por nombre/telefono)
- Notificaciones visuales con toast

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

## Modo local vs modo Supabase

- Modo local (mock): si no configuras variables de Supabase, la app usa datos en memoria.
- Modo Supabase: con `.env` configurado y base inicial creada, la app persiste datos en Supabase.

## El usuario unico de acceso

- Email: `psicologoLoquero@gmail.com`
- Password: `12345678910`
- Auto Confirm User: activado


## Acceso al sistema

- Modo local (mock): acepta cualquier correo/contrasena para demostracion.
- Modo Supabase: usa el usuario unico configurado en Authentication.

## Rutas del sistema

- `/` -> Login
- `/calendar` -> Calendario principal
- `/appointments/new` -> Nueva cita
- `/appointments/:id` -> Detalle de cita
- `/appointments/:id/edit` -> Editar/reprogramar cita
- `/patients` -> Directorio de pacientes (con busqueda avanzada)
- `/patients/new` -> Nuevo paciente

## Datos de demostracion (modo local)

Pacientes:

- Maria Quispe Mamani - +591 7123 4567
- Juan Choque Flores - +591 7214 5678
- Ana Rojas Condori - +591 7345 6789

Citas preagendadas:

- 26 Feb 2026, 09:00-10:00: Maria Quispe Mamani
- 26 Feb 2026, 11:00-12:00: Juan Choque Flores
- 27 Feb 2026, 10:00-11:00: Ana Rojas Condori

## Stack tecnico

- React 18 + TypeScript
- React Router v7 (Data Mode)
- Tailwind CSS v4
- Radix UI + shadcn/ui
- Sonner
- date-fns
- Context API



