# Design System Document: Luxury Automotive Editorial

## 1. Overview & Creative North Star: "The Obsidian Gallery"
This design system is anchored by the Creative North Star of **"The Obsidian Gallery."** It treats the automotive customer portal not as a utility dashboard, but as a high-end digital showroom. We reject the "template" look of SaaS platforms in favor of an editorial layout that prioritizes atmosphere, depth, and tactile luxury.

To achieve this, the system breaks the rigid grid through **intentional asymmetry**—large, high-contrast serif headlines overlapping subtle frosted containers—and a focus on **Tonal Layering** over structural lines. The goal is to make the user feel as though they are navigating a physical space crafted from glass, charcoal stone, and polished silver.

---

### 2. Colors & Surface Architecture
The palette is a monochromatic study in shadows and light, utilizing the full breadth of the charcoal spectrum to create depth without relying on traditional borders.

#### The "No-Line" Rule
Explicitly prohibit 1px solid, high-contrast borders for sectioning. Boundaries must be defined solely through background color shifts. Use `surface-container-low` (#131313) sitting on a `background` (#0e0e0e) to define regions.

#### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to create nested depth:
*   **Base:** `surface` (#0e0e0e) for the primary canvas.
*   **Sections:** `surface-container-low` (#131313) for large content areas.
*   **Cards/Elements:** `surface-container-high` (#1f2020) for interactive components.
*   **Floating Elements:** `surface-container-highest` (#252626) for modals and menus.

#### The "Glass & Gradient" Rule
To move beyond a flat digital feel, use **Glassmorphism** for floating elements. 
*   Apply `surface_variant` (#252626) at 60% opacity with a `24px` backdrop-blur. 
*   **Signature Textures:** For primary CTAs, use a subtle linear gradient from `primary` (#c6c6c6) to `primary_container` (#464747) at a 135-degree angle to mimic the sheen of brushed aluminum.

---

### 3. Typography: The Editorial Voice
We pair the authoritative elegance of **Playfair Display** (notoSerif variant) with the technical precision of **Outfit** (plusJakartaSans variant).

*   **Display & Headlines (Playfair Display):** These are your "Hero" moments. Use `display-lg` to `headline-sm` for vehicle names and section titles. Encourage negative letter-spacing (-0.02em) for a tighter, more premium feel.
*   **Titles, Body, & Labels (Outfit):** Use `title-lg` down to `label-sm`. These provide the "technical data" feel—clean, legible, and modern. 
*   **Hierarchy Note:** Use `on_surface_variant` (#acabaa) for secondary body text to ensure the primary headlines command the most visual attention.

---

### 4. Elevation & Depth
In this system, hierarchy is felt, not seen. We move away from traditional drop shadows toward **Ambient Luminosity.**

*   **The Layering Principle:** Stacking tiers is mandatory. A `surface-container-lowest` card placed on a `surface-container-low` section creates a natural "recessed" effect that feels more architectural than a shadow.
*   **Ambient Shadows:** For floating elements (Modals/Dropdowns), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5)`. The shadow must never look "dirty"; it should feel like a natural absence of light.
*   **The "Ghost Border":** If a container requires definition against a similar background, use a 1px border with `outline_variant` (#484848) at **20% opacity**. This creates a "glint" on the edge of the glass rather than a containing box.

---

### 5. Components

#### Buttons
*   **Primary:** A "Metallic" variant. Background: Gradient of `primary` to `primary_container`. Text: `on_primary`. Shape: `md` (0.375rem) for a sophisticated, non-boxy look.
*   **Secondary:** Ghost style. Border: `outline` (#767575). Text: `primary`. 
*   **Tertiary:** Text only in `label-md` (Outfit), using all-caps with 0.1rem letter spacing for an "archival" feel.

#### Input Fields
*   **Style:** Forbid boxy, 4-sided borders. Use a "Floating Label" style with only a bottom stroke (`outline-variant`) or a very subtle `surface-container-high` background with a `sm` (0.125rem) corner radius. 
*   **Focus State:** The bottom stroke transitions to `primary` (Silver).

#### Cards & Lists
*   **Cards:** Forbid divider lines. Use `spacing-6` (2rem) of vertical white space to separate content chunks. Cards should utilize the Glassmorphism rule (Backdrop-blur + 60% opacity).
*   **Lists:** Items are separated by a subtle shift in surface color on hover (`surface_bright`) rather than a line.

#### Vehicle Status Chips
*   Small, `full` radius (capsule) shapes using `surface-container-highest`. Text in `label-sm` (Outfit) with a 2px silver dot indicator for "Active" states.

---

### 6. Do’s and Don’ts

#### Do:
*   **Do** use asymmetrical layouts. Let a vehicle image bleed off the edge of the screen while the text remains centered.
*   **Do** use high-contrast typography sizes. A `3.5rem` headline next to a `0.75rem` label creates a premium, editorial rhythm.
*   **Do** favor "Breathing Room." Use `spacing-12` (4rem) and `spacing-16` (5.5rem) generously between major sections.

#### Don’t:
*   **Don't** use standard blue for links. Use `primary` (Silver) or `tertiary` (White).
*   **Don't** use sharp, 0px corners. Even the most "brutalist" element should have a `sm` (0.125rem) radius to feel finished.
*   **Don't** use "pure" black (#000000) for large surfaces. Use the defined `background` (#0e0e0e) to allow for subtle shadow depth.
*   **Don't** ever use Inter or Roboto. They lack the "signature" required for this editorial tier.