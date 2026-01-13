# THW Stocktaking App - Implementation Roadmap

## Phase 1: Foundation & Quality Gates ✓ COMPLETE
**Goal**: Working Angular + Firebase skeleton with authentication and agent-verifiable quality checks

### 1A: Project Setup
- [x] 1.1 Initialize Angular project with AngularFire
- [x] 1.2 Configure Firebase project (Firestore, Auth, Hosting)
- [x] 1.3 Set up Firebase emulators for local development

### 1B: Quality Gates (Agent-Verifiable)
- [x] 1.4 Configure ESLint with Angular recommended rules
- [x] 1.5 Configure Prettier for consistent formatting
- [x] 1.6 Set up Vitest unit testing (Angular 21 default)
- [x] 1.7 Add Playwright for E2E testing
- [x] 1.8 Install agent-browser for AI agent debugging
- [x] 1.9 Create npm scripts for quality checks:
  - `npm run lint` — ESLint check (must pass, 0 errors)
  - `npm run lint:fix` — Auto-fix lint issues
  - `npm run test` — Unit tests (must pass)
  - `npm run test:coverage` — Coverage report (target: 80%)
  - `npm run e2e` — Playwright E2E tests
  - `npm run build` — Production build (must succeed)
  - `npm run quality` — Run lint + test + build together

### 1C: Core Features
- [x] 1.10 Implement admin authentication (email/password)
- [x] 1.11 Create base layout with navigation
- [x] 1.12 Set up Firestore security rules (admin-only write)
- [x] 1.13 Add first unit test (auth service)
- [x] 1.14 Add first E2E test (login flow)

### Agent Quality Protocol
After each phase, coding agents MUST verify:
```bash
npm run lint          # 0 errors
npm run test          # All pass
npm run build         # Success
```

For UI debugging, agents can use:
```bash
agent-browser open http://localhost:4200
agent-browser snapshot -i    # Get element refs
agent-browser screenshot     # Capture current state
```

**Deliverable**: Admin can log in; all quality gates pass

---

## Phase 2: Data Model & Admin CRUD ✓ COMPLETE
**Goal**: Admins can manage trucks, compartments, and items

- [x] 2.1 Design Firestore data model (trucks, compartments, items)
- [x] 2.2 Create truck management (list, add, edit, delete)
- [x] 2.3 Create compartment management per truck
- [x] 2.4 Create item management with all identifiers (name, category, quantity, serial, barcode, asset tag)
- [x] 2.5 Assign items to compartments with expected quantities

**Deliverable**: Complete inventory structure defined in Firestore

---

## Phase 3: Import/Export
**Goal**: Seed data from existing spreadsheets, export results

- [ ] 3.1 CSV import for trucks/compartments/items
- [ ] 3.2 Excel (.xlsx) import support
- [ ] 3.3 Export current inventory to CSV
- [ ] 3.4 Export to Excel with formatting

**Deliverable**: Can migrate existing paper-based inventory data

---

## Phase 4: Stocktaking Sessions
**Goal**: Create and manage stocktaking sessions

- [ ] 4.1 Create stocktaking session (select truck, generate QR code)
- [ ] 4.2 Generate unique session tokens for QR access
- [ ] 4.3 Session state management (draft, active, completed)
- [ ] 4.4 View session progress (which compartments done)

**Deliverable**: Admin can start a stocktaking session and generate QR code

---

## Phase 5: Field Worker Mobile UI
**Goal**: Fast, frictionless stocktaking for field workers

- [ ] 5.1 QR code scan to join session (no login required)
- [ ] 5.2 Mobile-optimized compartment selection
- [ ] 5.3 Item checklist per compartment (expected vs actual)
- [ ] 5.4 Mark items: found, missing, quantity difference
- [ ] 5.5 Barcode scanning to find items quickly
- [ ] 5.6 Complete compartment and move to next

**Deliverable**: Field worker can complete stocktaking via phone

---

## Phase 6: Results & Reporting
**Goal**: See stocktaking results and discrepancies

- [ ] 6.1 Session summary view (found, missing, discrepancies)
- [ ] 6.2 Per-compartment results breakdown
- [ ] 6.3 Export stocktaking results to spreadsheet
- [ ] 6.4 Historical session comparison

**Deliverable**: Clear visibility into inventory status

---

## Phase 7: Borrowing System
**Goal**: Track equipment loans between groups

- [ ] 7.1 Check-out flow (select items, recipient group, expected return)
- [ ] 7.2 Check-in flow (return items, verify condition)
- [ ] 7.3 View outstanding loans
- [ ] 7.4 Loan history per item
- [ ] 7.5 Update item location after return

**Deliverable**: Full borrowing lifecycle tracked

---

## Dependencies

```
Phase 1 ─┬─► Phase 2 ─┬─► Phase 4 ───► Phase 5 ───► Phase 6
         │            │
         │            └─► Phase 3
         │
         └─────────────────────────────────────────► Phase 7
```

- Phase 2 requires Phase 1 (auth + Firebase)
- Phase 3 can run parallel to Phase 4
- Phase 5 requires Phase 4 (sessions)
- Phase 6 requires Phase 5 (completed stocktakes)
- Phase 7 can start after Phase 2 (needs items in system)

---

## MVP Recommendation

**Minimum for first user test**: Phases 1-5

This delivers the core stocktaking workflow. Import/Export (Phase 3) and Borrowing (Phase 7) can follow based on user feedback.

---

## Quality Gates (All Phases)

Every phase must pass these checks before completion:

| Check | Command | Requirement |
|-------|---------|-------------|
| Lint | `npm run lint` | 0 errors |
| Unit Tests | `npm run test` | All pass |
| Build | `npm run build` | Success |
| E2E Tests | `npm run e2e` | All pass (when UI changes) |

### Agent-Browser Integration

For visual debugging and verification, agents can use [agent-browser](https://github.com/vercel-labs/agent-browser):

```bash
# Navigate and inspect
agent-browser open http://localhost:4200/login
agent-browser snapshot -i              # Get accessibility tree with refs

# Interact
agent-browser fill @e3 "admin@thw.de"  # Fill form fields
agent-browser click @e5                # Click buttons

# Debug
agent-browser screenshot               # Capture current state
agent-browser evaluate "document.title" # Run JS in page
```

Use agent-browser when:
- Debugging UI rendering issues
- Verifying visual state after changes
- Testing user flows interactively
- Capturing screenshots for documentation

---

## Risk Areas

| Risk | Mitigation |
|------|------------|
| Field workers won't use mobile UI | Test with 1-2 colleagues early in Phase 5 |
| QR session tokens could be shared | Tokens expire after session, single-use option |
| Barcode scanning unreliable | Manual item search as fallback |
| Large inventory slow to load | Paginate compartment items, lazy load |
| Quality gates slow down iteration | Run lint/test in watch mode during dev |
