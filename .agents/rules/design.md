---
trigger: always_on
---

---
name: ActionFlow AI
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#23005c'
  on-tertiary-container: '#9466ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system for ActionFlow AI focuses on high-performance productivity, blending the reliability of a traditional SaaS platform with the fluid intelligence of modern AI. The design language is rooted in **Modern Corporate Minimalism**, emphasizing extreme clarity, generous whitespace, and purposeful motion.

The target audience consists of power users and knowledge workers who require a tool that feels both authoritative and assistive. The UI should evoke a sense of "calm control"—it is quiet when the user is focused and vibrantly helpful when the AI is active. To differentiate from standard utilities, the design system utilizes "AI Accents" through subtle gradients and layered glass components to highlight synthesized insights and automated actions.

## Colors

The palette is anchored by a high-contrast foundation of **Dark Navy (#0F172A)** text on a **Pure White** or **Slate-50 (#F8FAFC)** background. This ensures maximum legibility and a professional atmosphere.

AI-driven features are distinguished by a signature pairing of **Soft Blue (#3B82F6)** and **Vivid Purple (#8B5CF6)**. These colors should be used sparingly for "magic" moments: AI suggestions, automated workflow paths, and synthetic insights. Semantic status indicators follow standard industry patterns to ensure instant cognitive recognition of system states, using accessible shades of green, amber, and red.

## Typography

This design system utilizes **Inter** for all interfaces. Inter’s tall x-height and systematic spacing provide the neutral, functional clarity required for data-dense productivity tools. 

Headlines use tighter letter spacing and heavy weights to create a strong visual hierarchy. Body text is optimized for long-form reading with a generous 1.5x line height. Labels are occasionally used in uppercase with slight tracking to differentiate metadata from primary content.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid** model. On desktop, content is contained within a 1280px central track using a 12-column grid. Mobile views transition to a single-column fluid layout with 16px side margins.

A strict 8px spatial grid governs all padding and margins. Spaciousness is a priority; use "stack-lg" (32px) to separate major sections, and "stack-md" (16px) for internal card components. Negative space should be used aggressively to prevent the AI-driven data from feeling overwhelming.

## Elevation & Depth

This design system uses **Tonal Layering** combined with high-precision **Ambient Shadows**. 

- **Level 0 (Base):** Pure White (#FFFFFF).
- **Level 1 (Cards):** 1px border (#E2E8F0) with a very soft, diffused shadow (0px 4px 20px rgba(15, 23, 42, 0.05)).
- **Level 2 (Modals/Popovers):** Deeper shadow (0px 12px 32px rgba(15, 23, 42, 0.12)) and a subtle 0.5px border.

AI-generated components may use a **Glassmorphism** effect: a backdrop blur of 12px with a 10% white tint to indicate "active processing" or "suggestion" layers that float above the primary workflow.

## Shapes

The design system employs a distinctively rounded aesthetic to soften the professional tone. 
- **Standard UI Elements:** 0.5rem (8px) for buttons and inputs.
- **Primary Cards:** 1.5rem (24px) for the "2xl" look requested, creating a friendly, modern container feel.
- **Workflow Nodes:** Fully rounded (pill) for status indicators and priority chips.

## Components

### Buttons & Inputs
Buttons use a solid navy fill for primary actions and a soft blue ghost style for secondary AI-suggested actions. Input fields are large (48px height) with a subtle slate border that glows Soft Blue on focus.

### Guided Workflow Indicators
Visual steps are represented by a vertical or horizontal line of connected nodes. Completed steps use a Success Green check; the active step pulses with a Blue/Purple gradient glow.

### Confidence Badges
Small, pill-shaped tags used alongside AI suggestions. They display a percentage (e.g., "98% Match") using a subtle secondary-color background tint and navy text.

### Priority Chips
High-contrast labels for task management. 
- *High:* Red text on pale red background.
- *Medium:* Amber text on pale amber background.
- *Low:* Slate text on pale slate background.

### Comparison Cards
Side-by-side containers used for AI "Before vs. After" or "Option A vs. Option B" scenarios. These feature a 24px corner radius and a subtle vertical divider. The AI-recommended option is highlighted with a 2px purple gradient border.

### Progress Bars
Slim, 6px-height bars. The track is light slate; the progress fill is a linear gradient from Blue to Purple to signify "Active Thinking."