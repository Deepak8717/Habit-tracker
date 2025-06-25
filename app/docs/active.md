# Active Notes (WIP)

## Naming Shift: Habit → Commitment

- **Why:** “Habit” implies automation and repetition without thought. This system is built around **deliberate, conscious effort**.
- **Action:** Replace all `"habit"` references across UI labels, state keys, and schema with `"commitment"`.
- **Outcome:** Clearer framing. Future-proofed semantics for heavier use cases (sobriety, deep work, etc.).

---

## Schema Migration Plan

### Legacy Format

```js
{
  default: {
    slots: [2, 4, 6],
    score: 3,
    date: "2025-06-24"
  }
}
```

### New Format

```js
const commitmentRegistry = {
  commitment_001: { name: "Stay sober", config: {}, createdAt: 1721000000000 },
  commitment_002: { name: "Deep study", config: {}, createdAt: 1721500000000 },
};

const commitmentLog = {
  "2025-06-24": {
    commitment_001: { slots: [2, 4, 6], timestamp: 1722074000000 },
    commitment_002: { slots: [8, 10], timestamp: 1722074600000 },
  },
};
```

### Migration Notes

- **Decouple structure**: `commitmentRegistry` stores meta info and rules; `commitmentLog` stores daily pressure data.
- **Use commitment IDs as keys**: Prevent naming collisions; enable renaming without breaking data.
- **Flexible logic per commitment**: Scoring, bonuses, decay, and penalties can be added inside `config`.
- **Future-ready for multi-user context**: Commitments are unique per user, but logic scales across.

---

## Open Questions

- Should each log entry support metadata? (e.g., user notes, state of mind, environment tags)
- Should `config` support `decayRate` or `momentumWeight` for advanced scoring?
- What’s the minimum data needed to replay a user’s force history?
