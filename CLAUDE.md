# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Professional personal portfolio website for **Muhammad Abdullah Khan** — AI Automation Builder. Features a robust Light/Dark Mode system, mobile-optimized animations, and localized content for AI agency services. Built with pure HTML/CSS/JS (no build tools).

## File Structure

```
/
├── index.html          # Homepage — Hero, Services, ROI, Credibility, Lead Magnet, Contact
├── pricing.html        # Pricing tiers & FAQ strip
├── faq.html            # Filterable FAQ accordion + contact form
├── notes.html          # Case Study detail page
├── assets/
│   └── styles.css      # Shared design tokens (light + dark) and global :focus-visible
└── files/              # ALL media assets (images only — no video currently)
    └── *.jpeg/png      # Icons, profile photo, og-image
```

**Critical:** All media is in `files/`. Paths in HTML must use `files/<filename>`.

## Architecture

Pages are self-contained for everything except design tokens. Tokens live in `assets/styles.css` and are linked from each page's `<head>`. Page-specific styles, nav, and footer are still duplicated inline across the 4 pages — those remain a "edit-each-file" target for future refactoring.

**Theme System:**
- Uses `html[data-theme="light"]` attribute.
- Tokens defined once in `assets/styles.css` (`:root` + `html[data-theme="light"]`). Page-local rules can still target `html[data-theme="light"] .selector` for component-specific overrides.
- JS at the bottom of each file persists choice via `localStorage`.
- **Visibility Fix:** Sub-pages use explicit light-mode CSS overrides (`color: #1a1a24 !important`) where variable inheritance is unreliable.

**JavaScript Features:**
- `IntersectionObserver` Scroll Reveal: adds `.visible` to `.reveal` elements on scroll.
- **Mobile Fallback:** 2.5s timeout forces `.visible` on all stuck `.reveal` elements (`revealAllFallback()`).
- ROI Calculator: monthly savings logic in `index.html`.
- Keyword Chatbot: 10-topic qualification agent in `index.html` (no API — pure JS).
- Smooth Scroll: via `scroll-behavior: smooth` + scroll-spy for active nav states.

**Forms:**
- Lead magnet form (`index.html`) — Web3Forms fetch, access key `bd0d37e4-179a-4f66-83b6-c0dcce38ecd7`
- Index contact form (`index.html`) — same key
- Contact form (`faq.html`) — same key
- All three send notification emails to `doctorabdullahpharmacist@gmail.com`
- All three use plain `fetch('https://api.web3forms.com/submit', ...)` with a 15s `AbortController` timeout, an inline error element (`#lmError` / `#icError` / `#formError`) that surfaces a "try again or WhatsApp" message on failure, and `Sending…` button state during submission.

## Design Tokens

Edit values in `assets/styles.css` — applies to all pages.

| Token | Dark (Default) | Light (`data-theme="light"`) |
|---|---|---|
| `--bg` | `#05050d` | `#fafafa` |
| `--bg2` | `#0d0d18` | `#ffffff` |
| `--bg3` | `#151520` | `#f0f0f5` |
| `--accent` | `#7c6fff` | `#5e4bd8` |
| `--accent2` | `#b39dff` | `#7c6fff` |
| `--accent3` | `#e879f9` | `#d15ce0` |
| `--text` | `#eeeeff` | `#1a1a24` |
| `--muted` | `#777799` | `#5a5a78` |
| `--border` | `#1e1e30` | `#e2e2ec` |

## Key Conventions

**Mobile Responsive Breakpoints:**
- `< 1024px` — 3→2 column transitions
- `< 768px` — hamburger menu, single-column stacks
- `< 480px` — H1 scaling, padding reductions

**Reveal Pattern:**
- `class="reveal"` with optional `reveal-delay-1` through `reveal-delay-6`
- Triggers when 10% of element is visible

**Theme Toggle:**
- `#themeToggle` button, swaps `#moonIcon` / `#sunIcon`

## Pages Summary

| Page | Key Sections |
|---|---|
| `index.html` | Hero Video · Marquee · Services · Process · ROI Calc · Credibility · Lead Magnet · Contact |
| `pricing.html` | 3 tiers (Audit / System / Stack) · FAQ strip |
| `faq.html` | Filterable 14-question accordion · Contact form (Web3Forms) |
| `notes.html` | Case study: Problem · Architecture · Results |

## Content Status

- **Profile photo** — live
- **Booking link** — `cal.com/drabdullahautomation/30min` active on all CTAs
- **Testimonials** — replaced with honest credibility section (no fake clients)
- **WhatsApp** — `+92326281281` live
- **Lead magnet** — "5 Signs" checklist. PDF must be sent manually after form notification — automate via Web3Forms autoresponse (dashboard) or a lightweight serverless endpoint when ready.

## Deployment

- **Platform:** Vercel, auto-deploys from `master` branch on GitHub
- **Manual deploy:** `npx vercel --prod --yes` (use when GitHub auto-deploy lags)
- **Entry point:** `index.html`
- Paths must use `files/` (not `Portfolio/files/`) — repo root is the site root

## Known Duplication (Future Refactor)

Each page still inlines its own copy of the nav HTML, footer HTML, mobile menu HTML, theme toggle JS, and IntersectionObserver reveal logic. They drift slightly per page, so they were left untouched in the recent refactor. Consolidate to `assets/shared.js` + an HTML include strategy (or a small static-site build step) once the variations are reconciled.
