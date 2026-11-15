# Lily and Lullaby images

Source: the [Lily](https://wiki.kurobbs.com/mc/item/1559521973715369984) and
[Lullaby](https://wiki.kurobbs.com/mc/item/1569476457330941952) entries on the
Kuro Wuthering Waves wiki. The artwork belongs to Kuro Games.

These files are stored in the Cloudflare R2 bucket `wwaves-assets`:

- `character/lily/ico.webp`: 256px portrait cropped from the character artwork.
- `character/lily/stand.png`: transparent character cutout with the same framing as other card portraits.
- `character/lily/art.png`: landscape card artwork.
- `character/lily/C1.png` through `C6.png`: the chain icons in wiki order.
- `weapon/pistol/ico009.png`: the Lullaby icon.

These keys follow the existing CDN convention. The frontend uses
`VITE_IMAGE_BASE`, and the card renderer uses its existing `ASSET_BASE_URL`.
These files are not bundled into the frontend deploy.
