## 1. Content Script Configuration

- [x] 1.1 Update content script match pattern in `entrypoints/content.ts` from `*://*.google.com/*` to `*://app.reclaim.ai/*`
- [x] 1.2 Add host permission for `https://app.reclaim.ai/*` in `wxt.config.ts` manifest configuration

## 2. Generate Button UI

- [x] 2.1 Create "Generate" button UI element that floats in the page (injected via content script)
- [x] 2.2 Position button in a non-intrusive location (e.g., bottom-right corner)
- [x] 2.3 Add click event listener to trigger extraction workflow
- [x] 2.4 Show loading state while extraction is in progress
- [x] 2.5 Display success/error feedback after extraction completes

## 3. Route Detection (Passive)

- [x] 3.1 Create route pattern matchers for `/planner` and `/focus` using WXT's `MatchPattern` utility
- [x] 3.2 Implement `wxt:locationchange` event listener to track current route
- [x] 3.3 Store current route in a variable for use when "Generate" is clicked
- [x] 3.4 Create router function that selects the correct extractor based on stored route

## 4. DOM Data Extraction (User-Triggered)

> **Important**: Extraction ONLY runs when user clicks the "Generate" button. The extension is passive and does NOT auto-extract on navigation or page load.

- [x] 4.1 Create `lib/extractors/planner.ts` with planner-specific DOM traversal logic
- [x] 4.2 Create `lib/extractors/focus.ts` with focus-specific DOM traversal logic
- [x] 4.3 Implement calendar event node discovery using `[class*="RaiCalendarEventView"]` partial selectors
- [x] 4.4 Implement event title extraction from discovered nodes
- [x] 4.5 Implement event time range extraction from discovered nodes
- [x] 4.6 Add delay mechanism to allow React rendering before DOM traversal (only after button click)

## 5. Text Sanitization

- [x] 5.1 Create `lib/sanitize.ts` with emoji removal using Unicode property escapes
- [x] 5.2 Implement UI artifact removal (decorative characters, special Unicode)
- [x] 5.3 Add whitespace normalization (collapse multiple spaces, trim boundaries)
- [x] 5.4 Preserve international characters and common punctuation

## 6. Data Output

- [x] 6.1 Define TypeScript interface for extracted event data structure
- [x] 6.2 Format extracted data as standardized JSON array
- [x] 6.3 Log extraction results to console (event count, route detected)
- [x] 6.4 Return JSON data to the "Generate" button handler for further processing
