import type { ExtractedEvent } from '@/lib/types';

interface DayGroup {
  dayLabel: string;
  events: ExtractedEvent[];
}

export { DayGroup };

function groupEventsByDay(events: ExtractedEvent[]): DayGroup[] {
  const dayOrder: string[] = [];
  const dayMap = new Map<string, ExtractedEvent[]>();

  for (const event of events) {
    if (!event.dayLabel) continue;

    if (!dayMap.has(event.dayLabel)) {
      dayOrder.push(event.dayLabel);
      dayMap.set(event.dayLabel, []);
    }
    dayMap.get(event.dayLabel)!.push(event);
  }

  return dayOrder.map((dayLabel) => ({
    dayLabel,
    events: dayMap.get(dayLabel)!,
  }));
}

function parseTimeToMinutes(time: string): number {
  const match = time.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3]?.toLowerCase();

  if (period === 'am' || period === 'pm') {
    if (period === 'pm' && hours < 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
  }

  return hours * 60 + minutes;
}

function calculateDuration(
  startTime: string | null,
  endTime: string | null,
): number | null {
  if (!startTime || !endTime) return null;

  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  let diff = endMinutes - startMinutes;
  if (diff < 0) diff += 1440;

  return diff;
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min`;

  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (remainingMins === 0) return `${hours} h`;
  return `${hours} h ${remainingMins} min`;
}

function formatEventBullet(event: ExtractedEvent): string {
  const duration = calculateDuration(event.startTime, event.endTime);
  const durationStr = duration ? `${formatDuration(duration)}` : '';
  const timeRange =
    event.startTime && event.endTime
      ? `(${event.startTime} - ${event.endTime})`
      : '';
  return `- ${event.title} | ${durationStr} | ${timeRange}`;
}

function formatEventRow(event: ExtractedEvent): string {
  const duration = calculateDuration(event.startTime, event.endTime);
  const durationStr = duration ? formatDuration(duration) : '';
  const timeRange =
    event.startTime && event.endTime
      ? `${event.startTime} - ${event.endTime}`
      : '';
  return `| ${event.title} | ${durationStr} | ${timeRange} |`;
}

function getDayTotalDuration(events: ExtractedEvent[]): number {
  return events.reduce((total, event) => {
    const duration = calculateDuration(event.startTime, event.endTime);
    return total + (duration ?? 0);
  }, 0);
}

function formatEventsTable(events: ExtractedEvent[]): string {
  const tableHeader = `| Task | Duration | Time |\n| :--- | :--- | :--- |`;
  const tableRows = events.map(formatEventRow).join('\n');
  return `${tableHeader}\n${tableRows}`;
}

function formatFlatList(events: ExtractedEvent[]): string {
  return events.map(formatEventBullet).join('\n');
}

function formatDayGrouped(days: DayGroup[]): string {
  return days
    .map((day) => {
      const dayTotal = getDayTotalDuration(day.events);
      const dayTotalStr = formatDuration(dayTotal);
      return `### ${day.dayLabel}\n> **Total: ${dayTotalStr}**\n\n${formatEventsTable(day.events)}`;
    })
    .join('\n\n');
}

function isUnscheduled(event: ExtractedEvent): boolean {
  return event.unscheduled === true;
}

export {
  groupEventsByDay,
  isUnscheduled,
  getDayTotalDuration,
  formatDuration,
  calculateDuration,
};

export function formatMarkdown(
  events: ExtractedEvent[],
  route: string,
  timestamp: string,
): string {
  const scheduled = events.filter((e) => !isUnscheduled(e));
  const unscheduled = events.filter((e) => isUnscheduled(e));

  const scheduledTotal = getDayTotalDuration(scheduled);
  const scheduledTotalStr = formatDuration(scheduledTotal);

  const header = [
    '# Reclaim Stats Export',
    '',
    `- **Page**: ${route}`,
    `- **Events**: ${scheduled.length}`,
    `- **Total:** ${scheduledTotalStr}`,
    // `- **Extracted at**: ${new Date(timestamp).toLocaleString()}`,
  ].join('\n');

  const days = groupEventsByDay(scheduled);

  let body: string;

  if (days.length === 0) {
    body = `${header}\n\n## Events\n\n${formatFlatList(scheduled)}`;
  } else {
    body = `${header}\n\n## Events\n\n${formatDayGrouped(days)}`;
  }

  if (unscheduled.length > 0) {
    const unscheduledTotal = getDayTotalDuration(unscheduled);
    const unscheduledTotalStr = formatDuration(unscheduledTotal);
    body += `\n\n---\n\n## Unscheduled Events\n**Total: ${unscheduledTotalStr}**\n\n${formatEventsTable(unscheduled)}`;
  }

  return body;
}
