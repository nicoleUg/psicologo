import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Patients } from '../app/pages/Patients';
import { AppContext } from '../app/context/AppContext';
import { BrowserRouter } from 'react-router';

const mockPatients = [
  { id: '1', fullName: 'Maria Quispe Mamani', phone: '+591 7123 4567' },
  { id: '2', fullName: 'Juan Choque Flores', phone: '+591 7214 5678' },
];

describe('HU 9: Búsqueda avanzada de pacientes', () => {
  it('Filtra la lista de pacientes en tiempo real al escribir en el buscador', async () => {
    render(
      <BrowserRouter>
        <AppContext.Provider value={{
          patients: mockPatients,
          appointments: [],
          workingHours: { start: '08:00', end: '18:00' },
          isAuthenticated: false,
          isAuthLoading: false,
          isSupabaseConnected: true,
          addPatient: vi.fn().mockResolvedValue(null),
          addAppointment: vi.fn().mockResolvedValue(true),
          updateAppointment: vi.fn().mockResolvedValue(true),
          deleteAppointment: vi.fn().mockResolvedValue(true),
          getPatient: vi.fn(),
          hasTimeConflict: vi.fn().mockReturnValue(false),
          login: vi.fn(),
          logout: vi.fn(),
        }}>
          <Patients />
        </AppContext.Provider>
      </BrowserRouter>
    );

    // Ambos pacientes deben estar visibles inicialmente
    expect(screen.getByText('Maria Quispe Mamani')).toBeInTheDocument();
    expect(screen.getByText('Juan Choque Flores')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/buscar/i);
    await userEvent.type(searchInput, 'Juan');

    // Mapea la vista filtrada
    expect(screen.queryByText('Maria Quispe Mamani')).not.toBeInTheDocument();
    expect(screen.getByText('Juan Choque Flores')).toBeInTheDocument();
  });
});