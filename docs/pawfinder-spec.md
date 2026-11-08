## PawFinder Project Specification (Week 02)

**Feature Branch**: `001-pawfinder-project` (proposed)  
**Created**: 2026-11-07  
**Status**: Draft  
**Input**: PawFinder project proposal

## Project Overview

**Project title**: PawFinder  
**Description**: A web application that connects people reporting a missing pet with people who have spotted or are temporarily caring for an animal. It provides separate public report sections, city-based search, a public map, and private messaging.  
**Purpose**: Help communities find missing pets and reunite them with their families while allowing people who spotted or found an animal to share useful information safely.  
**Target audience**: Pet owners and caretakers, people who spot or temporarily care for an animal, and community members helping with a search.  
**First-version scope**: Account registration and sign-in; a personal dashboard and preferred city; creating, viewing, editing, deleting, and resolving owned reports; public missing-pet and spotted/temporary-care sections; city autocomplete and report filters; a public map; and private messages with an inbox. Exact first-release scope and implementation choices remain subject to team confirmation.

## User Scenarios & Testing _(mandatory)_

Priorities below are proposals for discussion, not confirmed release commitments.

### User Story 1 - Register, Sign In, and Open My Dashboard (Proposed Priority: P1)

A person creates an account or signs in, saves a preferred city, and uses a personal dashboard to manage their reports.

**Independent Test**: Register and sign in, save a city, then open the dashboard and verify it is associated with that account.

**Acceptance Scenarios**:

1. **Given** a visitor with valid registration details, **When** they register and then sign in, **Then** they reach their personal dashboard.
2. **Given** a registration or sign-in form with invalid or missing required input, **When** it is submitted, **Then** no account or session is incorrectly created and field-level feedback is shown.
3. **Given** a signed-in user, **When** they save or change their preferred city, **Then** the dashboard reflects the saved choice on their next visit.
4. **Given** two different signed-in users, **When** each opens their dashboard, **Then** each sees only their own reports and account preferences.
5. **Given** a signed-in user on their dashboard, **When** they manage their reports, **Then** they can start creating a report, open their own report, or choose to edit or delete one of their reports.

### User Story 2 - Post a Missing-Pet Report (Proposed Priority: P1)

A signed-in owner reports a missing pet with photos, identifying details, the last-seen date, and an author-selected map point.

**Independent Test**: Create a valid missing-pet report and verify its details and public map point in the missing-pets section.

**Acceptance Scenarios**:

1. **Given** a signed-in user who selects the animal's species and enters valid required report details, **When** they submit a missing-pet report, **Then** the report stores that species along with the pet's name, description, identifying characteristics, last-seen date, photos, and selected map point, and the species is available to the species filter.
2. **Given** required report input is missing or invalid, **When** the user submits the form, **Then** no report is created and the invalid fields are identified without discarding valid input.
3. **Given** a saved report, **When** a visitor views it, **Then** its selected last-seen point appears on the public map.

### User Story 3 - Post a Spotted or In Temporary Care Report (Proposed Priority: P1)

A signed-in person reports an animal they observed or are temporarily caring for, whether or not a matching missing-pet report exists.

**Independent Test**: Create one report with each supported label and verify both appear in the public spotted/found section without requiring a linked missing-pet report.

**Acceptance Scenarios**:

1. **Given** a signed-in user who selects the animal's species and enters valid photos, description, observation date and time, and map point, **When** they submit a spotted report, **Then** the report stores the selected species and is saved with the label **Spotted**; its species is available to the species filter.
2. **Given** a signed-in user who selects the animal's species and enters valid photos, description, observation date and time, and map point, **When** they submit a report for an animal in their care, **Then** the report stores the selected species and is saved with the label **In temporary care**; its species is available to the species filter.
3. **Given** either report label, **When** the user submits without linking a missing-pet report, **Then** the report is still accepted and its selected point appears on the public map.
4. **Given** required input is missing or invalid, **When** either form is submitted, **Then** no report is created and the user receives field-level feedback.

### User Story 4 - Browse Public Report Sections (Proposed Priority: P1)

A visitor browses missing-pet reports separately from reports labeled Spotted or In temporary care.

**Independent Test**: Create reports with all three labels and verify the missing-pets section and spotted/found section show the appropriate reports.

**Acceptance Scenarios**:

1. **Given** reports of all supported labels, **When** a visitor opens the missing-pets section, **Then** only missing-pet reports appear.
2. **Given** reports of all supported labels, **When** a visitor opens the spotted/found section, **Then** Spotted and In temporary care reports appear with their labels intact.
3. **Given** a visible report, **When** a visitor opens its detail view, **Then** the animal information, report label, relevant date, and public map point are shown.

### User Story 5 - Search and Filter Reports by City (Proposed Priority: P1)

A visitor searches either public section using city autocomplete and filters by species, date, and case status. A signed-in user can start with their saved city, choose another city, or view all locations.

**Independent Test**: Search each section with a selected city and filter values, then repeat with an unmatched combination and with all locations selected.

**Acceptance Scenarios**:

1. **Given** either public report section, **When** a visitor enters a city query, **Then** matching city suggestions are offered and selecting one filters that section's reports.
2. **Given** a signed-in user with a saved city, **When** they begin a search, **Then** the saved city is the initial location and they can replace it with another city or select all locations.
3. **Given** reports with differing species, dates, and case statuses, **When** a visitor applies one or more of those filters, **Then** only reports matching all selected filters are shown.
4. **Given** no reports match the selected city and filters, **When** the search is applied, **Then** an explicit empty-results message is shown with a way to change or clear filters.

### User Story 6 - Contact an Author and Use the Inbox (Proposed Priority: P1)

A signed-in user privately messages a report author, receives replies, and can share a phone number or pickup address in the conversation.

**Independent Test**: Send a message from one account to a report author, reply as the author, and verify both messages are available in the participants' inboxes.

**Acceptance Scenarios**:

1. **Given** a signed-in sender and a report author who is offline, **When** the sender messages the author, **Then** the private message is retained and the author can read it later in their inbox.
2. **Given** a conversation between its sender and report author, **When** a third signed-in account attempts to read it, **Then** access is denied and no conversation content is disclosed.
3. **Given** a message in an inbox, **When** its recipient replies, **Then** both conversation participants can read the reply later in their inbox.
4. **Given** a user shares a phone number or pickup address, including an address where an animal is being cared for, **When** it is sent in a private message, **Then** it is not shown on the public report or public map.
5. **Given** a signed-out visitor, **When** they try to send a message or open an inbox, **Then** access is denied and they are asked to sign in.

### User Story 7 - Edit My Report (Proposed Priority: P2)

A report author updates their own report from the personal dashboard.

**Independent Test**: Edit a report as its author and verify the revised information appears on the public report and map.

**Acceptance Scenarios**:

1. **Given** an author editing their report, **When** they submit valid changes, **Then** the report and its public details are updated.
2. **Given** invalid required changes, **When** the author submits them, **Then** the update is rejected and the previously saved report remains unchanged.
3. **Given** a user who does not own the report, **When** they attempt to edit it, **Then** the request is denied and the report remains unchanged.

### User Story 8 - Delete My Report (Proposed Priority: P2)

A report author removes their own report from the personal dashboard.

**Independent Test**: Delete a report as its author and verify it is no longer available in public sections or on the public map.

**Acceptance Scenarios**:

1. **Given** an author selects delete for their report, **When** they confirm, **Then** the report is removed from public sections and the map.
2. **Given** an author starts deletion, **When** they cancel, **Then** the report remains available and unchanged.
3. **Given** a user who does not own the report, **When** they attempt to delete it, **Then** the request is denied and the report remains available and unchanged.

### User Story 9 - Mark My Case Resolved (Proposed Priority: P2)

An author marks their report's case resolved after the pet is reunited with its family.

**Independent Test**: Mark an owned case resolved and verify its case status changes while its report label remains unchanged.

**Acceptance Scenarios**:

1. **Given** an author viewing their active report, **When** they mark the case resolved, **Then** its case status becomes Resolved and the update is visible in the dashboard and public report.
2. **Given** a report labeled Spotted or In temporary care, **When** its case is marked resolved, **Then** the label remains Spotted or In temporary care and only its separate case status changes.
3. **Given** a user who does not own the report, **When** they attempt to change its case status, **Then** the request is denied and the case status is unchanged.

### Edge Cases

- Missing or invalid account and report fields MUST produce clear errors and MUST NOT create or change data.
- A city query with no matching reports MUST show an empty state; clearing the city MUST restore results for the selected filters.
- Attempts to read another user's dashboard or edit, delete, or resolve their report MUST be denied without changing private or report data.
- Private messages, phone numbers, and pickup addresses MUST never appear in public report details or map markers.
- Public map points MUST represent the author-selected last-seen, spotted, or found location; a privately shared care/pickup address MUST remain separate.
- A deleted or unavailable report MUST show a not-found state; its messages and private contact details MUST not become publicly accessible.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: PawFinder MUST support account registration and sign-in using an authentication approach selected for the first release.
- **FR-002**: PawFinder MUST let signed-in users save a preferred city and use a personal dashboard to create, view, edit, and delete their own reports.
- **FR-003**: PawFinder MUST support missing-pet reports with an author-selected species stored for filtering, photos, pet name, description, identifying characteristics, last-seen date, and an author-selected map point.
- **FR-004**: PawFinder MUST support reports labeled Spotted and In temporary care, each with an author-selected species stored for filtering, photos, description, observation date and time, and an author-selected map point; neither label may require a linked missing-pet report.
- **FR-005**: PawFinder MUST present separate public sections for missing pets and Spotted/In temporary care reports and show each report's author-selected point on a public map.
- **FR-006**: Both public sections MUST support city autocomplete and filters for the species stored on each report, date, and case status.
- **FR-007**: Signed-in users MUST be able to start a search with their preferred city, choose another city, or view all locations; unmatched searches MUST show an empty state.
- **FR-008**: Signed-in users MUST be able to send private messages to report authors regardless of whether the author is online, read messages and replies later in an inbox, and privately share a phone number or pickup address; only conversation participants may read a conversation.
- **FR-009**: The public report and map MUST NOT display private messages, phone numbers, or pickup/care addresses.
- **FR-010**: A report author MUST be able to edit and delete only their own reports from the personal dashboard.
- **FR-011**: A report author MUST be able to mark their case Resolved; case status MUST remain distinct from the Spotted and In temporary care report labels.
- **FR-012**: PawFinder MUST validate input and deny unauthorized access without changing stored data.

### Proposed API Endpoints

These endpoint shapes are proposals for planning and issue breakdown only, not approved contracts. Authentication, storage, map, city-autocomplete, and photo mechanisms remain open.

| Method   | Proposed endpoint                                                                                                | Purpose                                                                  | Proposed priority |
| -------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------- |
| POST     | `/api/accounts`                                                                                                  | Register an account                                                      | P1, provisional   |
| POST     | `/api/sessions`                                                                                                  | Sign in                                                                  | P1, provisional   |
| DELETE   | `/api/sessions/current`                                                                                          | Sign out                                                                 | P1, provisional   |
| PATCH    | `/api/me/preferences`                                                                                            | Save a preferred city                                                    | P1, provisional   |
| GET      | `/api/me/reports`                                                                                                | List the signed-in user's reports for the dashboard                      | P1, provisional   |
| GET      | `/api/cities?query={text}`                                                                                       | Return city autocomplete suggestions                                     | P1, provisional   |
| GET      | `/api/reports?section={section}&city={city}&species={species}&dateFrom={date}&dateTo={date}&caseStatus={status}` | Browse or filter either public section; use `city=all` for all locations | P1, provisional   |
| POST     | `/api/reports`                                                                                                   | Create a missing, Spotted, or In temporary care report                   | P1, provisional   |
| GET      | `/api/reports/{reportId}`                                                                                        | View a public report and its map point                                   | P1, provisional   |
| PATCH    | `/api/reports/{reportId}`                                                                                        | Edit an owned report                                                     | P2, provisional   |
| DELETE   | `/api/reports/{reportId}`                                                                                        | Delete an owned report                                                   | P2, provisional   |
| PATCH    | `/api/reports/{reportId}/case-status`                                                                            | Mark an owned case Resolved                                              | P2, provisional   |
| POST     | `/api/reports/{reportId}/messages`                                                                               | Privately message the report author                                      | P1, provisional   |
| GET      | `/api/me/inbox`                                                                                                  | List the signed-in user's conversations                                  | P1, provisional   |
| GET/POST | `/api/me/inbox/{conversationId}/messages`                                                                        | Read a conversation or send a reply                                      | P1, provisional   |

### Verification Requirements

- Each user story MUST have automated tests or documented, repeatable verification steps.
- Verification MUST cover invalid forms, empty city-search results, private message access, and denied attempts to edit, delete, or resolve another user's report.
- Public map behavior and private handling of phone numbers and pickup/care addresses MUST be verified separately.
- User-facing workflows MUST be checked at mobile viewport sizes for keyboard operation, meaningful labels and errors, readable reflow, and usable touch targets.

### Key Entities

- **Account**: A registered user with sign-in credentials managed by the selected authentication approach, a preferred city, reports, and inbox conversations.
- **Pet report**: A report authored by an account with a label (Missing, Spotted, or In temporary care), photos and relevant details, an author-selected public map point, and a separate case status (for example, Active or Resolved).
- **City and search filters**: A selected city or all-locations choice, plus optional species, date, and case-status filters applied to either public section.
- **Conversation and message**: Private messages between signed-in users, associated with a report author and readable later through each participant's inbox.
- **Private contact detail**: A phone number or pickup/care address shared in a private conversation and not displayed on the public report or map.

### Implementation Priorities and GitHub Issue Breakdown

The following issue list maps to the stories and is sized for separate implementation work. P1/P2 are provisional ordering suggestions; the team must confirm first-release scope before treating them as commitments.

| Proposed priority | Suggested actionable GitHub issue                                                 | Story        |
| ----------------- | --------------------------------------------------------------------------------- | ------------ |
| P1                | Add account registration, sign-in, and personal dashboard with preferred city     | User Story 1 |
| P1                | Create missing-pet reports with photos, identifying details, and map point        | User Story 2 |
| P1                | Create Spotted and In temporary care reports without requiring a matching case    | User Story 3 |
| P1                | Build separate public report sections and show report points on the map           | User Story 4 |
| P1                | Add city autocomplete and species, date, and case-status filters to both sections | User Story 5 |
| P1                | Add private report messaging and a persistent inbox for replies                   | User Story 6 |
| P2                | Let report authors edit their own reports from the dashboard                      | User Story 7 |
| P2                | Let report authors delete their own reports from the dashboard                    | User Story 8 |
| P2                | Let report authors mark cases Resolved without changing report labels             | User Story 9 |

### Proposals and Open Questions

- **Authentication**: Registration and sign-in are in scope; provider, credential method, and session approach are undecided.
- **Database**: Persistent account, report, and message storage is required; the database and data model are open.
- **Maps and city autocomplete**: Public map points and city suggestions are required; map, geocoding, and autocomplete providers are open.
- **Photo storage**: Reports support photos; upload limits, formats, and storage provider are open.
- **Case status**: Active and Resolved are proposed values, separate from report labels. Confirm whether additional states are needed.
- **Release priorities**: P1/P2 ordering is proposed only. Confirm which dashboard, search, messaging, and resolution capabilities belong in the first release.
- **Public map precision**: The author-selected last-seen, spotted, or found point is public. A phone number or pickup/care address shared by message is private and must not be used as a public map point.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All nine user stories pass their acceptance scenarios, including invalid input, empty search, and ownership-denial cases.
- **SC-002**: In both public sections, a user can select a city suggestion, apply species/date/case-status filters, and receive either matching reports or an explicit empty state.
- **SC-003**: Every report type displays its author-selected point publicly while private messages, phone numbers, and pickup/care addresses remain inaccessible from public report and map views.
- **SC-004**: An author can manage only their own dashboard reports; attempts to edit, delete, or resolve another user's report leave its data unchanged.
- **SC-005**: Signed-in conversation participants can retrieve prior messages and replies from their inbox after leaving and returning to the application.
- **SC-006**: Marking a case Resolved changes its case status without changing its Missing, Spotted, or In temporary care label.
