## Why

The current Markdown output dumps all events in a flat, unstructured list, making it difficult for humans and AI tools to understand which events belong to which day. Events are already extracted with `dayLabel` from the DOM, but this information is discarded during formatting. Grouping events by day (e.g., "Mon 31", "Fri 3") makes the output scannable and contextually meaningful.

## What Changes

- Format Markdown output with events grouped under day headers (e.g., `## Mon 31`)
- Preserve existing day labels already extracted from the DOM
- Handle variable calendar ranges (2 days, 7 days, any start day)
- Keep the flat list as a fallback when day labels are unavailable

## Capabilities

### New Capabilities
- `day-grouped-export`: Format extracted events into Markdown grouped by day labels, with day headers and per-day event lists

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

- `lib/extract-events.ts`: No changes needed (already extracts `dayLabel`)
- New markdown formatting module to replace inline formatting
- `lib/types.ts`: No changes (already includes `dayLabel` on events)
- Tests for the new formatting logic
