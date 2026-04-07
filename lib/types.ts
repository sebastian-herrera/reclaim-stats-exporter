import type { RouteType } from './router';

export interface ExtractedEvent {
  title: string;
  startTime: string | null;
  endTime: string | null;
  dayLabel?: string;
  unscheduled?: boolean;
  route: RouteType;
  extractedAt: string;
}

export interface ExtractionResult {
  events: ExtractedEvent[];
  route: RouteType | null;
  count: number;
  timestamp: string;
}

export interface ExtractionRequestMessage {
  type: 'RECLAIM_STATS:EXTRACTION_REQUEST';
  route: RouteType;
}

export interface ExtractionResponseMessage {
  type: 'RECLAIM_STATS:EXTRACTION_RESPONSE';
  result: ExtractionResult | null;
  error: string | null;
}
