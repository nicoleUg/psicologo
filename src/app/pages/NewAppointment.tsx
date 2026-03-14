import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
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

export function NewAppointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { patients, addAppointment, workingHours } = useApp();

  const timeSlots = generateTimeSlots(workingHours.start, workingHours.end);
  const today = format(new Date(), 'yyyy-MM-dd');

  const initialDate = searchParams.get('date') ?? today;
  const initialStartTime = getValidTime(searchParams.get('start'), timeSlots, '09:00');
  const initialEndTime = getValidEndTime(searchParams.get('end'), initialStartTime, timeSlots);

  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

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

    const success = await addAppointment({
      patientId,
      date,
      startTime,
      endTime,
    });

    if (success) {
      toast.success('Cita agendada correctamente');
      navigate('/calendar');
    } else {
      toast.error(
        'No se pudo guardar la cita. Revise conflicto horario o configuración de Supabase (tabla public.appointments).'
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
            onClick={() => navigate('/calendar')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al calendario
          </Button>
          <h1 className="font-semibold text-xl">Nueva Cita</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Agendar Cita</CardTitle>
            <CardDescription>
              Complete la información para registrar una nueva cita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Selection */}
              <div className="space-y-2">
                <Label htmlFor="patient">Paciente</Label>
                <Select value={patientId} onValueChange={setPatientId} required>
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Seleccione un paciente">
                      {patientId && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {patients.find((p) => p.id === patientId)?.fullName}
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{patient.fullName}</p>
                            <p className="text-xs text-gray-500">{patient.phone}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => navigate('/patients/new')}
                  className="px-0"
                >
                  + Registrar nuevo paciente
                </Button>
              </div>

              {/* Date Selection */}
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

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Hora de inicio</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger id="startTime" className="pl-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">Hora de fin</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger id="endTime" className="pl-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-indigo-800">
                  <strong>Horario laboral:</strong> {workingHours.start} - {workingHours.end}
                </p>
                <p className="text-sm text-indigo-700 mt-1">
                  El sistema validará automáticamente que no existan conflictos de horario.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/calendar')}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="w-full sm:flex-1">
                  Agendar Cita
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function generateTimeSlots(start: string, end: string): string[] {
  const slots: string[] = [];
  const [startHour] = start.split(':').map(Number);
  const [endHour] = end.split(':').map(Number);

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
      if (time <= end) {
        slots.push(time);
      }
    }
  }

  return slots;
}

function getValidTime(candidate: string | null, timeSlots: string[], preferred: string): string {
  if (candidate && timeSlots.includes(candidate)) {
    return candidate;
  }

  if (timeSlots.includes(preferred)) {
    return preferred;
  }

  return timeSlots[0] ?? preferred;
}

function getValidEndTime(candidate: string | null, startTime: string, timeSlots: string[]): string {
  if (candidate && timeSlots.includes(candidate) && candidate > startTime) {
    return candidate;
  }

  const startIndex = timeSlots.indexOf(startTime);
  if (startIndex >= 0 && startIndex < timeSlots.length - 1) {
    return timeSlots[startIndex + 1];
  }

  return timeSlots[timeSlots.length - 1] ?? startTime;
}
