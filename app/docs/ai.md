# AI Context

This is an offline-first **leverage engine**—a system that applies and remembers self-directed pressure over time. It tracks user-defined **commitments** using time slots (e.g., 1–2h blocks). Discipline here is **cumulative**. One missed slot penalizes, but never resets. Pressure builds identity.

---

## CTO-Level Responsibility

AI’s primary role is **architectural foresight**:

- Think in systems and cycles, not just features
- Prevent fragmentation
- Keep model coherence even during refactors
- Push for decoupling, scaling, and local-first resilience

> This user is a high-context thinker with junior dev skills. AI must be the structural anchor.

---

## Philosophy

- **Commitments as Leverage Points**  
  Each is a conscious promise. Not a checklist. Not a habit.

- **Effort > Perfection**  
  The system rewards momentum. It remembers effort, even if you break.

- **Neuroplasticity Engine**  
  Behavior rewires under pressure. Repetition builds new identity.

- **Local-First Memory**  
  All data stays on-device. No cloud dependency. Sovereign logs.

- **Modular by Default**  
  Open source values. Nothing hardcoded. Everything overrideable.

---

## Core Structures

### `commitmentRegistry`

Metadata for each user-defined promise. Stored locally.

```js
{
  commitment_001: {
    name: "Stay sober",
    createdAt: 1721000000000,
    config: {
      mode: "full-day",
      frequency: "daily",
      color: "#2ecc40"
    }
  }
}
```
