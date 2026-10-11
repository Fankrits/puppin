---
name: Puppin
description: Own-label clothing storefront where a red plush character does the selling.
colors:
  puppin-red: "#d63a2c"
  puppin-red-deep: "#b42c20"
  sprout-mint: "#c8e6d6"
  sprout-deep: "#24583c"
  ink: "#121212"
  ink-soft: "#4a4a48"
  paper: "#ffffff"
  mist: "#f4f4f2"
  line: "#e4e4e0"
typography:
  display:
    fontFamily: "Anybody Variable, Kanit, Anuphan Variable, sans-serif"
    fontSize: "clamp(3.6rem, 10.5vw, 9.5rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 62"
  headline:
    fontFamily: "Anybody Variable, Kanit, Anuphan Variable, sans-serif"
    fontSize: "clamp(3.25rem, 7.5vw, 7rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 62"
  title:
    fontFamily: "Anuphan Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Anuphan Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Anuphan Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  pill: "9999px"
  card: "16px"
  panel: "28px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "40px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.puppin-red}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.puppin-red-deep}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  option-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  option-chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  product-tile:
    backgroundColor: "{colors.mist}"
    rounded: "{rounded.card}"
  hero-panel:
    backgroundColor: "{colors.sprout-mint}"
    rounded: "{rounded.panel}"
---

# Design System: Puppin

## Overview

**Creative North Star: "The Fuzzy Inspector"**

Puppin works like a clean own-label clothing store: white page, a product grid, a clear red action. A red plush creature with a rainbow sprout shows up wherever the page needs warmth. The structure is the category standard on purpose. The personality comes from two things: full-measure condensed uppercase headlines that fill the width like label tape, and Puppin himself, rendered as a 3D plush who hugs, peeks over, measures, and naps on the layout.

The character is the main character (a brand commitment in PRODUCT.md). He appears as generated plush renders matched to the character sheets in `.impeccable/refs/`, never as vector doodles, emoji, or a recoloured variant. Humour lives in the copy and in his poses; the commerce parts (prices, options, cart) stay plain and legible.

**Key Characteristics:**

- White ground, ink type, one red action colour.
- Huge condensed caps headlines with exactly one word in Puppin red.
- Puppin as plush renders at section edges: hug (hero), peek (over a rule), measure (story), nap (footer).
- Pill controls, 16px tiles, 28px hero panel.
- Thai and English set side by side; Thai lines carry `lang="th"`.

## Colors

One saturated red does all the work on a quiet white field; the mint exists only to make the red creature pop in the hero.

### Primary

- **Puppin Red** (#d63a2c): the primary action (Add to cart), the one red word in each display headline, the cart badge, text selection, the caret, and focus outlines. Taken from the character's fur.
- **Puppin Red Deep** (#b42c20): hover and pressed state of red actions, and inline error text.

### Secondary

- **Sprout Mint** (#c8e6d6): the hero panel field only; its cool green makes the red creature pop.
- **Sprout Deep** (#24583c): the Thai subline on the mint panel.

### Neutral

- **Ink** (#121212): headlines, body emphasis, selected option chips, the New In rule.
- **Ink Soft** (#4a4a48): secondary copy, nav links at rest, card subtitles.
- **Paper** (#ffffff): page ground.
- **Mist** (#f4f4f2): product image tiles and hover fills.
- **Line** (#e4e4e0): hairline borders, dividers, unselected chip outlines.

### Named Rules

**The One Red Word Rule.** Each display headline sets exactly one word in Puppin Red; the rest is ink. Product-name headings on the product page are catalog data and stay all ink.

**The Cutout Rule.** Every character render ships as a transparent cutout (generated on pure white with no floor or shadow, then cut with magick), so Puppin sits on any ground without a visible rectangle. Depth under him comes from a CSS `drop-shadow`, never a baked-in shadow.

## Typography

**Display Font:** Anybody Variable at width 62%, weight 900, uppercase (Thai glyphs fall back to Kanit 800)
**Body Font:** Anuphan Variable (Thai and Latin)

**Character:** A squeezed, heavy poster grotesque shouts the brand line, and a calm, round Thai-Latin sans does all the commerce talking.

### Hierarchy

- **Display** (900, clamp(3.6rem, 10.5vw, 9.5rem), 0.88): the hero headline, two lines, spanning the full hero panel.
- **Headline** (900, clamp(3.25rem, 7.5vw, 7rem) to clamp(3.5rem, 11vw, 10rem), 0.88): section heads such as NEW IN and MADE BY US.
- **Wordmark** (900, up to 36vw / 33rem, 0.8): the footer PUPPIN, edge to edge, in Puppin Red.
- **Title** (600, 1.25rem): product names in the hero quick-add card; 1rem in product tiles.
- **Body** (400, 1.125rem, 1.65): intro and story copy, capped at about 34rem.
- **Label** (600, 0.875rem): chips, small headings, footer column heads.

### Named Rules

**The Full-Measure Rule.** Display and headline type is set large enough to own the width of its container. A small condensed headline is a misuse.

**The Display Ceiling Exception.** These headlines intentionally exceed the usual 6rem display ceiling; the user asked for the Label Room's full-measure heading style.

## Layout

The content container is max 88rem with side gutters of 16px, 24px (sm) and 40px (lg). The hero is a rounded mint panel on a 12-column grid at lg: the headline spans all 12 columns, copy and quick-add take 7, and Puppin takes 5, pulled up under the headline's right end. Below lg, Puppin appears as a small render at the panel's top right, so the character is always in the first viewport. The product grid runs 2, 3, then 4 columns with 20px column gaps and 40px row gaps. Sections are separated by about 96–112px, with more space above a heading than below.

## Elevation & Depth

The system is mostly flat. One floating surface exists, the hero quick-add card on the mint panel, plus a soft drop-shadow under the hero Puppin cutout.

### Shadow Vocabulary

- **Tag Lift** (`box-shadow: 0 18px 40px -18px rgb(47 107 74 / 0.45)`): the hero quick-add card only, tinted green to sit on mint.
- **Menu** (`box-shadow: 0 12px 32px -8px rgb(18 18 18 / 0.18)`): the country dropdown.
- **Puppin Ground** (`filter: drop-shadow(0 24px 24px rgb(36 88 60 / 0.22))`): under the hero cutout on mint.

### Named Rules

**The One Elevation Rule.** A surface uses either a hairline border or a shadow, never both.

## Shapes

Controls are full pills. Product tiles use 16px corners and the hero panel 28px. Rules are 1px Line hairlines, except the 2px ink rule under the New In heading, which Puppin peeks over.

## Components

### Buttons

- **Shape:** full pill (9999px), minimum height 44px; the large size is 50px.
- **Primary:** Puppin Red with white semibold text. Hover is Puppin Red Deep; pressing scales it to 0.98.
- **Secondary:** Paper with a 2px Line border; on hover the border turns Ink and the fill turns Mist.
- **Focus:** a 2px Puppin Red outline with a 3px offset.
- **Loading:** an inline spinner, and the button is disabled.

### Option Chips

- **Style:** a pill with a 2px Line border and ink semibold label. Hover turns the border ink.
- **Selected:** filled Ink with white text. Each chip is a visually hidden radio inside a label, and the focus outline is drawn on the chip.

### Product Tile

- A 4:5 image on Mist with 16px corners; the image scales to 1.04 on hover (500ms, expo-out).
- Title (up to 2 lines) and price sit on the Paper below. The price stacks under the title on mobile and is right-aligned from sm up. Prices use tabular numerals.
- With no thumbnail, the logo shows at 25% opacity with "Photo coming soon".

### Hero Quick-Add (signature)

- A white card on the mint panel with the product name, price, option chips and a red Add to cart.
- The button is always active. Pressing it without an option says "Pick an option first." and focuses the first chip.
- On success it reads "In your bag", opens the cart drawer, and the hero Puppin does one squash-and-stretch hop (620ms, `cubic-bezier(0.16, 1, 0.3, 1)`, disabled under reduced motion).

### Product Page

- Gallery tile on Mist (5:4 on mobile, square from lg), with thumbnails in a left rail from lg and a row below on mobile; inactive thumbnails carry a Line border.
- The peek render sits on the gallery tile's top edge and does the same hop on add to cart.
- Product name in display type, all ink; price in tabular numerals, with "From" until every option is chosen; a sale shows "Save …" in ink, never a red badge.
- Option chips: an unavailable value is a dashed Line pill with line-through. It stays selectable and clears whichever choices conflict with it.
- "Pick a color and size first." when options are missing; "Sold out" disables the button.

### Navigation

- White, sticky, 64px high, with a Line bottom border.
- Logo mark plus the PUPPIN wordmark in display type; the mark tilts -6° on hover.
- Links are 15px Ink Soft and turn Ink on hover. The cart shows a red tabular badge.

### Footer

- Brand copy in English and Thai, Shop and Help columns, then the edge-to-edge red PUPPIN wordmark with the nap render resting on top of its first letter.

## Do's and Don'ts

### Do:

- **Do** generate every new Puppin pose with agy from the two character sheets, and embed the prompt as provenance (`impeccable embed-prompt`).
- **Do** ship every render as a transparent cutout (The Cutout Rule), and check it against the sheets for the mouth with fang, the brows, and soft peach-orange cheeks (see `.impeccable/refs/puppin-cheek-ref.png`).
- **Do** keep one red word per display headline, and Puppin Red as the only action colour.
- **Do** set Thai copy with `lang="th"` and let it fall to Kanit or Anuphan.

### Don't:

- **Don't** redraw, recolour, or add features to Puppin, or stand in vector doodles or emoji for him.
- **Don't** put a kicker or eyebrow label above headings.
- **Don't** invent quality claims, reviews, or shipping promises; PRODUCT.md lists none.
- **Don't** set display type small or in a system face.
