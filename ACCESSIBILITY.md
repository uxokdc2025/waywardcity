# Accessibility (a11y) — site-wide standard & QA gate
*Target: **WCAG 2.2 Level AA**, across the whole app. This is both a **dev best practice** (build it right the first time) and a **QA gate** (verify before "done"). A feature that isn't accessible isn't finished.*

Why it's non-negotiable: ~1 in 4 US adults has a disability, and under the ADA an inaccessible web product is real legal exposure. It also overlaps work we already do (alt-text, clear errors) — a moat, not a tax.

---

## How we check it: baseline once, then only what changed
We do **not** re-audit the whole site on every change. That doesn't scale and nobody does it.

1. **Baseline (one time):** audit the entire app to green against the checklist below. Record the date at the bottom of this file. That's our known-good line.
2. **Every change after that (the gate):** audit **only the surfaces you added or changed** in this PR — the new page, the edited component, the modified flow. Not the whole site.
3. **Exception — shared primitives ripple.** If a change touches something reused site-wide — the app shell / layout, the nav, global CSS / design tokens, toasts, or any shared UI primitive — re-check the surfaces that consume it, because one edit affects many pages.
4. **Full-site manual sweep** only at baseline, when a shared primitive changes, or on a periodic cadence (e.g. quarterly / before a launch).

**Two layers, different scope — this is the key to it being cheap:**
- **Automated (whole build, every time):** the project's lint step should run `jsx-a11y` (or the framework equivalent) — keep it at **zero errors**. Plus an `axe`/Lighthouse pass. Cheap, so it stays global.
- **Manual (scoped to the diff):** keyboard + screen-reader + contrast on the changed surfaces only. This is the part that scales by staying diff-scoped.

> Reality check: automated tools catch only ~30–40%. A green Lighthouse score is **not** "accessible." The manual pass on changed surfaces is where the real coverage comes from.

---

## The checklist (apply to each changed/new surface)

### The one rule that fixes most of it
**Use real semantic HTML.** A screen reader reads your markup structure, not your pixels. `<button>` for actions, `<a href>` for navigation, `<nav>/<main>/<h1>/<label>` for structure — that's a navigable outline. A pile of `<div onClick>` is an invisible wall. Reach for ARIA only to fill gaps native HTML can't, never to patch a div that should've been a button.

### Design (Figma / tokens)
- [ ] Text contrast **≥ 4.5:1** (≥ 3:1 large ≥ 24px / 19px bold). Holds in **both** light and dark if the app themes.
- [ ] Meaning **never carried by color alone** (status, errors, categories need an icon/label too — not just a colored dot).
- [ ] **Focus states designed** — a visible ring on every interactive element.
- [ ] Touch targets **≥ 44×44px**.
- [ ] Usable at **200% zoom** without content loss or horizontal scroll.

### Build (code)
- [ ] Actions are `<button>`, navigation is `<a href>` — not clickable divs.
- [ ] Every input has an associated `<label>` (or `aria-label` where no visible label can exist).
- [ ] Every image has `alt`; decorative uses `alt=""`. Meaningful icons have an accessible name.
- [ ] Icon-only buttons have `aria-label` (close ✕, hamburger, show-password eye, kebab menus).
- [ ] Headings in order — one `<h1>` per page, no skipped levels.
- [ ] Landmark regions: `<header> <nav> <main> <footer>`; a "skip to main content" link first in tab order.
- [ ] **Fully keyboard operable:** everything reachable/usable via Tab / Shift+Tab / Enter / Space / arrows, in a logical order, with a **visible focus ring** and **no keyboard traps**.
- [ ] **Overlays (modals, drawers, slide-overs, menus):** focus moves in on open, is **trapped** while open, `Esc` closes, focus **returns** to the trigger on close.
- [ ] Dynamic updates (toasts, live regions, async loading, validation) announced via `aria-live`.
- [ ] Respects `prefers-reduced-motion`.
- [ ] Errors identified **in text** at the field, describing the fix — not by color/position alone.

### CI / gate
- [ ] Lint clean, `jsx-a11y` (or equivalent) rules at zero.
- [ ] `axe` / Lighthouse a11y pass on the changed pages.

---

## The 4-step manual audit (run on changed surfaces before "done")
Automated tools catch only ~30–40%. **A green Lighthouse score is not "accessible."** The rest is minutes of manual testing:

1. **Automated** — lint + axe/Lighthouse; fix what they flag.
2. **Keyboard-only** — mouse away, `Tab` through the changed flow. Reach and operate everything? See the focus? `Esc` closes overlays? No dead ends?
3. **Screen reader** — VoiceOver (`Cmd+F5` on Mac) or NVDA (Windows) on the changed flow. Every control announced with a real name? Headings form a sensible outline?
4. **Contrast + zoom** — spot-check contrast and 200% zoom on the changed surface.

Log anything deferred — silent gaps read as "done" when they aren't.

---

*Baseline audit: not yet run — schedule the first full-site pass and record the date here.*
