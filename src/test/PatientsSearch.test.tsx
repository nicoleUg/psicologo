import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Patients } from '../app/pages/Patients';
import { AppContext } from '../app/context/AppContext';
import { BrowserRouter } from 'react-router';
const PATIENT_MARIA = 'Maria Quispe Mamani';
const PATIENT_JUAN = 'Juan Choque Flores';

const mockPatients = [
  { id: '1', fullName: PATIENT_MARIA, phone: '+591 7123 4567' },
  { id: '2', fullName: PATIENT_JUAN, phone: '+591 7214 5678' },
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

    expect(screen.getByText(PATIENT_MARIA)).toBeInTheDocument();
    expect(screen.getByText(PATIENT_JUAN)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/buscar/i);
    await userEvent.type(searchInput, 'Juan');

    expect(screen.queryByText(PATIENT_MARIA)).not.toBeInTheDocument();
    expect(screen.getByText(PATIENT_JUAN)).toBeInTheDocument();
  });
});