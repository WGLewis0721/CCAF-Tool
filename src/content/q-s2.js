Q.push(
{id:"s2-01",sc:2,d:3,ts:"3.2",r:0,off:1,q:"You want a custom `/review` slash command that runs your team's standard code review checklist and is available to every developer when they clone or pull the repository. Where should the command file go?",
o:["In the `.claude/commands/` directory inside the project repository","In `~/.claude/commands/` in each developer's home directory","In the `CLAUDE.md` file at the project root","In a `.claude/config.json` file with a commands array"],a:[0],
e:"Project-scoped commands live in `.claude/commands/`, are version-controlled, and reach everyone who clones the repo. The home-directory location is personal and not shared. `CLAUDE.md` holds instructions and context, not command definitions, and the config file option does not exist."},

{id:"s2-02",sc:2,d:3,ts:"3.4",r:0,off:1,q:"You are restructuring the team's monolithic application into microservices. The work touches dozens of files and requires decisions about service boundaries and module dependencies. Which approach should you take?",
o:["Enter plan mode to explore the codebase, understand dependencies, and design an approach before making changes","Start with direct execution and let the right service boundaries emerge as you change code","Use direct execution with detailed upfront instructions describing exactly how each service must be structured","Begin in direct execution and switch to plan mode only if unexpected complexity appears"],a:[0],
e:"Plan mode is built for large-scale changes, multiple valid approaches, and architectural decisions. Starting directly risks costly rework when dependencies are discovered late. Detailed instructions assume you already know the structure, and the complexity is already evident, not something that might emerge later."},

{id:"s2-03",sc:2,d:3,ts:"3.3",r:0,off:1,q:"Your codebase has areas with different conventions: React components use hooks, API handlers use async/await with specific error handling, and database models use a repository pattern. Test files sit next to the code they test (for example `Button.test.tsx` beside `Button.tsx`), and all tests must follow the same conventions. What is the most maintainable way to have Claude apply the right conventions automatically?",
o:["Create `.claude/rules/` files with YAML frontmatter `paths` glob patterns that activate conventions based on file paths","Put all conventions in the root `CLAUDE.md` under headers and rely on Claude to infer which section applies","Create a skill for each code type that includes its conventions in `SKILL.md`","Place a separate `CLAUDE.md` in each subdirectory containing that area's conventions"],a:[0],
e:"Glob-scoped rules (such as `**/*.test.tsx`) load by file type regardless of directory, which is exactly what tests spread across the tree need. Inferring from headers is unreliable, skills need explicit invocation or Claude's choice, and subdirectory `CLAUDE.md` files are directory-bound."},

{id:"s2-04",sc:2,d:3,ts:"3.1",r:0,q:"A new teammate cloned the repo and Claude ignores the team's coding standards. You discover the standards live in the lead's `~/.claude/CLAUDE.md`. What is the fix?",
o:["Move the standards into the project-level `CLAUDE.md` (root or `.claude/CLAUDE.md`) and commit it","Ask each teammate to copy the lead's home-directory file","Paste the standards into every prompt","Put the standards in `CLAUDE.local.md` and commit it"],a:[0],
e:"User-level files apply only to that user and are not shared through version control. Project-level files travel with the repo. Copying files or pasting standards shifts the burden onto each person, and `CLAUDE.local.md` is for personal, uncommitted notes."},

{id:"s2-05",sc:2,d:3,ts:"3.1",r:0,q:"The root `CLAUDE.md` has grown to hundreds of lines mixing testing rules, API conventions, and deployment steps. Claude follows it inconsistently. What is the best restructuring?",
o:["Split it into focused topic files under `.claude/rules/` (for example `testing.md`, `api-conventions.md`, `deployment.md`) and use `@import` where a package needs specific standards","Add more detail to the root file so nothing is ambiguous","Rename it to `INSTRUCTIONS.md` so it is treated as higher priority","Move everything into a skill so it loads on demand"],a:[0],
e:"Large monolithic files dilute adherence. Topic-specific rule files and `@import` keep each concern focused. More detail makes it longer, renaming has no effect, and universal standards belong in always-loaded memory rather than on-demand skills."},

{id:"s2-06",sc:2,d:3,ts:"3.1",r:0,q:"Claude behaves differently for two developers working in the same repository. Which command helps you see which memory files are actually loaded in each session?",
o:["`/memory`","`/compact`","`/plan`","`/resume`"],a:[0],
e:"`/memory` shows which memory files (CLAUDE.md and others) are loaded, which is the first diagnostic for inconsistent behavior across sessions. `/compact` reduces context, and the others are unrelated to configuration."},

{id:"s2-07",sc:2,d:3,ts:"3.2",r:0,q:"A team skill that analyzes the whole codebase prints thousands of lines of output that flood the main conversation. How do you keep that output out of the main context?",
o:["Set `context: fork` in the skill's SKILL.md frontmatter so it runs in an isolated sub-agent context","Add `allowed-tools: Read` to the frontmatter","Rename the skill so it is not auto-suggested","Move the skill's contents into `CLAUDE.md`"],a:[0],
e:"`context: fork` runs the skill in an isolated context so verbose or exploratory output does not pollute the main session. `allowed-tools` restricts tool access, not output volume, and putting it in `CLAUDE.md` would load it every session."},

{id:"s2-08",sc:2,d:3,ts:"3.2",r:1,q:"A skill generates documentation and should only be able to read and write files, never run shell commands that could delete anything. How do you enforce that?",
o:["Configure `allowed-tools` in the skill's frontmatter to limit it to file read and write tools","Add a sentence to the skill body saying 'never run destructive commands'","Ask developers to watch the output and stop it if needed","Run the skill with `context: fork`"],a:[0],
e:"Restricting tool access is a configuration control, not a request. A prose instruction is probabilistic, manual watching shifts the burden, and `context: fork` isolates context but does not limit tools."},

{id:"s2-09",sc:2,d:3,ts:"3.2",r:0,q:"Developers often run a `/fix-ticket` skill without giving the ticket ID, and it fails. Which frontmatter field prompts them for the missing parameter?",
o:["`argument-hint`","`context`","`allowed-tools`","`paths`"],a:[0],
e:"`argument-hint` tells developers what argument the skill expects when they invoke it without one. `context` sets isolation, `allowed-tools` limits tools, and `paths` belongs to rules files."},

{id:"s2-10",sc:2,d:3,ts:"3.2",r:0,q:"You want your own variation of a team-wide skill without changing it for teammates. What should you do?",
o:["Create a personal skill in `~/.claude/skills/` with a different name","Edit the shared skill in `.claude/skills/` and avoid committing the change","Add your variation to the team `CLAUDE.md`","Rename the team skill locally"],a:[0],
e:"Personal skills in your home directory affect only you, and a different name avoids colliding with the team skill. Editing the shared file risks leaking the change, and the `CLAUDE.md` option modifies shared instructions."},

{id:"s2-11",sc:2,d:3,ts:"3.4",r:0,q:"A single-file bug has a clear stack trace pointing at one function. What approach fits?",
o:["Direct execution: fix it right away","Plan mode first, with a full architecture review","Spawn a research subagent to survey the whole codebase before touching the file","Write a design document and get approval before editing"],a:[0],
e:"Simple, well-scoped changes with a known cause are for direct execution. The other options add ceremony the task does not need (over-engineered)."},

{id:"s2-12",sc:2,d:3,ts:"3.4",r:0,q:"You must migrate a library that affects 45+ files, and two integration approaches have different infrastructure requirements. What is the best workflow?",
o:["Use plan mode to investigate and choose the approach, then switch to direct execution to implement the plan","Use direct execution from the start and adapt as you go","Use plan mode for the whole task, including every file edit","Ask the team to pick the approach without exploring the code"],a:[0],
e:"Combine them: plan mode for investigation and the architectural decision, direct execution for the implementation once the approach is settled. Starting directly risks rework, and deciding without exploration guesses at the structure."},

{id:"s2-13",sc:2,d:3,ts:"3.5",r:2,q:"You describe a data transformation in prose, but Claude's output varies between runs. What most improves consistency?",
o:["Provide 2 to 3 concrete input and output examples of the transformation","Rewrite the description with more adjectives","Ask Claude to be more careful","Repeat the instruction three times"],a:[0],
e:"Concrete input/output examples are the most effective way to communicate an expected transformation when prose is interpreted inconsistently. More words or emphasis do not remove the ambiguity."},

{id:"s2-14",sc:2,d:3,ts:"3.5",r:0,q:"You are building a feature in an unfamiliar domain (a caching layer) and worry you have not thought of every design consideration. Which technique helps most before implementation?",
o:["The interview pattern: have Claude ask you questions that surface considerations such as cache invalidation and failure modes","Ask Claude to implement immediately and fix issues as they appear","Write a longer first prompt that guesses every requirement","Skip design and rely on test failures later"],a:[0],
e:"The interview pattern surfaces considerations you may not have anticipated, such as invalidation strategies and failure modes, before any code is written."},

{id:"s2-15",sc:2,d:3,ts:"3.5",r:0,q:"You found three problems: the first two interact (fixing one changes the other), and the third is unrelated. How should you give feedback?",
o:["Describe the two interacting problems together in one detailed message, and handle the unrelated one separately","Send all three in separate messages, one at a time","Send all three in one message regardless","Fix them in random order"],a:[0],
e:"Interacting problems must be addressed together because the fixes depend on each other. Independent problems can be fixed sequentially."},

{id:"s2-16",sc:2,d:1,ts:"1.7",r:0,q:"You resume a named session after teammates changed several files you had analyzed earlier. What should you do?",
o:["Tell the agent which files changed so it re-analyzes them in a targeted way","Resume silently; the agent will notice the changes on its own","Force a full re-exploration of the codebase","Delete the session and never resume again"],a:[0],
e:"Resumption keeps valid context, but the agent does not know about changes made since. Telling it which files changed gives targeted re-analysis without paying for a full re-exploration."},

{id:"s2-17",sc:2,d:1,ts:"1.7",r:0,q:"A session's earlier tool results are mostly stale after a large refactor. What is the more reliable choice?",
o:["Start a new session seeded with a structured summary of the important findings","Resume the old session and trust its tool results","Fork the session so both versions of the stale results exist","Increase the context window"],a:[0],
e:"Stale tool results make a resumed session unreliable. A fresh session with an injected structured summary keeps what is still true and drops what is not."},

{id:"s2-18",sc:2,d:5,ts:"5.4",r:0,q:"During a long exploration of a large codebase the agent starts answering with 'typical patterns' instead of the specific classes it found earlier. Which TWO practices counteract this context degradation? Select TWO.",
o:["Have the agent keep a scratchpad file of key findings and refer back to it","Delegate verbose exploration to subagents that return summaries while the main agent coordinates","Stop using Grep and read entire directories up front","Tell the agent to try harder to remember"],a:[0,1],
e:"Scratchpad files persist key findings across context boundaries, and subagents absorb verbose discovery output so the main context stays focused. Reading everything up front makes the problem worse, and exhortation changes nothing."},

{id:"s2-19",sc:2,d:5,ts:"5.4",r:0,q:"Your exploration session is filling up with verbose discovery output but you want to continue the same work. Which built-in command reduces context usage?",
o:["`/compact`","`/memory`","`--resume`","`/init`"],a:[0],
e:"`/compact` condenses the conversation to free context during extended sessions. `/memory` inspects memory files and `--resume` continues a prior session."},

{id:"s2-20",sc:2,d:5,ts:"5.4",r:10,q:"A multi-agent pipeline crashes halfway through. You want it to resume without redoing finished work. Which design supports that?",
o:["Each agent exports its state to a known location, and the coordinator loads a manifest of that state on resume and injects it into agent prompts","Rerun everything from the start every time","Keep all state only in the model's memory of the conversation","Ask each agent to remember what it did"],a:[0],
e:"Structured state persistence plus a manifest the coordinator loads is the crash-recovery pattern. Without it, the state lives only in a conversation that no longer exists."}
);
