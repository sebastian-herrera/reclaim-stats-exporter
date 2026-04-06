## 1. Create formatting module

- [x] 1.1 Create `lib/format-markdown.ts` with `formatMarkdown(events: ExtractedEvent[], route: string, timestamp: string): string` function
- [x] 1.2 Implement day grouping logic that preserves first-appearance order of day labels
- [x] 1.3 Implement day header rendering (`## <dayLabel>`) and event bullet formatting (`- Title (startTime → endTime)`)
- [x] 1.4 Implement fallback to flat list when no events have `dayLabel`
- [x] 1.5 Add metadata header (`# Reclaim Stats Export`, route, count, timestamp)

## 2. Write tests

- [x] 2.1 Create `lib/__tests__/format-markdown.test.ts`
- [x] 2.2 Test multiple days with events grouped correctly under day headers
- [x] 2.3 Test single day with all events under one header
- [x] 2.4 Test day order matches first-appearance order
- [x] 2.5 Test event order within a day is preserved
- [x] 2.6 Test fallback to flat list when no day labels present
- [x] 2.7 Test metadata header format

## 3. Integrate with existing code

- [x] 3.1 Replace existing Markdown generation with call to `formatMarkdown()` in sidepanel or export logic
- [x] 3.2 Run `pnpm test` and verify all tests pass
- [x] 3.3 Run `pnpm compile` and verify no TypeScript errors
