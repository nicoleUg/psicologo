import { describe, it, expect } from 'vitest';
import { isTimeConflict, timeToMinutes } from '../app/lib/timeUtils';

describe('isTimeConflict', () => {
  it('debe detectar un cruce cuando los horarios se superponen', () => {
    // cita 1: 08:00 a 09:00 y cita 2: 08:30 a 09:30 (Hay conflicto)
    const hasConflict = isTimeConflict("08:00", "09:00", "08:30", "09:30");
    expect(hasConflict).toBe(true);
  });
});