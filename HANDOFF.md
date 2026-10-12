# CCAF-Tool Handoff

This file gives any developer or AI assistant everything needed to keep working on CCAF-Tool without the original conversation. Read it top to bottom once, then use it as a reference. Where this file and the code disagree, the code wins; please update this file when you change something it describes.

Also read these repo files, which are short and authoritative for their topics:

- `AGENTS.md`: what must be preserved (identity, Archie, navigation, content, storage key) and where things live.
- `DESIGN.md`: the visual system (palette, type scale, spacing, radii, motion, responsive rules, copy budget). **For visual decisions, DESIGN.md wins over section 6 of this file.**
- `VISUAL-PLAN.md` and `src/assets/README.md`: the generated artwork and how it is used.

Last updated: 2026-10-12.

---

## 1. What this is

CCAF-Tool is an **unofficial, single-page study tool** for the **Claude Certified Architect, Foundations** exam (official exam code **CCAR-F**; the owner calls it "CCAF"). It is not affiliated with or endorsed by Anthropic.

- **Owner:** William Lewis (GitHub `WGLewis0721`). He is a cloud and platform engineer preparing for the exam for work, and coworkers may also use the tool.
- **Repository:** <https://github.com/WGLewis0721/CCAF-Tool> (branch `main`). Commits come from the `WGLewis0721` and `aws-dev-wgl` accounts.
- **Hosting:** GitHub Pages via GitHub Actions. Expected URL: `https://wglewis0721.github.io/CCAF-Tool/`.
- **Runtime:** One self-contained HTML file. No backend, no accounts, no build-time dependencies beyond Python. Progress lives in the browser's `localStorage`.

### Exam facts the content is built on

These come from the official exam guide and drive the weights, the scoring estimate, and the copy.

| Fact | Value |
| --- | --- |
| Format | 60 questions, 120 minutes, closed book, Pearson VUE (online or test center) |
| Question types | Multiple choice and multiple response (each item says how many to pick) |
| Scenarios | 4 drawn at random from a bank of 6 |
| Passing score | Scaled 720 on a 100 to 1,000 scale |
| Cost and validity | $125; valid 12 months |
| Retakes | Wait 14, then 30, then 90 days; at most 4 attempts in a rolling 12 months |

| Domain | Weight | Task statements |
| --- | --- | --- |
| D1 Agentic Architecture and Orchestration | 27% | 1.1 to 1.7 |
| D2 Tool Design and MCP Integration | 18% | 2.1 to 2.5 |
| D3 Claude Code Configuration and Workflows | 20% | 3.1 to 3.6 |
| D4 Prompt Engineering and Structured Output | 20% | 4.1 to 4.6 |
| D5 Context Management and Reliability | 15% | 5.1 to 5.6 |

That is 30 task statements in total. The six scenarios are: 1 customer support resolution agent, 2 code generation with Claude Code, 3 multi-agent research system, 4 developer productivity with Claude, 5 Claude Code for continuous integration, and 6 structured data extraction.

**Out of scope per the guide** (do not build content around these beyond a mention): prompt caching beyond knowing it exists, model comparison, streaming, rate limits and pricing, computer use, and vision. Third-party prep sites (for example open-exam-prep.com) cover topics the official guide excludes, such as stop sequences, Opus/Sonnet/Haiku selection, RAG, and evals. Weight the official guide when they disagree.

**Guide versus current docs nuance (important for D3 content):** the guide tests the skill frontmatter fields `allowed-tools` (the permission axis), `context: fork` (the isolation axis), and `argument-hint`. Current Claude Code docs also list `disallowed-tools`, `disable-model-invocation`, `user-invocable`, and `agent`. Questions about docs-only fields are marked `ext:1` ("Beyond the guide"). The loop-stopping rule is: `stop_reason` of `end_turn` is the primary stop, and an iteration cap such as `maxTurns` is only a backstop.

---

## 2. Quick start

```bash
git clone https://github.com/WGLewis0721/CCAF-Tool.git
cd CCAF-Tool
python scripts/build.py              # writes dist/index.html
node scripts/validate.js             # checks the question bank; exit code 1 on any problem
python -m http.server 8000 --directory dist   # then open http://localhost:8000
```

Optional browser tests (screenshots go to `tests/screenshots/`):

```bash
pip install playwright && python -m playwright install chromium webkit
python scripts/build.py
python tests/test_ui.py        # functional regression, about 4 to 5 minutes, desktop 1180px and phone 400px
python tests/test_release.py   # responsive checks: desktop 1440, iPhone 390 (WebKit), Samsung 412, small phone 320, tablet 768 (WebKit)
CCAF_TEST_URL=https://wglewis0721.github.io/CCAF-Tool/ python tests/test_release.py   # run the release checks against the live site
```

**Deploy:** push to `main`. `.github/workflows/pages.yml` validates, builds to `_site/index.html`, and deploys with `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, and `actions/deploy-pages@v4`. One-time setting: **Settings > Pages > Build and deployment > Source = GitHub Actions**. If the first run failed before that was set, re-run it from the Actions tab.

---

## 3. Repository map

```text
AGENTS.md                     Preservation rules and pointers for AI agents
DESIGN.md                     Authoritative visual system
VISUAL-PLAN.md                Plan for the generated artwork
.github/workflows/pages.yml   Validate, build, deploy to GitHub Pages
scripts/build.py              Assembles src/ into one HTML file (default dist/index.html, or a path argument)
scripts/validate.js           Question and card checks; fails CI on problems
src/template.html             Full HTML document: head, base CSS layers, core app logic (state, views, actions), markers
src/design.css                Final CSS layer from the visual elevation pass (injected last)
src/assets/*.webp             Generated artwork (hero atlas and six mode illustrations), embedded at build time
src/app.js                    Archie, hints, mobile menu, exam map, home landing page, guided tour
src/guide.js                  Learn section: lessons (GLEVELS), items, trigger words, diagrams, bosses/beasts data
src/content/q-s1.js ... q-s7.js   Questions grouped by scenario (q-s7 holds the "g-" gap-fill set)
src/content/q-fix.js, q-fix2.js, q-fix3.js   Patches that rewrite distractors to rebalance option lengths
src/content/cards.js          Flashcards (d:0 exam facts, d:1..5 domains)
src/content/drills.js         TELLS, SHAPEQ, AXIS drill items, SHAPENAMES, and the study PLAN
tests/test_ui.py              Playwright functional regression test
tests/test_release.py         Playwright responsive release checks across five device profiles
README.md                     Human setup and editing guide
HANDOFF.md                    This file
```

### How the build works

`scripts/build.py` reads `src/template.html` and fills it in this order:

1. `/*__APP__*/` (inside the main script) is replaced with the contents of `src/app.js`.
2. `/*__DATA__*/` (inside the main script) is replaced with, in order: `const Q=[];`, every question file (q-s1 to q-s7, then q-fix, q-fix2, q-fix3), `const CARDS=[];` plus `cards.js`, `drills.js`, then `guide.js`.
3. `/*__DESIGN__*/` (at the end of the `<style>` block) is replaced with `src/design.css`.
4. Every `__ASSET_name__` token is replaced with a base64 `data:image/webp` URI of `src/assets/name.webp`. A missing file fails the build. Today the tokens are `tactical-atlas` (home hero) and `mode-map`, `mode-practice`, `mode-cards`, `mode-mock`, `mode-learn`, `mode-tour` (the six mode cards), all used in `app.js`.

The output is one self-contained file of roughly 566,000 characters, most of it embedded artwork.

The q-fix files must stay after the q-s files because they patch questions by id. `guide.js` pushes extra cards into `CARDS` (3 added cards plus one `d:6` "Triggers" card per trigger-word row), which is why the app shows 128 cards. The validator also loads `guide.js`, so it reports 128 as well.

**Never put the literal strings `/*__APP__*/`, `/*__DATA__*/`, `/*__DESIGN__*/`, or an unintended `__ASSET_name__` token inside `app.js`, `design.css`, or any content file.** Python's `replace` substitutes every occurrence, so the data would get injected in the wrong place and the page would break. This has happened once already: a code sample in the guided tour quoted the build script and broke the build.

---

## 4. Architecture of the running app

`src/template.html` is a complete HTML document (doctype, head with meta tags and font preconnects, a skip link to `#study-main`). Everything runs inside one IIFE in it (`(function(){'use strict'; ... })()`). Functions declared in `app.js` are hoisted into the same scope, so `template.html` and `app.js` call each other freely.

### State

| Variable | Purpose |
| --- | --- |
| `store` | Persisted object in `localStorage` key `ccarf-study-v1`. Fields: `answers` (by question id: `{n, c, last, t}`), `cards` (spaced-repetition boxes), `rate`, `flags`, `mocks` (results: `{date, pct, scaled, mins, dom}`), `days` (study days), `examDate`, `view`, `drill` (`{tell, shape, axis}` counters), `plan`, `planStart`, `guide.done`, `lastLearn`, `hints` (false when the user turned hints off) |
| `KEY + '-mock'` | An in-progress mock exam, so a refresh does not lose it |
| `view` | Current screen: `home`, `map`, `practice`, `mock`, `cards`, `guide`, `library` |
| `sub` | Sub-tabs: `practice` (`q`, `tell`, `shape`, `axis`), `library` (`playbook`, `scenarios`, `plan`, `syllabus`), `guide` (`walk`, `items`, `trig`, `maps`), `glevel` (1 to 5), `icat`, `tcat` |
| `sess`, `dr`, `mock` | The active practice session, drill round, and mock exam |
| `csel` | Map selection, for example `ts:1.3`, `boss:2`, `creep:0`, or null |
| `coach` | Guided tour state: `{open, i, turns}` |

### Rendering

`render()` rebuilds the whole `#app` with `innerHTML = shell(viewHtml)`, then calls `afterRender()` (in `app.js`). There is no framework and no virtual DOM. Consequences:

- Any state change calls `render()`. Keep view functions pure string builders.
- `go(view)` sets `enterNext = true`, which plays the staggered entrance animation once per page change. Sub-tab changes do not animate.
- Elements outside `#app` survive renders: `#pal` (command palette), `#coach` and `#cring` (tour box and spotlight ring), `#fairy` (desktop Archie), and `#mbub` (mobile hint bubble).

### Navigation

- `NAV = [home, map, practice, learn]`, labeled Home, **Campaign Mode**, Practice, Learn. The top bar (desktop) and the mobile pill render from it.
- `NAVG` maps internal views to their nav group: `guide` and `library` belong to `learn`; `cards` and `mock` belong to `practice`.
- `go('learn')` opens `store.lastLearn` (guide or library).
- The **Learn** tab row merges Guidebook and Library tabs (`learnHead()`); the **Practice** tab row includes Flashcards and Mock exam (`practiceHead()`). Cross-view tab clicks are routed in `extAct()`.

### Actions

A single document click listener routes `[data-go]` to `go()` and `[data-act]` to `act(name, dataset)`. `act()` first calls `extAct()` (in `app.js`), which handles the newer actions and returns true when it did. The full list of action names in use:

`again cardno cardyes cback cclose cdeck cdrill cfg cgo cguide check cjump clib cnext coach csel deck dnext dpick drillend drillstart endsess flag flip glevel gtab icat ltab mcancel mconfirm mfinish mflag missed mjump mnavtog mnext mockreset mockstart mprev next opendrill pal pick planstart ptab quick rate resetask resetno resetyes scdrill start tcat tsdrill`

Key ones: `quick` (10 questions, `data-d` domain or 0 for mixed), `tsdrill` (one task statement), `scdrill` (one scenario), `opendrill` (a drill), `csel` (map selection), `coach` (open the tour).

### Keyboard

- Ctrl or Cmd + K opens the command palette (`palAll()` lists every jump target).
- Practice: 1 to 8 pick options, Enter or N goes to the next question, F flags.
- Home: 1 to 6 open the study modes.
- Map: the actions panel hotkeys (A, R, S, T, X, M, P, H), and Esc clears the selection.
- Tour: arrow keys, and Esc closes it. Its listener runs in the capture phase so practice keys do not fire underneath.

### Scoring formulas

- Readiness per domain = `acc * min(1, seen / (0.6 * total))`, where `acc` uses the latest answer per question. Overall readiness weights the domains by exam weight.
- A task counts as mastered at 80% or more of latest answers correct (`tsState`: `own`, `cont`, `foe`, `fog`).
- Rough mock score = `100 + 900 * percent correct`, so 720 is about 69%. Copy always calls this an estimate and recommends aiming for 80%.

---

## 5. Feature guide (where each thing lives)

| Feature | Code |
| --- | --- |
| Home landing page and mode select (hero over the generated atlas art with a small "code gate" diagram, exam facts, 6 illustrated modes, what you get, what to expect, domain-to-product mapping, closing call to action) | `vHome()`, `MODES`, `MODE_ART` in `app.js` |
| Campaign Mode, the exam map (5 domain regions, 30 task markers, 6 scenario castles, 5 wrong-answer camps, fog, minimap, actions panel, goals) | `vMap()`, `campMap()`, `miniMap()`, `selPanel()`, `questLog()` in `app.js` |
| Practice questions, setup, results | `vPractice`, `vSetup`, `vSession`, `vSessionDone` in `template.html` |
| Drills (Spot the tell, Name the shape, Pick the axis) | `startDrill`, `vDrill` in `template.html`; data in `drills.js` |
| Mock exam (60 items, timer, flags, question map, score report) | `vMockIntro`, `vMockRun`, `vMockResult`, `mockStart`, `finishMock` in `template.html` |
| Flashcards (spaced repetition: 1, 3, 7, 14 days) | `vCards` in `template.html` |
| Learn: lessons (each with a working-flow diagram and a "Spot the trap" disclosure from `lessonVisual(d)`), items, trigger words, diagrams | `vGuide`, `vWalk`, `lessonVisual`, `vItems`, `vTrig`, `vMaps`, `DIAGS` in `guide.js` |
| Learn: decision rules, scenarios, study plan, syllabus | `vLibrary`, `vPlaybook`, `vScenarios`, `vPlan`, `vSyllabus` in `template.html` |
| Progress bar on every page | `hudHtml()` in `app.js` |
| Archie sprite (poses idle, cheer, dazed, point, fight) | `spr(pose)`, `archie(pose, text)`, `ARCH_DEFS` in `app.js` |
| Archie's contextual hints | `HFACT`, `HDOM`, `HVIEW`, `HDRILL`, `hintPool()`, `showHint()`, `hideHint()` in `app.js` |
| Desktop dock and flight | `#fairy`, `placeFairy()`, `syncFairy()`, `.rail .dock` |
| Mobile collapsible menu | `mnavHtml()`, `setMnav()`, `peekMnav()` in `app.js` |
| Guided tour (19 steps, front end and back end, all 5 domains) | `COACH`, `CODE`, `coachOpen/Step/Next/Back/Close`, `coachFocus` in `app.js` |

### Internal names versus what users see

The map began as a strategy-game "campaign". Code still uses game names; the UI uses plain ones. Keep the UI wording plain.

| Code name | UI wording |
| --- | --- |
| `campMap`, `camp`, view `map` | Campaign Mode |
| outpost, `ts:` | Task marker |
| `boss`, fortress, `BOSSES` | Exam scenario (castle icon) |
| `creep`, camp, `BEASTS` | Common wrong answer |
| `own`, `cont`, `foe`, `fog` | Mastered, In progress, Needs work, Not started yet |
| `quests` | Goals |
| `cmdcard` | Actions panel |
| hero unit, units | Decorative only |

### Archie's hint rules

- Desktop: Archie sits in `.dock` at the right of the top bar. On a hint he flies to the top right below the bar (`#fairy.hover`), shows a bubble for 10 seconds (paused while hovered), then flies back. Clicking him opens the tour.
- Mobile (860px and narrower): Archie stays in the bottom-left pill and never flies; the hint bubble (`#mbub`) appears above him.
- Triggers: 1.6 seconds after any page change, and 1.2 seconds after meaningful clicks (`HTRIG`). There is a 20 second cooldown. Hints are blocked during an active mock exam, while the tour is open, while the palette is open, or when the user turned them off.
- Context: the selected map item, the current lesson level, or the current question's domain picks `HDOM` facts; the view picks `HVIEW` tips; about 30% of the time a general `HFACT` fact appears instead.
- **Accuracy rule for hint text:** only add facts that are stable and verifiable from Anthropic's public docs or well-known history. Avoid prices, model names, context-window sizes, or dates that change.

### Mobile menu rules

The pill is open for a few seconds after every page change (4 seconds on first load, 3 seconds after), then collapses to Archie plus an arrow. The arrow reopens it for 6 seconds. Collapsed links get `inert` so they are not focusable.

### Guided tour rules

Each `COACH` step can set `view`, `sub`, `csel`, a spotlight selector `hl`, a `code` key into `CODE`, a domain `d` (adds a "Drill Domain N" button), a `pose`, and `end`. The spotlight selectors in use are `.modes`, `.mapwrap`, `.hud`, `.cmdcard`, `.quests`, `.chap`, `.trig`, `.panel`, and `#coach .cbox`. **If you rename these classes, update `COACH`.** The `CODE` snippets quote real app code (the click dispatcher, the store, the readiness formula, the mock confirm gate, `coachNext`, validator lines). If you change that code, update the snippet so the tour stays honest.

---

## 6. Styling system

All CSS lives in one `<style>` block in `src/template.html`, layered in this order (later blocks override earlier ones):

1. Base styles and original tokens (top of the file).
2. `/* ===== PS2-era war table ===== */`: the current visual identity. It forces a single dark theme by redefining tokens on `:root,:root:not([data-theme="light"]),:root[data-theme]`.
3. `/* ===== Archie ===== */`
4. `/* ===== coach tour ===== */`
5. `/* ===== Orchestrator Campaign ===== */` (the exam map)
6. `/* ===== landing ===== */` (Home)
7. `/* ===== top nav, Archie's dock, hints, mobile menu ===== */`
8. `src/design.css`, injected at `/*__DESIGN__*/`: the visual elevation pass. It wins over everything above.

**Visual direction (current):** a navy and gold game interface described in `DESIGN.md` as a "crisp tactical atlas": 12px panel radii, thin inner borders, restrained shadows, solid pale gold headings (not metallic gradients), solid gold primary buttons with navy text, purposeful motion (160, 280, and 420ms; no continuous background pan), and bespoke illustrations. Fonts: Marcellus (headings), Saira (body), Share Tech Mono (numbers and code), loaded from Google Fonts. Ground `#0C111B`, panels `#151D2B` and `#1C2738`, ink `#E6EAF2`, muted `#AAB6CA`. Domain colors: `--d1 #E0675A`, `--d2 #45B5C6`, `--d3 #E2A440`, `--d4 #A08AE6`, `--d5 #63BF6F`. Gold: `--gold #C9A55A`, `--goldhi #F2D894`. Domain colors mean domain membership; gold owns primary actions.

**Breakpoint:** 860px. Above it, the top bar shows the nav, Jump to, the streak, and Archie's dock. At or below it, the top bar shows only the brand and Jump to, and the bottom-left pill holds the nav.

**Accessibility habits to keep:** real `<button>` elements everywhere, `aria-current` on the active nav item and tabs, `aria-label` on icon-only controls, `prefers-reduced-motion` handling in every animated block, and text contrast of at least 4.5:1.

---

## 7. Content system

### Question schema

```js
{ id: "g-10", sc: 3, d: 1, ts: "1.1", r: 4,
  q: "Question text",
  o: ["Correct option first", "Distractor", "Distractor", "Distractor"],
  a: [0],
  e: "Why the correct option wins and why the others fail.",
  ext: 1,   // optional: tests a docs-only fact, shows a "Beyond the guide" tag
  off: 1 }  // optional: an official sample question
```

Rules (most enforced by `scripts/validate.js`):

- Author the correct option first; the app shuffles options at runtime.
- **Do not let the correct option be the longest.** Early versions leaked answers through length. The q-fix files rewrite distractors to fix this, and the validator prints how many questions still have the correct option longest (46 of 120 at last count). New questions should have distractors of similar length and equal plausibility.
- Never refer to options by letter in explanations.
- Multi-answer questions must say "Select TWO" or "Select THREE".
- `ts` must start with the domain number `d`.
- **No em dashes or en dashes anywhere.** This is the owner's standing preference for all writing, and the validator enforces it on questions and cards.

Current counts: 124 questions (D1 24, D2 21, D3 27, D4 29, D5 23); 12 official samples; 4 multi-answer questions.

### Other content

- **Cards** `{d, f, b}`: d 0 exam facts, 1 to 5 domains, 6 trigger words (generated from `TRIG`).
- **Ten decision rules** (`RULES` in `template.html`): 1 must-always means code; 2 judgment needs criteria and 2 to 4 examples; 3 fix the cheapest root cause first; 4 trust structured signals; 5 subagents start blank; 6 scope tools to the role; 7 distrust self-assessment; 8 structured errors, never hidden failures; 9 match the API to the latency need; 10 never lose provenance or facts.
- **Five wrong-answer shapes** (`SHAPENAMES`, `BEASTS`): a probabilistic fix for a deterministic need, over-engineered, solves the wrong problem, unreliable proxy, shifts the burden.
- **Trigger words** (`TRIG`, 29 rows `{t, a, w, v, n}`): verdict `v` is Solid, Refined, Careful, or Added, from checking a coworker's cheat sheet against the official guide. Keep that provenance when editing.
- **Study plan** (`PLAN` in `drills.js`): a "Fix list" block (`x:1`, not counted as a week) plus four weeks of checklist items.

---

## 8. Working agreements with the owner

These came from explicit feedback during development. Follow them unless he says otherwise.

- **Writing:** no em dashes, ever. Use a direct, plain voice with no corporate filler. Keep the copy approachable: heavy gaming jargon (an earlier "Warcraft III" pass) was rejected as off-putting. **Open question:** the owner asked for complete sentences during development, but the latest visual pass (`DESIGN.md`, "Show / Tell / Guide 60 / 30 / 10") shortened page copy to brief captions such as "Five domains. Thirty tasks." Confirm with the owner which style wins before rewriting copy. Never cut exam questions, explanations, or lesson facts to save words.
- **Design:** no "AI slop". That means no generic gradient hero, no purple-on-white, no left-border accent cards, no emoji, and no Inter, Roboto, or Arial. Each visual direction should be committed and specific. The arcade style was rejected as hard on the eyes, so keep motion and effects subtle.
- **Characters and brands:** Archie is an **original** character. Requests to imitate Anthropic's Claude mascot, the Wing Gundam head, or the Zelda fairy were declined; Archie only borrows the fairy's role as a guide. Do not add trademarked characters or logos. The tool must not present itself as an official Anthropic product.
- **Accuracy:** check claims about Anthropic products against the official exam guide or current docs before adding them. When the guide and the docs differ, say so in the content.

### Visual history (so you do not repeat rejected directions)

1. A light "study desk" dashboard. The owner called it generic.
2. A drafting-table blueprint pass. Rejected as still "AI slop".
3. A risograph print-zine pass, abandoned mid-build when the owner chose arcade.
4. Retro arcade (CRT, pixel fonts). Rejected as hard on the eyes.
5. **PS2 / Warcraft III-era.** Accepted as "much easier to read", then toned down to plain language.
6. **Visual elevation pass (current, commit `f69029c`).** Kept the navy and gold identity and the layout, added generated artwork, lesson diagrams, solid gold headings, calmer motion, and shorter copy. Documented in `DESIGN.md`.

A separate **Anthropic-brand Home mockup** exists as a Claude Design canvas: ivory `#FAF9F5`, slate `#141413`, clay `#D97757`, serif display over sans body, flat Archie, and an "unofficial" disclaimer in the header and footer. **The owner has not decided whether to adopt it across the tool.** Ask before restyling.

---

## 9. Testing checklist before you push

1. `node scripts/validate.js` reports 0 problems.
2. `python scripts/build.py`, then check that the script parses. One way: extract the `<script>` block and run `node --check` on it.
3. `python tests/test_ui.py` prints `errors []`, and `python tests/test_release.py` passes on all five device profiles. It also prints the mock item count (60), the trigger-word row count (29), actions for a selected map item, 19 tour steps, the hint text, mobile menu open-then-collapse, and `hscroll 0` (no horizontal scroll) for both viewports.
4. Look at the screenshots in `tests/screenshots/` for both `d-` (desktop) and `m-` (mobile).
5. Search for em and en dashes in anything you wrote.

---

## 10. Known gaps and tech debt

- **Dead code:** `vHomeOld()`, `traceHtml()`, and `heatHtml()` in `template.html` belong to retired home screens and are no longer called. `vBoss()` and `vBeast()` in `guide.js` are no longer routed (bosses and beasts now live on the map). Remove them carefully.
- **Layered CSS:** seven override blocks in `template.html` plus `design.css`, from successive redesigns. A consolidation pass would shrink the file, but check every view on both breakpoints afterward.
- **Single theme:** the app is dark-only by design. Light mode would need its own token set.
- **Local-only progress:** no sync between devices or people. A shared leaderboard would need a backend, which GitHub Pages cannot host.
- **Map on phones:** the map scrolls sideways (minimum width 760px) so markers stay tappable.
- **Fonts:** loaded from Google Fonts, so they fall back to system fonts offline.
- **Validator source:** `scripts/validate.js` contains literal dash characters inside its own dash-detecting regular expressions. That is intentional, but writing them as Unicode escapes (code points U+2014 and U+2013) would be cleaner.

## 11. Ideas the owner has raised or been offered

- Adopt the Anthropic-brand look across the whole tool (pending his decision).
- A shared team leaderboard or progress view (needs a backend).
- More questions for the weaker-covered task statements, kept to the same schema and balance rules.

## 12. Related assets outside the repo

These live in the owner's claude.ai account and are private unless he shares them.

- **Study guide (Claude Doc):** "Claude Certified Architect Foundations: Study Guide". It includes a "Gap fill from your colleagues' resources" section.
- **Published copy of the tool** (claude.ai artifact, same build as this repo).
- **Design canvas:** "CCAR-F Home Screen", the Anthropic-brand Home mockup.
- **Source documents:** the official exam guide PDF, plus two coworker documents (`CCA-F_Study_Plan_1.docx` and `AI_Architecture_Trigger_Words_CheatSheet.docx`) whose content was checked and folded into the trigger words, the fix list, and 12 gap-fill questions.

## 13. Sources

- Official Claude Certified Architect, Foundations exam guide (PDF, from the owner)
- Claude Code skills documentation: <https://code.claude.com/docs/en/skills>
- Anthropic, "Building effective agents": <https://www.anthropic.com/engineering/building-effective-agents>
- open-exam-prep.com CCA-F practice page (third party; broader scope than the official guide)
