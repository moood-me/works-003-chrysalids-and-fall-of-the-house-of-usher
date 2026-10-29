# 2026-10-29 — Belarusian (`be`)

Why: Павел: ещё язык — белорусский.

- Worlds: `worlds/chrysalids` («Хрызаліды v3»), `worlds/fall-of-the-house-of-usher` («Падзенне дома Ашэраў v3») — `"be"` in `languages`, `lang/be.json` and every scene's `lang/be.json`.\n- Games: `games/chrysalids` («Хрызаліды»), `games/fall-of-the-house-of-usher` («Падзенне дома Ашэраў») — `bespoke/lang/be/strings.json`; the Chrysalids' hymn by language — `bespoke/lang/be/hymn.json` (its own syllables on the same notes: «Хай будзе чысты род Яго», «Пракляты, хто не ў вобразе Яго»).\n- Names: no Belarusian edition of Wyndham's novel is known, so the title is the English one rendered («Хрызаліды»; the Russian uses «Отклонение от нормы»); Дэвід Сторм, Разалінда, Сафі, Петра, Аксель, Вакнук, Ускраіны (the Fringes), Зеландыя (Sealand), Старажытныя (the Old People), Павук (the Spider-man), Азначэнні (the Definitions). Poe: «Падзенне дома Ашэраў», Родэрык, Мэдлін, Этэльрэд; the seal's initial — «А».

How it was checked: moood's `check` (its `be` branch: `be` in `i18n/languages.json`), `node packages/check/cli.js <repo> --write`
laid the files out, the translations were written into them, then `check` on the whole repository says «all right».
Modern standard Belarusian, the official orthography; translated from the English source, the Russian read beside it as
a second view of meaning and tone. Only translations and the `languages` lists were added; no source text, code or doc
was changed.
