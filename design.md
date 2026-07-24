# Vectorline — Design System

## Overview
Vectorline is a speculative technical console designed to translate ambiguous ideas into functional structural patterns. The design language is characterized by a "dark mode" aesthetic, using a deep space backdrop with sophisticated glassmorphism, precise 3D elements, and cinematic typography. The interface feels like a high-end technical instrument rather than a standard web application.

## Design Tokens

### Colors
- **Background**: Deep space void `#070707`
- **Primary Accent**: Electric Indigo `#818CF8`
- **Selection Highlight**: Warm Gold `#e8c382`
- **Grays (Neutral scale)**:
  - Text primary: `white`
  - Text secondary: `zinc-400` (`#a1a1aa`)
  - Text tertiary: `zinc-500` (`#71717a`)
  - Borders/dividers: `white/10` or `white/5`

### Typography
- **Display Headings**: *Bebas Neue* (Tight tracking, uppercase, impactful)
- **Body & UI**: *Manrope* (Clean, modern sans-serif for readability at small sizes)
- **Alternate Serif**: *Gloock* (Used for specific editorial flourishes if needed)
- **Tracking**: Tight tracking (`tracking-tight` or `tracking-tighter`) is used consistently across headings to create a dense, engineered feel.

## Layout & Architecture
- **Shell**: The main content is contained within a max-width shell of `max-w-7xl`.
- **Frame-section Pattern**: Sections are frequently wrapped in a "frame" box with a distinct linear-gradient background (e.g., `rgba(24,24,27,0.3)` to `rgba(10,10,10,0.6)`) and an inset shadow that acts as a subtle bezel.
- **Accents**: 
  - *Corner brackets*: Thin L-shaped border accents at the corners of major frames.
  - *Corner dots*: Small `2x2` pixel dots placed in the corners of critical active zones.
  - *Grid overlays*: Blueprint-style grids (e.g., 2rem or 4rem spacing) layered behind 3D canvases to reinforce the architectural theme.

## Components

### Buttons
- **Dark Glass Buttons**: Dark gradient with a sharp top inner-shadow (white) and deep bottom inner-shadow (black). Used for secondary actions (e.g., "Log in").
- **Light Metallic Buttons**: Bright, silvery gradient with an inner glow. Used for primary calls to action (e.g., "Open console", "Start mapping").

### Badges & Cards
- **Pill Badges**: Pill-shaped indicators (e.g., "Diagnostic layer active") using dark glass styling with a pulsing dot.
- **Label Cards**: Small floating labels (e.g., "Sync mesh") overlaid on 3D scenes to denote system architecture.
- **Metric Cards**: Data-heavy cards displaying vital stats (Event Volume, Payload Size) with horizontal progress bars in semantic colors.
- **Protocol Rows**: List items featuring a numbered step badge (`01`, `02`) that change border color and icon color on hover.

## Motion & Interaction

### Smooth Scrolling
Powered by **Lenis** with a duration of `1.2s` and a custom easing curve: `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`.

### GSAP Animations
- **Heading Word Reveal**: Headings are split into words and revealed on scroll (`y: 100`, `opacity: 0`, `blur: 12px` to `0`).
- **Fade Up**: Paragraphs, buttons, and detail elements gently fade and slide up (`y: 24`, `opacity: 0`).
- **Staggers**: Metric cards, asset cards, and architecture cards are revealed with a staggered delay (`stagger: 0.15` or `0.2`) as they enter the viewport.
- **Parallax**: Background images slowly scrub vertically between `-15%` and `15%` based on scroll position.

## 3D Specifications (Three.js)

### Hero Wireframe Canvas
- **Camera**: PerspectiveCamera (FOV 45)
- **Elements**: Twin rotating torus rings, central wireframe boxes, and 8 orbiting nodes.
- **Materials**: `LineBasicMaterial` with varying opacities for depth.
- **Animation**: Continuous subtle rotation (`y += 0.004`, `x = sin(time)*0.08`), with elements gently bobbing vertically based on sinusoidal time functions.

### Core Architecture Scenes
- **Camera**: OrthographicCamera (isometric perspective).
- **Lighting**: AmbientLight (0.4) + DirectionalLight (0.8) + PointLight at origin (Accent color, intensity 2).
- **Materials**: 
  - Base: `MeshStandardMaterial` (`#18181b`, roughness 0.8, metalness 0.2)
  - Accent: Emissive `MeshStandardMaterial` (`#818CF8`) pulsing over time.
- **Variants**:
  1. *Lattice*: Central cylinder with rotating rings.
  2. *Consensus*: A network of nodes connected by dark wires to a central box.
  3. *Access*: A flat platform with isolated clusters.
  4. *Audit*: Stacked slabs bobbing in a sequence.

## Implementation Notes
- **Framework**: Next.js 14 App Router.
- **Styling**: Tailwind CSS with arbitrary values utilized extensively for complex gradients and shadows.
- **Icons**: Iconify web component (`iconify-icon`) used for lightweight, consistent iconography.
- **Structure**: Components are broken down into logical sections (`Hero`, `Architecture`, `Signals`) and imported into `app/page.tsx`. `AnimationRoot.tsx` handles all global client-side motion (GSAP/Lenis) once the DOM has hydrated.

## Accessibility Notes
- All images include descriptive `alt` tags.
- The UI heavily relies on color and contrast; ensure the text against dark gradients maintains sufficient contrast.
- Custom form inputs (e.g., search) are associated with `sr-only` labels.
- Motion can be intense; consider respecting `prefers-reduced-motion` queries by disabling the GSAP ticker if preferred by the user.
