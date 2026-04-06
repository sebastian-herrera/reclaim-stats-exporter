import type { RouteType } from '@/lib/router';
import type { ExtractionResult } from '@/lib/types';

function sanitizeText(text: string): string {
  if (!text) return '';
  let result = text;
  result = result.replace(/\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu, '');
  result = result.replace(/[\u200B-\u200D\uFEFF]/g, '');
  result = result.replace(/[\u2028\u2029]/g, ' ');
  result = result.replace(/[\u00A0]/g, ' ');
  result = result.replace(/[•·▪▸▹►◄◆◇○●]/g, '');
  result = result.replace(/[^\w\s.,;:!?'"()\-\u00C0-\u024F]/g, '');
  result = result.replace(/\s+/g, ' ');
  return result.trim();
}

function sanitizeEvents(
  events: Array<{
    title: string;
    startTime: string | null;
    endTime: string | null;
    dayLabel?: string;
    unscheduled?: boolean;
    isFree?: boolean;
  }>,
) {
  return events.map((event) => ({
    title: sanitizeText(event.title),
    startTime: event.startTime ? sanitizeText(event.startTime) : null,
    endTime: event.endTime ? sanitizeText(event.endTime) : null,
    dayLabel: event.dayLabel,
    unscheduled: event.unscheduled || event.isFree,
  }));
}

interface CalendarEventNode {
  title: string;
  startTime: string | null;
  endTime: string | null;
  dayLabel?: string;
  unscheduled?: boolean;
  isFree?: boolean;
}

function extractTitle(element: HTMLElement): string {
  const titleSelectors = [
    '[class*="title"]',
    '[class*="event-title"]',
    '[class*="EventTitle"]',
    'span[style*="font-weight"]',
    'div[style*="font-weight"]',
  ];

  for (const selector of titleSelectors) {
    const titleEl = element.querySelector<HTMLElement>(selector);
    if (titleEl?.textContent?.trim()) {
      return titleEl.textContent.trim();
    }
  }

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

  while (walker.nextNode()) {
    const text = walker.currentNode.textContent?.trim();
    if (text && text.length > 0) {
      return text;
    }
  }

  return '';
}

function parseAmPm(time: string): 'am' | 'pm' | null {
  const lower = time.toLowerCase();
  if (lower.includes('am')) return 'am';
  if (lower.includes('pm')) return 'pm';
  return null;
}

function normalizeAmPm(
  startTime: string,
  endTime: string,
): { startTime: string; endTime: string } {
  const startAmPm = parseAmPm(startTime);
  const endAmPm = parseAmPm(endTime);

  if (startAmPm && endAmPm) {
    return { startTime, endTime };
  }

  if (!startAmPm && !endAmPm) {
    return { startTime, endTime };
  }

  if (startAmPm && !endAmPm) {
    return { startTime, endTime: `${endTime}${startAmPm}` };
  }

  return { startTime: `${startTime}${endAmPm}`, endTime };
}

function parseTimeRange(range: string): {
  startTime: string | null;
  endTime: string | null;
} {
  const parts = range.split(/\s*[-–—]\s*/);
  if (parts.length >= 2) {
    const start = parts[0].trim();
    const end = parts[1].trim();
    const normalized = normalizeAmPm(start, end);
    return { startTime: normalized.startTime, endTime: normalized.endTime };
  }
  return { startTime: range.trim(), endTime: null };
}

function extractTimeRange(element: HTMLElement): {
  startTime: string | null;
  endTime: string | null;
} {
  const timeSelectors = [
    '[class*="time"]',
    '[class*="Time"]',
    '[class*="duration"]',
    '[class*="Duration"]',
    'time',
  ];

  for (const selector of timeSelectors) {
    const timeEl = element.querySelector<HTMLElement>(selector);
    if (timeEl?.textContent?.trim()) {
      return parseTimeRange(timeEl.textContent.trim());
    }
  }

  const text = element.textContent || '';
  const timePattern =
    /(?:\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?\s*[-–—]\s*\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/i;
  const match = text.match(timePattern);

  return match ? parseTimeRange(match[0]) : { startTime: null, endTime: null };
}

function discoverDayHeaders(): Array<{
  element: HTMLElement;
  label: string;
  index: number;
}> {
  const dayHeaders: Array<{
    element: HTMLElement;
    label: string;
    index: number;
  }> = [];
  const dayPattern = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+\d{1,2}$/i;

  const dayOfWeekSelectors = ['[class*="CalendarDayOfWeekDisplay_day__aR3BQ"]'];

  for (const selector of dayOfWeekSelectors) {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const ps = el.querySelectorAll('p');
      if (ps.length >= 2) {
        const dayPart = ps[0].textContent?.trim() || '';
        const datePart = ps[1].textContent?.trim() || '';
        const label = `${dayPart} ${datePart}`.replace(/\s+/g, ' ').trim();
        if (/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+\d{1,2}$/i.test(label)) {
          dayHeaders.push({ element: el, label, index: i });
        }
      }
    }
    if (dayHeaders.length > 0) break;
  }

  if (dayHeaders.length === 0) {
    const selectorStrategies = [
      '[class*="CalendarDayOfWeekDisplay_day"]',
      '[class*="DayHeader"]',
      '[class*="day-header"]',
      '[class*="planner-day-header"]',
      '[class*="day-title"]',
      '[class*="DayTitle"]',
    ];

    for (const selector of selectorStrategies) {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const text = el.textContent?.trim() || '';
        const match = text.match(dayPattern);
        if (match) {
          dayHeaders.push({ element: el, label: match[0], index: i });
        }
      }
      if (dayHeaders.length > 0) break;
    }
  }

  if (dayHeaders.length === 0) {
    const allElements = document.querySelectorAll<HTMLElement>(
      '[class*="day"], [class*="Day"]',
    );
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i];
      const text = el.textContent?.trim() || '';
      const match = text.match(dayPattern);
      if (match) {
        dayHeaders.push({ element: el, label: match[0], index: i });
      }
    }
  }

  console.log(
    `[Reclaim Stats Exporter] Found ${dayHeaders.length} day headers:`,
    dayHeaders.map((h) => h.label),
  );
  return dayHeaders;
}

function findEventDayColumnIndex(eventElement: HTMLElement): number {
  const dayColumns = document.querySelectorAll<HTMLElement>(
    '[class*="CalendarDay_column__cL9jK"]',
  );

  for (let i = 0; i < dayColumns.length; i++) {
    const column = dayColumns[i];
    if (column.contains(eventElement)) {
      return i;
    }
  }

  return -1;
}

function findNearestDayHeader(
  eventElement: HTMLElement,
  dayHeaders: Array<{ element: HTMLElement; label: string; index: number }>,
): string | undefined {
  const columnIndex = findEventDayColumnIndex(eventElement);

  if (columnIndex >= 0 && columnIndex < dayHeaders.length) {
    return dayHeaders[columnIndex].label;
  }

  if (dayHeaders.length === 0) return undefined;

  const eventRect = eventElement.getBoundingClientRect();
  let nearest: { element: HTMLElement; label: string; index: number } | null =
    null;
  let minDistance = Infinity;

  for (const header of dayHeaders) {
    const headerRect = header.element.getBoundingClientRect();
    if (headerRect.bottom <= eventRect.top || headerRect.top < eventRect.top) {
      const distance = eventRect.top - headerRect.bottom;
      if (distance >= 0 && distance < minDistance) {
        minDistance = distance;
        nearest = header;
      }
    }
  }

  return nearest?.label;
}

function discoverEventNodes(): CalendarEventNode[] {
  const dayHeaders = discoverDayHeaders();
  const selectorStrategies = [
    '[class*="RaiCalendarEventView"]',
    '[class*="calendar-event"]',
    '[class*="CalendarEvent"]',
    '[class*="event-card"]',
    '[class*="EventCard"]',
    '[class*="event-item"]',
    '[class*="EventItem"]',
    '[class*="calendar-item"]',
    '[class*="CalendarItem"]',
    '[class*="event-row"]',
    '[class*="EventRow"]',
    '[class*="planner-event"]',
    '[class*="PlannerEvent"]',
    '[class*="focus-event"]',
    '[class*="FocusEvent"]',
    '[class*="event-container"]',
    '[class*="EventContainer"]',
    '[class*="event-block"]',
    '[class*="EventBlock"]',
    '[class*="schedule-event"]',
    '[class*="ScheduleEvent"]',
    '[role="article"]',
    '[role="listitem"]',
  ];

  let eventElements: NodeListOf<HTMLElement> | HTMLElement[];

  for (const selector of selectorStrategies) {
    eventElements = document.querySelectorAll<HTMLElement>(selector);
    if (eventElements.length > 0) {
      console.log(
        `[Reclaim Stats Exporter] Found ${eventElements.length} elements with selector: ${selector}`,
      );

      const nodes: CalendarEventNode[] = [];

      for (const element of eventElements) {
        const title = extractTitle(element);
        const { startTime, endTime } = extractTimeRange(element);
        const dayLabel = findNearestDayHeader(element, dayHeaders);
        const isFree = element.className.includes('--free');
        const isPast = element.querySelector('[class*="--past"]') !== null;
        const unscheduled = title.includes('\u26A0\uFE0F') || isFree || !isPast;

        if (title) {
          nodes.push({ title, startTime, endTime, dayLabel, unscheduled });
        }
      }

      if (nodes.length > 0) {
        console.log(
          `[Reclaim Stats Exporter] Extracted ${nodes.length} valid events`,
        );
        return nodes;
      }
    }
  }

  console.warn(
    '[Reclaim Stats Exporter] No event elements found with any selector strategy',
  );
  return [];
}

function waitForRender(delayMs = 500): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    }, delayMs);
  });
}

export async function extractEvents(
  route: RouteType,
): Promise<ExtractionResult> {
  await waitForRender();

  const nodes = discoverEventNodes();

  const sanitized = sanitizeEvents(nodes).map((event) => ({
    ...event,
    route,
    extractedAt: new Date().toISOString(),
  }));

  return {
    events: sanitized,
    route,
    count: sanitized.length,
    timestamp: new Date().toISOString(),
  };
}
