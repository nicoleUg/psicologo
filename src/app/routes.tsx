import { createBrowserRouter, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { Calendar } from './pages/Calendar';
import { NewAppointment } from './pages/NewAppointment';
import { AppointmentDetail } from './pages/AppointmentDetail';
import { Patients } from './pages/Patients';
import { NewPatient } from './pages/NewPatient';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/calendar',
    element: (
      <ProtectedRoute>
        <Calendar />
      </ProtectedRoute>
    ),
  },
  {
    path: '/appointments/new',
    element: (
      <ProtectedRoute>
        <NewAppointment />
      </ProtectedRoute>
    ),
  },
  {
    path: '/appointments/:id',
    element: (
      <ProtectedRoute>
        <AppointmentDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: '/patients',
    element: (
      <ProtectedRoute>
        <Patients />
      </ProtectedRoute>
    ),
  },
  {
    path: '/patients/new',
    element: (
      <ProtectedRoute>
        <NewPatient />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
