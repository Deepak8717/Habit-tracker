# Leverage

A tool to keep your promises to yourself—when things get heavy.
This isn’t a tracker. It’s a crowbar.  
You pull, you show up, and the system remembers. It doesn’t reset. It compounds.

---

## What It Does

- Divides your day into **fixed time slots** (e.g., 2-hour blocks)
- Tracks **effort** per slot—not tasks, not checklists
- Builds a **cumulative score** that never resets
- Visualizes your growth as a **living, colored pattern**
- Penalizes inconsistency—but never erases past effort
- Keeps your **internal accounting** of momentum, relapse, and resilience

---

## Why It Exists

Most systems shame you for slipping. One bad day and it’s like nothing ever happened.  
This one remembers. It rewards consistency. It respects the math of human change.

Even when you fall, your past effort stays on the books.  
You’re not starting over. You’re picking up where you left off.

> **Effort compounds. It’s never erased—only carried forward.**

---

## Philosophy

This is a **trainer for your nervous system**.  
You log your effort. You see it grow. And slowly, your brain rewires around the shape of showing up.

You become someone who shows up—not because of motivation, but because your score tells the truth.

> “Give me a place to stand, and I will move the world.”  
> — Archimedes

This app is that place.

---

## Naming

This project began as a habit tracker.  
Then it evolved into a commitment trainer.  
Now it’s **Leverage**—a tool to multiply force against what resists you.

No dopamine loops. No fake gamification. Just pressure applied precisely—until your inner system adapts.

---

## Dev Info

- Written in **plain JavaScript**, no frameworks
- Works **fully offline**—data lives in `localStorage`
- **Slot-based model**: core time unit = fixed slot (e.g., 2 hrs)
- **Modular design**: logic, views, storage, and UI are loosely coupled
- **Commitments don’t share logic**: each has its own rules, penalties, bonuses, and visual style
- **Optional Firebase sync** in `firebase.js` (isolated)

---

## Directory Structure

```text
index.html        # App entry point
main.js           # Binds modules and events

/app
  ├── store/       # Core logic: scores, slot mapping, commitment rules
  ├── calendar/    # Long-view heatmaps and growth visuals
  ├── ui/          # Popups and input interfaces
  ├── css/         # Design system (tokens, components, layout)
  ├── backup/      # Manual data export/import (JSON snapshots)
  └── utils.js     # Date formatting, slot helpers

firebase.js        # Optional sync layer (non-essential)

docs/
  ├── core.md      # Philosophy and design principles
  ├── system.md    # Technical overview, data flow, slot logic
  └── ai.md        # Project context for AI assistance
```
