# Create the EzPMS style inventory

## Deliverable
Create a standalone Markdown file named `ezpms-style-guide.md` in Files. No application source code, configuration, or database content will be changed.

## Contents
1. **Style sources and conventions**
   - Identify the global stylesheet, Tailwind configuration, loaded font source, component-library conventions, and any legacy template styles.
   - Clearly distinguish configured design tokens from one-off values used directly in individual screens.

2. **Color system**
   - Document every light- and dark-theme semantic color token with its name, HSL value, hex equivalent, role, and representative usage locations.
   - Inventory the Tailwind palette colors, opacity variants, gradients, chart colors, status colors, and hard-coded color values actually used in the app.
   - Group colors by purpose: brand, surfaces, text, borders/focus, feedback/status, charts, and navigation.

3. **Typography system**
   - Document Lato, its loaded weights/styles, fallback stack, and where the font is applied.
   - List every text size, default line height, weight, line-height override, letter-spacing option, casing treatment, and text-alignment pattern currently used.
   - Include both Tailwind class names and their CSS/rem equivalents.

4. **Layout and visual variables**
   - List the spacing values actually used for padding, margin, gaps, and positioning.
   - Document containers, breakpoints, grids, flex layouts, widths, heights, minimum/maximum sizes, and aspect ratios.
   - Cover radii, borders, rings, shadows, opacity, z-index, transitions, animations, and duration/easing values.
   - Include relevant component-specific variables such as sidebar and Radix sizing variables.

5. **Usage reference and consistency notes**
   - Provide representative file/component references for each style family so readers can locate its use.
   - Flag duplicated, ad-hoc, or legacy values without changing them.
   - End with a compact quick-reference table of the core brand, typography, spacing, and shape values.

## Verification
- Scan all styling-bearing `.css`, `.ts`, and `.tsx` files plus the Tailwind configuration and document head.
- Check that every reported value exists in the current project and that converted HSL/hex values are accurate.
- Review the Markdown for clear tables, valid formatting, and complete coverage before delivering it.
