# ARCHIE CCAR-F Study Tool

Unofficial browser study tool for Claude Certified Architect, Foundations. Production, not a fictional demo. Primary actions: guided tour, practice, Campaign Mode, flashcards, mock exam, lessons. Preserve the gamified navy/gold identity, five domain colors, Archie's original dialogue and personality settings, navigation, learning content, and local-storage key ccarf-study-v1.

Vanilla HTML/CSS/JS, combined by scripts/build.py. No backend, account, API secret, or runtime build tooling. GitHub Pages URL: https://wglewis0721.github.io/CCAF-Tool/ ; workflow .github/workflows/pages.yml deploys main.

Design: DESIGN.md. Assets: VISUAL-PLAN.md and src/assets/. Functional regression: tests/test_ui.py. Responsive release checks: tests/test_release.py.

Approved implementation: IMPLEMENTATION-PLAN.md. src/experience.js and src/experience.css provide source-linked study journeys, hash routes, shared map/written selection, and restrained motion. Official page/task references: src/content/sources.js. Learn begins with Study plan; Lessons are worked teaching examples, Diagrams are complete mechanism references, and Trigger Words retains the original three-column format.

Additional checks: scripts/check_bundle.py, tests/test_experience.py, tests/test_motion.py. Keep all existing study-plan completion IDs and original learning/question/card data. Do not reinstate the rejected hero artwork or homepage code-gate card. The user explicitly authorized this release on main.
