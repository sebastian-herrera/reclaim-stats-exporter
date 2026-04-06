## Why

The DOM extraction pipeline works correctly, but the user receives zero visual feedback. After clicking "Generate", the only way to confirm success or failure is opening DevTools Console. This makes the extension feel broken and unreliable.

## What Changes

- Add visual feedback on the "Generate" button after extraction (success color, error color)
- Add a floating toast notification showing extraction results (event count, route)
- Show the currently detected route on or near the button so the user knows which extractor will run

## Capabilities

### New Capabilities

- `visual-feedback`: Toast notification and button state changes after extraction completes (success/error)
- `route-indicator`: Display the currently detected route (planner/focus/unknown) on or near the Generate button

### Modified Capabilities

- (none)

## Impact

- **Files modified**: `lib/create-generate-button.ts`, `entrypoints/content.ts`
- **New files**: `lib/toast.ts` (toast notification helper)
- **Dependencies**: No new external dependencies
- **Permissions**: No changes
