# THW Stocktaking App
## What This Is
A stocktaking application for THW (Technisches Hilfswerk) that enables fast annual inventory checks and tracks equipment across trucks and compartments. Built for the user and their colleagues to replace tedious paper-based inventory processes.
## Core Value
Fast annual stocktaking that the team actually adopts. If colleagues don't use it, nothing else matters.
## Requirements
### Validated
(None yet — ship to validate)
### Active
- [ ] Compartment-based stocktaking workflow (Truck → Compartment → Items)
- [ ] Scan items against expected list, mark found/missing/quantity differences
- [ ] Track equipment and consumables with identifiers (name, category, quantity, serial numbers, barcodes, asset tags)
- [ ] Mobile scanning + desktop management interface
- [ ] Admin authentication (email/password)
- [ ] Field worker access via QR code (per stocktaking session, no account needed)
- [ ] Import inventory data from spreadsheets (CSV/Excel)
- [ ] Export inventory data back to spreadsheet
- [ ] Check-out/check-in for borrowed items between groups
- [ ] Track current location of items (which truck/compartment)
### Out of Scope
- Multi-organization sync — v1 is for single THW unit, no cross-unit data sharing
- Maintenance scheduling — no tracking when equipment needs servicing
- Procurement/ordering — no purchase orders or supplier management
- Offline support — nice to have but not required for v1
## Context
THW is the German Federal Agency for Technical Relief. Equipment is organized by trucks, with each truck having multiple compartments containing specific items.
Current pain points:
- Annual stocktaking is slow and tedious with paper
- During deployments, equipment gets borrowed to other groups
- Items get lost on the way back or end up in wrong compartments
- The person responsible for tracking is often busy (e.g., driving) during deployments
Stocktaking workflow:
1. Remove all items from all compartments of truck
2. Check each item against the expected list
3. Record what's present, missing, or has quantity differences
4. Put back each item after recording where it belongs
5. Result: accurate inventory of each compartment
Success metric: colleagues actually use the app instead of falling back to paper.
## Constraints
- **Frontend**: Angular with AngularFire — required technology choice
- **Backend**: Firebase (Firestore + Auth + Cloud Functions) — serverless backend
- **Adoption**: UX must be simple enough for field workers to use without training
## Reference Files
When working with Angular code, agents MUST consult:
- `.planning/angular-guidelines.md` — Angular 20+ best practices, patterns, and requirements
- `.planning/angular-guides.txt` — Official Angular documentation links by topic
These files define the coding standards for this project.
## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| QR code access for field workers | No accounts needed = lower friction = higher adoption | — Pending |
| Compartment-based organization | Matches real-world truck layout and existing workflow | — Pending |
| Angular + Firebase stack | First-class Angular support via AngularFire, mature real-time sync, battle-tested auth | — Pending |
---
*Last updated: 2026-01-13 after switching backend to Firebase*