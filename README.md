

# Sistema de Reservas para Psicologo

Sistema web para gestion de citas de consultorio psicologico (MVP Fase 1), con React + TypeScript.

## Que incluye este MVP

- Autenticacion por correo y contrasena
- Registro de pacientes
- Agendamiento de citas con validacion de conflictos
- Vista de calendario (semanal en desktop y diaria/lista en movil)
- Detalle y cancelacion de citas
- Diseno responsive

## Instalacion y ejecucion

1. Instala dependencias:

```bash
npm i
```

2. Inicia el servidor de desarrollo:

```bash
npm run dev
```

### 2) usuario unico de acceso
	- Email: `psicologoLoquero@gmail.com`
	- Password: `12345678910`

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

