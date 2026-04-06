## ADDED Requirements

### Requirement: Stats Dashboard Display
The sidepanel SHALL display a dashboard showing the most recent extraction results including event count, detected route, extraction timestamp, and a list of extracted events.

#### Scenario: Dashboard shows extraction summary
- **WHEN** the sidepanel opens and extraction data exists in storage
- **THEN** the dashboard displays event count, route name, and extraction timestamp

#### Scenario: Dashboard shows empty state
- **WHEN** the sidepanel opens and no extraction data exists in storage
- **THEN** the dashboard displays a message prompting the user to run extraction from the Reclaim.ai page

#### Scenario: Dashboard shows event list
- **WHEN** extraction data contains events
- **THEN** each event is displayed with its title, start time, and end time in a scrollable list

### Requirement: Event Detail Formatting
The sidepanel SHALL format event times and titles for human-readable display.

#### Scenario: Event with full time range
- **WHEN** an event has both start and end times
- **THEN** the display shows "title — startTime → endTime"

#### Scenario: Event with missing end time
- **WHEN** an event has a start time but no end time
- **THEN** the display shows "title — startTime"

#### Scenario: Event with no times
- **WHEN** an event has neither start nor end time
- **THEN** the display shows only the event title
