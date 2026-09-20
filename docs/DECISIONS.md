# Decisions of SigueMX (Week 6)

Date: 20 September 2026  
Scope: Adaptive behavior loop implemented. Voice input is still not implemented.

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

- ADAPT, voice input, and adaptive logic — not started
- Further commits and two deployments — still required later
- Mechanical and persona tests — after ADAPT exists

## Phone-first foundation — 20 September 2026

Built welcome, STOP, intensity disclosure, ACT → COORDINATE → ADAPT progress labels, and synthetic family setup (Mariana, Elena, Diego). Responsibilities are editable; names and ages stay as the demo household. Empty, too-short, and too-long responsibilities are blocked.

The three rehearsal modes, Three.js scene, voice input, and adaptive engine are still not implemented. Progress is visual only.

`npm run build` succeeded. Validation checks passed for default, empty, short, and long responsibility text. The in-IDE browser tools were unavailable this session, so the click-through UI was not exercised in a real viewport.

## ACT rehearsal — 20 September 2026

ACT is a night earthquake decision for the synthetic household. The prompt does not tell the user to help Elena; the three options are: go to Elena, wait for Mariana, or move yourself. Measurement records the choice, response time from when options appear (STOP time is subtracted), and whether Elena’s care was assumed without prompting. One behavioral finding is shown. No survival score.

**Visual tradeoff:** ACT uses a simple CSS night-home scene, not Three.js. A full 3D scene would have delayed this milestone without changing the decision, timing, or finding. Three.js remains in the stack for a later interacting Dragon Stack slice.

COORDINATE, ADAPT, voice input, and the adaptive repeat loop are still not implemented. “Make another ACT decision” repeats the same ACT screen; it is not the adaptive modified scenario.

## COORDINATE rehearsal — 20 September 2026

COORDINATE places the synthetic family apart: Mariana at work (unreachable), Elena at home, Diego at school. One decision tests whether they follow the saved plan without the coordinator. Options: follow the plan now, wait for Mariana, or send Diego to Elena even if that is not the plan.

The finding compares the choice with the actual setup text (keyword signals on responsibilities). Default Diego text (“do not wait only for Mariana”) treats waiting as a mismatch and following the plan as a match. No preparedness or survival score.

**Limitations:** Plan comparison is English keyword matching, not a full language model. Locations are a CSS map, not Three.js. Repeating COORDINATE is the same scenario, not the adaptive loop.

ACT, welcome, STOP, and family setup are unchanged in behavior.

## ADAPT rehearsal — 20 September 2026

ADAPT uses one controlled uncertainty: the saved meeting point is unavailable. The original plan (including the meeting point from family setup, default “the neighborhood plaza”) is shown. Options: keep going to that place, wait for Mariana, or pick a nearby open alternative.

Repeating the blocked meeting point matches the original plan but is not adaptation. Choosing an alternative is a workable change. Waiting for instructions is neither repeating the failed point nor adapting. No preparedness or survival score.

**Tradeoff:** CSS blocked-plaza scene, not Three.js. **Limitation:** ADAPT is a single decision screen; repeating it is the same scenario, not the adaptive engine or modified-repeat loop.

ACT and COORDINATE remain available from the family-plan screen.

## Adaptive loop — 20 September 2026

After ACT, COORDINATE, and ADAPT each have one recorded decision, the engine reads those records and picks **one** weakness in this order:

1. `depends-on-coordinator` (waited for Mariana in any mode, including ADAPT “wait for instructions”)
2. `repeats-failed-plan` (kept going to the blocked meeting point)
3. `skips-elena` (ACT moved self first)

Mapped variations:

- coordinator → Mariana unreachable **and** original meeting point blocked
- failed plan → meeting point still blocked, backup place required
- skips Elena → Mariana unreachable, Elena still needs a first step

The user must change Diego’s written responsibility before **Rehearse again**. The second scenario is not a replay. Comparison uses the actual first and second decision labels, with response times. No preparedness or survival score.

**Limitations:** Keyword/choice-id rules only; three variations only; session memory (no Supabase); English plan-change text; repeating the original three modes still works independently.

Voice input is still not implemented.

## Remaining work

- Voice input — not started
- Mechanical and persona tests, two deployments — still required

## Next move

After approval, optional browser voice input that writes structured decision data, or first deployment.
