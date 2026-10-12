# CCAF-Tool

Started studying for the CCAF, ended up creating a gamified study tool for it.

CCAF-Tool is an unofficial study tool for the **Claude Certified Architect, Foundations** exam (exam code CCAR-F). It runs entirely in the browser as a single HTML page, so there is no server, database, or account to set up.

> This project is not affiliated with or endorsed by Anthropic. The content is built from the public exam guide and Anthropic's public documentation.

## What's inside

- **Home:** A landing page where you pick a study mode. Number keys 1 to 6 open each mode.
- **Exam map:** All 30 task statements on one map, colored by how well you know each one, with the six exam scenarios and the five common wrong-answer patterns.
- **Practice:** 124 scenario questions with explanations, 128 flashcards with spaced repetition, a timed 60-question mock exam, and three quick drills.
- **Learn:** A lesson for each of the five domains, ten decision rules, six scenario briefs, trigger words, diagrams, and a four-week study plan.
- **Archie:** A guide who docks in the menu and offers tips and facts based on the screen you are on. His 19-step tour explains each exam domain using this app's own code.

Your progress is saved in your browser's local storage. Each person and each browser keeps separate progress, and clearing site data resets it. You can turn Archie's hints on or off from **Jump to** (Ctrl K or Cmd K).

## Run it locally

You need **Python 3.9 or later** to build the page. **Node.js 18 or later** is only needed for the validation step.

1. Clone the repository.

   ```bash
   git clone https://github.com/WGLewis0721/CCAF-Tool.git
   cd CCAF-Tool
   ```

2. Build the page. This writes `dist/index.html`.

   ```bash
   python scripts/build.py
   ```

3. Open the page. You can open `dist/index.html` in your browser directly, or serve the folder:

   ```bash
   python -m http.server 8000 --directory dist
   ```

   Then visit <http://localhost:8000>.

4. (Optional) Check the question bank before you commit changes:

   ```bash
   node scripts/validate.js
   ```

## Deploy to GitHub Pages

The workflow in `.github/workflows/pages.yml` validates the content, builds the page, and publishes it with GitHub Actions.

1. In the repository on GitHub, open **Settings**, then **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main`, or open the **Actions** tab, choose **Build and deploy to GitHub Pages**, and select **Run workflow**.
4. When the run finishes, the site is live at `https://wglewis0721.github.io/CCAF-Tool/`. The exact address also appears on the Pages settings screen and in the deploy step of the workflow run.

Every later push to `main` rebuilds and redeploys the site automatically. If validation finds a problem, the run stops before anything is deployed, and the log lists the failing questions.

## Project structure

```text
.github/workflows/pages.yml   Build and deploy workflow for GitHub Pages
scripts/build.py              Combines the source files into one HTML page
scripts/validate.js           Checks the question bank and flashcards
src/template.html             Page shell, styles, and core app logic
src/app.js                    Exam map, Archie, hints, the guided tour, and the home page
src/guide.js                  Lessons, items, trigger words, and diagrams
src/content/q-s1.js ... q-s7.js   Questions, grouped by scenario
src/content/q-fix*.js         Patches that rebalance answer-option lengths
src/content/cards.js          Flashcards
src/content/drills.js         Drill items and the study plan
tests/test_ui.py              Optional end-to-end browser test
```

The build inserts `src/app.js` at the `/*__APP__*/` marker and all content at the `/*__DATA__*/` marker in `src/template.html`. The output is one self-contained file. Fonts load from Google Fonts.

## Adding or editing questions

Each question is one object in a `src/content/q-*.js` file:

```js
{ id: "g-10", sc: 3, d: 1, ts: "1.1", r: 4,
  q: "The question text",
  o: ["The correct option", "Distractor", "Distractor", "Distractor"],
  a: [0],
  e: "Why the correct option wins and why the others fail." }
```

| Field | Meaning |
| --- | --- |
| `id` | A unique id |
| `sc` | Scenario number, 1 to 6 |
| `d` | Domain number, 1 to 5 |
| `ts` | Task statement, such as `1.1`; its first digit must match `d` |
| `r` | Decision rule number, 1 to 10, or 0 for none |
| `o` | At least four options; list the correct one first, because the app shuffles them |
| `a` | Index of the correct option or options |
| `e` | The explanation shown after answering |

A few house rules, which the validator enforces:

- Don't use em dashes or en dashes.
- Don't refer to options by letter in explanations, because the options shuffle.
- A question with more than one correct answer must say "Select TWO" or "Select THREE".

If you add a new question file, add its name to the lists in both `scripts/build.py` and `scripts/validate.js`.

## Optional browser test

The end-to-end test clicks through every screen on a desktop and a phone-sized window and saves screenshots to `tests/screenshots/`.

```bash
pip install playwright
python -m playwright install chromium
python scripts/build.py
python tests/test_ui.py
```

## Sources

- The official Claude Certified Architect, Foundations exam guide
- [Claude Code documentation](https://code.claude.com/docs)
- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
