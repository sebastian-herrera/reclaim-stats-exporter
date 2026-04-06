## ADDED Requirements

### Requirement: Store Extraction Results
The content script SHALL save extraction results to chrome.storage.local after each successful extraction.

#### Scenario: Save after successful extraction
- **WHEN** extraction completes successfully with events
- **THEN** the result is saved to chrome.storage.local under a known key

#### Scenario: Overwrite previous result
- **WHEN** a new extraction completes
- **THEN** the previous stored result is replaced with the new one

### Requirement: Read Extraction Results
The sidepanel SHALL read the most recent extraction result from chrome.storage.local on mount and on storage change events.

#### Scenario: Load data on sidepanel open
- **WHEN** the sidepanel opens
- **THEN** it reads the latest extraction result from chrome.storage.local

#### Scenario: React to storage changes
- **WHEN** chrome.storage.local is updated while the sidepanel is open
- **THEN** the sidepanel updates its display with the new data

### Requirement: Storage Permission
The extension manifest SHALL include the `storage` permission to allow chrome.storage.local access.

#### Scenario: Permission granted
- **WHEN** the extension is installed
- **THEN** the `storage` permission is declared in the manifest and granted automatically
