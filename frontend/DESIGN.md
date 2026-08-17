# Design System: NIRDC (National Initiative for R&D Commercialisation)

This document defines the single source of truth for the NIRDC frontend redesign, built on premium design engineering principles.

## 1. Visual Theme & Atmosphere
- **Concept:** Professional Trust meets Immersive Innovation. A clean, high-density, authoritative government interface redesigned to feel like a modern research-investment hub.
- **Density:** *Daily App Balanced* (Score: 6/10). Clean margins, compact forms, and structured layouts.
- **Variance:** *Offset Asymmetric* (Score: 6/10). Moving away from generic symmetric grids to asymmetric Bento grids.
- **Motion:** *Fluid CSS & Springs* (Score: 7/10). Snappy durations (<250ms), custom ease-out curves, tactile active scales, and staggered reveals.

## 2. Color Palette & Roles
We use a cohesive palette of slate neutrals with a single Gov-Blue accent (kept under 80% saturation to maintain authority without neon glare).

| Role | Token Name | Light Mode | Dark Mode | Function |
|---|---|---|---|---|
| Background | `--color-bg-canvas` | `#F8FAFC` (Slate-50) | `#090D16` (Deep Obsidian) | Canvas background |
| Surface | `--color-bg-surface` | `#FFFFFF` (White) | `#131B2E` (Deep Navy Gray) | Cards, panels, dialogs |
| Primary Text | `--color-text-main` | `#0F172A` (Slate-900) | `#F8FAFC` (Slate-50) | Headings and primary copy |
| Secondary Text | `--color-text-muted` | `#475569` (Slate-600) | `#94A3B8` (Slate-400) | Captions, secondary info |
| Gov-Blue Accent | `--color-accent` | `#0B4F9C` (Trusted Cobalt) | `#1D77D7` (Vibrant Cobalt) | CTAs, focus rings, links |
| Subtle Border | `--color-border-subtle`| `#E2E8F0` (Slate-200) | `#1E293B` (Slate-800) | Dividers, card borders |
| Star/Highlight | `--color-gold` | `#D97706` (Amber-600) | `#F59E0B` (Amber-500) | Star ratings, highlights |

## 3. Typography Rules
- **Display/Headings:** `Outfit` (Google Font)
  - *Styles:* Medium (500), SemiBold (600), Bold (700)
  - *Rules:* Track-tight (`tracking-tight`), line-height `1.2`.
- **Body Copy:** `Plus Jakarta Sans` (Google Font)
  - *Styles:* Regular (400), Medium (500)
  - *Rules:* Line-height `1.6`, maximum line length of `65ch` for optimal readability.
- **Numbers/Metadata:** `JetBrains Mono` (Google Font)
  - *Styles:* Regular (400), SemiBold (600)
  - *Rules:* Used for ID codes, timestamps, proposal metrics, and financial figures.
- **Banned Fonts:** `Inter`, `Roboto`, `Helvetica`, `Times New Roman`, and default system serif fonts.

## 4. Component Stylings
- **Buttons:**
  - Flat, premium surfaces (no heavy gradients).
  - Tactile feedback: `transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1)`.
  - Active state: `scale(0.97)` on press.
  - Interactive target size: Minimum `44x44px` padding area.
- **Cards:**
  - Soft, colored shadow: `shadow-[0_4px_20px_rgba(15,23,42,0.03)]` tinted to the slate background.
  - Subtle borders: `border border-border-subtle`.
  - Interaction: Lift on hover (`hover:-translate-y-1 hover:shadow-lg transition-all`).
- **Form Inputs:**
  - Labels positioned explicitly above the input box (never inside as placeholders).
  - Focus state: Clear `2px` gov-blue border with offset ring (`ring-2 ring-accent/20`).
- **Loaders:**
  - No infinite generic spinners. Use layout-matching skeletal shimmer animation (`animate-pulse`).
- **Empty States:**
  - No plain "No data" text. Structured guide illustrating how the user can submit research/investment requests.

## 5. Layout Principles
- **Grid-First Bento Layout:** Replacing symmetrical cards with asymmetrical layout grids (varying widths and spans).
- **Asymmetric Hero Section:** Left-aligned text hierarchy with typography accents and high-contrast primary CTA.
- **Banned Patterns:** Center-aligned hero layout, "3 equal cards side-by-side" design blocks, absolute-positioned overlapping copy.
- **Containment:** Layout constrained with a strict `max-w-7xl` (1280px) viewport margin container.

## 6. Motion & Interaction (Emil Kowalski Physics)
- **Duration Limit:** All UI micro-interactions must stay under `250ms`.
- **Easings:** Native CSS transitions with custom cubic-bezier curve: `cubic-bezier(0.23, 1, 0.32, 1)` (snappy ease-out). No `ease-in`.
- **Interruptible UI:** Use CSS transitions instead of keyframes to allow smooth animation reversals on rapid clicks.
- **Staggered List Entrance:** Proposal grid items and news cards enter using a staggered delay (`30ms` increment per item).
- **Origin-Aware Popovers:** Scale out from the click trigger (`transform-origin: var(--trigger-origin)`), not from the center.

## 7. Anti-Patterns (Banned AI Clichés)
- ❌ **No emojis** as functional icons (only clean SVG icons).
- ❌ **No pure black** (`#000000`) - use `--color-text-main`.
- ❌ **No neon glows**, outer shadow glows, or AI purple-to-pink gradients.
- ❌ **No custom mouse cursors**.
- ❌ **No fabricated metrics**, placeholder data, or fake "live performance statistics".
- ❌ **No AI copywriting clichés** ("unleash", "seamless", "next-gen", "revolutionize").
- ❌ **No scrolling chevron prompts** or "scroll to explore" text in the hero section.
- ❌ **No broken images** or missing avatar links.
