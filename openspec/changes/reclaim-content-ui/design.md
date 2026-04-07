## Context

The content script injects a floating "Generate" button into Reclaim.ai using vanilla DOM APIs. Currently, the button has a loading state ("Generating...") but provides no feedback after extraction completes. The user must open DevTools Console to see results or errors.

The project uses React + Tailwind + shadcn for the Side Panel UI, but the content script cannot share those styles. All injected UI must use vanilla DOM with inline styles.

## Goals / Non-Goals

**Goals:**
- Show visual success/error feedback on the button after extraction
- Display a toast notification with event count or error message
- Show the currently detected route near the button

**Non-Goals:**
- Using React/shadcn in the content script (not available in injected DOM)
- Shadow DOM isolation (over-engineered for a single button + toast)
- Persistent notification history or notification tray

## Decisions

### 1. Vanilla DOM for Content Script UI

**Decision:** Continue using vanilla DOM with inline styles for all content script UI elements.

**Rationale:**
- Content scripts injected into pages cannot use React/shadcn without Shadow DOM
- The existing button already works this way
- Minimal complexity for a small number of UI elements

**Alternatives considered:**
- Shadow DOM + React: Adds complexity, bundling overhead, and style isolation issues for minimal benefit
- CSS file injection: More maintainable but requires extra build configuration in WXT

### 2. Button State Auto-Revert After 2 Seconds

**Decision:** After showing success or error state, revert the button to its default state after 2 seconds.

**Rationale:**
- Gives the user enough time to notice the feedback
- Doesn't leave the button in a permanent non-functional-looking state
- Matches common UX patterns (toast + brief state change)

**Alternatives considered:**
- Permanent state until next click: Confusing if user doesn't notice
- Revert on mouse leave: Unpredictable timing

### 3. Toast Positioned Above Button, Bottom-Right

**Decision:** Toast appears fixed above the Generate button in the bottom-right corner.

**Rationale:**
- Keeps all UI elements clustered in one area
- Doesn't interfere with Reclaim.ai's main content
- Natural association between button click and feedback

**Alternatives considered:**
- Top-right corner: Too far from button, user might miss it
- Inline below button: Could overlap other page elements

### 4. Route Indicator as Small Label Above Button

**Decision:** Display the current route as a small text label positioned directly above the Generate button.

**Rationale:**
- Minimal visual footprint
- Always visible without hovering
- Updates automatically on navigation

**Alternatives considered:**
- Icon-based indicator: Requires icon assets, less clear
- Tooltip on hover: Hidden by default, user might not discover it

## Risks / Trade-offs

- **Style conflicts**: Inline styles may occasionally clash with Reclaim.ai's CSS → Mitigation: High z-index (9999) ensures UI stays on top
- **Toast overlap on short pages**: Toast could overlap content near the bottom → Mitigation: 3-second auto-dismiss limits interference
- **Color accessibility**: Green/red states may not be distinguishable for colorblind users → Mitigation: Text changes ("3 events found", "Error") provide redundant information
