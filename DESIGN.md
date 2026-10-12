# ARCHIE / CCAR-F visual system

Preservation upgrade for learners preparing for Claude Certified Architect, Foundations. Keep the current section order, navigation, six mode actions, question content, storage key, game map, and Archie identity. Production remains GitHub Pages, built by Python into a static page.

Design read: crisp tactical atlas, with polished game illustrations and practical visual teaching. DESIGN_VARIANCE 4, MOTION_INTENSITY 4, VISUAL_DENSITY 3. The current layout is approved; no separate wireframe is needed. This is a custom game interface, not a new third-party design system.

Show / Tell / Guide target is a visual communication budget of 60 / 30 / 10, not a word-count formula. Show: illustrations, existing live map, diagrams, recognizable mode symbols, actual progress. Tell: short headers and captions. Guide: optional reasoning, contextual Archie, existing actions. Never cut exam questions, answer explanations, or lesson facts to meet a visual ratio.

Typography: preserve Marcellus for game identity and display headings, Saira for readable UI/body, Share Tech Mono for task IDs and numeric telemetry. Hero 40-54px desktop and 32-38px mobile; page headings 32-44px; body 16px at 1.6; supporting text 14px at 1.5; headings in solid pale gold, not metallic gradients. All fonts are Google Fonts with display=swap.

Palette: deep navy ground #0C111B, panels #151D2B and #1C2738, ink #E6EAF2, muted #AAB6CA, gold #C9A55A, gold highlight #F2D894. Preserve the domain colors: coral #E0675A, cyan #45B5C6, amber #E2A440, lilac #A08AE6, green #63BF6F. Domain colors communicate domain membership; gold owns primary actions. Preserve one dark theme in all OS color schemes.

Rhythm: spacing 4 / 8 / 12 / 16 / 24 / 32 / 48. Main width 1120px. Panel radii 12px, controls 8px, tags 4px. Thin consistent inner borders, restrained shadows. Primary action solid gold with navy text; secondary navy with visible border. Touch controls at least 44px, stable keyboard focus.

Homepage: same hero, facts, modes, included materials, study loop, product/domain mapping, and final actions. Remove redundant paragraphs. Hero teaches one decision rule visually before asking for study effort; optional native disclosure explains it. Mode illustrations support the existing six actions. Display real counts and actual readiness only.

Lessons: show the existing relevant working flow diagram near the lesson summary. Preserve every key move, objective, trap, tip, checkbox and practice action. Use optional disclosure for supplementary prose where practical.

Motion: corporate and purposeful. Easing cubic-bezier(.2,0,0,1). Quick 160ms, standard 280ms, entry 420ms. Entrance travels at most 12px; no continuous background pan. Hover can lift 2px; press scales to .99. Native disclosures require no animation. Reduced motion disables all CSS animation/transition and SVG SMIL motion. No scroll handlers or animation dependency.

Responsive: desktop uses the existing horizontal nav and content layout; mobile retains Archie's compact menu, constrained to viewport at 320px. Modes use two columns where readable and one below 360px. Hero reflows to copy then visual lesson. All diagram SVGs scale to width with readable text; exam map retains deliberate local panning rather than document overflow.

Research: inspected live source/site and learning references https://brilliant.org/ and https://www.duolingo.com/. Principles: show a concept, offer contextual feedback, use short captions and recognizable illustrations. Do not copy their assets, layout, or claims. Warcraft reference was inaccessible; existing approved game identity is authoritative.

Skipped: new wireframes, new framework, external icon library, Cloudflare hosting. Reason: approved layout, working vanilla architecture, recognizable existing icons, and explicit GitHub Pages target. Existing legal wording and nav remain intact.
