# Integration plan: improvements from competitor review

Rule: fit of 80% or more is folded into an existing feature. Anything lower is parked for a deliberate design pass, not bolted on as a new tab.

Fit = how much of the recommendation already exists in the app, measured against the code at `2c909d8`.

## Integrate now (fit 80% or more)

Status: all eight implemented and covered by `tests/test_integration.py`. Question bank is now 132 (eight hard-trap questions g-13 to g-20).

| # | Recommendation | Fit | Existing home | Change |
|---|---|---|---|---|
| 1 | Doc links on wrong answers | 95% | `sourceLine()` in `src/experience.js`, shown in answer explanations, mock results, lessons | Already shipped. Add `sourceLine([q.ts])` to each row of "Review missed items" in `vSessionDone` (`src/template.html`). Check the three drills show a link. |
| 2 | Mock per-domain breakdown and "study this next" | 90% | `mockResult` (D1 to D5 history table, `tsMiss` links) | Already shipped. No change. Mock draws 4 scenarios x 15, which matches the real exam's scenario-based draw, so do not switch to weight-based selection. |
| 3 | "Last verified" and unofficial notice | 85% | `SOURCES.verified`, `SOURCES.version`, `.study-utility` footer | Show `SOURCES.verified` next to the guide version in the footer. |
| 4 | Wrong-answer pattern reference | 85% | `SHAPENAMES`, `BEASTS` (tells, counters), "Name the shape" drill, map camps, Decision rules shape list | Surface `BEASTS` tells and counters, plus one `SHAPEQ` example, inside the existing shape list in Decision rules. No new page. |
| 5 | Three rules that resolve most questions, per domain (from the community repo) | 85% | Lesson header, 10 `RULES`, "Pro tip" per level | Add a "Three rules" line to each lesson header, picked from the existing ten rules. Content is a short mapping in `guide.js`. |
| 6 | Printable cheat sheet | 80% | Trigger words, Decision rules, Key terms tabs | `@media print` styles plus a "Print this tab" button on those three tabs. Print each tab as it is. |
| 7 | "Read the lesson first" (from the community repo) | 80% | `vSetup`, `cguide` action, lessons already link to practice | One link in practice setup that opens the lesson for the selected domain or task. |
| 8 | Hard-trap questions | 90% | Question bank, schema, validator | Ongoing authoring using the same schema. Several plausible options where one word decides it. Keep correct option from being the longest. |

## Park for deliberate integration (fit below 80%)

| Recommendation | Fit | Why parked | Intended home when built |
|---|---|---|---|
| First-run diagnostic | 70% | `smart` mode and "start with a mixed baseline" copy exist, but no scored baseline that seeds the map | A "Baseline" preset on the Study desk "next step" card, seeding fog of war |
| Difficulty tiers | 30% | No difficulty field. `r` is the decision rule, not difficulty. Needs rating 124 questions. | Derive from answer history (`smart` mode already weights misses), or rate during question authoring |
| Combined one-page cheat sheet | 40% | Per-tab print covers most of it. A merged sheet needs design and content choices. | After per-tab print ships, if it still feels needed |
| Map to the guide's "Knowledge of" bullets | 40% | Questions map to task statements only. Needs a content pass on all 124. | Extend the `ts` field, validator checks |
| Progress export and import (JSON) | 25% | Nothing similar exists besides reset. Touches the storage key `ccarf-study-v1`, so it needs care. | Settings area, behind a deliberate design |

## Do not copy
Huge AI-generated banks, accounts and sync, weekly quotas, and out-of-scope topics (stop sequences, RAG, model selection).

## Order
Tasks 1, 3, 7 (small, same file area), then 4, 5, 6, then 8 continuously. Run `node scripts/validate.js`, `python scripts/build.py`, `tests/test_ui.py` and `tests/test_release.py` after each group. No em or en dashes.

## Added later
Recency decay in readiness, exam-date-aware Smart mix and flashcard intervals, and a per-domain "Beyond Claude" note were built together. The exam-date item was below the 80% line and was promoted at the owner's request.

## Parked items, now built
- First-run diagnostic: a 15-question baseline (domain-weighted), offered on home, in the map idle panel, and in practice setup.
- Difficulty tiers: authored tiers were rejected because rating 132 questions by hand would be guesswork. A "Tough for me" mode derives difficulty from your own answers instead.
- Combined cheat sheet: "Print exam-day sheet", a print-only compact sheet, not a new tab.
- Guide "Knowledge of" bullets: not embedded in the app (it would copy the guide). `scripts/coverage.py` reports bullets with little question coverage, and six questions (g-21 to g-26) were added for the thinnest spots.
- Progress export and import: in Learn > Syllabus, validated, with a confirmation step.

## Housekeeping, done
Dead code removed, the correct-option-longest count cut from 48 of 128 to 44 of 134 (the new questions are all within 6% of the longest distractor), and the count cap in practice routes raised to 200.
