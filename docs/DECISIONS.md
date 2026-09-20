# Decisions of SigueMX (Week 6)

Date: 20 September 2026  
Scope: phone-first foundation (welcome + family setup). ACT, COORDINATE, ADAPT, voice, and adaptive logic are still not implemented.

## Why this folder is a new project

Week 6 is **SigueMX — Rehearse Before Reality**, a phone-first family disaster rehearsal MVP. Week 5 is a different product slice and must not be modified or reused. This folder started empty.

## Why Vite + React + TypeScript + Three.js

Those are the approved architecture and Dragon Stack conditions. Adaptive logic will be constrained TypeScript rules later. Voice input, if used, will be the browser Web Speech API later. No state library, no React Three Fiber, no speech SDK, and no AI API were added.

The three Dragon Stack pieces must interact in one product, not as separate demos.

## Why the first Vite scaffold was corrected

`create-vite` in this folder produced a vanilla TypeScript app (the `react-ts` template flag did not apply). React, React DOM, `@vitejs/plugin-react`, and React type packages were installed next, and the entry was switched to `src/main.tsx` + `src/App.tsx`. That is setup correction, not product work.

## Why placeholder folders exist

The approved layout reserves one place each for:

- `src/data` — ONE fictional family
- `src/domain` — types and the three modes
- `src/adaptive` — ONE adaptive repeat loop
- `src/measurement` — observable behavior measurement
- `src/voice` — optional browser voice input
- `src/scene` — Three.js rehearsal
- `src/ui` — phone-first screens

Those files are comments only. ACT, COORDINATE, ADAPT, adaptive logic, voice input, and the 3D rehearsal are not implemented.

## Documentation decisions — packet family and diagrams

The ONE demo household is now named in `docs/PACKET.md` and labeled **synthetic**:

- Mariana, 46, mother and family coordinator
- Elena, 72, grandmother who may need assistance
- Diego, 15, son

Doña Mari remains the **persona tester**, not a fourth family member.

The adaptive rule in the packet states that the engine detects **one** behavioral weakness and changes the **next** rehearsal. Repeat must use a **modified** scenario, not an identical replay. That is a documentation constraint for later code. It is not implemented yet.

Mermaid flowchart and Mermaid swimlane were added to the packet. They are diagrams in markdown, not application screens.

## Packet sections confirmed present

Scope cut, global benchmark (with URL), three-year view, architecture, security floor, mechanical test plan, and persona test plan are in `docs/PACKET.md`.

## Packet-before-code complete — 20 September 2026

The Week 6 packet is complete:

- Synthetic family (Mariana, Elena, Diego)
- Five Blueprint conditions, Dragon Stack, shadow clause, benchmark, scope cut, architecture, security floor, test plan
- Mermaid flowchart and swimlane
- Image-generated mockup at `docs/mockup-siguemx.png`, embedded in `docs/PACKET.md`

## Remaining work

- Phone-first application foundation — next move
- ACT, COORDINATE, ADAPT, voice input, and adaptive logic — not started
- Further commits and two deployments — still required later
- Mechanical and persona tests — after the working slice exists

## Phone-first foundation — 20 September 2026

Built welcome, STOP, intensity disclosure, ACT → COORDINATE → ADAPT progress labels, and synthetic family setup (Mariana, Elena, Diego). Responsibilities are editable; names and ages stay as the demo household. Empty, too-short, and too-long responsibilities are blocked.

The three rehearsal modes, Three.js scene, voice input, and adaptive engine are still not implemented. Progress is visual only.

`npm run build` succeeded. Validation checks passed for default, empty, short, and long responsibility text. The in-IDE browser tools were unavailable this session, so the click-through UI was not exercised in a real viewport.

## Remaining work

- ACT, COORDINATE, ADAPT, voice input, and adaptive logic — not started
- Mechanical and persona tests — after those modes exist
- Two deployments — not started

## Next move

After approval, implement ACT only as a phone-first decision screen (no 3D, voice, or adaptive loop).
