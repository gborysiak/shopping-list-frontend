---
name: i18n-sync
description: Find missing, extra and unused translation keys between de.json and fr.json and the templates
disable-model-invocation: true
---

Audit ngx-translate keys. Files: `src/assets/i18n/de.json` (reference language), `fr.json` and `en.json`.

1. Flatten the JSON files to dotted keys (e.g. `global.submit`) and report:
   - keys present in `de.json` but missing in `fr.json` or `en.json`, and the reverse
   - values that look untranslated (identical to the German text, empty, or obviously in the wrong language)
2. Grep `src/app` (`*.html` and `*.ts`) for used keys: `'a.b' | translate`, `translate.instant('a.b')`, `translate.get('a.b')`. Report:
   - keys used in code but missing from either JSON file
   - keys defined in JSON but never referenced (candidates for removal; note keys built dynamically may be false positives)
3. Present a summary table first. Only edit the JSON files after the user confirms; keep the existing key order and indentation, and add missing French and English entries with a proposed translation marked for review.
