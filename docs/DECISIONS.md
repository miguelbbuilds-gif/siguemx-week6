# Decisions of SigueMX (Week 6)

Date: 20 September 2026  
Scope: Persona test. User-facing MVP translated to everyday Mexican Spanish.

## Why this folder is a new project

Week 6 is **SigueMX — Rehearse Before Reality**, a phone-first family disaster rehearsal MVP. Week 5 is a different product slice and must not be modified or reused. This folder started empty.

## Why Vite + React + TypeScript + Three.js

Those are the approved architecture and Dragon Stack conditions. Adaptive logic will be constrained TypeScript rules later. Voice input, if used, will be the browser Web Speech API later. No state library, no React Three Fiber, no speech SDK, and no AI API were added.

The three Dragon Stack pieces must interact in one product, not as separate demos.

## Why the first Vite scaffold was corrected

`create-vite` in this folder produced a vanilla TypeScript app (the `react-ts` template flag did not apply). React, React DOM, `@vitejs/plugin-react`, and React type packages were installed next, and the entry was switched to `src/main.tsx` + `src/App.tsx`. That is setup correction, not product work.

## Why those folders exist

The layout keeps one place each for:

- `src/data` — ONE fictional family
- `src/domain` — types and the three modes
- `src/adaptive` — ONE adaptive repeat loop
- `src/measurement` — observable behavior measurement
- `src/voice` — optional browser voice input
- `src/scene` — Three.js rehearsal
- `src/ui` — phone-first screens

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

Historical note: later slices added ADAPT, the adaptive loop, voice, and 3D. Deployments remain gated.

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

Voice input and the 3D ACT/repeat scene are implemented in the Dragon Stack slice below.

## Dragon Stack — 20 September 2026

ACT uses one lightweight Three.js room (cylinders and spheres, no likenesses, no injuries). A spoken **or** tapped choice becomes the same `ActRecord` (`recordActDecision`), which feeds measurement and `runAdaptiveEngine`. The modified **Rehearse again** screen uses the same renderer with a visible variation: Mariana hidden when the coordinator is unreachable; a red blocker and/or green backup marker when the meeting place is blocked; Diego eases toward Elena, the door, or the backup marker after the decision.

Voice uses the browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) when present. Speech is mapped to the three ACT options with English keywords (`matchActSpeech`). The recognized transcript and matched label are shown before **Confirm this decision**. Confirm uses the same `choose` path as tap, including response time (timer starts when ACT options appear; STOP pause is subtracted). If speech is missing, permission is denied, recognition errors, or the phrase does not match, tap still works. Voice is never required to finish ACT.

**Voice limits:** Chrome and Edge are the practical browsers. Safari support is incomplete or prefixed; Firefox often has none. Recognition is `en-US` only, on-device/browser quality, not a vendor SDK. Noisy rooms, accents, and mixed phrases (Elena + wait) can mis-map; unmatched speech never auto-commits. Microphone permission can be denied; the UI then tells the user to tap. HTTPS or localhost is required. This automation cannot prove a real microphone in every environment.

**3D tradeoffs:** One small WebGL canvas (~10.5rem tall) on the phone layout, not a city, physics world, or WebXR/headset path. No React Three Fiber. Pixel ratio is capped at 2. If WebGL construction fails, the older CSS night room is shown. COORDINATE and ADAPT stay 2D CSS maps so the stack stays usable on a normal phone. The scene is a rehearsal cue, not a disaster generator. Simulated movement does not prove real-world survival.

STOP still overlays the app, pauses ACT/repeat timers, and freezes the 3D loop without disposing the renderer until the screen unmounts. Intensity disclosure remains.

COORDINATE and ADAPT remain independently reachable from the family-plan screen.

## GitHub publishing — 20 September 2026

This Week 6 project is a **new** repository. Week 5 was not modified.

Published as **siguemx-week6** on GitHub:

- Repository: https://github.com/miguelbbuilds-gif/siguemx-week6
- Branch pushed: `master`
- Remote: `origin` (`https://github.com/miguelbbuilds-gif/siguemx-week6.git`)

`.gitignore` excludes `node_modules`, `dist`, `*.local`, `.env`, and `.env.*`. No secrets or real personal data are tracked. Demo household names remain synthetic.

Vercel deployment is **not** part of this step.

## Mechanical test — 20 September 2026

Public URL tested: https://siguemx-week6.vercel.app (phone-width metrics 390×844).

**Performed on the live site**

- Welcome: STOP visible; intensity disclosure present; synthetic Mariana/Elena/Diego; no preparedness/survival/fear score; copy says practice does not predict real-world survival.
- Family setup: too-short Mariana text (`x`) was blocked with “Write a bit more so the family knows what to do.”
- Restore demo plan + save reached **Family plan saved** with ACT / COORDINATE / ADAPT start buttons.

**Bug (reproduced)**

- Steps: open the public app → Set up this family → Save family plan.
- Expected: after the plan is saved, the header should not say rehearsals have not started.
- Actual: Ready still showed `Family setup · rehearsals not started` (same string as the empty welcome screen). Completing ACT would keep that lie, because Ready/welcome never pass a mode into the chrome.
- Root cause: `AppChrome` defaults to that string whenever `currentMode` is null. Only ACT/COORDINATE/ADAPT set a mode; Ready, setup, and welcome after a saved plan do not.
- Fix: `progressNote()` now reports `Family plan · no decisions yet`, `Family plan · recorded: ACT`, or `Family plan · three modes recorded` from the actual session records.

**Not finished in this agent browser (MCP dropped mid-flow)**

Voice with a real microphone, COORDINATE, ADAPT, the adaptive repeat + comparison, STOP during an open choice list, denied-mic UI, and refresh after a recorded decision need a manual pass on the phone. Session memory is still in-memory only: a full reload returns to welcome.

## Remaining work

- Persona test complete; Spanish UI shipped in this slice

## Next move

Wait for approval of the Spanish usability fix.

## Persona test — 20 September 2026

Persona: **Doña Mari**, 54, vende comida afuera del metro en la Ciudad de México. Usa WhatsApp, desconfía de apps nuevas, lee despacio y puede abandonar en silencio si no entiende.

**Confusión real:** entendió que SigueMX ayuda a practicar decisiones de emergencia, pero la interfaz en inglés la dejó insegura de qué hacer y de si le pedían datos de una familia real. Le resultaron extraños: *synthetic demo family*, *rehearse*, *institutional drills*, *real-world survival*, *intensity*, *family coordinator*.

**Problema priorizado:** la experiencia no estaba en español cotidiano.

**Cambios:** toda la interfaz visible pasó a español mexicano claro. CTA principal **Empezar práctica**. Familia de ejemplo y aviso de que no hay que escribir datos reales. **DETENER** visible. “Qué esperar de esta práctica” en lugar de *intensity*. ACT / COORDINATE / ADAPT se quedan por dentro; la persona ve Decidir / Separados / Otro plan. El reconocimiento de voz pide `es-MX` y palabras en español; el toque sigue siendo suficiente. Las reglas del motor no cambiaron; solo se añadieron señales en español para el plan escrito.

**Verificación:** `npm run build`; chequeos de voz en español y de encabezado; flujo de toque en el navegador del agente cuando esté disponible.

**Límites:** el reconocimiento de voz en español depende del navegador; Safari/Firefox varían. Un recargo de página sigue borrando la sesión. Los documentos internos del paquete pueden seguir en inglés.
