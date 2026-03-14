import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  Calendar as CalendarIcon,
  Plus,
  LogOut,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { type DateClickArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import type { EventClickArg, EventContentArg } from '@fullcalendar/core';

export function Calendar() {
  const navigate = useNavigate();
  const { appointments, getPatient, workingHours, logout } = useApp();

  const calendarEvents = useMemo(
    () =>
      appointments.map((appointment) => {
        const patient = getPatient(appointment.patientId);

        return {
          id: appointment.id,
          title: patient?.fullName ?? 'Paciente no encontrado',
          start: `${appointment.date}T${appointment.startTime}:00`,
          end: `${appointment.date}T${appointment.endTime}:00`,
          extendedProps: {
            startTime: appointment.startTime,
            endTime: appointment.endTime,
          },
        };
      }),
    [appointments, getPatient]
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEventClick = (eventClickArg: EventClickArg) => {
    navigate(`/appointments/${eventClickArg.event.id}`);
  };

  const handleDateClick = (dateClickArg: DateClickArg) => {
    const params = new URLSearchParams({
      date: formatDateForInput(dateClickArg.date),
    });

    if (!dateClickArg.allDay) {
      const startTime = formatTimeForInput(dateClickArg.date);
      const endTime = getSuggestedEndTime(startTime, workingHours.end);

      params.set('start', startTime);

      if (endTime) {
        params.set('end', endTime);
      }
    }

    navigate(`/appointments/new?${params.toString()}`);
  };

  const renderEventContent = (eventContent: EventContentArg) => {
    const { startTime, endTime } = eventContent.event.extendedProps as {
      startTime: string;
      endTime: string;
    };

    return (
      <div className="px-1 py-0.5">
        <p className="text-xs font-medium truncate">{eventContent.event.title}</p>
        <p className="text-[11px] opacity-90">
          {startTime} - {endTime}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold">Agenda</h1>
                <p className="text-sm text-gray-500">Agenda del Consultorio</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/patients')}
                className="hidden sm:flex"
              >
                <Users className="w-4 h-4 mr-2" />
                Pacientes
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={() => navigate('/appointments/new')}
            className="h-9 w-[100px] justify-self-start px-2 text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nueva Cita
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/patients')}
            className="h-auto py-4 sm:hidden"
          >
            <Users className="w-5 h-5 mr-2" />
            Ver Pacientes
          </Button>
        </div>

        <Card className="p-4 overflow-hidden">
          <FullCalendar
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale={esLocale}
            firstDay={1}
            allDaySlot={false}
            nowIndicator
            height="auto"
            slotMinTime={`${workingHours.start}:00`}
            slotMaxTime={`${workingHours.end}:00`}
            slotDuration="00:30:00"
            events={calendarEvents}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay,dayGridMonth',
            }}
            buttonText={{
              today: 'Hoy',
              week: 'Semana',
              day: 'Día',
              month: 'Mes',
            }}
            eventClassNames={() => ['cursor-pointer']}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            eventContent={renderEventContent}
            eventDisplay="block"
            dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }}
          />
        </Card>
      </main>
    </div>
  );
}

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTimeForInput(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getSuggestedEndTime(startTime: string, workingEnd: string): string | null {
  const startMinutes = timeToMinutes(startTime);
  const workingEndMinutes = timeToMinutes(workingEnd);

  let suggestedEndMinutes = Math.min(startMinutes + 60, workingEndMinutes);

  if (suggestedEndMinutes <= startMinutes) {
    suggestedEndMinutes = Math.min(startMinutes + 30, workingEndMinutes);
  }

  if (suggestedEndMinutes <= startMinutes) {
    return null;
  }

  return minutesToTime(suggestedEndMinutes);
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
