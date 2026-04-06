## ADDED Requirements

### Requirement: Events are grouped by day label in Markdown output
The system SHALL group extracted events under day headers using the `dayLabel` field. Each day SHALL be rendered as a `##` heading followed by the day label (e.g., `## Mon 31`), with its events listed below as bullet points in the format `- Title (startTime → endTime)`.

#### Scenario: Multiple days with events
- **WHEN** extracted events contain day labels "Mon 31" and "Tue 1"
- **THEN** the Markdown output contains two day sections, each with its events listed under the correct header

#### Scenario: Single day with events
- **WHEN** all extracted events share the same dayLabel "Fri 3"
- **THEN** the Markdown output contains a single `## Fri 3` section with all events listed beneath it

### Requirement: Day order follows DOM extraction order
The system SHALL preserve the order in which days first appear in the extracted event list. The first event's `dayLabel` determines the first day section, and subsequent distinct `dayLabel` values create new sections in order of first appearance.

#### Scenario: Days appear in calendar order
- **WHEN** events are extracted with day labels in order: "Sun 30", "Mon 31", "Tue 1"
- **THEN** the Markdown output lists day sections in that same order: Sun 30, then Mon 31, then Tue 1

### Requirement: Events within a day preserve their original order
The system SHALL maintain the relative order of events within each day group as they appeared in the original extraction.

#### Scenario: Events maintain chronological order within a day
- **WHEN** events for "Mon 31" were extracted in order: "Morning Standup", "Lunch", "Code Review"
- **THEN** the Markdown lists them in that same order under the `## Mon 31` section

### Requirement: Fallback to flat list when no day labels are present
The system SHALL render events as a flat bulleted list (without day headers) when no events have a `dayLabel` value.

#### Scenario: All events lack day labels
- **WHEN** all extracted events have `dayLabel` as undefined or null
- **THEN** the Markdown output uses the existing flat list format with no day headers

### Requirement: Markdown header includes route, event count, and extraction timestamp
The system SHALL include a top-level `# Reclaim Stats Export` heading followed by metadata: route, total event count, and extraction timestamp, before any day sections.

#### Scenario: Complete metadata in header
- **WHEN** generating Markdown for 37 events on the planner route
- **THEN** the output begins with `# Reclaim Stats Export`, followed by route, event count (37), and the extraction timestamp
