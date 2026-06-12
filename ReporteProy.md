EF — Reporte de Proyecto
Estudiante: Sofia Nicole Ugarte Salazar
Proyecto: Sistema de agenda psicologo
repositorio: https://github.com/nicoleUg/psicologo.git 
Fecha de entrega: 13/06/2026 

seccion 1 --deployment
URL del despliegue: https://psicologo.leleworks.dev/ 
url2 del despliegue:https://psicologoagenda.netlify.app/

![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
Seccion 2--Pruebas con TDD + cobertura
cobertura inicial(esto depues de ec2)
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-3.png)
![alt text](image-6.png)
2.1 Ciclo TDD 1 — HU-08 (Cruce de horarios)
primero atacaremos a lo que es los cruces de horarios en las citas para eso creamos nuestro archivo timeUtils.test.ts crearemos un test pero siguiendo los principios de tdd haremos que falle 
2.1.1. Prueba roja
como lo planeado fallo la prueba
![alt text](image-7.png)
commit 1 Rojo [a92f591] https://github.com/nicoleUg/psicologo/commit/a92f591d51019cd2ddb736af746ee5a7e4836000 

```typescript
import { describe, it, expect } from 'vitest';
import { isTimeConflict, timeToMinutes } from '../app/lib/timeUtils';

describe('isTimeConflict', () => {
  it('debe detectar un cruce cuando los horarios se superponen', () => {
    // cita 1: 08:00 a 09:00 y cita 2: 08:30 a 09:30 (Hay conflicto)
    const hasConflict = isTimeConflict("08:00", "09:00", "08:30", "09:30");
    expect(hasConflict).toBe(true);
  });
});'
```
2.1.2 Fase en verde 
como lo planeado paso el test
![alt text](image-8.png)
![alt text](image-9.png)
commit 2 Verde [abbdd1b] https://github.com/nicoleUg/psicologo/commit/abbdd1b58b8f9c250042a8ad6c761eb44cba601b 
```typescript
export function isTimeConflict(start1: string, end1: string, start2: string, end2: string): boolean {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  
  if (s1 < e2 && s2 < e1) {
    return true;
  }
  return false;
}
```
2.1.3 Refactorizacion 
refactor al codigo para que sea mas  legible e entendible 
![alt text](image-10.png)
![alt text](image-11.png)
commit 3 refactorizacion [] '
```typescript
export function isTimeConflict(start1: string, end1: string, start2: string, end2: string): boolean {
  return timeToMinutes(start1) < timeToMinutes(end2) && timeToMinutes(start2) < timeToMinutes(end1);
}

```
