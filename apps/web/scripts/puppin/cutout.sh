#!/bin/bash
# usage: scripts/puppin/cutout.sh in.png out.png
# 1) flood-fill near-white background from the border  2) clear enclosed pure-white pockets
#    (>1500px, near #FFF) via connected components  3) erode+soften the alpha edge to kill white fringe
set -e
in=$1; out=$2; t=$(mktemp -d)
magick "$in" -bordercolor white -border 2 -alpha set -fuzz 8% -fill none -draw "color 0,0 floodfill" -shave 2x2 "$t/a.png"
# mask of remaining near-pure-white opaque pixels
magick "$t/a.png" -alpha off -fuzz 3% -fill black +opaque white -fill white -opaque white "$t/w.png"
magick "$t/w.png" -define connected-components:area-threshold=1500 -define connected-components:mean-color=true -connected-components 8 -threshold 50% "$t/holes.png"
# combine: alpha = original alpha AND NOT holes
magick "$t/a.png" -alpha extract "$t/al.png"
magick "$t/al.png" \( "$t/holes.png" -negate \) -compose Multiply -composite -morphology Erode Disk:1.5 -blur 0x0.8 "$t/al2.png"
magick "$in" "$t/al2.png" -alpha off -compose CopyOpacity -composite -trim +repage "$out"
rm -rf "$t"
