export interface Patient {
  id: string;
  fullName: string;
  phone: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  date: string; // ISO date string
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface WorkingHours {
  start: string; // HH:mm format
  end: string; // HH:mm format
}
