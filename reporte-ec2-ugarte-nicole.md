# Reporte EC2 - Ugarte Nicole

## Fase 2 · Reporte de cobertura inicial (Frontend)
El reporte de cobertura inicial fue generado **antes de escribir ninguna prueba**, evidenciando un **0% de cobertura**. La configuración fue ajustada en `vite.config.ts` para que Vitest midiera únicamente los directorios pertinentes a la **lógica de negocio**, es decir:
- `src/app/pages/**/*.tsx`
- `src/app/context/**/*.tsx`
- `src/app/lib/**/*.ts`

Se excluyeron los componentes de infraestructura (UI components como botones, modales, etc.). El reporte inicial se encuentra en la carpeta `reports/initial-coverage`.

---

## Fase 3 · Implementación de pruebas unitarias (Frontend)
Se desarrollaron **5 pruebas unitarias en total** en este proyecto frontend (superando el mínimo), repartidas de la siguiente manera:

1. **Login.test.tsx**
   - HU vinculada: Validar autenticación de psicólogo permitido.
   - Refleja la validación y denegación de credenciales inválidas.
2. **NewPatient.test.tsx**
   - HU vinculada: Validar formulario de nuevo paciente.
   - Verifica campos obligatorios en el guardado de datos.
3. **PatientsSearch.test.tsx**
   - HU vinculada: Directorio de pacientes.
   - Valida el filtro en tiempo real del buscador de pacientes.
4. **Appointments.test.tsx** (x2 pruebas)
   - HU 5: Manejo y validación de horarios traslapados al agendar.
   - HU 8: Eliminación de citas (muestra del cuadro de diálogo antes de cancelar).

Los *commits* de la implementación están representados aplicando la convención *Conventional Commits*:
- `test(frontend): agregar prueba para validación de acceso denegado en login`
- `test(frontend): agregar prueba de validación de campos obligatorios al registrar paciente`
- `test(frontend): agregar prueba de filtrado de búsqueda de pacientes en tiempo real`
- `test(frontend): agregar pruebas para bloqueo de horarios y eliminación de citas`

---

## Fase 4 · Reporte de cobertura final (Frontend)
Una vez añadidas las 5 pruebas de lógica de negocio, se volvió a ejecutar la inspección de coverage con Istanbul/v8 en Vitest, evidenciando:
- **Antes:** 0.00%
- **Después:** 28.34% Statements (28.61% Lines) globales en la lógica de negocio evaluada.

El reporte final completo en formato HTML fue exportado y se encuentra en `reports/final-coverage`.

---

## Reporte de Code Smells (Frontend Portion)
A lo largo de los proyectos se subsanarán un total de 12 Code Smells. A continuación, presento los smells identificados y corregidos dentro de este repositorio (Frontend en la arquitectura React/TypeScript), abarcando **3 tipos distintos** aquí:

1. **Dead Code / Unused Imports**
   - **Ubicación:** `src/app/pages/Patients.tsx`
   - **Smell:** Importación estática de propiedades de interfaz sin uso en todo el componente (`CardDescription`, `CardHeader`, `CardTitle`).
   - **Corrección:** Eliminación de imports sobrantes, lo que reduce la carga innecesaria de librerías.

2. **Poor Naming (Nombres Poco Descriptivos)**
   - **Ubicación:** `src/app/pages/Patients.tsx` (Método `getPatientAppointmentCount`)
   - **Smell:** Uso de argumento lambda excesivamente acortado `(apt) => apt.patientId === patientId`.
   - **Corrección:** Renombrado a un identificador claro que explique su contexto: `(appointment) => appointment.patientId === patientId`.

3. **Magic Numbers / Hardcoded Configs**
   - **Ubicación:** `src/app/pages/NewAppointment.tsx`
   - **Smell:** Al determinar la hora por defecto si no venía en la URL, se usaba un valor mágico suelto llamado `'09:00'`: `getValidTime(..., '09:00')`.
   - **Corrección:** Extracción a un valor configurable semántico, usando el que ya provee la aplicación: `getValidTime(..., workingHours.start)`.

*(Nota: Los smells restantes y sus tipos complementarios, como God Class o Feature Envy, se resolverán en los repositorios de Backend correspondientes para completar los 12).*