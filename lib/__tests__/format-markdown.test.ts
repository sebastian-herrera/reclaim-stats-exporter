import { describe, expect, it } from 'vitest';
import type { ExtractedEvent } from '../types';
import { formatMarkdown } from '../format-markdown';

const createEvent = (
  title: string,
  dayLabel: string | undefined,
  startTime: string | null,
  endTime: string | null,
): ExtractedEvent => ({
  title,
  dayLabel,
  startTime,
  endTime,
  route: 'planner',
  extractedAt: '2026-04-05T12:00:00.000Z',
});

describe('formatMarkdown', () => {
  describe('metadata header', () => {
    it('should include route, event count, and timestamp', () => {
      const events: ExtractedEvent[] = [
        createEvent('Test Event', 'Mon 31', '9:00am', '10:00am'),
      ];
      const result = formatMarkdown(
        events,
        'planner',
        '2026-04-05T12:00:00.000Z',
      );

      expect(result).toContain('# Reclaim Stats Export');
      expect(result).toContain('- **Page**: planner');
      expect(result).toContain('- **Events**: 1');
      expect(result).toContain('- **Total:**');
    });
  });

  describe('day grouping', () => {
    it('should group events under day headers', () => {
      const events: ExtractedEvent[] = [
        createEvent('Morning Event', 'Mon 31', '9:00am', '10:00am'),
        createEvent('Afternoon Event', 'Mon 31', '2:00pm', '3:00pm'),
        createEvent('Next Day Event', 'Tue 1', '10:00am', '11:00am'),
      ];
      const result = formatMarkdown(
        events,
        'planner',
        '2026-04-05T12:00:00.000Z',
      );

      expect(result).toContain('## Mon 31');
      expect(result).toContain('## Tue 1');
    });

    it('should preserve day order by first appearance', () => {
      const events: ExtractedEvent[] = [
        createEvent('Event A', 'Tue 1', '9:00am', '10:00am'),
        createEvent('Event B', 'Sun 30', '9:00am', '10:00am'),
        createEvent('Event C', 'Mon 31', '9:00am', '10:00am'),
      ];
      const result = formatMarkdown(
        events,
        'planner',
        '2026-04-05T12:00:00.000Z',
      );

      const tueIndex = result.indexOf('## Tue 1');
      const sunIndex = result.indexOf('## Sun 30');
      const monIndex = result.indexOf('## Mon 31');

      expect(tueIndex).toBeLessThan(sunIndex);
      expect(sunIndex).toBeLessThan(monIndex);
    });

    it('should preserve event order within each day', () => {
      const events: ExtractedEvent[] = [
        createEvent('First Event', 'Mon 31', '9:00am', '10:00am'),
        createEvent('Second Event', 'Mon 31', '11:00am', '12:00pm'),
        createEvent('Third Event', 'Mon 31', '2:00pm', '3:00pm'),
      ];
      const result = formatMarkdown(
        events,
        'planner',
        '2026-04-05T12:00:00.000Z',
      );

      const firstIndex = result.indexOf('First Event');
      const secondIndex = result.indexOf('Second Event');
      const thirdIndex = result.indexOf('Third Event');

      expect(firstIndex).toBeLessThan(secondIndex);
      expect(secondIndex).toBeLessThan(thirdIndex);
    });
  });

  describe('event formatting', () => {
    it('should format event with start and end time', () => {
      const events: ExtractedEvent[] = [
        createEvent('Meeting', 'Mon 31', '9:00am', '10:00am'),
      ];
      const result = formatMarkdown(
        events,
        'planner',
        '2026-04-05T12:00:00.000Z',
      );

      expect(result).toContain('| Meeting | 1 h | 9:00am - 10:00am |');
    });

    it('should format event without times', () => {
      const events: ExtractedEvent[] = [
        createEvent('No Time Event', 'Mon 31', null, null),
      ];
      const result = formatMarkdown(
        events,
        'planner',
        '2026-04-05T12:00:00.000Z',
      );

      expect(result).toContain('| No Time Event |  |  |');
      expect(result).not.toContain('()');
    });
  });

  describe('fallback', () => {
    it('should use flat list when no day labels present', () => {
      const events: ExtractedEvent[] = [
        createEvent('Event 1', undefined, '9:00am', '10:00am'),
        createEvent('Event 2', undefined, '11:00am', '12:00pm'),
      ];
      const result = formatMarkdown(
        events,
        'planner',
        '2026-04-05T12:00:00.000Z',
      );

      expect(result).not.toMatch(/##\s+[A-Z][a-z]+\s+\d+/);
      expect(result).toContain('- Event 1');
      expect(result).toContain('- Event 2');
    });
  });

  describe('single day', () => {
    it('should render all events under single day header', () => {
      const events: ExtractedEvent[] = [
        createEvent('Event A', 'Fri 3', '9:00am', '10:00am'),
        createEvent('Event B', 'Fri 3', '11:00am', '12:00pm'),
      ];
      const result = formatMarkdown(
        events,
        'planner',
        '2026-04-05T12:00:00.000Z',
      );

      expect(result).toContain('## Fri 3');
      expect(result).toContain('| Event A |');
      expect(result).toContain('| Event B |');
    });
  });
});
