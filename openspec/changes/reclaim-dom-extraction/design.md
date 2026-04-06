## Context

Reclaim.ai is a Single Page Application (SPA) that uses HTML5 history mode for navigation. The extension needs to extract calendar event data from two specific routes: `/planner` and `/focus`. Each route renders different DOM structures, requiring route-aware extraction logic.

The current content script targets Google (`*://*.google.com/*`) and contains only a placeholder implementation. The extension must be reconfigured to target Reclaim.ai and implement robust DOM observation.

## Goals / Non-Goals

**Goals:**
- Extract calendar event data from Reclaim.ai's `/planner` and `/focus` pages
- Detect SPA navigation between routes without full page reloads
- Sanitize extracted text to remove emojis and UI artifacts
- Output structured JSON array of event data

**Non-Goals:**
- Real-time data synchronization or background processing
- Support for additional Reclaim.ai routes beyond `/planner` and `/focus`
- Data persistence or storage (extraction only)
- UI overlays or visual modifications to Reclaim.ai

## Decisions

### 1. Use `wxt:locationchange` Event for SPA Detection

**Decision:** Leverage WXT's built-in `wxt:locationchange` event listener instead of manually overriding `history.pushState`.

**Rationale:**
- WXT provides this event specifically for SPA navigation detection
- Cleaner abstraction than manual history API patching
- Handles both `pushState` and `popstate` events automatically
- Follows WXT best practices for content scripts in SPAs

**Alternatives considered:**
- Manual `history.pushState` override: More control but error-prone and duplicates WXT functionality
- `MutationObserver` on DOM: Detects visual changes but not navigation intent, leading to race conditions

### 2. Use Partial Class Selectors for DOM Traversal

**Decision:** Target calendar event nodes using `[class*="RaiCalendarEventView"]` and similar partial class selectors.

**Rationale:**
- Reclaim.ai uses hashed/generated class names that change between deployments
- Partial matching on stable class name prefixes provides resilience
- Avoids brittle full-class-name dependencies

**Alternatives considered:**
- Data attributes: Reclaim.ai doesn't expose stable data attributes
- XPath: More precise but harder to maintain and slower
- Full class name matching: Breaks on any class name regeneration

### 3. Route-Specific Extraction Handlers

**Decision:** Implement separate extraction functions for `/planner` and `/focus` routes, triggered by URL pattern matching.

**Rationale:**
- Each route has different DOM structures and event layouts
- Isolates extraction logic for easier debugging and maintenance
- Allows independent evolution of extraction strategies per route

**Alternatives considered:**
- Single unified extractor: Too complex given DOM differences
- Dynamic selector configuration: Over-engineered for two known routes

### 4. Regex-Based Text Sanitization

**Decision:** Use Unicode property escapes (`\p{Emoji}`) and regex patterns to strip emojis and UI artifacts.

**Rationale:**
- Native Unicode support in modern JavaScript
- Handles emoji variations and combined emoji sequences
- Performant for typical event title lengths

**Alternatives considered:**
- Character whitelist: Too restrictive for international event titles
- Third-party emoji libraries: Unnecessary dependency for simple stripping

## Risks / Trade-offs

- **DOM Structure Changes** → Mitigation: Partial class selectors provide some resilience; extraction functions can be updated independently per route
- **Reclaim.ai Anti-Scraping** → Mitigation: Extension reads DOM passively without modifying requests or injecting external scripts
- **Race Conditions on Navigation** → Mitigation: Add small delay before DOM traversal to allow React rendering to complete
- **Selector Performance** → Mitigation: Scoped queries within route-specific containers rather than global `querySelectorAll`
