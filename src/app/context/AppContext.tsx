import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Patient, Appointment, WorkingHours } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AppContextType {
  patients: Patient[];
  appointments: Appointment[];
  workingHours: WorkingHours;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isSupabaseConnected: boolean;
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<Patient | null>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<boolean>;
  deleteAppointment: (id: string) => Promise<boolean>;
  getPatient: (id: string) => Patient | undefined;
  checkTimeConflict: (date: string, startTime: string, endTime: string, excludeId?: string) => boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const initialPatients: Patient[] = [
  { id: '1', fullName: 'Maria Quispe Mamani', phone: '+591 7123 4567' },
  { id: '2', fullName: 'Juan Choque Flores', phone: '+591 7214 5678' },
  { id: '3', fullName: 'Ana Rojas Condori', phone: '+591 7345 6789' },
];

const initialAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    date: '2026-02-26',
    startTime: '09:00',
    endTime: '10:00',
  },
  {
    id: '2',
    patientId: '2',
    date: '2026-02-26',
    startTime: '11:00',
    endTime: '12:00',
  },
  {
    id: '3',
    patientId: '3',
    date: '2026-02-27',
    startTime: '10:00',
    endTime: '11:00',
  },
];

interface PatientRow {
  id: string;
  full_name: string;
  phone: string;
}

interface AppointmentRow {
  id: string;
  patient_id: string;
  date: string;
  start_time: string;
  end_time: string;
}

const defaultWorkingHours: WorkingHours = { start: '08:00', end: '18:00' };
const ALLOWED_PSYCHOLOGIST_EMAIL = 'psicologoloquero@gmail.com';

export function AppProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(isSupabaseConfigured);
  const [workingHours] = useState<WorkingHours>(defaultWorkingHours);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsAuthLoading(false);
      return;
    }

    const syncSession = (session: Session | null) => {
      const sessionEmail = session?.user?.email?.trim().toLowerCase();
      const isAllowedUser = Boolean(
        sessionEmail && sessionEmail === ALLOWED_PSYCHOLOGIST_EMAIL
      );

      setIsAuthenticated(isAllowedUser);

      if (session && !isAllowedUser) {
        void supabase.auth.signOut();
      }
    };

    const initAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error validando sesión de Supabase:', error.message);
      }

      syncSession(data.session ?? null);
      setIsAuthLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncSession(session);
      setIsAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    if (!isAuthenticated) {
      setPatients([]);
      setAppointments([]);
      return;
    }

    const loadInitialData = async () => {
      const [patientsResponse, appointmentsResponse] = await Promise.all([
        supabase
          .from('patients')
          .select('id, full_name, phone')
          .order('full_name', { ascending: true }),
        supabase
          .from('appointments')
          .select('id, patient_id, date, start_time, end_time')
          .order('date', { ascending: true })
          .order('start_time', { ascending: true }),
      ]);

      if (patientsResponse.error) {
        console.error('Error cargando pacientes desde Supabase:', patientsResponse.error.message);
      } else {
        setPatients((patientsResponse.data ?? []).map(mapPatientRow));
      }

      if (appointmentsResponse.error) {
        console.error(
          'Error cargando citas desde Supabase:',
          appointmentsResponse.error.message
        );
      } else {
        setAppointments((appointmentsResponse.data ?? []).map(mapAppointmentRow));
      }
    };

    loadInitialData();
  }, [isAuthenticated]);

  const addPatient = async (patientData: Omit<Patient, 'id'>): Promise<Patient | null> => {
    const normalizedData = {
      fullName: patientData.fullName.trim(),
      phone: patientData.phone.trim(),
    };

    if (!isSupabaseConfigured || !supabase) {
      const newPatient: Patient = {
        id: Date.now().toString(),
        ...normalizedData,
      };
      setPatients((prev) => [...prev, newPatient]);
      return newPatient;
    }

    const { data, error } = await supabase
      .from('patients')
      .insert({
        full_name: normalizedData.fullName,
        phone: normalizedData.phone,
      })
      .select('id, full_name, phone')
      .single();

    if (error || !data) {
      console.error('Error guardando paciente en Supabase:', error?.message);
      return null;
    }

    const newPatient = mapPatientRow(data as PatientRow);
    setPatients((prev) => [...prev, newPatient]);
    return newPatient;
  };

  const addAppointment = async (
    appointmentData: Omit<Appointment, 'id'>
  ): Promise<boolean> => {
    const hasConflict = checkTimeConflict(
      appointmentData.date,
      appointmentData.startTime,
      appointmentData.endTime
    );

    if (hasConflict) {
      return false;
    }

    if (!isSupabaseConfigured || !supabase) {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        ...appointmentData,
      };
      setAppointments((prev) => [...prev, newAppointment]);
      return true;
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        patient_id: appointmentData.patientId,
        date: appointmentData.date,
        start_time: appointmentData.startTime,
        end_time: appointmentData.endTime,
      })
      .select('id, patient_id, date, start_time, end_time')
      .single();

    if (error || !data) {
      console.error('Error guardando cita en Supabase:', error?.message);
      return false;
    }

    const newAppointment = mapAppointmentRow(data as AppointmentRow);
    setAppointments((prev) => [...prev, newAppointment]);
    return true;
  };

  const deleteAppointment = async (id: string): Promise<boolean> => {
    if (!isSupabaseConfigured || !supabase) {
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
      return true;
    }

    const { error } = await supabase.from('appointments').delete().eq('id', id);

    if (error) {
      console.error('Error eliminando cita en Supabase:', error.message);
      return false;
    }

    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    return true;
  };

  const getPatient = (id: string): Patient | undefined => {
    return patients.find((p) => p.id === id);
  };

  const checkTimeConflict = (
    date: string,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): boolean => {
    const dayAppointments = appointments.filter(
      (apt) => apt.date === date && apt.id !== excludeId
    );

    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    return dayAppointments.some((apt) => {
      const aptStart = timeToMinutes(apt.startTime);
      const aptEnd = timeToMinutes(apt.endTime);
      return (start < aptEnd && end > aptStart);
    });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!isSupabaseConfigured || !supabase) {
      console.error('Supabase no está configurado para autenticación.');
      return false;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail !== ALLOWED_PSYCHOLOGIST_EMAIL) {
      return false;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.session) {
      console.error('Error de login en Supabase:', error?.message);
      return false;
    }

    const sessionEmail = data.user?.email?.trim().toLowerCase();

    if (sessionEmail !== ALLOWED_PSYCHOLOGIST_EMAIL) {
      await supabase.auth.signOut();
      return false;
    }

    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);

    if (isSupabaseConfigured && supabase) {
      void supabase.auth.signOut();
    }
  };

  return (
    <AppContext.Provider
      value={{
        patients,
        appointments,
        workingHours,
        isAuthenticated,
        isAuthLoading,
        isSupabaseConnected: isSupabaseConfigured,
        addPatient,
        addAppointment,
        deleteAppointment,
        getPatient,
        checkTimeConflict,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Helper function
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function mapPatientRow(row: PatientRow): Patient {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
  };
}

function mapAppointmentRow(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    patientId: row.patient_id,
    date: row.date,
    startTime: row.start_time.slice(0, 5),
    endTime: row.end_time.slice(0, 5),
  };
}
