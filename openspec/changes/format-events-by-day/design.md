## Context

The extension already extracts `dayLabel` from the Reclaim.ai DOM (e.g., "Mon 31", "Fri 3") via `discoverDayHeaders()` and `findNearestDayHeader()` in `lib/extract-events.ts`. Each extracted event carries this `dayLabel` field. However, the Markdown output currently ignores it entirely, producing a flat list of all events across all days. The formatting logic needs to group events by their `dayLabel` before rendering.

## Goals / Non-Goals

**Goals:**
- Group Markdown events under day headers (e.g., `## Mon 31`)
- Preserve chronological order within each day
- Handle any number of days (2, 7, N) and any starting day of the week
- Gracefully fall back to a flat list when `dayLabel` is missing

**Non-Goals:**
- Changing how events are extracted from the DOM
- Adding new data fields to the extraction result
- Modifying the storage or messaging layers

## Decisions

**Extract formatting into a dedicated module**
Create `lib/format-markdown.ts` to house all Markdown generation logic. This separates formatting concerns from extraction logic and makes the code testable in isolation. The current inline formatting in the sidepanel (or wherever Markdown is assembled) will call this new module.

**Preserve extraction order as day order**
Events are extracted in DOM order, which already reflects day order (the calendar renders days sequentially). We'll use the first occurrence of a `dayLabel` to determine day ordering, then group subsequent events under their matching day. This avoids needing to parse or sort dates.

**Day header format: `## <dayLabel>`**
Use `## Mon 31` style headers (matching the label already extracted from the DOM). This keeps the format consistent with what the user sees in the Reclaim UI.

**Fallback for missing dayLabel**
If no events have a `dayLabel`, render the existing flat list format. This ensures backwards compatibility if DOM structure changes and day headers can no longer be discovered.

## Risks / Trade-offs

[Day labels not extracted] → Fallback to flat list ensures output is always produced, just less structured.
[DOM order differs from day order] → Unlikely given how Reclaim renders the calendar, but if it happens, events may appear under the wrong day. Mitigation: the current `findNearestDayHeader` uses spatial positioning (getBoundingClientRect), which is robust.
[Multiple calendars with overlapping day labels] → Could cause events from different weeks with the same day label (e.g., two "Mon 3"s) to merge. Acceptable risk since the extension exports a single view at a time.
