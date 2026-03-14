# Sistema de Reservas para Psicólogo - Mockups Funcionales

## 📋 Descripción

Sistema completo de gestión de citas para consultorio psicológico con todas las funcionalidades del MVP (Fase 1).

## ✨ Características Implementadas (MVP - Fase 1)

### ✅ Historia 1: Autenticación
- Login con correo y contraseña
- Validación de credenciales
- Protección de rutas
- **Demo:** Acepta cualquier correo/contraseña para demostración

### ✅ Historia 4: Registro de Pacientes
- Formulario simple (nombre completo + teléfono)
- Validación de campos obligatorios
- Confirmación visual con toast

### ✅ Historia 5: Agendamiento de Citas
- Selección de paciente existente
- Selector de fecha y horarios
- **Validación automática de conflictos de horario**
- Validación de horario laboral (08:00 - 18:00)
- Alertas informativas

### ✅ Historia 6: Visualización del Calendario
- Vista semanal completa
- Vista diaria para móviles
- Navegación entre semanas
- Indicador visual de "Hoy"
- Citas coloreadas por paciente
- Carga en menos de 3 segundos

### ✅ Historia 8: Cancelación de Citas
- Vista detallada de cada cita
- Confirmación antes de eliminar
- Liberación automática del horario

### ✅ Historia 10: Diseño Responsive
- Totalmente adaptable a móviles, tablets y desktop
- Navegación optimizada por tamaño de pantalla
- Botones táctiles apropiados para móvil

## 🎨 Pantallas Incluidas

1. **Login** (`/`)
   - Pantalla de inicio de sesión
   - Diseño centrado con branding

2. **Calendario** (`/calendar`)
   - Vista principal del sistema
   - Navegación semanal
   - Acceso rápido a nueva cita
   - Lista de citas para móvil
   - Tabla horaria para desktop

3. **Nueva Cita** (`/appointments/new`)
   - Formulario completo de agendamiento
   - Selección de paciente
   - Fecha y horarios
   - Validaciones en tiempo real

4. **Detalle de Cita** (`/appointments/:id`)
   - Información completa de la cita
   - Datos del paciente
   - Botón de cancelación con confirmación

5. **Directorio de Pacientes** (`/patients`)
   - Lista completa de pacientes
   - Búsqueda en tiempo real
   - Acceso rápido para agendar

6. **Nuevo Paciente** (`/patients/new`)
   - Formulario de registro
   - Campos mínimos requeridos

## 🎯 Datos de Demostración

El sistema incluye datos de ejemplo:

### Pacientes
- María García López - +34 612 345 678
- Juan Pérez Martínez - +34 623 456 789
- Ana Rodríguez Silva - +34 634 567 890

### Citas Pre-agendadas
- 26 Feb 2026, 09:00-10:00: María García López
- 26 Feb 2026, 11:00-12:00: Juan Pérez Martínez
- 27 Feb 2026, 10:00-11:00: Ana Rodríguez Silva

## 🔐 Seguridad (Mockup)

- Sistema de autenticación simulado
- Rutas protegidas con redirección
- En producción requeriría Supabase para:
  - Autenticación real con encriptación
  - Base de datos persistente
  - Backups automáticos

## 🚀 Funcionalidades Destacadas

### Validación de Conflictos
El sistema **previene automáticamente** el doble agendamiento:
- Detecta solapamiento de horarios
- Bloquea el guardado si hay conflicto
- Muestra alerta clara al usuario

### Horario Laboral
- Configurado: 08:00 - 18:00
- Valida que las citas estén dentro del rango
- En Fase 2 será configurable dinámicamente

### Experiencia de Usuario
- Máximo 2-3 clics para completar acciones
- Feedback inmediato con toasts
- Navegación intuitiva
- Sin recarga de página (SPA)

## 📱 Responsive Design

### Móvil
- Vista de lista por día
- Tarjetas expandidas
- Botones grandes para táctil

### Desktop
- Tabla completa semanal
- Vista general de toda la semana
- Más información simultánea

## 🔄 Flujos de Usuario Principales

### Flujo 1: Agendar Nueva Cita
1. Login → Calendario
2. Clic en "Nueva Cita"
3. Seleccionar paciente (o crear uno nuevo)
4. Elegir fecha y horario
5. Sistema valida conflictos
6. Confirmación y regreso al calendario

### Flujo 2: Ver y Cancelar Cita
1. Desde el calendario, clic en una cita
2. Ver detalles completos
3. Opción de cancelar
4. Confirmación de seguridad
5. Horario liberado automáticamente

### Flujo 3: Gestionar Pacientes
1. Desde calendario → Pacientes
2. Ver lista completa o buscar
3. Registrar nuevo paciente
4. Agendar cita directamente

## 🎨 Paleta de Colores

- **Principal:** Índigo (#4F46E5)
- **Éxito:** Verde
- **Error/Cancelar:** Rojo
- **Neutro:** Grises para interfaz

## 📊 Próximos Pasos (Fase 2)

- Historia 2: Login con Google OAuth
- Historia 3: Configuración dinámica de horario laboral
- Historia 7: Edición directa de citas (sin eliminar y recrear)
- Historia 9: Búsqueda avanzada con filtros

## 💡 Notas Técnicas

- **Framework:** React 18 + TypeScript
- **Router:** React Router v7 (Data Mode)
- **Estilos:** Tailwind CSS v4
- **UI Components:** Radix UI + shadcn/ui
- **Notificaciones:** Sonner
- **Manejo de fechas:** date-fns
- **Estado:** Context API (simula backend)

## 🔗 Rutas del Sistema

```
/                          → Login
/calendar                  → Calendario principal
/appointments/new          → Nueva cita
/appointments/:id          → Detalle de cita
/patients                  → Directorio
/patients/new              → Nuevo paciente
```

## 🎬 Cómo Usar

1. Abrir el sistema
2. Login con cualquier correo/contraseña
3. Explorar el calendario pre-poblado
4. Crear nuevas citas
5. Gestionar pacientes
6. Navegar entre semanas
7. Cancelar citas existentes

---

**Nota:** Este es un mockup funcional con datos en memoria. Para producción se recomienda integrar Supabase para persistencia real, autenticación segura y backups automáticos.
