# Manual Feature Checklist for Leverage

Use this checklist to quickly verify all major features after migrations, refactors, or big changes. Mark each item as you test it. Add new features as your app evolves.

---

## Core App Flows

- [ ] App loads and displays the calendar view
- [ ] Can add a new commitment (if supported)
- [ ] Can switch between commitments and see correct data
- [ ] Data persists after reload (localStorage)

## Slot & Scoring

- [ ] Can select/deselect individual time slots for a day
- [ ] "Select All" slots works and updates all slots for the day
- [ ] Slot changes update the calendar UI immediately
- [ ] Cumulative score updates correctly after slot changes (including for today and previous days)
- [ ] Unchecking today updates cumulative scores for previous days as expected

## UI & Popups

- [ ] Slot popup opens when clicking a calendar day
- [ ] Slot popup closes and returns to calendar
- [ ] UI popups (slot, score, hamburger, etc.) open/close as expected
- [ ] No console errors on main flows

## Data & Backup

- [ ] Backup/export and import works (if supported)
- [ ] (Optional) Firebase sync works (if enabled)

## Visuals & Feedback

- [ ] Calendar heatmap/score colors update as expected
- [ ] Score and feedback are visually correct after slot changes

## Edge Cases

- [ ] App handles empty state (no commitments, no slots) gracefully
- [ ] App handles switching commitments with different data
- [ ] No data loss after migration or major update

---

**Tip:**

- Run through this checklist after every major change.
- If you find a bug, add a note or a new checklist item.
- Update this file as you add new features!
