# brand-source

## logo-master.pdf is corrupt — do not trust it

The file is a valid PDF shell: the header, the object structure and the
`/BaseFont /DATEPM+HighTowerText-Reg` and `/FontFile` references all read
correctly. Every one of its ten compressed streams is damaged, including the
page content and the embedded font, so it renders nothing and no tool can
extract anything from it.

The cause is line-ending normalisation applied to a binary file — almost
certainly committed before `.gitattributes` marked images and PDFs as binary.
Diagnosis, from a PNG in the same commit whose correct bytes are known:

    expected  89 50 4e 47 0d 0a 1a 0a      PNG signature
    observed  89 50 4e 47 0d 0a 1a 0d 0a

A lone `0a` became `0d 0a`, a lone `0d` became `0d 0a`, and an existing
`0d 0a` was left alone. The file's `0a` and `0d` counts are exactly equal,
which confirms it: everything was normalised to CRLF.

**That is not reversible.** Each surviving `0d 0a` could have been `0d`, `0a`
or `0d 0a`, so the inverse is ambiguous rather than merely unknown. The font
stream alone carries 593 such pairs.

## What was done instead

`public/assets/logo/logo-mark.svg` used to position a live
`<text>riti</text>` in High Tower Text, a font no visitor's browser has, so
that part of the mark rendered in a substitute serif for everyone. Both SVGs
now carry that text as outlines, generated with fontTools from the genuine
High Tower Text on a machine that has it licensed and installed.

Verified by rasterising the old and new SVGs at 2x and diffing: all differing
pixels fall inside the text's own bounding box, and none is fully inked in one
and fully blank in the other — the difference is antialiasing, nothing else.

The SVGs no longer reference any font, so there is nothing left to go wrong.
An uncorrupted master is still worth having from the client if one exists.
