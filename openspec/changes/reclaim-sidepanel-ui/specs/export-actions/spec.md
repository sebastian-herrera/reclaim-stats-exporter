## ADDED Requirements

### Requirement: Copy Markdown to Clipboard
The sidepanel SHALL provide a button to copy the extracted events formatted as Markdown to the system clipboard.

#### Scenario: Successful clipboard copy
- **WHEN** the user clicks "Copy Markdown" and extraction data exists
- **THEN** the formatted Markdown is copied to the clipboard and a confirmation is shown

#### Scenario: Copy with no data
- **WHEN** the user clicks "Copy Markdown" and no extraction data exists
- **THEN** the button is disabled and no action occurs

### Requirement: Download Markdown File
The sidepanel SHALL provide a button to download the extracted events as a `.md` file.

#### Scenario: Successful file download
- **WHEN** the user clicks "Download .md" and extraction data exists
- **THEN** a file download is triggered with the formatted Markdown content

#### Scenario: Download with no data
- **WHEN** the user clicks "Download .md" and no extraction data exists
- **THEN** the button is disabled and no action occurs

### Requirement: Markdown Format
The exported Markdown SHALL include a header with metadata (route, event count, timestamp) followed by a list of events with their details.

#### Scenario: Markdown header
- **WHEN** events are formatted as Markdown
- **THEN** the output includes a header section with route, count, and extraction timestamp

#### Scenario: Markdown event list
- **WHEN** events are formatted as Markdown
- **THEN** each event appears as a list item with title, start time, and end time
