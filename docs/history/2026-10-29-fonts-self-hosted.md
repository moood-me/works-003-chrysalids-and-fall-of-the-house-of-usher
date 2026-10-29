# 2026-10-29 — fonts carried by the games

**What.** games/fall-of-the-house-of-usher: Old Standard TT 400, 700, 400 italic (@fontsource/old-standard-tt 5.3.0). fonts.css 52 289 -> 400 276 bytes.

**Why.** The new moood site's Content-Security-Policy allows styles and fonts only from 'self' (and data: for fonts). The `@import url("https://fonts.googleapis.com/…")` on the first line of each ui.css was blocked, the runtime saw ui.css as failed and the game stopped ("no stylesheet ui.css"). Pavel: fix it properly in the games — the fonts carried by the game itself, nothing external.

**How.** The same way these games already carry their other fonts: the woff2 files of the @fontsource packages (SIL Open Font License 1.1) are embedded in `bespoke/fonts.css` as `@font-face` with `src: url(data:font/woff2;base64,…)`, same family names as the import used, exactly the weights/styles it asked for, font-display: swap, in the subsets latin, latin-ext, cyrillic, cyrillic-ext (Google served all by unicode-range; moood speaks Polish, Ukrainian, Belarusian too), each with the unicode-range fontsource gives. The `@import` line is deleted from ui.css; nothing else in ui.css changed. 
