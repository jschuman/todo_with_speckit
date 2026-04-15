# Feature Specification: To-Do Application

**Feature Branch**: `001-create-todo`
**Created**: 2026-04-14
**Status**: Draft
**Input**: User description: "Build a To-Do application that allows users to view, add, toggle, delete, and filter to-do items."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View All To-Do Items (Priority: P1)

A user opens the application and sees the complete list of all existing to-do items. Each item
displays its title, optional description, and whether it is active or completed. When no items
exist, the user sees an empty state.

**Why this priority**: Foundational visibility capability. Without it the app has no value — all
other features build on being able to see items.

**Independent Test**: Can be fully tested by loading the app with a pre-populated data set and
confirming all items appear with their correct title, description (when present), and status.

**Acceptance Scenarios**:

1. **Given** the to-do list contains existing items, **When** the user opens the app, **Then** all items are displayed with their titles, optional descriptions, and completion status.
2. **Given** no to-do items exist, **When** the user opens the app, **Then** an empty-state message is displayed.
3. **Given** items were added during the current session, **When** the user views the list, **Then** all added items appear.

---

### User Story 2 - Add a New To-Do Item (Priority: P2)

A user creates a new to-do item by entering a title (required) and an optional description.
After submission, the item appears in the list marked as active.

**Why this priority**: Core input capability. No list state exists until items are added; without
this, all other user stories are untestable end-to-end.

**Independent Test**: Can be fully tested by submitting a new-item form and confirming the item
appears in the list with the correct title, description, and active status.

**Acceptance Scenarios**:

1. **Given** the user provides a valid title, **When** they submit the form, **Then** the new item appears in the list as active.
2. **Given** the user provides a title and a description, **When** they submit the form, **Then** both the title and description are visible on the new item.
3. **Given** the user submits with an empty or whitespace-only title, **When** submission is attempted, **Then** an error message is displayed and no item is created.
4. **Given** the user provides only a title (no description), **When** they submit, **Then** the item is created successfully without a description field.

---

### User Story 3 - Toggle Completion Status (Priority: P3)

A user can mark any active item as completed, or re-activate any completed item. The item's
appearance updates immediately to reflect the new status.

**Why this priority**: Completion tracking is the primary value proposition of a to-do app.
Without it, the list cannot distinguish done work from outstanding work.

**Independent Test**: Can be fully tested by toggling an active item to completed and back,
confirming the status change is reflected in the list within the same session.

**Acceptance Scenarios**:

1. **Given** an active to-do item, **When** the user marks it as complete, **Then** the item is shown as completed.
2. **Given** a completed to-do item, **When** the user marks it as active again, **Then** the item is shown as active.
3. **Given** an item whose status was toggled, **When** the user continues using the app in the same session, **Then** the toggled status is preserved.

---

### User Story 4 - Delete a To-Do Item (Priority: P4)

A user can permanently remove any to-do item from the list. After deletion, the item no longer
appears regardless of the active filter.

**Why this priority**: Deletion completes the full item lifecycle. Users need to clean up the
list by removing items that are no longer relevant.

**Independent Test**: Can be fully tested by deleting an item and confirming it no longer
appears in the list under any filter (All, Active, Completed).

**Acceptance Scenarios**:

1. **Given** an existing to-do item, **When** the user deletes it, **Then** the item is permanently removed from the list.
2. **Given** an item has been deleted, **When** the user views the list under any filter, **Then** the deleted item does not appear.
3. **Given** an attempt to delete a non-existent item, **Then** the system returns a clear error indicating the item was not found.

---

### User Story 5 - Filter To-Do Items by Status (Priority: P5)

A user can narrow the visible list to show only "All", "Active", or "Completed" items using
a set of filter controls. The count or context of the current filter state is visible at a glance.

**Why this priority**: Filtering improves usability once the list grows. It is not required for
the core value proposition but is an expected standard feature of any to-do app.

**Independent Test**: Can be fully tested by creating a mix of active and completed items,
applying each filter in turn, and confirming only matching items appear.

**Acceptance Scenarios**:

1. **Given** a mix of active and completed items, **When** the user selects "Active", **Then** only active items are displayed.
2. **Given** a mix of active and completed items, **When** the user selects "Completed", **Then** only completed items are displayed.
3. **Given** any filter is active, **When** the user selects "All", **Then** all items regardless of status are displayed.
4. **Given** the "Active" filter is selected, **When** the user adds a new item, **Then** the new item (which is active) appears in the filtered view.
5. **Given** the "Completed" filter is selected and no completed items exist, **When** the user views the list, **Then** an appropriate empty-state message is shown.

---

### Edge Cases

- What happens when a title consists entirely of whitespace? → Rejected with `422` and `{"error": "Title is required"}` (covered by FR-009/FR-010).
- What happens when a user deletes an item that has already been removed in the same session (e.g., double-click)? → Returns `404` with `{"error": "Item not found"}` (covered by FR-010).
- How does the list behave when a filter is active but no items match the selected status? → API returns an empty list `[]`; the frontend shows an empty-state message (covered by SC-007).
- What is the maximum allowable title length, and how is exceeding it communicated to the user? → Maximum length to be determined during planning; violation returns `422` and `{"error": "Title exceeds maximum length"}`.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to retrieve the complete list of all to-do items at any time.
- **FR-002**: Users MUST be able to create a new to-do item by providing a required title. A successful creation MUST return the newly created item with a `201 Created` status.
- **FR-003**: Users MUST be able to include an optional description when creating a to-do item.
- **FR-004**: New to-do items MUST be created with an active (not completed) status by default.
- **FR-005**: The system MUST assign a unique identifier to each to-do item at the time of creation.
- **FR-006**: Users MUST be able to toggle the completion status of any existing to-do item between active and completed. The toggle operation MUST be exposed as a dedicated endpoint that requires no request body; the backend flips the current status automatically and returns the updated item.
- **FR-007**: Users MUST be able to permanently delete any existing to-do item. A successful deletion MUST return `200 OK` with the body `{"message": "Deleted successfully"}`.
- **FR-008**: The API MUST support filtering to-do items by status via a query parameter. Filtering MUST be performed server-side; the API returns only items matching the requested status. The three valid filter values are `all` (no filter — returns all items), `active`, and `completed`. When no `status` parameter is provided, the API MUST return all items (equivalent to `all`).
- **FR-009**: Submitting a to-do item with an empty or whitespace-only title MUST be rejected with a clear error message shown to the user.
- **FR-010**: The system MUST respond with a structured error when an operation targets a to-do item that does not exist or when input is invalid. Error responses MUST use the shape `{"error": "<human-readable message>"}` with an appropriate HTTP status code: `404 Not Found` when an item does not exist, `422 Unprocessable Entity` when input validation fails (e.g., blank title).
- **FR-011**: All to-do state is held for the lifetime of the running backend process only; no data survives a process restart.
- **FR-012**: The frontend web application and the backend API MUST be able to communicate even when served from different addresses.

### Key Entities

- **To-Do Item**: Represents a single task. Key attributes: unique identifier, title (required), description (optional), completion status (active or completed), creation timestamp (for ordering).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can add a new to-do item and see it appear in the list without a full page reload.
- **SC-002**: A user can toggle the completion status of an item and the change is reflected immediately in the displayed list.
- **SC-003**: A user can delete an item and it disappears from the list without a full page reload.
- **SC-004**: A user can switch between All, Active, and Completed filters and see only matching items each time.
- **SC-005**: Attempting to submit an item with an empty title results in a visible error message; no item is created.
- **SC-006**: The to-do list accurately reflects the in-session state after any combination of add, toggle, and delete operations performed within the same session.
- **SC-007**: When a filter is active but no items match, the user sees an informative empty-state message (not a blank screen or error).

---

## Assumptions

- No authentication or authorization is required; all operations are publicly accessible.
- No pagination is needed; the list is expected to remain small in this demo context.
- To-do items are displayed in creation order (oldest first).
- Unique identifiers are auto-generated server-side.
- Title length is constrained to a reasonable maximum determined during planning.
- All state is intentionally lost when the backend process restarts; this is expected behavior, not a defect.
- There is no multi-user scenario; a single shared in-memory state is sufficient for a demo.
- No offline support is required; a running backend process is a prerequisite.

---

## Clarifications

### Session 2026-04-14

- Q: Should filtering (All / Active / Completed) be implemented server-side (API query parameter) or client-side (frontend filters the full list locally)? → A: Server-side — the API MUST expose a `status` query parameter so filtering is performed and enforced at the backend layer.
- Q: What should the API error response shape be for validation failures and not-found errors? → A: Flat JSON `{"error": "<message>"}` with appropriate HTTP status codes — `404 Not Found` for missing items, `422 Unprocessable Entity` for invalid input.
- Q: What HTTP status code should a successful to-do item creation return? → A: `201 Created` with the newly created item as the JSON response body.
- Q: How should the toggle-completion operation be exposed in the API? → A: Dedicated endpoint with no request body; the backend flips the status automatically and returns the updated item.
- Q: What should a successful delete response look like? → A: `200 OK` with body `{"message": "Deleted successfully"}`.
