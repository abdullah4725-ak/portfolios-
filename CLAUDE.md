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
├── api/
│   └── chat.js         # Vercel serverless function (unused — chatbot is keyword-based)
├── files/              # ALL media assets (images + video)
│   ├── *.jpeg/png      # Backgrounds, icons, profile photo
│   └── *.mp4           # Hero background video
└── vercel.json         # Empty {} — lets Vercel auto-detect Node runtime
```

**Critical:** All media is in `files/`. Paths in HTML must use `files/<filename>`.

## Architecture

Pages are self-contained (all CSS/JS inline). Design tokens, nav, and footer are duplicated across all 4 pages — edit each file individually.

**Theme System:**
- Uses `html[data-theme="light"]` attribute.
- Tokens defined in `:root` (dark default) and `html[data-theme="light"]` (light override).
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
- Contact form (`faq.html`) — Web3Forms fetch, same access key
- Both send notification emails to `doctorabdullahpharmacist@gmail.com`
- No SDK needed — plain `fetch('https://api.web3forms.com/submit', ...)`

## Design Tokens

| Token | Dark (Default) | Light (`data-theme="light"`) |
|---|---|---|
| `--bg` | `#05050d` | `#fafafa` |
| `--bg2` | `#0d0d18` | `#ffffff` |
| `--bg3` | `#151520` | `#f0f0f5` |
| `--accent` | `#7c6fff` | `#5e4bd8` |
| `--accent2` | `#b39dff` | `#7c6fff` |
| `--text` | `#eeeeff` | `#1a1a24` |
| `--muted` | `#777799` | `#6a6a8a` |
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
- **Lead magnet** — "5 Signs" checklist. PDF must be sent manually after form notification (no auto-attachment yet)

## Deployment

- **Platform:** Vercel, auto-deploys from `master` branch on GitHub
- **Manual deploy:** `npx vercel --prod --yes` (use when GitHub auto-deploy lags)
- **Entry point:** `index.html`
- **Env vars:** `OPENAI_API_KEY` set in Vercel dashboard (used by `api/chat.js` — currently inactive)
- Paths must use `files/` (not `Portfolio/files/`) — repo root is the site root
