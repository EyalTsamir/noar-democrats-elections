# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static election website for the Noar HaDemocratim (נוער הדמוקרטים) youth movement, 2026. The entire site is in **Hebrew, RTL, mobile-first**. Built with React 19 + TypeScript + Vite, deployed as a static build (targeting GitHub Pages).

## Commands

```bash
npm run dev      # dev server
npm run build    # tsc -b && vite build → dist/
npm run lint     # oxlint (not eslint)
npm run preview  # serve the built dist/
npm test         # vitest run (one-shot)
npm test -- shuffle          # run a single test file by name
npx vitest                   # watch mode
```

Test coverage is limited to pure utilities — [src/utils/shuffle.test.ts](src/utils/shuffle.test.ts) and [src/utils/electionPhase.test.ts](src/utils/electionPhase.test.ts). There is no component/DOM testing setup, so the phase engine is kept as pure functions precisely so it can be unit-tested.

Deploy is automatic: [.github/workflows/deploy.yml](.github/workflows/deploy.yml) runs lint → test → build → publish to GitHub Pages on every push to `main`. Lint and test failures block the deploy, so keep both green.

## Architecture

The core design decision is a **content layer separated from code**: non-developers edit only [src/content/](src/content/) and everything else updates automatically.

- [src/content/types.ts](src/content/types.ts) — interfaces for all content (`Candidate`, `ElectionConfig`, `CommitteeGroup`). Heavily commented in Hebrew as editor documentation.
- [src/content/electionConfig.ts](src/content/electionConfig.ts) — site texts, election dates/times, voting URL. Many fields are intentionally empty strings meaning "not yet determined"; pages render placeholder text for them.
- [src/content/candidates.ts](src/content/candidates.ts) — candidate list (currently empty; a full commented example shows the format). Adding an entry automatically creates the home-page card, the `/candidate/:slug` page, and the nav-drawer link.
- [src/content/committee.ts](src/content/committee.ts) — election committee.
- [src/content/infoSections.ts](src/content/infoSections.ts) — ordered sections of the `/info` (election info) page. Each section fills only what it needs (`events` / `bullets` / `paragraphs`); the two main texts (eligibility, voting method) live in `electionConfig.ts` and are pulled in here.
- [src/content/phaseCopy.ts](src/content/phaseCopy.ts) — home-page Hero texts per election phase (countdown headings, voting-day copy, closed-screen copy). Editing here changes what the auto-switching Hero says without touching logic.

Candidate photos live in `public/candidates/` and are referenced by **file name only**; [src/utils/candidateImage.ts](src/utils/candidateImage.ts) prefixes `import.meta.env.BASE_URL`.

Routing: **HashRouter** (from `react-router` v8 — not `react-router-dom`) with routes defined in [src/App.tsx](src/App.tsx). Combined with `base: './'` in [vite.config.ts](vite.config.ts), this makes the site work from any subpath on static hosting. Do not switch to BrowserRouter or absolute base without accounting for that.

**Candidate order is randomized for fairness.** [src/components/CandidateOrderProvider.tsx](src/components/CandidateOrderProvider.tsx) wraps the app and re-shuffles the candidate list (Fisher–Yates, [src/utils/shuffle.ts](src/utils/shuffle.ts)) once per navigation — keyed on `location.key`, so ordinary re-renders (e.g. opening the nav drawer) don't reshuffle. Consumers read the shared order via `useCandidateOrder()` so the home page and nav drawer always agree. Render candidates via the hook, not the raw source-order `candidates` array.

**The home-page Hero auto-switches by election phase.** The site walks through five phases derived purely from the dates/times in `electionConfig.ts`: `before-registry-close` → `before-debate` → `before-voting` → `voting-open` → `voting-closed`. The engine is [src/utils/electionPhase.ts](src/utils/electionPhase.ts) — pure functions (no React, no DOM, no `import.meta`) so they stay unit-testable. Boundaries are computed as absolute moments in the election timezone (`Asia/Jerusalem`) via **Luxon**, so the countdown is correct regardless of the visitor's local clock or region. Phase comparison is strict-less-than on millis (at the exact boundary you're already in the next phase); invalid/empty dates fall back to the first phase rather than mis-inferring "voting closed".

The live clock is [src/utils/useNow.ts](src/utils/useNow.ts): `useNow()` ticks each second by recomputing `base + real-elapsed` (not a decrementing counter), so it stays accurate across tab-suspend/sleep; `useElectionPhase()` returns `{ now, phase }`. The countdown itself ([Countdown.tsx](src/components/Countdown.tsx)) is re-derived each tick via `getCountdownParts`. When adding a phase (e.g. a planned `results-published`), extend `ElectionPhaseId`, the boundary logic, `phaseCopy.ts`, and the `HeroContent` switch together.

**Dev-only time simulation.** In dev, a `?now=<ISO>` query param (parsed in Israel time) overrides the clock, and [DevPhasePanel.tsx](src/components/DevPhasePanel.tsx) renders jump-links to just-before / exactly / just-after each boundary. Both are gated on `import.meta.env.DEV`, so the entire branch is stripped from the production build — this is not a public phase control.

Styling: CSS Modules per component/page, all values drawn from design tokens in [src/styles/tokens.css](src/styles/tokens.css) (single source of truth for colors, spacing, type scale, motion). CSS variables can't be used in `@media` queries, so breakpoints (480/768/1024px) are documented in tokens.css and written literally in module files. Global reset, focus styles, skip link, and `prefers-reduced-motion` handling are in [src/styles/global.css](src/styles/global.css).

The Heebo font is bundled via `@fontsource-variable/heebo` — no runtime network dependency.

## Conventions

- **Comments are written in Hebrew** throughout the codebase — follow this in new code. Content files double as editing instructions for non-technical maintainers, so keep their comments beginner-friendly.
- RTL first: use logical CSS properties (`inline-size`, `margin-block-start`, `inset-inline-start`), never left/right physical properties. Shadows are symmetric to stay direction-neutral.
- Accessibility is deliberate: skip link with manual focus (anchor hashes would collide with HashRouter), visible `:focus-visible` outlines, `.visually-hidden` utility, reduced-motion support, WCAG-contrast token colors. Preserve these when touching UI.
- No semicolons, single quotes (match existing style).
