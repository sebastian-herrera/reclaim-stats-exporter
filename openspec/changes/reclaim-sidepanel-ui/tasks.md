## 1. Infrastructure

- [x] 1.1 Add `storage` permission to manifest in `wxt.config.ts`
- [x] 1.2 Create `lib/export-markdown.ts` with `formatAsMarkdown(result: ExtractionResult): string` function
- [x] 1.3 Install shadcn components: Card, Table, Badge, ScrollArea, Separator, Alert

## 2. Data Persistence

- [x] 2.1 Update `content.ts` to save `ExtractionResult` to storage after successful extraction
- [x] 2.2 Create `lib/storage.ts` with `saveResult()`, `getLatestResult()`, and `watchResult()` helpers
- [x] 2.3 Add storage change listener hook for React sidepanel

## 3. Sidepanel Dashboard UI

- [x] 3.1 Build `entrypoints/sidepanel/components/Dashboard.tsx` with Card layout, empty state, and stats summary
- [x] 3.2 Build `entrypoints/sidepanel/components/EventList.tsx` with ScrollArea and Table for event display
- [x] 3.3 Build `entrypoints/sidepanel/components/ExportActions.tsx` with Copy Markdown and Download .md buttons
- [x] 3.4 Wire up `App.tsx` to compose Dashboard, EventList, and ExportActions components
- [x] 3.5 Connect sidepanel to storage with live updates on storage change

## 4. Polish

- [x] 4.1 Add HMR test cleanup (remove placeholder content from App.tsx)
- [x] 4.2 Ensure sidepanel layout fits within Chrome sidepanel width constraints
- [x] 4.3 Add route badge and event count badge to dashboard header
