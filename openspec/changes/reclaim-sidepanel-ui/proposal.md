## Why

The content script successfully extracts calendar events from Reclaim.ai, but results are only visible in DevTools Console. The sidepanel exists as a WXT scaffold with placeholder content and provides no value. Users need a proper UI to view extraction results, event details, and export data.

## What Changes

- Replace sidepanel placeholder with a stats dashboard showing extraction results
- Add chrome.storage integration to persist extraction results between content script and sidepanel
- Add export-to-clipboard and export-to-markdown-file functionality
- Install additional shadcn components needed for the dashboard UI (Card, Table, Badge, ScrollArea, Separator, Button variants)

## Capabilities

### New Capabilities
- `stats-display`: Display extraction results (event count, route, event list with title/time) in the sidepanel dashboard
- `data-persistence`: Persist extraction results via chrome.storage.local so the sidepanel can read them
- `export-actions`: Copy markdown export to clipboard and download as .md file from the sidepanel

### Modified Capabilities
- (none)

## Impact

- **Files modified**: `entrypoints/sidepanel/App.tsx`, `entrypoints/content.ts` (add storage write)
- **New files**: `entrypoints/sidepanel/components/` (React components for the dashboard), `lib/export-markdown.ts` (markdown formatting)
- **Dependencies**: Additional shadcn components (Card, Table, Badge, ScrollArea, Separator)
- **Permissions**: Add `storage` permission to manifest for chrome.storage.local
