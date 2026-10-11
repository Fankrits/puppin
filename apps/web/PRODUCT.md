# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Design-led shoppers in Thailand who buy from small brands with a point of view rather than from marketplaces or big retailers. They care about taste and quality more than the lowest price. They shop on mobile and desktop, in Thai or English.

## Product Purpose

Puppin is the direct-to-consumer storefront for Puppin, an own-label apparel brand for people. Shoppers browse, pick variants (material, fit, sleeve), check out as a guest or with an account, and receive an order confirmation. Success means a shopper who trusts the brand enough to buy direct.

## Positioning

Own label: Puppin designs its own garments and sells them direct, with no marketplace in between. **Open decision:** the specific differentiator (material, fit, style POV, or something else) is not defined yet. Do not invent one in copy or design.

## Operating Context

- Market: Thailand. Storefront is bilingual Thai and English; pricing in THB.
- Commerce runs on Medusa v2 (regions, carts, shipping options, payments, customer accounts). Routes are country-prefixed (`/$countryCode/...`).
- Catalog structure: products with options such as Material, Fit, and Sleeve. Current catalog is demo seed data (`apps/medusa/src/scripts/seed-demo-products.ts`), not the real line.

## Capabilities and Constraints

- Built: home, category, product detail, cart drawer and cart page, checkout, customer login/register/account, and order confirmation.
- Stack: TanStack Start + React, Tailwind CSS v4, Radix primitives, TanStack Query, Medusa JS SDK; Vite+ toolchain, deployed to Vercel.
- Not yet set up: Thai localization and THB as the default region (code currently defaults to the first region, falling back to `us`, with `lang="en"`).
- Copy across the site is placeholder ("Elevate your daily essentials", "Modern Commerce Experience") and is not product truth.

## Brand Commitments

- Name: Puppin.
- Logo: `public/logo.svg` (black line mark of the character's head) and `public/favicon.svg`.
- **The Puppin character is the main character of the website** (user-pinned). A round red plush creature: red plush fur, rainbow-gradient two-leaf sprout on its head, a curly fur tuft, small dark-red eyebrow marks, sparkling dark eyes, soft peach-orange cheek blush (user-chosen over the sheets' rosy-red; reference `.impeccable/refs/puppin-cheek-ref.png`), a visible small smile with one tiny white fang, a peach belly patch, soft orange spikes down the back, and a short tail. Two canonical renderings: flat illustration and 3D plush.
- Character sheets: `.impeccable/refs/puppin-sheet-flat.png` and `.impeccable/refs/puppin-sheet-plush.jpeg`. Every generated image of Puppin must match them. Never redesign, recolor, or add features to the character.
- Image generation: `agy` CLI (Antigravity) with the character sheets as reference.

## Evidence on Hand

- Logo files and the two Puppin character sheets (above). Generated character imagery is authored brand art, not product photography.
- No real product photography, customer reviews, testimonials, press, or size charts exist yet. Never fabricate them; use clearly marked placeholders until real assets arrive.
- Placeholder trust claims on the homepage ("Fast Shipping, tracked deliveries worldwide", "Premium Quality") are unverified and must not be treated as commitments.

## Product Principles

1. Sell like a brand, not a marketplace: the shopper should feel they are buying from the people who made the clothes.
2. Claim only what is true. Until the differentiator and assets exist, say less rather than inventing proof.
3. Bilingual by default: Thai and English are both first-class, including longer Thai strings and Thai typography needs.
4. Checkout trust is the product: clear prices in THB, honest shipping, and errors that explain themselves.
