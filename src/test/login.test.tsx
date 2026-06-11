import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Login } from '../app/pages/Login';
import { AppContext } from '../app/context/AppContext';
import { BrowserRouter } from 'react-router';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  }
}));

describe('HU 1: Inicio de sesión local', () => {
  it('Dado credenciales incorrectas, Cuando intenta iniciar sesión, Entonces deniega el acceso y muestra error', async () => {
    const mockLogin = vi.fn().mockResolvedValue(false); //  fallo en login

    render(
      <BrowserRouter>
        <AppContext.Provider value={{ 
          login: mockLogin, 
          isSupabaseConnected: true, 
          isAuthenticated: false,
          isAuthLoading: false,
          workingHours: { start: '08:00', end: '18:00' },
          logout: vi.fn(), 
          patients: [], 
          appointments: [], 
          addPatient: vi.fn().mockResolvedValue(null), 
          addAppointment: vi.fn().mockResolvedValue(true), 
          deleteAppointment: vi.fn(), 
          updateAppointment: vi.fn().mockResolvedValue(true),
          getPatient: vi.fn(),
          hasTimeConflict: vi.fn().mockReturnValue(false),
        }}>
          <Login />
        </AppContext.Provider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await userEvent.type(emailInput, 'incorrecto@gmail.com');
    await userEvent.type(passwordInput, 'claveEquivocada');
    await userEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith('incorrecto@gmail.com', 'claveEquivocada');
    const { toast } = await import('sonner');
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Credenciales inválidas'));
  });
});