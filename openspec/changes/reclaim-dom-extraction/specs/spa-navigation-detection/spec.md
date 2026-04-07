## ADDED Requirements

### Requirement: SPA Route Detection
The system SHALL detect navigation between routes in Reclaim.ai's Single Page Application without requiring full page reloads.

> **Important**: Route detection is PASSIVE. The system tracks the current route but does NOT trigger extraction automatically. Extraction only occurs when the user clicks the "Generate" button.

#### Scenario: Initial Page Load on Planner
- **WHEN** user navigates directly to `https://app.reclaim.ai/planner`
- **THEN** system stores current route as "planner" (no extraction triggered)

#### Scenario: Initial Page Load on Focus
- **WHEN** user navigates directly to `https://app.reclaim.ai/focus`
- **THEN** system stores current route as "focus" (no extraction triggered)

#### Scenario: Navigation from Planner to Focus
- **WHEN** user clicks navigation link to `/focus` while on `/planner`
- **THEN** system updates stored route to "focus" (no extraction triggered)

#### Scenario: Navigation from Focus to Planner
- **WHEN** user clicks navigation link to `/planner` while on `/focus`
- **THEN** system updates stored route to "planner" (no extraction triggered)

#### Scenario: Browser Back/Forward Navigation
- **WHEN** user uses browser back/forward buttons to navigate between routes
- **THEN** system updates stored route via popstate (no extraction triggered)

### Requirement: Route Pattern Matching
The system SHALL match URLs against defined route patterns to determine which extraction handler to available for user-triggered extraction.

#### Scenario: Planner Route Match
- **WHEN** URL matches `https://app.reclaim.ai/planner*`
- **THEN** system identifies route as planner and prepares planner extractor

#### Scenario: Focus Route Match
- **WHEN** URL matches `https://app.reclaim.ai/focus*`
- **THEN** system identifies route as focus and prepares focus extractor

#### Scenario: Non-Matching Route
- **WHEN** URL is `https://app.reclaim.ai/settings` or other non-target route
- **THEN** system stores route as "unknown" and disables "Generate" button
