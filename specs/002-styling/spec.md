# Feature Specification: Modern UI Styling

**Feature Branch**: `002-styling`
**Created**: 2026-04-15
**Status**: Draft
**Input**: User description: "Update the todo application front end to have a modern look: The title of the application should have a nice font with an image or 2 to indicate this is a TODOs app. The form to add a new todo should be in a separated frame. The list of current todos should be in a nice looking, clean data table. The actions you can take for each todo should be represented by button icons whose image makes sense. The filters for the todos (All, Active, Completed) should be positioned and represented in a logical way for a standard todo app."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Branded App Header (Priority: P1)

A user opening the app immediately recognises it as a to-do application. The page title uses a distinctive, legible heading font and is accompanied by one or two relevant icons (e.g., a checklist/tick icon) that reinforce the purpose of the app at a glance.

**Why this priority**: First impressions matter. A clear, branded header establishes context before the user interacts with any feature.

**Independent Test**: Open the app in a browser. The heading text is visually distinct from body text (different font and size), and at least one relevant icon appears adjacent to the title. No functional behaviour need change.

**Acceptance Scenarios**:

1. **Given** the app loads, **When** the user views the page, **Then** the title "To-Do" is rendered in a custom heading font that is visually distinct from body text.
2. **Given** the app loads, **When** the user views the header, **Then** one or two icons that represent a to-do or checklist concept are displayed alongside the title.
3. **Given** any screen width above 320 px, **When** the header is viewed, **Then** the title and icons remain legible and do not overflow their container.

---

### User Story 2 — Add-Todo Form in a Separated Card (Priority: P2)

A user who wants to add a new to-do item sees the input form presented in a visually distinct, framed section (card/panel) that is clearly separated from the rest of the page.

**Why this priority**: Visual separation reduces cognitive load and makes the primary action (adding a todo) immediately obvious.

**Independent Test**: Render the app with an empty list. The form area has a visible card or framed container with a border or shadow that distinguishes it from the background and the list area.

**Acceptance Scenarios**:

1. **Given** the app loads, **When** the user views the page, **Then** the add-todo form is enclosed in a card container with a visible boundary (border, shadow, or background contrast).
2. **Given** the form card is rendered, **When** the user views it, **Then** there is clear whitespace (padding/margin) separating the card from adjacent sections.
3. **Given** the user submits a valid todo, **When** the item is added, **Then** the form card resets and retains its styled appearance.

---

### User Story 3 — To-Do List as a Clean Data Table (Priority: P3)

A user viewing their list of to-do items sees them displayed in a clean, structured table layout with columns for status, title/description, and actions, rather than an unstyled bullet list.

**Why this priority**: A tabular layout makes scanning multiple items faster and presents metadata (completion status, description) in a predictable, aligned structure.

**Independent Test**: Seed the app with three to-do items (mix of active and completed). The items render in a table with visible column alignment; completed items are visually distinguished (e.g., strikethrough or muted colour).

**Acceptance Scenarios**:

1. **Given** one or more todos exist, **When** the user views the list, **Then** items are displayed in a structured table with consistent row and column alignment.
2. **Given** a todo is marked as completed, **When** the user views the list, **Then** that row is visually distinct from active rows (e.g., muted colour, strikethrough on title).
3. **Given** no todos exist, **When** the user views the list area, **Then** a styled empty-state message is displayed, centred or clearly placed within the table container.
4. **Given** a table with multiple rows, **When** the user views it, **Then** alternating row shading or row separators are present to aid readability.

---

### User Story 4 — Icon Buttons for Row Actions (Priority: P4)

A user can toggle completion and delete a to-do item using icon buttons in each table row. The icons are intuitive — a tick/check for toggle and a trash/bin for delete — with accessible labels.

**Why this priority**: Replacing text buttons with recognised icon buttons reduces visual noise in the table and follows standard UI conventions for list management.

**Independent Test**: Render one active and one completed todo. The toggle button displays a check/tick-style icon and the delete button displays a trash/bin-style icon. Hovering or focusing a button shows a tooltip or visible focus ring.

**Acceptance Scenarios**:

1. **Given** an active todo row, **When** the user views the action column, **Then** a check/tick icon button is shown for toggling completion and a trash/bin icon button is shown for deletion.
2. **Given** a completed todo row, **When** the user views the action column, **Then** the toggle icon communicates an "undo" or "reopen" affordance (e.g., undo arrow or unfilled check).
3. **Given** any icon button, **When** the user focuses or hovers over it, **Then** a visible focus ring or tooltip is present for accessibility.
4. **Given** the user clicks the delete icon, **When** the item is removed, **Then** the row disappears from the table without a page reload.

---

### User Story 5 — Filter Bar Positioned Conventionally (Priority: P5)

A user can filter todos by All, Active, and Completed using a filter control positioned above the to-do list, styled as a segmented button group or tab bar consistent with standard to-do app conventions.

**Why this priority**: Filter controls positioned above the list match the mental model established by popular to-do apps (e.g., TodoMVC). This reduces learning time.

**Independent Test**: Render the app with a mix of active and completed items. The filter control is visually above the list, styled as a tab/segment group. The active filter is highlighted. Clicking each filter updates the list.

**Acceptance Scenarios**:

1. **Given** the app is loaded, **When** the user views the page, **Then** the filter controls (All, Active, Completed) appear between the add-form and the to-do list.
2. **Given** the filter bar is rendered, **When** the user views it, **Then** the buttons are styled as a segmented group or tabs (not isolated separate buttons) and the currently active filter is visually highlighted.
3. **Given** the user clicks "Active", **When** the filter changes, **Then** only active todos are shown in the list and the "Active" segment is highlighted.
4. **Given** the user clicks "Completed", **When** the filter changes, **Then** only completed todos are shown and the "Completed" segment is highlighted.
5. **Given** the user clicks "All", **When** the filter changes, **Then** all todos are shown and the "All" segment is highlighted.

---

### Edge Cases

- What happens when the todo title is very long? The table row must not break the layout — title cell truncates with ellipsis or wraps within its column.
- What happens on a narrow viewport (mobile-width)? The layout must remain usable above 320 px wide; the table may scroll horizontally or reflow to a card-per-row layout.
- What happens if icon assets fail to load? Buttons must still be operable (accessible label text shown as fallback).

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application header MUST render the title using *Poppins* (loaded from Google Fonts via a `<link>` tag in `index.html`) in bold weight, visually distinct from body text.
- **FR-002**: The header MUST display `✅` and `📝` Unicode emoji adjacent to the title text to reinforce the to-do app concept.
- **FR-003**: The add-todo form MUST be enclosed in a visually distinct card container separated from the list area by whitespace and a border or box-shadow.
- **FR-004**: The to-do list MUST be rendered as an HTML table (or CSS-grid table equivalent) with distinct columns for status indicator, title/description, and actions.
- **FR-005**: Completed todo rows MUST be visually distinguished from active rows through colour change, strikethrough, or opacity reduction on the title.
- **FR-006**: The toggle action MUST use `✓` (U+2713) for active items and `↩` (U+21A9) for completed items as the icon button label; the delete action MUST use a `🗑` (U+1F5D1) Unicode character as its icon button label.
- **FR-007**: All icon buttons MUST have an accessible `aria-label` attribute that describes the action.
- **FR-008**: The filter control MUST be positioned between the add form and the to-do list.
- **FR-009**: The filter control MUST be styled as a segmented button group or tab bar where the active filter is visually highlighted (e.g., filled background, underline).
- **FR-010**: All styling MUST be implemented using plain CSS (no external CSS frameworks or component libraries) in one or more `.css` files imported by the components.
- **FR-011**: Long todo titles MUST truncate with an ellipsis or wrap within their table cell without breaking the overall layout.
- **FR-013**: The page content MUST be rendered in a centered column with a maximum width of 720 px, horizontally centered in the viewport on all screen sizes above 320 px.
- **FR-012**: The color palette MUST use a warm scheme: off-white background (`#faf9f7` or similar), warm-gray accents for borders and surfaces, and indigo/purple (`#6366f1` family) as the primary action color for buttons, active states, and highlights.

### Key Entities

- **Styled App Shell**: The outer layout — header, form card, filter bar, list table — each with defined visual regions.
- **CSS Module / Global Stylesheet**: The file(s) that own all style rules for this feature.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can identify the purpose of the app (to-do/task management) within 5 seconds solely from the header.
- **SC-002**: All five action types (add, toggle, delete, filter, view) remain fully operable after styling is applied — zero functional regressions.
- **SC-003**: All existing passing tests (56 backend, 50 frontend) continue to pass after the styling change.
- **SC-004**: All icon buttons pass basic accessibility requirements: each has a non-empty `aria-label` and is keyboard focusable.
- **SC-005**: The layout is usable at viewport widths from 320 px to 1920 px without horizontal overflow on the page body.

---

## Assumptions

- Styling is front-end only — no backend changes required.
- Plain CSS (no Tailwind, Bootstrap, or CSS-in-JS) is used, consistent with the project's "simplicity" constitution principle.
- Google Fonts (or a self-hosted equivalent) is acceptable for loading a web font; a `<link>` tag in `index.html` is sufficient.
- Unicode/emoji characters (e.g., ✓, 🗑) are acceptable as icon fallbacks; dedicated SVG icons are preferred but not required.
- The existing component _logic_ (`TodoItem`, `TodoList`, `AddTodoForm`, `FilterBar`, `App`) is preserved — component HTML element structure may change where required by FR-004 (table layout), but all props and callbacks remain unchanged.
- Mobile responsiveness means "usable" at 320 px, not a fully optimised mobile-first design.
- Dark mode is out of scope.

---

## Clarifications

### Session 2026-04-15

- Q: What color palette should the app use? → A: Warm — off-white background, warm-gray accents, indigo/purple for actions
- Q: What font should be used for the app heading? → A: Poppins (Google Fonts), bold weight
- Q: What should be used for toggle and delete action icons? → A: Unicode — ✓ (U+2713) for toggle, 🗑 (U+1F5D1) for delete
- Q: How should the page content be laid out horizontally? → A: Centered column, max-width 720 px
- Q: What header icons should represent the to-do app in the title area? → A: Two Unicode emoji — ✅ (completed task) and 📝 (notes/writing) flanking the title
