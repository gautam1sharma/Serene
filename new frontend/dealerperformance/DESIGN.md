# Design System Strategy: Precision & Depth

## 1. Overview & Creative North Star
### The Creative North Star: "The Precision Architect"
Automotive retail is often cluttered and chaotic. This design system seeks to provide the antithesis: a high-end, editorial dashboard experience that treats data like a luxury asset. We move beyond the "standard SaaS" look by prioritizing **Environmental Depth** and **Asymmetric Balance**. 

Unlike rigid templates, "The Precision Architect" uses intentional negative space and layered surfaces to guide the user’s eye. It is sophisticated, clean, and authoritative—borrowing the functional elegance of tools like Linear and Stripe while maintaining the premium tactile feel of a high-end automotive brochure.

## 2. Colors & Surface Architecture
The color palette is rooted in deep slates and cool neutrals, moving away from pure blacks to create a softer, more professional visual range.

*   **Primary Brand Tone:** `primary` (#545F73) and `on-primary-fixed` (#354053) drive the core identity—stable, sophisticated, and serious.
*   **The "No-Line" Rule:** To achieve a premium look, designers are **strictly prohibited** from using 1px solid borders to section off major UI areas. Instead, define boundaries through background shifts. For example, a `surface-container-low` section should sit atop a `background` (#F7F9FB) to create a natural visual break.
*   **Surface Hierarchy & Nesting:** Treat the dashboard as a series of stacked, physical sheets of paper.
    *   **Base:** `background` (#F7F9FB).
    *   **Sections:** `surface-container-low` (#F0F4F7).
    *   **Cards/Primary Data:** `surface-container-lowest` (#FFFFFF).
*   **Signature Textures:** For high-impact areas (like the "Welcome" hero or CTA blocks), use a subtle linear gradient transitioning from `primary` (#545F73) to `primary-dim` (#485367). This provides a "soul" to the interface that flat colors cannot achieve.
*   **Glassmorphism:** For floating menus, dropdowns, or mobile overlays, use `surface-container-lowest` at 80% opacity with a `backdrop-filter: blur(12px)`.

## 3. Typography
We utilize a dual-font strategy to balance editorial character with functional data density.

*   **Display & Headlines (Plus Jakarta Sans):** Used for "moments of impact." This typeface provides a modern, geometric personality. Use `headline-lg` for dashboard greetings and `headline-sm` for section headers.
*   **Body & Labels (Inter):** The workhorse for data. Inter is used for its exceptional legibility at small sizes.
*   **The Weight Hierarchy:** 
    *   **Bold (700):** Only for `title-sm` or critical status labels.
    *   **Medium (500):** Default for body text to maintain "ink weight" on high-res screens.
    *   **Regular (400):** Reserved for long-form secondary descriptions.

## 4. Elevation & Depth
In this system, depth is a functional tool, not just an aesthetic choice. We avoid "structural" lines in favor of **Tonal Layering**.

*   **The Layering Principle:** Instead of outlining a card, place a `surface-container-lowest` card on top of a `surface-container-low` background. The subtle shift in hex code creates a cleaner, more sophisticated edge.
*   **Ambient Shadows:** When a card requires a "lift" (e.g., a hover state or a modal), use an extra-diffused shadow: `0px 12px 32px rgba(30, 41, 59, 0.05)`. Notice the shadow is tinted with the `on-surface` color, making it feel like natural ambient light.
*   **The "Ghost Border" Fallback:** If a divider is mandatory for accessibility, use the `outline-variant` token at **15% opacity**. Never use 100% opaque borders.
*   **Roundedness:** A strict `xl` (1.5rem/24px) or `lg` (1rem/16px) radius must be applied to all cards to soften the data-heavy environment and make the interface feel approachable.

## 5. Components
### Buttons
*   **Primary:** High-contrast `primary` background with `on-primary` text. Use a 4px vertical gradient for a "pressed" look.
*   **Secondary:** `surface-container-highest` background. No border.
*   **Tertiary:** Ghost style. No background/border until hover.

### Input Fields
*   **Layout:** Use `surface-container-low` as the input background rather than a white box with a border.
*   **State:** On focus, transition the background to `surface-container-lowest` and apply a subtle `primary` glow.

### Cards & Lists
*   **Rule:** Forbid the use of divider lines between list items. Use `spacing-6` (1.5rem) of vertical white space to separate rows.
*   **Status Chips:** Use 10% opacity of the status color (e.g., `error-container` for alerts) with a high-contrast text color (`on-error-container`).

### Automotive-Specific Components
*   **Inventory Cards:** Use `surface-container-lowest` with a high-aspect-ratio image slot. Use `label-sm` for VIN and stock numbers.
*   **Metric Tickers:** Large `headline-md` numbers with a `tertiary` (Blue) trend indicator.

## 6. Do’s and Don'ts

### Do
*   **DO** use whitespace as a separator. If in doubt, increase the spacing.
*   **DO** use duotone icons (Lucide/Phosphor) at a 1.5px stroke weight for a refined, custom feel.
*   **DO** nest containers using the surface-scale (Lowest > Low > High) to create natural hierarchy.
*   **DO** use semi-transparent backgrounds (10% opacity) for status badges to keep the UI light and airy.

### Don't
*   **DON'T** use 1px solid, high-contrast borders. It breaks the "premium editorial" feel.
*   **DON'T** use pure #000000 for text. Use `on-surface` (#2A3439) for a softer, more professional reading experience.
*   **DON'T** use sharp corners. Everything must adhere to the defined `roundedness` scale (8px to 24px).
*   **DON'T** clutter the dashboard. If a piece of data isn't vital, move it to a "View All" sub-page.