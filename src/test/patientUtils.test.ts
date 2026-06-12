import { describe, it, expect } from 'vitest';
import { isValidMobilePhone } from '../app/lib/patientUtils';

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