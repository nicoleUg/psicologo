import { MINUTES_IN_HOUR, DEFAULT_SLOT_MINUTES } from './constants';


export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * MINUTES_IN_HOUR + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / MINUTES_IN_HOUR)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % MINUTES_IN_HOUR).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}


export function calculateDuration(startTime: string, endTime: string): number {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
}


export function generateTimeSlots(
  start: string,
  end: string,
  stepMinutes: number = DEFAULT_SLOT_MINUTES
): string[] {
  const slots: string[] = [];
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);

  for (let current = startMin; current <= endMin; current += stepMinutes) {
    slots.push(minutesToTime(current));
  }

  return slots;
}

export function getValidTime(
  candidate: string | null,
  timeSlots: string[],
  preferred: string
): string {
  if (candidate && timeSlots.includes(candidate)) {
    return candidate;
  }
  if (timeSlots.includes(preferred)) {
    return preferred;
  }
  return timeSlots[0] ?? preferred;
}


export function getValidEndTime(
  candidate: string | null,
  startTime: string,
  timeSlots: string[]
): string {
  const isCandidateValid = candidate && timeSlots.includes(candidate) && candidate > startTime;
  if (isCandidateValid) {
    return candidate as string;
  }

  const startIndex = timeSlots.indexOf(startTime);
  if (startIndex >= 0 && startIndex < timeSlots.length - 1) {
    return timeSlots[startIndex + 1];
  }

  return timeSlots[timeSlots.length - 1] ?? startTime;
}


export function isTimeConflict(start1: string, end1: string, start2: string, end2: string): boolean {
  return timeToMinutes(start1) < timeToMinutes(end2) && timeToMinutes(start2) < timeToMinutes(end1);
}
