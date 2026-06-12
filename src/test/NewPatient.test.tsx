import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { NewPatient } from '../app/pages/NewPatient';
import { AppContext } from '../app/context/AppContext';
import { BrowserRouter } from 'react-router';

describe('HU 4: Registro de un nuevo paciente', () => {
  it('Dado el formulario vacío, Cuando llena el nombre pero deja el teléfono vacío, Entonces impide guardar', async () => {
    const mockAddPatient = vi.fn();

    render(
      <BrowserRouter>
        <AppContext.Provider value={{ 
          patients: [],
          appointments: [],
          workingHours: { start: '08:00', end: '18:00' },
          isAuthenticated: false,
          isAuthLoading: false,
          isSupabaseConnected: true,
          addPatient: mockAddPatient,
          addAppointment: vi.fn().mockResolvedValue(true),
          updateAppointment: vi.fn().mockResolvedValue(true),
          deleteAppointment: vi.fn().mockResolvedValue(true),
          getPatient: vi.fn(),
          hasTimeConflict: vi.fn().mockReturnValue(false),
          login: vi.fn(),
          logout: vi.fn(),
        }}>
          <NewPatient />
        </AppContext.Provider>
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const submitButton = screen.getByRole('button', { name: /registrar paciente/i });

    await userEvent.type(nameInput, 'Carlos Mendoza');
    fireEvent.click(submitButton);

    expect(mockAddPatient).not.toHaveBeenCalled();
  });
});