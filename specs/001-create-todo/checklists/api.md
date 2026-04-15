# API Completeness & Testing Requirements Checklist: To-Do Application

**Purpose**: Validate that the spec fully and unambiguously specifies all API contract details and that acceptance scenarios are structured to support TDD (red-green-refactor)
**Created**: 2026-04-14
**Feature**: [spec.md](../spec.md)
**Scope**: Full contract completeness (endpoints, HTTP methods, status codes, request/response shapes) + TDD readiness
**Audience**: Reviewer (PR gate)

---

## Endpoint Inventory & HTTP Method Completeness

- [ ] CHK001 - Is an HTTP method (GET / POST / PATCH / DELETE) explicitly specified for each to-do operation rather than implied by verb choice in prose? [Completeness, Gap — FR-001 through FR-008 name operations but do not state HTTP methods]
- [ ] CHK002 - Is the full URL path pattern for every endpoint (e.g., `/todos`, `/todos/<id>`, `/todos/<id>/toggle`) explicitly stated in the requirements? [Completeness, Gap]
- [ ] CHK003 - Are all five operations (list, create, toggle, delete, filter) each traceable to a distinct, formally named endpoint in the requirements? [Completeness, Spec §FR-001–FR-008]

---

## Request Body Shape Completeness

- [ ] CHK004 - Are the exact JSON field names for the create-item request body specified in the requirements, or only described in plain-language prose? [Clarity, Gap — "title" and "description" appear in prose but no formal schema is defined]
- [ ] CHK005 - Are the data types and constraints for each request field (e.g., `title` is a non-empty string of at most N characters) specified with measurable values? [Completeness, Gap — max length deferred to planning per Assumptions]
- [ ] CHK006 - Is the behavior defined when an unexpected or extra field is included in the create-item request body? [Edge Case, Gap]
- [ ] CHK007 - Is it specified whether the description field must be explicitly omitted or can be sent as `null`/empty string when not provided? [Clarity, Spec §FR-003, Gap]

---

## Response Body Shape Completeness

- [ ] CHK008 - Are the JSON field names and types for the to-do item response schema formally defined, or only described as a prose entity? [Completeness, Gap — Key Entities section lists attributes but not field names or types]
- [ ] CHK009 - Is the field name and value type for the item's unique identifier in the response body specified (e.g., `id` as UUID string vs. integer)? [Clarity, Spec §FR-005, Gap — ID type deferred to planning]
- [ ] CHK010 - Is the field name and serialization format for the completion status in the response body defined (e.g., `completed: boolean` vs `status: "active"|"completed"`)? [Clarity, Gap]
- [ ] CHK011 - Is the field name and format for the creation timestamp in the response body specified (e.g., ISO 8601 string, Unix epoch integer)? [Clarity, Gap — timestamp noted in Key Entities but format unspecified]
- [ ] CHK012 - Does the item response shape returned by the toggle endpoint match the item response shape returned by the list/filter endpoint? [Consistency, Spec §FR-006 vs FR-001]
- [ ] CHK013 - Is the response body shape for a successful filter request (empty array vs. populated array) defined, including the field name of the list container (e.g., top-level array or `{"todos": [...]}`)? [Completeness, Spec §FR-008, Gap]

---

## HTTP Status Code Coverage

- [ ] CHK014 - Is the success HTTP status code for the list-all endpoint explicitly specified in the requirements? [Completeness, Spec §FR-001, Gap]
- [ ] CHK015 - Is the success HTTP status code for the toggle endpoint explicitly specified in the requirements? [Completeness, Spec §FR-006, Gap]
- [ ] CHK016 - Is the success HTTP status code for the filter endpoint explicitly specified in the requirements? [Completeness, Spec §FR-008, Gap]
- [ ] CHK017 - Are the success status codes for all read operations (list, filter) consistent with each other in the requirements? [Consistency, Spec §FR-001, FR-008]

---

## Query Parameter Specification

- [ ] CHK018 - Is the behavior defined when the `status` query parameter receives an invalid or unrecognized value (e.g., `?status=unknown`)? [Edge Case, Spec §FR-008, Gap]
- [ ] CHK019 - Is case sensitivity of the `status` parameter value (`active` vs `Active` vs `ACTIVE`) defined in the requirements? [Clarity, Spec §FR-008, Gap]
- [ ] CHK020 - Is it specified whether supplying multiple `status` values in a single request (e.g., `?status=active&status=completed`) is permitted or must be rejected? [Completeness, Spec §FR-008, Gap]
- [ ] CHK021 - Is the value `all` for the `status` parameter defined as functionally equivalent to omitting the parameter entirely, and is this equivalence stated explicitly? [Clarity, Spec §FR-008]

---

## Error Response Completeness

- [ ] CHK022 - Is the HTTP status code and error body explicitly specified for calling the toggle endpoint with a non-existent item ID? [Coverage, Spec §FR-006, Spec §FR-010]
- [ ] CHK023 - Is the behavior specified when the request body is malformed or non-JSON (e.g., a syntax-error payload on create)? [Edge Case, Gap]
- [ ] CHK024 - Is the error response defined for an item ID that is syntactically valid but does not match any stored item (vs. an ID of the wrong type)? [Clarity, Spec §FR-010, Gap]
- [ ] CHK025 - Are the error responses for all five operations consistent in shape (`{"error": "..."}`) and is this consistency stated as a requirement rather than assumed? [Consistency, Spec §FR-010]
- [ ] CHK026 - Is an error status code and response body defined for an invalid `status` query parameter value on the filter endpoint? [Completeness, Spec §FR-008, Gap]

---

## TDD Readiness & Acceptance Scenario Testability

- [ ] CHK027 - Are all acceptance scenarios for each user story written in Given/When/Then form with an observable, assertable outcome (not just describing intent)? [Completeness, Spec §US1–US5]
- [ ] CHK028 - Does each acceptance scenario's "Then" clause reference a specific API response (status code, body field, or list state) that can act as a test assertion before the implementation exists? [Measurability, Spec §US1–US5]
- [ ] CHK029 - Are the error-path acceptance scenarios (blank title, item not found) specific enough to assert both the expected HTTP status code AND the error response body shape in a single failing test? [Clarity, Spec §FR-009, FR-010]
- [ ] CHK030 - Is the "Independent Test" defined for each user story concrete enough to be implemented as a standalone test case that neither requires any other user story to be implemented nor shares state with other test cases? [Consistency, Spec §US1–US5]
- [ ] CHK031 - Is the toggle operation's acceptance scenario specific enough to distinguish between a test asserting the status *changed* (toggle worked) from a test asserting the resulting status *value* (correct new state)? [Clarity, Spec §US3]
- [ ] CHK032 - Does the filter user story's acceptance scenario for the "Active filter after adding a new item" (US5 scenario 4) specify whether the new item should appear via a separate list call or within the same filter call? [Ambiguity, Spec §US5]

---

## Coverage Measurability

- [ ] CHK033 - Is each success criterion (SC-001 – SC-007) traceable to at least one functional requirement, with no success criterion floating without a corresponding FR? [Traceability, Spec §SC-001–SC-007]
- [ ] CHK034 - Are there success criteria covering error-path outcomes (blank title rejected, not-found error), not just happy-path flows? [Coverage, Spec §SC-005]
- [ ] CHK035 - Can the 80% code coverage threshold (per constitution §II) be met by implementing tests that map to the acceptance scenarios as written, or are there code paths implied by the requirements that no acceptance scenario exercises? [Measurability, Constitution §II, Gap]

---

## Notes

- Check items off as completed: `[x]`
- Items marked `[Gap]` indicate requirements that are absent and need to be added to the spec or deferred with explicit justification to the plan
- Items marked `[Ambiguity]` indicate requirements that exist but need clarification before implementation can produce a deterministic test
- Items marked `[Consistency]` indicate cross-requirement alignment that must be verified before the contract is locked
- CHK009 and CHK011 gaps are acknowledged in the spec's Assumptions section as intentionally deferred to planning; verify they are resolved in `plan.md` before tasks are generated
