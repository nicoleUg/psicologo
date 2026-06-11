import { MINUTES_IN_HOUR, DEFAULT_SLOT_MINUTES } from './constants';

/**
 * Converts a "HH:mm" time string into total minutes since midnight.
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * MINUTES_IN_HOUR + minutes;
}

/**
 * Converts total minutes since midnight back into a "HH:mm" time string.
 */
export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / MINUTES_IN_HOUR)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % MINUTES_IN_HOUR).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Calculates the duration between two "HH:mm" times in minutes.
 */
export function calculateDuration(startTime: string, endTime: string): number {
  return timeToMinutes(endTime) - timeToMinutes(startTime);
}

/**
 * Generates an array of "HH:mm" time strings between start and end times, incremented by stepMinutes.
 */
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

/**
 * Validates if a candidate time is within available slots, falling back if not.
 */
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

/**
 * Returns a valid end time that is strictly after the start time.
 */
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
