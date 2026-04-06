## ADDED Requirements

### Requirement: Calendar Event Node Discovery
The system SHALL locate individual calendar event nodes within the DOM using partial class selector matching.

#### Scenario: Planner Event Discovery
- **WHEN** system traverses the planner page DOM
- **THEN** system identifies all elements matching `[class*="RaiCalendarEventView"]`

#### Scenario: Focus Event Discovery
- **WHEN** system traverses the focus page DOM
- **THEN** system identifies all event container elements using route-specific selectors

#### Scenario: Empty Event List
- **WHEN** page contains no calendar events
- **THEN** system returns empty array without errors

### Requirement: Event Title Extraction
The system SHALL extract the title text from each calendar event node.

#### Scenario: Standard Event Title
- **WHEN** event node contains a title element
- **THEN** system extracts the text content of the title element

#### Scenario: Multi-Line Title
- **WHEN** event title spans multiple lines in the DOM
- **THEN** system concatenates text content preserving semantic meaning

#### Scenario: Missing Title Element
- **WHEN** event node does not contain a recognizable title element
- **THEN** system assigns empty string as title

### Requirement: Event Time Range Extraction
The system SHALL extract the time range information from each calendar event node.

#### Scenario: Standard Time Range
- **WHEN** event node contains time range element
- **THEN** system extracts start and end time text

#### Scenario: All-Day Event
- **WHEN** event represents an all-day event without specific times
- **THEN** system extracts date information without time component

#### Scenario: Missing Time Element
- **WHEN** event node does not contain time information
- **THEN** system assigns null for time range

### Requirement: Structured JSON Output
The system SHALL format extracted event data as a standardized JSON array.

#### Scenario: Multiple Events
- **WHEN** page contains N calendar events
- **THEN** system outputs JSON array with N objects containing title and time fields

#### Scenario: Event Data Structure
- **WHEN** system outputs event data
- **THEN** each event object contains `title` (string), `startTime` (string|null), and `endTime` (string|null) fields
