# ชอบไปเรื่อย / The Curiosity Club

Design prototype, 27 October 2026. A Thai editorial gallery covering IT, Apple, skincare, and Thai fashion.

## Run

No installation or build step is required. `npm run dev` serves `dist` at http://localhost:4173. `npm run check` checks JavaScript syntax. All assets except optional Google Fonts are local. The font fallback remains usable offline.

## Included

- Home with animated CSS 3D sculpture and four original procedural category objects.
- Four category routes, six original prototype article routes, archive, and about/rights page.
- Thai search, category filter, local bookmarks, pause toggle, reduced-motion CSS, responsive layouts, keyboard navigation.
- The private hosted preview has a 155-document Drive index. This public source package deliberately excludes titles and private Drive URLs; `dist/drive-index.json` is empty.

## Content status

All on-site articles are clearly labeled original design samples. Drive records remain pending verification and must not be represented as validated news. There is no live or unattended Drive sync yet. The snapshot is dated 27 October 2026; it must not be used as an automatically refreshed timestamp.

## Before public release

Verify every sourced factual claim, especially announcements, medical claims, ratings, prices, and personal-test claims. Keep source URLs, publication dates, checked dates, and media license evidence. Do not assume attribution or AI paraphrasing establishes permission. Obtain expert review where needed. Use only original or appropriately licensed media.

`dist/drive-index.json` includes the owner's file titles and Drive links. This prototype is private. Review/remove that index before making the repository or site public. Never commit Google tokens, service-account keys, private raw reports, or unlicensed media.

## GitHub handoff

GitHub target: wanatsarutpungkasem-lgtm/realtime-skil. The managed private Sites repository is separate. This public repository contains sanitized frontend source only. GitHub Pages can serve `dist` as a static site, but does not execute an unattended Drive/AI job.

## Future data pipeline

Drive reports -> private ingestion/verification -> approved structured articles -> site. Store Google credentials on the server only, allowlist the four folders, and publish only approved fields. Add scheduled ingestion and an honest checked timestamp when that service is configured.

## Art and dependencies

All objects are made with CSS gradients and transforms. No Apple logo, product photos, third-party videos, music, or copied article text is included. Fonts are IBM Plex Sans Thai (Open Font License) and Manrope (Open Font License), optionally loaded from Google Fonts. Brand/domain clearance has not been completed; the project name is provisional.

## Editing the appearance

- `dist/index.html`: page shell and external CSS links.
- `dist/style.css`: formatted layout, colors, CSS 3D objects and responsive rules.
- `dist/typography.css`: font families, weights, title sizes, spacing and metallic title treatment.
- `dist/app.js`: content, routing and interaction; no inline style attributes.

Typography reference: https://www.apple.com/th/iphone-duo/ uses SF Pro / SF Pro TH. This project does not host or redistribute Apple font files. It uses device system fonts plus Noto Sans Thai via Google Fonts (SIL OFL). Rendering can vary across devices.
