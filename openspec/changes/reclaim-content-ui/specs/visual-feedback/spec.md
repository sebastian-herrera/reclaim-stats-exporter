## ADDED Requirements

### Requirement: Button Success State
The system SHALL visually indicate successful extraction on the Generate button.

#### Scenario: Success color change
- **WHEN** extraction completes without errors
- **THEN** button changes to a green/success color for 2 seconds before reverting

#### Scenario: Button text shows result count
- **WHEN** extraction succeeds with N events found
- **THEN** button text briefly shows "N events found" before reverting to "Generate"

### Requirement: Button Error State
The system SHALL visually indicate failed extraction on the Generate button.

#### Scenario: Error color change
- **WHEN** extraction fails with an error
- **THEN** button changes to a red/error color for 2 seconds before reverting

#### Scenario: Button text shows error
- **WHEN** extraction fails
- **THEN** button text briefly shows "Error" before reverting to "Generate"

### Requirement: Toast Notification
The system SHALL display a floating toast notification after extraction completes.

#### Scenario: Success toast
- **WHEN** extraction completes successfully
- **THEN** a toast notification appears showing event count and detected route

#### Scenario: Error toast
- **WHEN** extraction fails
- **THEN** a toast notification appears showing the error message

#### Scenario: Toast auto-dismiss
- **WHEN** toast notification is displayed
- **THEN** it auto-dismisses after 3 seconds

#### Scenario: Toast non-intrusive position
- **WHEN** toast appears
- **THEN** it is positioned in the bottom-right area near the button without blocking page content
