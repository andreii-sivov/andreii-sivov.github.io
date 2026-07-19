# Andrei Sivov — Academic Portfolio (GitHub Pages)

A one-page academic portfolio, deployed as a static site to GitHub Pages
under the **user site** at `https://portfolio.github.io/` (repo must be
named exactly `portfolio.github.io`, source on the `main` branch, root).

## Source of truth (read before editing content or design)

- [`cv-info.txt`](cv-info.txt) — all real content: education, publications,
  conference talks, research/industry experience, grants, skills. Never
  invent credentials, dates, or publication details — pull them verbatim
  from this file. If something needed for the design isn't in here, ask
  rather than fabricate.
- [`design-description.txt`](design-description.txt) — the approved design
  concept, **"Red Sands Terminal"**. Treat this as the brief. Deviations are
  fine if they serve the brief better, but stay inside its aesthetic logic
  (retro-terminal / early-GUI, not generic "warm beige + serif" — see the
  note on genericness below).
- [`.claude/skills/frontend-design/SKILL.md`](.claude/skills/frontend-design/SKILL.md) —
  installed skill with process guidance for distinctive, non-templated
  design. Follow its brainstorm → plan → critique → build → critique loop
  before writing markup.
- [`assets/papers/`](assets/papers/) — the two available full-text PDFs
  (Beyond Clinical Vignettes; nostalgia affective-consequences paper). Link
  to these directly for the publications that have them; for publications
  without a local PDF, link out to the DOI/URL given in `cv-info.txt`.

⚠️ Note on genericness: the palette in `design-description.txt` (warm
cream/sand background + terracotta/rust text) is close to one of the
clustered "AI-default" looks the frontend-design skill warns against. It's
justified here because it's grounded in a specific reference (CRT amber/
monochrome monitors, early Mac UI) rather than chosen by default — lean
into that terminal/OS framing hard (window chrome, boot sequence, pixel
fonts, dithering) so it reads as deliberate, not templated.

## Tech stack

Plain **HTML/CSS/JS, no build step, no framework, no npm dependencies**.
GitHub Pages serves the repo root directly — keep it that way so
deployment is just "push to `main`."

- `index.html` — single page, all sections
- `css/style.css` — all styles; design tokens live in `:root` at the top
- `js/main.js` — boot sequence, draggable windows, typewriter effects,
  hover/glitch interactions (vanilla JS or a small dependency-free helper
  you write yourself — do not add jQuery/React/build tooling)
- `assets/images/` — portrait, project thumbnails (to be dithered — see
  below)
- `assets/papers/` — local PDFs for direct linking
- `assets/fonts/` — only needed if self-hosting; currently fonts are
  loaded from Google Fonts in `index.html` (VT323 for display, IBM Plex
  Mono for body). Switch to self-hosted `.woff2` here only if load
  performance becomes an issue.

## Design tokens (from design-description.txt)

| Token | Value | Use |
|---|---|---|
| `--sand` | `#F4E8D1` | background |
| `--rust` | `#8C2E1B` | text, borders, grid lines, illustrations |
| `--crimson` | `#B23A22` | accent, hover states, links, cursor `_` |
| `--font-display` | VT323 / VT323-style pixel font | headers, nav, silhouette keywords |
| `--font-body` | IBM Plex Mono / Courier Prime | resume content, abstracts, body copy |

Style rule: ALL CAPS for system/UI chrome (window titles, folder labels),
sentence case for human-readable content.

## Layout (3-column desktop grid, from design-description.txt)

1. **Left** — `BIOGRAPHY_EVENTS` timeline window + `SYSTEM_STATUS` widget
   (location, contact, "online" status)
2. **Center** — typographic silhouette built from research-interest
   keywords (LLM SAFETY, HUMAN-AI, DIGITAL NUDGING, QUANT METHODS,
   BEHAVIORAL, HCI), hover-glitch interaction
3. **Right** — `RESEARCH_PORTFOLIO.dir` (project cards with dithered
   thumbnails) + `PUBLICATIONS.lib` (list with Q-ratings/DOIs, `[ READ ]`
   links to `assets/papers/` or external DOI)

Collapse to a single stacked column below ~768px — this is a real
constraint to design for, not an afterthought; decide the collapse order
now rather than late.

## Interaction/motion (from design-description.txt)

- ~1.5s boot sequence on load (typed system-check lines) before revealing
  the interface
- Draggable window headers (vanilla JS drag, no jQuery UI dependency)
- Typewriter effect for bios/abstracts
- Respect `prefers-reduced-motion`: skip/shorten the boot sequence and
  typewriter effects for users who request reduced motion — this is a
  real accessibility requirement, not optional polish

## Workflow

1. Before building a section, restate its plan against the design brief
   (per the frontend-design skill's critique step) — don't skip straight
   to markup.
2. Build content-first: pull real copy from `cv-info.txt`, don't placeholder
   with lorem ipsum for anything that has real source data.
3. Test in-browser at each milestone (this repo has no dev server — open
   `index.html` directly, or serve locally with `python3 -m http.server`).
4. Check responsiveness (mobile/tablet/desktop) and `prefers-reduced-motion`
   before considering a section done.
5. Keep accessibility basics: semantic HTML landmarks, alt text on
   thumbnails/portrait, sufficient contrast (verify `--rust` on `--sand`
   and `--crimson` on `--sand` meet WCAG AA for body text size), visible
   focus states on draggable/interactive elements.

## Deployment

1. Create the GitHub repo `portfolio.github.io` (must match this exact
   name for a user site).
2. `git remote add origin git@github.com:portfolio/portfolio.github.io.git`
3. Push `main`. GitHub Pages auto-serves user-site repos from `main` /
   root — no `gh-pages` branch or `/docs` folder needed, no Pages config
   required beyond the repo name.
4. Site goes live at `https://portfolio.github.io/`.

## Do / don't

- Do keep everything static and dependency-free — this is a portfolio,
  not an app; a build step adds friction for near-zero benefit here.
- Do treat `cv-info.txt` as authoritative; ask before adding content not
  present there.
- Don't add a CSS framework (Tailwind/Bootstrap) — the design system here
  is small, opinionated, and bespoke; a framework fights it more than it
  helps.
- Don't commit large unoptimized images — dither/compress thumbnails
  before adding them to `assets/images/`.
