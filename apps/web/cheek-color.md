# Puppin cheek colour: finish the last two images

**Status (2026-10-11):** 2 of 4 homepage images done. The other two were blocked by the `agy` image quota.

| Image                       | File                             | Cheeks         | Status  |
| --------------------------- | -------------------------------- | -------------- | ------- |
| Hero (hugging tees)         | `public/images/puppin/hero.webp` | peach-orange   | ✅ done |
| Peek (over the New In rule) | `public/images/puppin/peek.webp` | peach-orange   | ✅ done |
| Tape (Made by us section)   | `public/images/puppin/tape.webp` | rosy red (old) | ❌ redo |
| Nap (footer)                | `public/images/puppin/nap.webp`  | rosy red (old) | ❌ redo |

## The cheek rule

The user chose **soft peach-orange cheek blush**, the cheeks from the first hero render. These replace the darker rosy red on the character sheets.

- Reference image: `.impeccable/refs/puppin-cheek-ref.png`. Use it for cheek colour and shape only.
- Everything else still follows the character sheets in `.impeccable/refs/`:
  - mouth always visible: a small smile with one tiny white fang
  - small dark-red eyebrow marks
  - rainbow two-leaf sprout
  - peach belly
  - orange back spikes
  - short tail
- This is recorded in `PRODUCT.md` (Brand Commitments) and in `DESIGN.md` (Do's).

## Steps

Run from `apps/web`, after the `agy` quota has reset. Run the two at the same time or one after the other; four at once caused timeouts.

```bash
# 1. Generate on pure white (prompt already includes the cheek reference)
scripts/puppin/gen.sh .impeccable/gen/v3/tape.png "Puppin standing in a 3/4 view, full body, back spikes and tail visible, holding a yellow tailor's measuring tape stretched between both hands, concentrating, mouth visible in a small focused smile with the fang. Square 1:1."

scripts/puppin/gen.sh .impeccable/gen/v3/nap.png "Puppin curled up asleep, full body, lying on top of a folded cream knit sweater, eyes closed peacefully, a small content closed smile with the tiny fang peeking out, peach cheeks, tail curled around, back spikes visible. The sweater is fully inside the frame. Landscape 3:2."

# 2. Check each render against the sheets: peach-orange cheeks, fang smile, brows,
#    and no stray marks on the image edges (crop them first with
#    `magick in.png -gravity north -chop 0x6 +repage out.png`
#    or the cutout's trim keeps the whole canvas)

# 3. Cut out to transparent, then convert
for f in tape nap; do
  scripts/puppin/cutout.sh .impeccable/gen/v3/$f.png /tmp/$f.png
  cwebp -quiet -q 86 -alpha_q 100 -exact /tmp/$f.png -o public/images/puppin/$f.webp
done

# 4. Record provenance (prompt plus post-processing) for each file
~/.claude/skills/impeccable/scripts/impeccable embed-prompt public/images/puppin/tape.webp --prompt-file <prompt.txt>
~/.claude/skills/impeccable/scripts/impeccable embed-prompt --scan public/images
```

## Done when

- [ ] `tape.webp` and `nap.webp` have peach-orange cheeks, the fang smile, and brows.
- [ ] Both are transparent, with no white rectangle or fringe on the mint or white grounds.
- [ ] `embed-prompt --scan public/images` reports `0 missing`.
- [ ] The homepage is checked at 1440 and 390 wide: the tape image sits in "Made by us", and the nap image rests on the footer wordmark without covering links.
- [ ] Delete this file.

## To hand this back to Claude

> Implement `apps/web/cheek-color.md`.
