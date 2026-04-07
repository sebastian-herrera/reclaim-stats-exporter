## ADDED Requirements

### Requirement: Route Display on Button
The system SHALL display the currently detected route on or near the Generate button.

#### Scenario: Planner route indicator
- **WHEN** user is on /planner route
- **THEN** button or label shows "Planner"

#### Scenario: Focus route indicator
- **WHEN** user is on /focus route
- **THEN** button or label shows "Focus"

#### Scenario: Unknown route indicator
- **WHEN** user is on an unrecognized route
- **THEN** indicator shows "Unknown" and button is disabled

### Requirement: Route Indicator Updates on Navigation
The system SHALL update the route indicator when the user navigates between routes in Reclaim.ai.

#### Scenario: Navigation updates indicator
- **WHEN** user navigates from /planner to /focus
- **THEN** route indicator updates to "Focus"

#### Scenario: Initial load sets indicator
- **WHEN** page first loads
- **THEN** route indicator reflects the current URL route
