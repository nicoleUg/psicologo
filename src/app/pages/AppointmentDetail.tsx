import { useNavigate, useParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { ArrowLeft, Calendar, Clock, Edit, Phone, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function AppointmentDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { appointments, getPatient, deleteAppointment } = useApp();

  const appointment = appointments.find((apt) => apt.id === id);
  const patient = appointment ? getPatient(appointment.patientId) : null;

  if (!appointment || !patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500 mb-4">Cita no encontrada</p>
            <Button onClick={() => navigate('/calendar')}>Volver al calendario</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = async () => {
    const success = await deleteAppointment(appointment.id);

    if (!success) {
      toast.error(
        'No se pudo cancelar la cita en Supabase. Verifique la tabla public.appointments y sus policies.'
      );
      return;
    }

    toast.success('Cita cancelada correctamente');
    navigate('/calendar');
  };

  const appointmentDate = parseISO(appointment.date);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/calendar')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al calendario
          </Button>
          <h1 className="font-semibold text-xl">Detalles de la Cita</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6">
        <div className="space-y-6">
          {/* Appointment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Información de la Cita
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fecha</p>
                  <p className="font-medium capitalize">
                    {format(appointmentDate, "EEEE, d 'de' MMMM yyyy", { locale: es })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Horario</p>
                  <p className="font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {appointment.startTime} - {appointment.endTime}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-1">Duración</p>
                <p className="font-medium">
                  {calculateDuration(appointment.startTime, appointment.endTime)} minutos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                Información del Paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nombre completo</p>
                <p className="font-medium text-lg">{patient.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Teléfono de contacto</p>
                <a
                  href={`tel:${patient.phone}`}
                  className="font-medium flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                >
                  <Phone className="w-4 h-4" />
                  {patient.phone}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cancelar Cita
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Está seguro de cancelar esta cita?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. La cita de <strong>{patient.fullName}</strong> el{' '}
                    <strong>{format(appointmentDate, "d 'de' MMMM", { locale: es })}</strong> a las{' '}
                    <strong>{appointment.startTime}</strong> será eliminada permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, mantener cita</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Sí, cancelar cita
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button 
              onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
              className="w-full sm:flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              Reprogramar Cita
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function calculateDuration(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  return (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
}