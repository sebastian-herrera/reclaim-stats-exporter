## Why

The extension needs to extract calendar event data from Reclaim.ai's web application to enable stats analysis and AI-powered insights. Currently, the content script targets Google instead of Reclaim.ai, and lacks DOM observation capabilities required for Single Page Application navigation.

## What Changes

- Redirect content script from Google to Reclaim.ai domain (`https://app.reclaim.ai`)
- Implement SPA navigation tracking via `wxt:locationchange` event listener (passive, no auto-extraction)
- Add "Generate" button UI that user clicks to trigger extraction
- Create route-aware extraction logic that adapts to `/planner` and `/focus` pages
- Extract calendar event data using partial class selector DOM traversal (only on button click)
- Sanitize extracted text to remove emojis and UI artifacts
- Output structured JSON array of event data

## Capabilities

### New Capabilities

- `spa-navigation-detection`: Detect route changes in Reclaim.ai's SPA and trigger appropriate extraction handlers
- `dom-data-extraction`: Extract event titles and time ranges from calendar event nodes using partial class selectors
- `text-sanitization`: Clean extracted text by removing emojis, special characters, and UI artifacts

### Modified Capabilities

- `content-script-targeting`: Change content script match pattern from Google to Reclaim.ai domain

## Impact

- **Files modified**: `entrypoints/content.ts`, `wxt.config.ts` (match patterns)
- **New files**: Extraction utilities in `lib/` directory
- **Dependencies**: No new external dependencies required
- **Permissions**: Requires `https://app.reclaim.ai/*` host permission
