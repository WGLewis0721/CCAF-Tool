Q.push(
{id:"s4-01",sc:4,d:2,ts:"2.5",r:0,q:"You need to find every place that calls the function `processInvoice` across a large codebase. Which built-in tool fits best?",
o:["Grep","Glob","Read","Write"],a:[0],
e:"Grep searches file contents for patterns such as function names, error messages, or imports. Glob matches file paths, Read loads a known file, and Write creates or overwrites files."},

{id:"s4-02",sc:4,d:2,ts:"2.5",r:0,q:"You want every test file matching `**/*.test.tsx`. Which built-in tool fits best?",
o:["Glob","Grep","Edit","Bash with a hand-written loop"],a:[0],
e:"Glob matches file paths by name or extension patterns. Grep is for content, and Edit modifies files."},

{id:"s4-03",sc:4,d:2,ts:"2.5",r:0,q:"An Edit call fails because the text you want to replace appears several times in the file and is not unique. What is the reliable fallback?",
o:["Read the full file, then Write the modified version","Retry the same Edit until it works","Use Grep to change the text","Delete the file and start over"],a:[0],
e:"Edit needs a unique match. When it cannot find one, load the whole file with Read and apply the change with Write."},

{id:"s4-04",sc:4,d:2,ts:"2.5",r:0,q:"You are exploring an unfamiliar codebase to understand a legacy payment flow. What is the best approach?",
o:["Start with Grep to find entry points, then Read files to follow imports and trace the flow incrementally","Read every file in the repository first, then start asking questions","Use Glob to list files and guess the architecture from names","Ask a teammate to explain it and skip exploring"],a:[0],
e:"Build understanding incrementally: find entry points with Grep, then follow the trail with Read. Loading everything up front wastes context and buries what matters."},

{id:"s4-05",sc:4,d:2,ts:"2.5",r:0,q:"Callers use a function through several wrapper modules that re-export it under different names. How do you trace all usages?",
o:["First identify all exported names from the wrapper modules, then search for each name across the codebase","Grep only for the original function name","Read the first wrapper and assume the rest are the same","Glob for files with 'wrapper' in the name"],a:[0],
e:"Searching only the original name misses usages through re-exports. Identify the exported names first, then search for each."},

{id:"s4-06",sc:4,d:2,ts:"2.4",r:1,q:"Your team shares an MCP server that needs a GitHub token. How should you configure it so every developer gets it without committing the secret?",
o:["Put it in the project's `.mcp.json` and reference the token with environment variable expansion such as `${GITHUB_TOKEN}`","Paste the token directly into `.mcp.json` and commit it","Put the server in each developer's `~/.claude.json` with the same token","Describe the token in `CLAUDE.md` for Claude to use"],a:[0],
e:"Project-scoped `.mcp.json` is shared through version control, and `${VAR}` expansion keeps credentials out of the file. Committing a secret is unsafe, and per-user config is not shared."},

{id:"s4-07",sc:4,d:2,ts:"2.4",r:0,q:"You want to try an experimental MCP server just for yourself, while the team's shared servers keep working. Where do you configure it, and what happens to the tools?",
o:["In user-scoped `~/.claude.json`; tools from all configured servers are discovered at connection time and available together","In the project `.mcp.json`; it replaces the team's servers","In `CLAUDE.md`; it loads only when you ask","In a separate project folder; only one server's tools can be active at a time"],a:[0],
e:"User scope is personal and experimental. Tools from every configured MCP server are available simultaneously, so personal and shared servers coexist."},

{id:"s4-08",sc:4,d:2,ts:"2.4",r:3,q:"Your MCP server exposes a capable code-search tool, but the agent keeps using built-in Grep instead. What is the cheapest fix?",
o:["Improve the MCP tool's description to explain what it does, what it returns, and how it is better than Grep for these cases","Disable Grep globally","Add few-shot examples of using the MCP tool","Rewrite the server in a different language"],a:[0],
e:"Descriptions drive tool choice. A thin MCP description loses to a familiar built-in. Better descriptions come first, before removing tools or adding examples."},

{id:"s4-09",sc:4,d:2,ts:"2.4",r:0,q:"Your team wants Jira integration for the agent. What is the best approach?",
o:["Use an existing community MCP server for Jira, and reserve custom servers for team-specific workflows","Build a custom Jira MCP server from scratch for control","Paste Jira API docs into the prompt","Have developers copy tickets in by hand"],a:[0],
e:"For standard integrations, prefer an existing server. Build custom ones only when the workflow is unique to your team."},

{id:"s4-10",sc:4,d:2,ts:"2.4",r:0,q:"Agents make many exploratory tool calls just to discover which issues, documents, or database tables exist. How can you reduce that?",
o:["Expose the content catalog (issue summaries, documentation hierarchy, schemas) as MCP resources so the agent sees what is available up front","Increase the number of tools","Tell the agent to guess where data lives","Lower the model's temperature"],a:[0],
e:"MCP resources are for exposing content catalogs, which gives visibility without exploratory calls. Tools are for actions."},

{id:"s4-11",sc:4,d:1,ts:"1.6",r:0,q:"Your request is open-ended: 'add comprehensive tests to this legacy codebase'. Which decomposition strategy fits?",
o:["Map the structure first, identify high-impact areas, then build a prioritized plan that adapts as dependencies are discovered","A fixed pipeline: test every file alphabetically in one pass","Write tests for the first file and stop","Generate a plan once and never revise it"],a:[0],
e:"Open-ended investigation tasks need adaptive decomposition that responds to discoveries. A rigid sequence cannot anticipate dependencies."},

{id:"s4-12",sc:4,d:1,ts:"1.6",r:0,q:"Which task is the best fit for prompt chaining (a fixed sequence of steps) rather than dynamic decomposition?",
o:["A predictable multi-aspect review: analyze each file individually, then run a cross-file integration pass","Diagnosing an unknown production outage","Exploring an unfamiliar legacy system to find where to start","Planning a migration whose scope is not yet known"],a:[0],
e:"Chaining fits predictable, repeatable structure. Open-ended or unknown-scope work needs plans that adapt to what is discovered."},

{id:"s4-13",sc:4,d:1,ts:"1.7",r:0,q:"You investigate a bug across several work sessions and want to continue the same conversation each morning. What do you use?",
o:["Resume a named session with `--resume <session-name>`","Start fresh each day and re-explain everything","Copy the previous day's terminal output into a new prompt","Use `-p` mode"],a:[0],
e:"Named sessions let you pick up a specific prior conversation. `-p` is non-interactive mode, not session continuation."},

{id:"s4-14",sc:4,d:1,ts:"1.7",r:0,q:"You finished analyzing a codebase and now want to compare two refactoring approaches independently from that shared analysis. What fits?",
o:["Fork the session (`fork_session`) to create independent branches from the shared baseline","Run both approaches in the same session and mix the results","Start two sessions with no analysis","Pick one approach without exploring the other"],a:[0],
e:"Forking creates independent branches from a common baseline, which is what comparing divergent approaches needs."},

{id:"s4-15",sc:4,d:3,ts:"3.4",r:0,q:"A multi-phase task begins with a long discovery phase that produces verbose output and threatens to exhaust the context window. What helps?",
o:["Use the Explore subagent to isolate verbose discovery and return summaries to the main conversation","Paste the discovery output into the main conversation so nothing is lost","Skip discovery","Restart the conversation after every command"],a:[0],
e:"The Explore subagent keeps verbose discovery out of the main context and returns just the summary."},

{id:"s4-16",sc:4,d:3,ts:"3.1",r:0,q:"A monorepo has packages with different standards. You want each package's `CLAUDE.md` to include only the standards relevant to it, maintained by the people who know the package. What fits?",
o:["Use `@import` in each package's `CLAUDE.md` to pull in just the relevant standards files","Copy all standards into every package","Put every standard in the root file only","Rely on developers to remember"],a:[0],
e:"`@import` keeps `CLAUDE.md` modular and lets each package include exactly what it needs."},

{id:"s4-17",sc:4,d:3,ts:"3.3",r:0,q:"Rules for Terraform should only be in context while Claude is editing Terraform files. What do you create?",
o:["A file in `.claude/rules/` with frontmatter `paths: [\"terraform/**/*\"]`","A skill named terraform that developers must invoke","A section in the user-level `CLAUDE.md`","A comment at the top of every Terraform file"],a:[0],
e:"Path-scoped rules load only when matching files are being edited, saving context and avoiding irrelevant instructions."},

{id:"s4-18",sc:4,d:3,ts:"3.2",r:0,q:"Which belongs in `CLAUDE.md` and which in a skill? Choose the best rule of thumb.",
o:["Always-loaded universal standards go in `CLAUDE.md`; on-demand, task-specific workflows go in skills","Everything goes in `CLAUDE.md`","Everything goes in skills","Standards go in skills; workflows go in `CLAUDE.md`"],a:[0],
e:"`CLAUDE.md` is always loaded, so keep it for universal standards. Skills load on demand for specific workflows."},

{id:"s4-19",sc:4,d:5,ts:"5.4",r:0,q:"While the main agent coordinates a large codebase investigation, you need answers to specific questions such as 'find all test files' and 'trace refund flow dependencies'. What is the best approach?",
o:["Spawn subagents for each specific question while the main agent keeps high-level coordination","Have the main agent do every search itself in one long thread","Ask the user to run the searches","Skip the questions"],a:[0],
e:"Delegating specific questions isolates verbose output and lets the main agent preserve high-level understanding."}
);
