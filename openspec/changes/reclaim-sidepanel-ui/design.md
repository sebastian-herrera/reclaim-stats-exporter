## Context

The sidepanel is a WXT `browser_action` entrypoint that currently renders a placeholder React app. The content script (`entrypoints/content.ts`) already extracts calendar events from Reclaim.ai and formats them into an `ExtractionResult` object, but only logs to console. There is no data sharing between the content script and the sidepanel.

The project uses React 19 + TypeScript + Tailwind CSS v4 + shadcn (base-lyra style with Phosphor icons) for the sidepanel UI. Only the `Button` component is currently installed.

## Goals / Non-Goals

**Goals:**
- Display extraction results (count, route, event list) in a clean sidepanel dashboard
- Persist extraction results via chrome.storage.local for cross-context communication
- Enable copying and downloading Markdown-formatted export
- Install only the shadcn components needed for this dashboard

**Non-Goals:**
- Real-time streaming of events from content script to sidepanel
- Historical extraction log (only the most recent result is stored)
- Configuration/settings UI
- Authentication or multi-account support

## Decisions

### 1. chrome.storage.local for Data Sharing
**Decision:** Use `chrome.storage.local` as the communication channel between content script and sidepanel.

**Rationale:**
- Simple key-value API, no background script needed
- Sidepanel can listen to `onChanged` events for live updates
- Persistent across browser sessions

**Alternatives considered:**
- Messaging API (`chrome.runtime.sendMessage`): Requires background script, no persistence
- IndexedDB: Overkill for a single result object, harder to share across contexts

### 2. Single Latest Result Storage
**Decision:** Store only the most recent extraction result under a single key (`reclaim-stats-exporter:latestResult`).

**Rationale:**
- Keeps storage simple and bounded
- Matches the current workflow (user extracts, then checks sidepanel)
- No need for history in the initial version

### 3. shadcn Components to Install
**Decision:** Install Card, Table, Badge, ScrollArea, Separator, and Alert from shadcn.

**Rationale:**
- Card: Dashboard container
- Table: Event list display
- Badge: Route indicator and count
- ScrollArea: Scrollable event list within sidepanel constraints
- Separator: Visual section dividers
- Alert: Empty state and feedback messages

### 4. Markdown Formatting in Shared Library
**Decision:** Place Markdown formatting logic in `lib/export-markdown.ts` so it can be used by both content script and sidepanel.

**Rationale:**
- Single source of truth for export format
- Sidepanel can format on-demand without duplicating logic

## Risks / Trade-offs

- **Sidepanel size constraints**: Chrome sidepanels have limited width (~300-400px) → Mitigation: Use compact table layout, scrollable event list, truncate long titles
- **Storage size limits**: chrome.storage.local has a 5MB quota → Mitigation: Only store the latest result, not history; events are small text objects
- **Stale data**: Sidepanel may show old results if extraction hasn't been run → Mitigation: Clear empty state message with instructions, show extraction timestamp prominently
