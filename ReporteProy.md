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
commit 3 refactorizacion [ec07f48] https://github.com/nicoleUg/psicologo/commit/ec07f48b55423d4b83f4388491a1e2630cd23870 
```typescript
export function isTimeConflict(start1: string, end1: string, start2: string, end2: string): boolean {
  return timeToMinutes(start1) < timeToMinutes(end2) && timeToMinutes(start2) < timeToMinutes(end1);
}

```
2.2 HU-11:Validacion de telefono movil 
2.2.1 Prueba roja
como se esperaba fallo
![alt text](image-13.png)
![alt text](image-14.png)
![alt text](image-12.png)
commit 1 Rojo [39dd26d] https://github.com/nicoleUg/psicologo/commit/39dd26d1b08c0f21828c7cc05d58eb6af0d75e94 
```typescript

describe('isValidMobilePhone', () => {
  it('debe validar un número móvil correcto con prefijo +591', () => {
    expect(isValidMobilePhone("+591 71234567")).toBe(true);
    expect(isValidMobilePhone("+591 69876543")).toBe(true);
  });

  it('debe rechazar números con formato inválido o longitud incorrecta', () => {
    expect(isValidMobilePhone("12345")).toBe(false); 
    expect(isValidMobilePhone("+591 21234567")).toBe(false); 
  });
});
```
2.2.2 prueba verde 
![alt text](image-15.png)
como se esperaba paso el test
commit verde [1193b01] https://github.com/nicoleUg/psicologo/commit/1193b01da0d521b50969886467db3e89e365a5fa 
```typescript
export function isValidMobilePhone(phone: string): boolean {
  if (phone.includes("+591 7") || phone.includes("+591 6")) {
    return true;
  }
  return false;
}
```
2.2.3 Refactor 
refactor al codigo para que sea mas  legible e entendible 
![alt text](image-16.png)
commit refactor [faa23f9] https://github.com/nicoleUg/psicologo/commit/faa23f9033528db97d1b675aab3ddfcc8c4ae329 

```typescript

export function isValidMobilePhone(phone: string): boolean {
  const normalized = phone.replace(/\s/g, '');
  const phoneRegex = /^\+591[67]\d{7}$/;
  return phoneRegex.test(normalized);
}
```
2.3 HU-12: Validación de Nombre Completo 
2.3.1 Prueba roja 
fallo 
commit rojo [8e8ce32] https://github.com/nicoleUg/psicologo/commit/8e8ce323d09203b414ad38d678abff04da135e93 
![alt text](image-17.png)
![alt text](image-18.png)
```typescript
describe('isValidFullName', () => {
  it('debe aceptar nombres con al menos dos palabras', () => {
    expect(isValidFullName("Maria Quispe")).toBe(true);
  });

  it('debe rechazar nombres de una sola palabra', () => {
    expect(isValidFullName("Maria")).toBe(false);
  });
});
```
2.3.2 prueba verde 
commit verde []
![alt text](image-19.png)
```typescript
export function isValidFullName(name: string): boolean {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return true;
  }
  return false;
}
```