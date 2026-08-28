---
name: Mae Sariang Ops Console
colors:
  surface: '#13121b'
  surface-dim: '#13121b'
  surface-bright: '#393842'
  surface-container-lowest: '#0e0d16'
  surface-container-low: '#1b1b24'
  surface-container: '#1f1f28'
  surface-container-high: '#2a2933'
  surface-container-highest: '#35343e'
  on-surface: '#e4e1ee'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#e4e1ee'
  inverse-on-surface: '#302f39'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1d00a5'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#4d44e3'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#bec6e0'
  on-tertiary: '#283044'
  tertiary-container: '#586076'
  on-tertiary-container: '#d4dbf5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#13121b'
  on-background: '#e4e1ee'
  surface-variant: '#35343e'
  success: '#10B981'
  warning: '#F59E0B'
  critical: '#F43F5E'
  info: '#0EA5E9'
  surface-lighter: '#334155'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-margin: 24px
  gutter: 16px
  card-padding: 20px
  input-padding: 12px 16px
---

## Brand & Style

The design system embodies a **Modern Dashboard Console** aesthetic, specifically tailored for the technical and operational environment of the Mae Sariang Industrial and Community Education College. It targets a multi-role user base ranging from administrative staff to on-site technicians, requiring a balance between high-density information display and rapid-action mobile interfaces.

The visual direction is a blend of **Minimalism** and **Glassmorphism**, utilizing deep slate tones to reduce eye strain during prolonged use, while employing vibrant, functional color accents to signal status and urgency. The interface emphasizes clarity, reliability, and modern efficiency. Key characteristics include:
- **Professionalism:** A dark, structured environment that feels like a mission control center.
- **Responsiveness:** Fluid transitions between desktop monitoring and mobile field reporting.
- **Urgency-Aware:** High-contrast semantic colors that guide the user's attention to critical tasks without overwhelming the layout.

## Colors

The palette is anchored in a **Dark Slate** ecosystem to provide a sophisticated, low-glare foundation for long-term data management. 

- **Primary (Deep Indigo):** Used for primary actions, active navigation states, and key interactive elements.
- **Surface Strategy:** The background uses the deepest slate (`#0F172A`), while cards and containers use a lighter slate (`#1E293B`) to create depth without relying on heavy shadows.
- **Semantic Logic:**
    - **Emerald (Success):** Reserved for "Completed" (ซ่อมเสร็จสิ้น) and positive confirmations.
    - **Amber (Warning):** Denotes "Pending" (รอดำเนินการ) and Medium urgency.
    - **Rose (Critical):** Highlights "Critical" (วิกฤต) urgency and high-priority alerts.
    - **Indigo (In-Progress):** Represents active work states.

## Typography

The system utilizes **Be Vietnam Pro** for its modern, clean geometry and excellent legibility in both Thai and English. 

- **Hierarchy:** Strong weight differentiation is used to separate data labels from user-generated content. Headlines should use semi-bold or bold weights to stand out against the dark backgrounds.
- **Thai Language Optimization:** Line heights are increased by approximately 1.2x compared to standard Latin-only layouts to accommodate Thai diacritics without clipping.
- **Data Display:** For "Asset IDs" (เลขครุภัณฑ์) and technical codes, use `label-md` with medium weight to maintain a technical "console" feel.

## Layout & Spacing

The system follows a **Fluid Grid** model designed for responsiveness across devices.

- **Desktop (1280px+):** A 12-column grid with a fixed 260px Sidebar. Content is organized in modular cards that span 3, 4, 6, or 12 columns depending on information density.
- **Tablet (768px - 1024px):** Sidebar collapses into an icon-only rail or hamburger menu. Grid shifts to 8 columns.
- **Mobile (<768px):** A single-column flow with 16px horizontal margins. The sidebar transitions to a bottom navigation bar for high-frequency actions (Home, New Request, Tasks).
- **Rhythm:** A 4px baseline grid ensures consistent vertical rhythm. Standard component spacing uses multiples of 4 (8px, 16px, 24px, 32px).

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** rather than heavy shadows, maintaining a clean, high-tech look.

- **Level 0 (Background):** `#0F172A` - The canvas.
- **Level 1 (Cards/Surface):** `#1E293B` - Main content containers. Features a subtle `1px` border of `#334155` to define edges.
- **Level 2 (Modals/Overlays):** `#334155` - High-priority pop-ups with a `0px 10px 15px -3px rgba(0, 0, 0, 0.5)` micro-shadow to simulate lift.
- **Glassmorphism:** Navigation headers and mobile bottom bars use a background blur (`backdrop-filter: blur(12px)`) with 80% opacity of the secondary color to maintain context of the content scrolling beneath.

## Shapes

The shape language is consistently **Rounded**, which softens the "industrial" nature of the application and makes it feel more approachable and modern.

- **Cards & Major Containers:** Use `rounded-xl` (1.5rem / 24px) to create a distinct "pod" appearance.
- **Buttons & Inputs:** Use `rounded-lg` (1rem / 16px) for a comfortable touch target that aligns with the card's softness.
- **Status Badges:** Use fully pill-shaped (rounded-full) geometry to differentiate status indicators from clickable buttons.

## Components

### Buttons
- **Primary:** Deep Indigo background, white text. Large `px-6 py-3` for mobile-friendly tapping.
- **Secondary:** Transparent background with a `1px` border of `#334155`.
- **Status-Specific:** Small buttons used in the Technician Board (e.g., "Accept Task") should use the semantic color (Success/Indigo) but with a subtle 10% opacity background and 100% opacity text for a "ghost" effect.

### Input Fields
- **Style:** Background of `#0F172A` (inset look) with `#334155` borders. 
- **Focus:** 2px solid Deep Indigo border with a soft indigo glow.
- **Dropzone:** Dashed border using `#475569`, featuring a large Lucide "Camera" icon for easy photo reporting.

### Cards
- **Stat Cards:** Feature a large numerical value in the center, a semantic-colored icon in the top right, and a descriptive Thai label at the bottom.
- **Task Cards:** Include a thumbnail placeholder for the "Before" photo, a prominent Urgency Badge, and clear "Action" buttons at the footer.

### Status Badges
- **Logic:** Small, uppercase or bold Thai text.
- **Pending:** Amber text on Amber (10% opacity) background.
- **In Progress:** Indigo text on Indigo (10% opacity) background.
- **Done:** Emerald text on Emerald (10% opacity) background.

### Lists & Tables
- Table headers should be uppercase, low-contrast (`#94A3B8`), and use `label-sm`.
- Rows should have a subtle hover state (`#334155`) to indicate interactivity.