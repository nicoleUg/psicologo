import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function generateTimeSlots(startTime: string, endTime: string): string[] {
  const slots: string[] = [];
  let current = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  while (current < end) {
    const hours = Math.floor(current / 60);
    const minutes = current % 60;
    slots.push(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
    current += 60; // 1 hour slots
  }

  return slots;
}

function formatTimeForInput(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function getValidTime(time: string | null, timeSlots: string[], fallback: string): string {
  if (!time || !timeSlots.includes(time)) {
    return fallback;
  }
  return time;
}

function getValidEndTime(
  endTime: string | null,
  startTime: string,
  timeSlots: string[]
): string {
  if (!endTime) {
    const startIdx = timeSlots.indexOf(startTime);
    return startIdx < timeSlots.length - 1 ? timeSlots[startIdx + 1] : timeSlots[timeSlots.length - 1];
  }
  return getValidTime(endTime, timeSlots, timeSlots[timeSlots.length - 1]);
}

export function EditAppointment() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { appointments, patients, updateAppointment, workingHours, checkTimeConflict } = useApp();

  const appointment = appointments.find((apt) => apt.id === id);

  if (!appointment) {
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

  const timeSlots = generateTimeSlots(workingHours.start, workingHours.end);

  const [patientId, setPatientId] = useState(appointment.patientId);
  const [date, setDate] = useState(appointment.date);
  const [startTime, setStartTime] = useState(appointment.startTime);
  const [endTime, setEndTime] = useState(appointment.endTime);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate working hours
    if (startTime < workingHours.start || endTime > workingHours.end) {
      toast.error(
        `La cita debe estar dentro del horario laboral (${workingHours.start} - ${workingHours.end})`
      );
      return;
    }

    // Validate time range
    if (startTime >= endTime) {
      toast.error('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    // Check for conflicts (excluding this appointment)
    if (checkTimeConflict(date, startTime, endTime, appointment.id)) {
      toast.error('Conflicto horario: existe otra cita en este horario');
      return;
    }

    const success = await updateAppointment(appointment.id, {
      patientId,
      date,
      startTime,
      endTime,
    });

    if (success) {
      toast.success('Cita reprogramada correctamente');
      navigate('/calendar');
    } else {
      toast.error(
        'No se pudo actualizar la cita. Revise la configuración de Supabase (tabla public.appointments).'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/appointments/${appointment.id}`)}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a detalles
          </Button>
          <h1 className="font-semibold text-xl">Reprogramar Cita</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Editar Cita</CardTitle>
            <CardDescription>
              Modifique los detalles de la cita para reprogramarla
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Selection */}
              <div className="space-y-2">
                <Label htmlFor="patient">Paciente</Label>
                <Select value={patientId} onValueChange={setPatientId} required>
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Seleccione un paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {patient.fullName}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Hora Inicio</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Select value={startTime} onValueChange={setStartTime} required>
                      <SelectTrigger id="startTime" className="pl-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">Hora Fin</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Select value={endTime} onValueChange={setEndTime} required>
                      <SelectTrigger id="endTime" className="pl-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots
                          .filter((slot) => slot > startTime)
                          .map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/appointments/${appointment.id}`)}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="w-full sm:flex-1">
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
