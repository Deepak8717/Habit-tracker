# AI Context

This is an offline-first **leverage engine**—a system that applies and remembers self-directed pressure over time. It tracks user-defined **commitments** using time slots (e.g., 1–2h blocks). Discipline here is **cumulative**. One missed slot penalizes, but never resets. Pressure builds identity.

---

## Philosophy

- **Commitments as Leverage Points**  
  Each is a promise you keep. Nothing passive. No automation.
- **Effort > Perfection**  
  Slots penalize failure but preserve momentum.
- **Neuroplasticity Engine**  
  Repetition under tension rewires behavior.
- **Local-First Memory**  
  All data stays with the user. No cloud dependency.
- **No Lock-In**  
  Open source values. Modular, forkable, editable.

---

## Core Structures

### `commitmentRegistry`

Where all user-defined commitments live. Includes name and optional config (rules, weight, etc.).

```js
{
  commitment_001: { name: "Stay sober", createdAt: "2025-06-10", config: {} },
  commitment_002: { name: "Deep study", createdAt: "2025-06-15", config: { penalty: 2 } }
}
```

### `commitmentLog`

Logs applied pressure (slots) per date per commitment. Can be extended with score, tags, notes, etc.

```js
{
  "2025-06-24": {
    commitment_001: { slots: [2, 4, 6], timestamp: 1722074000000 },
    commitment_002: { slots: [8, 10], timestamp: 1722074600000 }
  }
}
```

---

## Code Style

- Functions declared first, called last
- Pure logic separated from interface
- Invite refactor, avoid tight coupling
- Code should describe pressure, not hide it

---

## Modules

- `/store`: state logic, slot system, scoring engine
- `/calendar`: visual feedback of applied force
- `/ui/popups`: adjust slots, apply scores
- `/firebase.js`: optional sync (fully isolated)
- `/main.js`: system boot, hydration, orchestration

---

## Final Word

This is a **neural force logger**. A version control system for who you're becoming. You apply pressure. The lever remembers. Over time, it shifts weight you didn’t think you could move.
