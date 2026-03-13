## AI DESIGN AUDIT PROMPT

You are acting as a Chief Design Officer performing a platform-level UX audit.

Use the rules and standards in this document to review the interface and identify design issues.

Important:
The current Home page is the visual benchmark for the platform.
When auditing any screen, compare it against the design quality, polish, rhythm, typography variety, and surface treatment already established on Home.


## Core Instruction

Do not redesign the product.

Do not change layout architecture.

Do not move major sections.

Do not invent a new visual language.

Refine each screen so it feels like it belongs to the same product family as the current Home page.


## What Makes The Home Page The Reference

The Home page succeeds because it feels:

- premium but calm
- editorial without losing product clarity
- generous in spacing without feeling empty
- varied in typography without feeling chaotic
- expressive in surface treatment without becoming loud
- modern and polished without looking template-driven

It does not rely on a single trick.
Its strength comes from many small details working together:

- the soft page canvas
- the restrained violet accent usage
- the large rounded parent cards
- the slightly tighter nested cards
- the sharper buttons inside softer containers
- the mix of white, transparent, and muted surfaces
- the use of both operational and inspirational content blocks
- the stronger section titles paired with quieter metadata


# Platform UI/UX Audit
### Home-Page-Calibrated Product Design Review

Author: Internal Design Audit
Scope: Full platform interface and interaction system
Goal: Bring every page to the same product maturity, polish, and cohesion already demonstrated by the Home page.

---

# Executive Summary

This audit evaluates whether a screen feels like a true sibling of the Home page.

The objective is not to create a different aesthetic.
The objective is to preserve the existing layout while upgrading the screen so it reflects the same:

- visual hierarchy
- spacing rhythm
- card language
- typography richness
- button polish
- interaction feedback
- restraint in accent color
- overall premium SaaS feel

When a page feels flatter, harsher, denser, or more generic than Home, it should be treated as under-designed.

---

# Non-Negotiable Audit Rule

The existing layout structure of the platform is considered correct.

This audit must not:

- change page layouts
- restructure grids
- move major sections
- alter column structures
- replace the current navigation model

All recommendations must work within the existing layout system.

The goal is refinement, not redesign.

---

# Home Page Reference Principles

Every audited screen should aim to match these qualities from Home:

1. Strong section hierarchy
Page sections are easy to scan because titles are bold, large, and clearly separated from supporting copy.

2. Calm canvas
The page background is softly atmospheric, not flat white and not aggressively branded.

3. Layered card system
Large parent cards, smaller nested cards, transparent feature surfaces, and restrained accent surfaces all coexist without conflict.

4. Purposeful typography variety
Different text roles feel intentionally different.
Home does not flatten everything into one heading size and one body size.

5. Sharper CTA language
Buttons are slightly sharper than cards, which creates a polished contrast.

6. Utility plus storytelling
The page mixes operational modules, learning content, community proof, and support entry points.
This makes the experience feel alive, not purely transactional.

7. Accent restraint
Violet is used as emphasis, not wallpaper.

---

# Page Canvas

The Home page establishes the approved page background system:

- subtle radial violet bloom at the top-left
- soft neutral linear gradient underneath
- light overall page value
- no heavy tinted blocks across the full page

Reference surface:

- `radial-gradient(circle at top left, rgba(118, 38, 198, 0.08), transparent 28%), linear-gradient(180deg, #f7f5fb 0%, #f4f5f8 100%)`

Audit rule:

- Pages should feel softly elevated from the browser, not placed on a stark flat background.
- Background styling should remain understated.
- Large content areas should not compete with cards and typography.

---

# Layout And Spacing Rhythm

The Home page uses a generous but controlled rhythm.

Reference spacing behavior:

- overall page padding feels spacious
- primary card gap: 24px
- nested content gap: 16px
- standard parent card padding: 24px
- section title to supporting copy: 8px to 12px
- section to section rhythm: clear 24px cadence
- wider top-level breathing room before the first content block

Audit rule:

- Keep the layout exactly where it is.
- Improve spacing consistency so screens feel composed rather than merely assembled.
- Avoid cramped stacks, random gaps, and inconsistent card padding.

---

# Typography System

The Home page proves that the platform should use controlled typography variety, not a flat single-scale UI.

Reference hierarchy:

- Primary page greeting: large, welcoming, calm, and not overly heavy
- Major section titles: `30px / 40px`, bold, dark plum
- Mid-level card titles: `20px / 24px` or `20px / 28px`, semibold
- Lead/supporting paragraphs: `17px to 18px`, comfortable line height
- Standard body copy: `14px`, neutral and readable
- Metadata and utility copy: `12px`
- Small labels can use medium or semibold weight when needed

Reference text colors:

- primary dark heading: `#1e0a3c`
- standard body text: `#39364f`
- quiet metadata: `#6f7287`

Audit rule:

- Do not reduce everything to one generic title size and one generic paragraph size.
- Larger sections should feel important.
- Supporting copy should feel quieter without disappearing.
- Typography should create rhythm, confidence, and hierarchy.

---

# Color System

Home uses color with discipline.

Reference accent palette:

- primary accent violet: `#7626c6`
- soft violet tint: `#f4ecfb`
- soft violet mist: `rgba(118, 38, 198, 0.08)`

Approved accent usage:

- icons
- link buttons
- small highlight titles
- pills and badges
- selected emphasis moments
- primary CTA gradients

Avoid:

- large solid violet surfaces
- excessive accent text
- multiple competing accent colors on one screen
- decorative color blocks with no semantic purpose

Audit rule:

- Neutrals should dominate.
- Accent color should guide attention, not flood the interface.

---

# Card System

The Home page establishes a layered card system rather than one repeated card style.

## Parent Cards

Reference:

- white background
- `28px` border radius
- `24px` padding
- subtle neutral border
- minimal shadow or no visible shadow

Use for:

- major content sections
- checklist blocks
- resources sections
- academy sections
- spotlight content

## Transparent Feature Cards

Reference:

- transparent background
- same `28px` radius
- same `24px` padding
- no unnecessary border

Use for:

- hero choices
- introductory action modules
- content that should feel integrated with the page canvas

## Nested Cards

Reference:

- `22px` radius
- compact internal spacing
- muted or white surface
- lighter emphasis than parent cards

Use for:

- resource items
- academy tiles
- help topic cards
- small supportive modules

## Micro Surfaces

Reference:

- icon tiles at `48px x 48px`
- generous rounding
- badge pills with fully rounded radius
- small label strips used sparingly

Audit rule:

- Pages should not use one corner radius for everything.
- Parent cards should feel softer and broader.
- Buttons should feel slightly sharper.
- Nested cards should feel distinct from the parent they live inside.

---

# Button System

Home establishes the clearest button language in the product and should be the reference.

## Action Buttons

Reference:

- minimum height: `48px`
- border radius: `14px`
- semibold label
- calm hover lift
- polished border and shadow treatment

## Outline CTAs

Reference:

- near-white surface
- subtle border
- light inset highlight
- gentle hover elevation

## Primary CTAs

Reference:

- violet gradient
- soft depth
- strong contrast
- still restrained and premium

## Link Buttons

Reference:

- no heavy chrome
- violet text
- semibold
- slight horizontal motion on hover

Audit rule:

- Buttons should feel intentionally crafted, not default.
- CTA hierarchy should be obvious.
- Different button roles should look related but not identical.

---

# Section Composition

Home works because each section has a different job and a slightly different presentation style.

Reference section archetypes:

- dual hero choice cards
- a checklist card with one dominant CTA
- a resource grid made of muted nested cards
- a horizontal academy scroller with image-led learning cards
- a community spotlight split layout
- a help grid with equal support cards
- a promotional mobile app card with localized accent treatment
- a narrow right-rail utility card

Audit rule:

- Preserve the existing section order and layout.
- Within that layout, make sure sections feel intentionally differentiated.
- Avoid pages where every section repeats the same exact visual formula.

---

# Imagery And Iconography

Home uses imagery in a disciplined way.

Reference behavior:

- photography appears inside clipped rounded frames
- icons sit inside clean supportive containers
- icon color follows the accent system
- visual assets support the content instead of overpowering it

Audit rule:

- Use imagery only where it adds warmth, proof, or context.
- Keep icon language clean and recognizable.
- Avoid random illustration styles or inconsistent icon treatment.

---

# Interaction Design

Every interactive component must support:

- hover
- active
- focus
- disabled
- loading, when relevant

Reference interaction behavior from Home:

- small vertical lift for action buttons
- small horizontal movement for link buttons
- subtle shadow increase on hover
- no exaggerated motion

Audit rule:

- Interactions should feel responsive and polished immediately.
- Feedback should be visible but calm.

---

# Motion

Motion should feel fast, soft, and modern.

Reference timing:

- small movement: about `120ms`
- color and shadow transitions: about `150ms`
- larger surface changes should still feel brief and unobtrusive

Audit rule:

- Motion should add polish, not theatricality.
- Avoid both sluggish animation and completely dead interfaces.

---

# Content Tone

Home demonstrates the right voice for the platform:

- clear
- warm
- direct
- supportive
- optimistic

Reference content behavior:

- titles are concise
- supporting copy explains value quickly
- CTAs use simple verbs
- educational and inspirational modules still feel product-native

Audit rule:

- Copy should sound like a refined product team, not placeholder marketing or machine-generated filler.

---

# Accessibility

Minimum accessibility requirements:

- WCAG AA contrast compliance
- keyboard navigation support
- visible focus states
- clear text hierarchy
- touch-friendly interaction targets

Accessibility should be treated as part of premium polish, not a separate checklist.

---

# Audit Output Format

Your output should include:

1. Identified UI issues
2. Suggested improvements
3. Priority level: High / Medium / Low
4. Recommended design changes
5. A note on whether the audited screen feels aligned with the Home page reference

When reviewing a page, ask:

- Does it feel as polished as Home?
- Does it use typography with the same confidence?
- Does it use surfaces with the same nuance?
- Do buttons feel equally intentional?
- Does the page feel calm, premium, and modern?
- Does the layout stay the same while the visual system improves?

---

# Final Standard

The target quality bar is no longer a generic Apple / Stripe / Linear reference in the abstract.

The practical benchmark is:

Apple / Stripe / Linear level polish interpreted through the current Home page design language.

If a page feels flatter, harsher, more generic, more cramped, or less expressive than Home, it should be upgraded until it belongs to the same family.

---

End of Audit
