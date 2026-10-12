/* ===== Guidebook data and views (concatenated into the app scope) ===== */
const GLEVELS=[null,
{tag:'The boss rush. More than a quarter of your score lives here.',
 moves:[
  'Loop on <code>stop_reason</code>. <code>tool_use</code> means run the tools, append the results, and call again. <code>end_turn</code> means stop.',
  'Anything that must always happen belongs in a hook or a prerequisite gate. A prompt is a request, not a guarantee.',
  'Subagents start blank. Put the complete findings in each prompt, and let the coordinator route everything between them.',
  'Spawn subagents in parallel with several <code>Task</code> calls in one response. The coordinator\'s <code>allowedTools</code> must include <code>Task</code>.',
  'Decompose open-ended work adaptively. Use a fixed prompt chain only when the steps are predictable.',
  'Resume a named session with <code>--resume</code>, branch it with <code>fork_session</code>, and after a big change either name the changed files or start fresh from a summary.'],
 foes:['Stopping when the reply contains the word "done" or any text at all','An iteration cap used as the stopping rule','Assuming subagents share memory or inherit context','Blaming a subagent when the coordinator split the topic too narrowly','"NEVER" in capitals for a rule that must always hold'],
 tip:'If a question stem says always, never, or involves money, think "hook" before you read the options.',
 secret:'If every subagent did its job and the report is still thin, the coordinator\'s decomposition is the culprit.'},
{tag:'The item shop. Good descriptions are your cheapest weapon.',
 moves:[
  'Tool descriptions drive selection. Say what the tool does, what it takes, what it returns, and when not to use it. Fix descriptions before building routers.',
  'Return structured errors: category, whether it is retryable, what was attempted, and any partial results. An empty result is not a failure.',
  'Give each agent four or five tools for its role. Add one scoped cross-role tool, such as <code>verify_fact</code>, for frequent needs.',
  '<code>tool_choice</code>: <code>auto</code> may reply in plain text, <code>any</code> forces some tool, a named tool forces that tool, <code>none</code> disables tools.',
  'Shared MCP servers go in project <code>.mcp.json</code> with <code>${ENV_VAR}</code> expansion. Personal ones go in <code>~/.claude.json</code>. All configured servers\' tools load together.',
  'Grep searches contents, Glob matches paths, Read loads a file, and Edit needs a unique match. If it has none, Read the file and Write the new version.',
  'Expose catalogs of issues, docs, or schemas as MCP resources so agents stop making exploratory calls.'],
 foes:['Merging confusable tools before trying better descriptions','A generic "operation failed" for every error','One agent holding eighteen tools','A secret pasted into <code>.mcp.json</code>','Grep and Glob swapped'],
 tip:'When two tools get confused, the cheap fix is the description. Routers and merges are the expensive answer the exam hides beside it.',
 secret:'A thin MCP tool description loses to a familiar built-in like Grep, so the capable tool never gets used.'},
{tag:'The rulebook. Know where each file lives and who gets it.',
 moves:[
  'Project <code>CLAUDE.md</code> travels with the repo. <code>~/.claude/CLAUDE.md</code> does not. Split a bloated file with <code>@import</code> and <code>.claude/rules/</code>.',
  'Path-scoped rules (<code>.claude/rules/</code> with <code>paths:</code> globs) load by file type anywhere in the tree. Directory <code>CLAUDE.md</code> files cannot follow a pattern across folders.',
  'Skills load on demand. <code>context: fork</code> isolates noisy output, <code>allowed-tools</code> restricts tools, and <code>argument-hint</code> prompts for a missing argument. Personal skills live in <code>~/.claude/skills/</code>.',
  'Team slash commands live in <code>.claude/commands/</code> inside the repo.',
  'Plan mode for large, multi-file, or ambiguous work. Direct execution for clear small fixes. For big migrations, plan first and then execute.',
  'Refine with concrete input and output examples, test-driven iteration, and the interview pattern. Send interacting problems in one message.',
  'In CI use <code>claude -p</code>. Add <code>--output-format json</code> with <code>--json-schema</code> for machine-readable output, and feed prior findings in to avoid duplicate comments.',
  '<code>/memory</code> shows which memory files are loaded. <code>/compact</code> trims the context.'],
 foes:['Standards that live only in a lead\'s home directory','A CLAUDE.md in every folder for test files scattered across the tree','A "never" rule that exists only as prose','Plan mode for a one-line fix','Interactive <code>claude</code> inside a pipeline'],
 tip:'Ask two questions: where does the file live, and who gets it? Shared means project scope. Personal means home scope.',
 secret:'<code>allowed-tools</code> limits tools. <code>context: fork</code> limits noise. The exam loves offering one as the answer to the other\'s problem.'},
{tag:'The spell book. Criteria, examples, and schemas beat adjectives.',
 moves:[
  'Replace "be conservative" with explicit categorical criteria: what to report, what to skip, and a concrete example for each severity level.',
  'Two to four targeted few-shot examples of ambiguous cases, showing why one action beat the plausible alternatives. Examples also fix output format.',
  'Use <code>tool_use</code> with a JSON schema for reliable structure. Use <code>tool_choice: any</code> when the document type is unknown.',
  'Schemas remove syntax errors, not semantic ones. You still check that totals add up and values sit in the right field.',
  'Make a field nullable when the source may be silent. Add <code>other</code> plus a detail string, and <code>unclear</code>, to enums.',
  'Retry with the document, the failed output, and the specific error. A retry cannot recover information that is absent from the source.',
  'Batches are 50% cheaper, take up to 24 hours, have no latency SLA, and correlate with <code>custom_id</code>. Blocking checks stay synchronous. Tune the prompt on a sample first.',
  'Review in focused per-file passes plus an integration pass, with an independent reviewer instance rather than the generator\'s own session.'],
 foes:['A required field that forces the model to invent a value','Majority voting that suppresses real but intermittent bugs','Batch processing for a pre-merge check','Asking the generating session to review itself','Retrying a value that is simply not in the document'],
 tip:'Schema questions follow one rule: syntax errors vanish, semantic errors stay. A wrong value in the right field means validation logic.',
 secret:'Batches cannot run tools mid-request. Any multi-turn tool loop needs the synchronous API.'},
{tag:'The survival guide. Keep the facts, show your sources, escalate honestly.',
 moves:[
  'Keep a case-facts block (amounts, dates, IDs) outside the running summary so exact facts survive a long session.',
  'Put key instructions at the start of long inputs. Models handle the beginning and end best, and the middle worst.',
  'Escalate on an explicit request for a human, a policy gap, or no progress. Not on sentiment, and not on self-reported confidence.',
  'Propagate structured errors with the attempted query, partial results, and alternatives. Recover locally first, then pass up what is left.',
  'Delegate verbose exploration to subagents, keep a scratchpad file of key findings, use <code>/compact</code>, and persist state so a crashed pipeline can resume.',
  'Validate accuracy by document type and field before automating. Sample high-confidence outputs. Calibrate thresholds on labeled data.',
  'Preserve provenance with claim and source pairs plus dates, and annotate conflicting numbers instead of picking one.'],
 foes:['A 97% aggregate hiding a weak document type','Escalating on negative sentiment','One number chosen from two conflicting sources','"Typical patterns" replacing the specific classes found earlier','Asking the customer to repeat details the agent should have kept'],
 tip:'The 97% trap: whenever a stem quotes one overall accuracy number, ask which segment it is hiding.',
 secret:'An empty search result is an answer. A timeout is a failure. Never present one as the other.'}];

const BOSSES=[null,
 {name:'The Escalation Maze',weak:[1,3,7,10],plan:'Gate the must-always rule in code first. Check tool descriptions before touching routers. Escalate on an explicit request or a policy gap, never on mood. Keep a case-facts block as the session grows.'},
 {name:'The Config Labyrinth',weak:[2,3],plan:'Decide scope first: shared (project) or personal (home). Match the mechanism to the shape of the files, with path rules for scattered ones. Size the workflow to the job: plan for large, direct for small.'},
 {name:'The Blank-Slate Swarm',weak:[5,6,8,10],plan:'Trace blame upward, since a thin report means thin decomposition. Hand every subagent everything it needs. Scope tools per role and propagate failures with structure. Keep claim and source pairs.'},
 {name:'The Legacy Codebase',weak:[3,6],plan:'Explore incrementally: Grep for entry points, Read to follow them. Choose a better description over a rewrite. Keep secrets out of <code>.mcp.json</code>.'},
 {name:'The Noisy Pipeline',weak:[2,7,9,10],plan:'Run with <code>-p</code>. Use batches only for work nobody waits on. Judge with explicit criteria, independent reviewers, and prior findings in context.'},
 {name:'The Messy Document Heap',weak:[1,7,10],plan:'Let the schema carry structure and nullable fields carry honesty. Retry only what feedback can fix. Calibrate and sample before you automate.'}];

const BEASTS=[
 {name:'The Wishful Prompt',habitat:'Must-always rules, compliance, anything with money attached.',tells:['Stronger wording','NEVER in capitals','Add more examples','Remind the model'],counter:'Move the rule into a hook, a gate, or a schema setting. A prompt is a request. Code is a guarantee.',rule:1},
 {name:'The Overbuilt Golem',habitat:'Any question where a cheaper cause was never tried.',tells:['Train a classifier','Build a router','Merge the tools','Use a bigger model'],counter:'Ask what the cheapest root-cause fix is and whether anyone tried it. Descriptions and criteria come first.',rule:3},
 {name:'The Decoy',habitat:'Problems that have an obvious but misplaced fix.',tells:['A bigger context window for an attention problem','Widen one subagent\'s search when the coordinator split the topic badly'],counter:'Name the real cause in five words, then pick the option that acts on that cause.',rule:3},
 {name:'The Mirage',habitat:'Anything that asks a model to judge itself.',tells:['Sentiment','Self-rated confidence','Same-session self-review','Majority voting'],counter:'Use signals that measure the thing: explicit criteria, independent reviewers, calibrated labeled data.',rule:7},
 {name:'The Hand-off Imp',habitat:'Fixes that quietly become someone else\'s job.',tells:['Ask the user to resubmit','Split the PR first','Clean up by hand afterward'],counter:'The system should do the work. Fix the design, not the people using it.',rule:0}];

const ITEMS=[
 {c:'Built-in tools',n:'Grep',k:'Search by content',u:'Find a function name, an error message, or an import across many files.',x:'Glob, which only matches paths.'},
 {c:'Built-in tools',n:'Glob',k:'Search by path',u:'Find files by name pattern, such as <code>**/*.test.tsx</code>.',x:'Grep, which looks inside files.'},
 {c:'Built-in tools',n:'Read',k:'Load a file',u:'Open a known file or follow an import.',x:'Reading the whole repo up front. It buries what matters.'},
 {c:'Built-in tools',n:'Edit',k:'Targeted change',u:'Replace text that appears exactly once.',x:'Non-unique text. Read the file, then Write the new version.'},
 {c:'Built-in tools',n:'Write',k:'Whole-file write',u:'Create a file or replace one when Edit cannot find a unique match.',x:'Small edits, where Edit is safer.'},
 {c:'API settings',n:'stop_reason',k:'Loop control',u:'<code>tool_use</code> means run tools and call again. <code>end_turn</code> means stop.',x:'Parsing the reply text for "done".'},
 {c:'API settings',n:'tool_choice: auto',k:'Model decides',u:'The model may call a tool or answer in plain text.',x:'A guarantee that a tool will be called.'},
 {c:'API settings',n:'tool_choice: any',k:'Must call a tool',u:'Force a tool call when you do not know the document type in advance.',x:'Forcing one named tool for mixed documents.'},
 {c:'API settings',n:'tool_choice: named',k:'Force one tool',u:'Run a specific extraction tool first, then continue.',x:'Unknown document types.'},
 {c:'API settings',n:'JSON schema tool',k:'Structured output',u:'Read schema-compliant data from the <code>tool_use</code> response.',x:'Expecting it to catch wrong values or bad totals.'},
 {c:'API settings',n:'Message Batches',k:'Cheap and slow',u:'50% cheaper for overnight work no one waits on. Up to 24 hours, no SLA.',x:'Blocking checks, or any multi-turn tool loop.'},
 {c:'API settings',n:'custom_id',k:'Batch correlation',u:'Match results to requests and resubmit only the failures.',x:'Relying on result order.'},
 {c:'Claude Code',n:'CLAUDE.md (project)',k:'Shared standards',u:'Root or <code>.claude/CLAUDE.md</code>. Travels with the repo to every teammate.',x:'The lead\'s home directory file.'},
 {c:'Claude Code',n:'~/.claude/CLAUDE.md',k:'Personal standards',u:'Your own preferences across all projects.',x:'Team rules. Teammates never receive it.'},
 {c:'Claude Code',n:'.claude/rules/',k:'Path-scoped rules',u:'Frontmatter <code>paths:</code> globs load rules only for matching files, in any folder.',x:'A CLAUDE.md in every directory for scattered files.'},
 {c:'Claude Code',n:'.claude/commands/',k:'Team slash commands',u:'Version-controlled commands every developer gets on clone.',x:'<code>~/.claude/commands/</code>, which is personal.'},
 {c:'Claude Code',n:'context: fork',k:'Skill isolation',u:'Run a noisy skill in its own context so output stays out of the main chat.',x:'Restricting tools. That is <code>allowed-tools</code>.'},
 {c:'Claude Code',n:'allowed-tools',k:'Skill tool limits',u:'Hold a skill to read and write tools only.',x:'Managing output volume.'},
 {c:'Claude Code',n:'argument-hint',k:'Skill parameter prompt',u:'Tell developers what argument a skill expects.',x:'Isolation or tool limits.'},
 {c:'Claude Code',n:'Plan mode',k:'Explore first',u:'Large, multi-file, or architectural work with more than one valid approach.',x:'A one-function bug with a clear stack trace.'},
 {c:'Claude Code',n:'claude -p',k:'Non-interactive run',u:'Pipelines and CI. Processes the prompt, prints, and exits.',x:'Environment variables or flags that do not exist.'},
 {c:'Claude Code',n:'--output-format json',k:'Machine-readable',u:'Pair with <code>--json-schema</code> so a script can post findings as inline comments.',x:'Parsing prose with regular expressions.'},
 {c:'Claude Code',n:'/memory',k:'Diagnose config',u:'See which memory files are loaded when behavior differs between sessions.',x:'<code>/compact</code>, which trims context.'},
 {c:'Claude Code',n:'/compact',k:'Free up context',u:'Condense a long session so you can keep working.',x:'Inspecting configuration.'},
 {c:'Claude Code',n:'--resume / fork_session',k:'Session control',u:'Continue a named session, or branch from a shared baseline to compare approaches.',x:'Trusting stale tool results after a big refactor.'},
 {c:'MCP',n:'.mcp.json',k:'Shared servers',u:'Project scope. Use <code>${GITHUB_TOKEN}</code> style expansion so no secret is committed.',x:'A token pasted into the file.'},
 {c:'MCP',n:'~/.claude.json',k:'Personal servers',u:'Experimental servers for you alone. Tools from every server load together.',x:'Assuming a personal server replaces the team\'s.'},
 {c:'MCP',n:'MCP resources',k:'Content catalogs',u:'Show issue summaries, docs, or schemas up front so agents skip exploratory calls.',x:'Using tools for static catalogs.'},
 {c:'Claude Code',n:'disallowed-tools',k:'Skill tool removal (beyond the guide)',u:'Remove tools from the pool while a skill is active. Found in the Claude Code docs, not the exam guide.',x:'<code>allowed-tools</code>, which pre-approves tools rather than removing them.'},
 {c:'Claude Code',n:'disable-model-invocation',k:'Manual-only skill (beyond the guide)',u:'<code>true</code> stops Claude loading the skill on its own. Good for side-effect commands like <code>/deploy</code>.',x:'<code>user-invocable: false</code>, which does the reverse.'},
 {c:'Claude Code',n:'user-invocable',k:'Claude-only skill (beyond the guide)',u:'<code>false</code> hides a skill from the menu so only Claude can invoke it.',x:'<code>disable-model-invocation</code>.'},
 {c:'Claude Code',n:'agent (with context: fork)',k:'Subagent type (beyond the guide)',u:'Chooses which subagent runs a forked skill, which sets its model, tools, and permissions.',x:'Assuming fork itself restricts tools.'},
 {c:'Patterns (outside the guide)',n:'Workflow vs agent',k:'Vocabulary',u:'Workflows follow predefined code paths. Agents direct their own steps and tool use.',x:'Treating every task as needing an agent. Start with the simplest design that works.'},
 {c:'Patterns (outside the guide)',n:'Prompt chaining',k:'Fixed sequence',u:'Predictable multi-step work, such as per-file passes followed by an integration pass. In the guide.',x:'Open-ended investigations, which need adaptive decomposition.'},
 {c:'Patterns (outside the guide)',n:'Routing',k:'Classify then dispatch',u:'Inputs fall into distinct categories that need different prompts or handling.',x:'Building a router when a tool description rewrite would fix the problem.'},
 {c:'Patterns (outside the guide)',n:'Parallelization',k:'Sectioning or voting',u:'Sectioning runs independent subtasks together for speed. In the guide as parallel Task calls.',x:'Voting for bug detection: requiring agreement suppresses real bugs.'},
 {c:'Patterns (outside the guide)',n:'Orchestrator-workers',k:'Coordinator and subagents',u:'Subtasks cannot be predicted, so a central model decomposes, delegates, and synthesizes. In the guide as coordinator-subagent.',x:'Assuming workers share context. They start blank.'},
 {c:'Patterns (outside the guide)',n:'Evaluator-optimizer',k:'Generate, critique, refine',u:'Clear criteria exist and feedback measurably improves the output. Echoes the guide\'s independent-reviewer idea.',x:'Letting the generator grade itself in the same session.'}];

/* ----- SVG diagrams ----- */
const SVGH='<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--ink)"/></marker></defs>';
function gB(x,y,w,h,lines,cls){return `<rect class="dg ${cls||''}" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`+lines.map((t,i)=>`<text class="dt${i?' dm':''}" x="${x+w/2}" y="${y+h/2+(i-(lines.length-1)/2)*16+4}" text-anchor="middle">${esc(t)}</text>`).join('');}
function gD(cx,cy,hw,hh,t){return `<polygon class="dg" points="${cx},${cy-hh} ${cx+hw},${cy} ${cx},${cy+hh} ${cx-hw},${cy}"/><text class="dt" x="${cx}" y="${cy+4}" text-anchor="middle">${esc(t)}</text>`;}
function gP(d,dash){return `<path class="da${dash?' dd':''}" d="${d}" marker-end="url(#ah)"/>`;}
function gT(x,y,t,a,c){return `<text class="${c||'dt'}" x="${x}" y="${y}" text-anchor="${a||'start'}">${esc(t)}</text>`;}
function gS(h,label,body){return `<svg class="dgsvg" viewBox="0 0 440 ${h}" role="img" aria-label="${esc(label)}">${SVGH}${body}</svg>`;}
function dgLoop(){return gS(400,'Agentic loop diagram',
 gB(120,10,200,44,['Send messages and tools'])+gP('M220 54 V84')+gB(120,84,200,44,['Claude responds'])+gP('M220 128 V150')+gD(220,190,100,40,'stop_reason?')+
 gP('M120 190 H100 V262')+gT(114,180,'tool_use','end','sl')+gB(30,262,140,64,['Run the tools','append results','to the history'])+gP('M30 294 H12 V32 H120')+
 gP('M320 190 H340 V262')+gT(326,180,'end_turn','start','sl')+gB(270,262,140,64,['Stop','return the answer'],'hot')+
 gT(220,366,'Not the stop rule: "done" text in the reply,','middle','sl')+gT(220,384,'any text block, or an iteration cap','middle','sl'));}
function dgSwarm(){return gS(330,'Coordinator and subagents diagram',
 gB(120,10,200,50,['Coordinator','plans, delegates, merges'],'hot')+gP('M220 60 V100 H70 V150')+gP('M220 100 V150')+gP('M220 100 H370 V150')+gT(232,86,'findings go in the prompt','start','sl')+
 gB(10,150,120,56,['Web search'])+gB(160,150,120,56,['Document','analysis'])+gB(310,150,120,56,['Synthesis'])+
 gT(220,232,'each returns claims with their sources','middle','sl')+
 gT(220,268,'Blank context: nothing is inherited or shared','middle')+gT(220,288,'Parallel: several Task calls in one response','middle')+gT(220,308,'Coordinator allowedTools includes Task','middle'));}
function dgConfig(){
 const rows=[['~/.claude/CLAUDE.md','User level. Personal, never shared through git.'],['CLAUDE.md  or  .claude/CLAUDE.md','Project level. Travels with the repo to everyone.'],['.claude/rules/*.md','paths: globs. Loads only for matching files, in any folder.'],['packages/api/CLAUDE.md','Directory level. Applies to that folder and below.']];
 return gS(372,'Configuration hierarchy diagram',rows.map((r,i)=>{const y=10+i*85;return `<rect class="dg" x="10" y="${y}" width="420" height="72" rx="8"/><rect x="10" y="${y}" width="7" height="72" rx="3" style="fill:var(--d3)"/><text class="sm" x="32" y="${y+30}">${esc(r[0])}</text><text class="dt dm" x="32" y="${y+52}">${esc(r[1])}</text>`;}).join('')+gT(220,362,'/memory shows which files are loaded','middle','sl'));}
function dgHook(){return gS(400,'Hook interception diagram',
 gB(90,10,260,46,['Model requests','process_refund(amount: 800)'])+gP('M220 56 V80')+gB(110,80,220,44,['Interception hook','runs before the tool'],'hot')+gP('M220 124 V146')+gD(220,186,100,40,'amount > 500?')+
 gP('M120 186 H90 V258')+gT(114,176,'yes','end','sl')+gB(10,258,160,64,['Block the call','redirect to','escalate_to_human'],'hot')+
 gP('M320 186 H350 V258')+gT(326,176,'no','start','sl')+gB(270,258,160,64,['Tool runs','returns a raw result'])+gP('M350 322 V346')+gB(265,346,170,46,['Normalization hook','dates, status codes'],'hot')+
 gT(90,346,'a guarantee,','middle','sl')+gT(90,364,'not a request','middle','sl'));}
function dgBatch(){
 const X=h=>(20+h*11.11).toFixed(1);let ticks='';
 for(let h=0;h<=36;h+=6)ticks+=`<line class="da" x1="${X(h)}" y1="186" x2="${X(h)}" y2="192"/>`+gT(X(h),208,h+'h','middle','sl');
 return gS(262,'Batch timeline diagram',
  `<line class="da dd" x1="${X(30)}" y1="40" x2="${X(30)}" y2="186"/>`+gT(X(30),32,'30h SLA','middle','sl')+
  gT(20,66,'Every 4 hours: 4 + 24 = 28h, safe','start','dt')+
  `<rect class="dg" x="${X(0)}" y="76" width="${(4*11.11).toFixed(1)}" height="26" rx="4" style="fill:var(--panel2)"/><rect class="dg hot" x="${X(4)}" y="76" width="${(24*11.11).toFixed(1)}" height="26" rx="4"/>`+
  gT(20,136,'Every 8 hours: 8 + 24 = 32h, misses','start','dt')+
  `<rect class="dg" x="${X(0)}" y="146" width="${(8*11.11).toFixed(1)}" height="26" rx="4" style="fill:var(--panel2)"/><rect class="dg hot" x="${X(8)}" y="146" width="${(24*11.11).toFixed(1)}" height="26" rx="4"/><rect x="${X(30)}" y="147" width="${(2*11.11).toFixed(1)}" height="24" style="fill:var(--bad)"/>`+
  `<line class="da" x1="20" y1="186" x2="420" y2="186"/>`+ticks+
  gT(20,232,'Gray: waiting for the next submission','start','sl')+gT(20,248,'Blue: batch processing, up to 24 hours','start','sl'));}
function dgRetry(){return gS(440,'Validation and retry diagram',
 gB(120,10,200,44,['Extract','forced tool_use + schema'])+gP('M220 54 V76')+gB(120,76,200,44,['Validate','schema + meaning checks'])+gP('M220 120 V142')+gD(220,182,90,40,'passes?')+
 gP('M310 182 H370 V212')+gT(316,174,'yes','start','sl')+gB(310,212,120,44,['Accept'],'hot')+
 gP('M220 222 V250')+gT(230,240,'no','start','sl')+gB(120,250,200,44,['What failed?'])+gP('M220 294 V316 H100 V340')+gP('M220 316 H340 V340')+
 gB(10,340,180,76,['Format or structure','Retry with the document,','the failed output, and','the specific error'],'hot')+gB(250,340,180,76,['Value not in source','Leave it null,','route to review.','Retrying cannot help'],'bad')+
 gP('M10 378 H4 V32 H120'));}
const DIAGS=[
 {n:'The agentic loop',t:'1.1',f:dgLoop,m:'Loop on <code>stop_reason</code>. <code>tool_use</code> means run the tools, append the results, and call again. <code>end_turn</code> means stop.',x:'Parsing the reply for "done", checking for any text block, or using an iteration cap as the real stopping rule.'},
 {n:'Coordinator and subagents',t:'1.2, 1.3',f:dgSwarm,m:'Subagents start blank, so every prompt carries complete findings. Spawn them in parallel with several Task calls in one response, and include Task in the coordinator\'s allowedTools.',x:'Assuming shared memory, or blaming a subagent for a gap the coordinator\'s decomposition created.'},
 {n:'Where configuration lives',t:'3.1, 3.3',f:dgConfig,m:'User level is personal. Project level travels with the repo. Path rules load by glob in any folder. Directory files bind to their folder. <code>@import</code> keeps files modular.',x:'Team standards that live only in one person\'s home directory.'},
 {n:'Hooks beat prompts',t:'1.4, 1.5',f:dgHook,m:'An interception hook is a guarantee, a prompt is a request. Use hooks for refund limits and identity checks, and a normalization hook to unify dates and status codes from different tools.',x:'Stronger prompt wording or few-shot examples for a rule that must always hold.'},
 {n:'Batch math',t:'4.5',f:dgBatch,m:'Work backward from the SLA: the wait for the next submission plus 24 hours of processing must fit inside it. Batches are 50% cheaper but have no latency guarantee.',x:'Batch for a blocking pre-merge check, or for any workflow that needs tool calls mid-request.'},
 {n:'Validate, then retry wisely',t:'4.3, 4.4',f:dgRetry,m:'Retry when feedback can fix the problem: format or structure. When the value is absent from the source, make the field nullable and route to review instead.',x:'Retrying the same request unchanged, or retrying to recover information that does not exist.'}];

/* ----- views ----- */
function bossStats(s){
  const qs=Q.filter(q=>q.sc===s);let seen=0,right=0;
  qs.forEach(q=>{const a=store.answers[q.id];if(a){seen++;if(a.last)right++;}});
  return {total:qs.length,seen,right,hp:Math.round(100-100*right/Math.max(1,qs.length))};
}
function glyph(i){
  const c=`var(--d${i+1})`;
  const g=[
   `<rect x="10" y="12" width="36" height="32" rx="6" fill="none" stroke="${c}" stroke-width="3"/><path d="M18 24h20M18 32h14" stroke="${c}" stroke-width="3" stroke-linecap="round"/><circle cx="44" cy="46" r="7" fill="${c}"/>`,
   `<rect x="18" y="8" width="20" height="14" rx="3" fill="${c}"/><rect x="11" y="24" width="34" height="14" rx="3" fill="none" stroke="${c}" stroke-width="3"/><rect x="5" y="40" width="46" height="11" rx="3" fill="none" stroke="${c}" stroke-width="3"/>`,
   `<circle cx="28" cy="28" r="20" fill="none" stroke="${c}" stroke-width="3"/><circle cx="28" cy="28" r="10" fill="none" stroke="${c}" stroke-width="3"/><circle cx="46" cy="12" r="5" fill="${c}"/>`,
   `<circle cx="28" cy="28" r="20" fill="none" stroke="${c}" stroke-width="3"/><path d="M12 24q8-8 16 0t16 0M12 34q8-8 16 0t16 0" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`,
   `<rect x="6" y="16" width="26" height="24" rx="5" fill="none" stroke="${c}" stroke-width="3"/><path d="M30 28h20m-8-8l8 8-8 8" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`];
  return `<svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true">${g[i]}</svg>`;
}
function vGuide(){
  if(sub.guide==='boss'||sub.guide==='beast')sub.guide='walk';
  const head=learnHead('gtab:'+sub.guide);
  const s=sub.guide;
  return head+(s==='walk'?vWalk():s==='boss'?vBoss():s==='beast'?vBeast():s==='items'?vItems():s==='trig'?vTrig():vMaps());
}
function vWalk(){
  const d=sub.glevel;const L=GLEVELS[d];const ds=domStats()[d];const done=store.guide.done;
  const chips=[1,2,3,4,5].map(n=>`<button class="${done[n]?'cl':''}" data-act="glevel" data-v="${n}" aria-pressed="${n===d}">Level ${n}</button>`).join('');
  const cleared=Object.keys(done).filter(k=>done[k]).length;
  return `<div class="stack"><div class="seg">${chips}</div><div class="prail" aria-label="Levels cleared">${[1,2,3,4,5].map(n=>`<i class="${done[n]?'ok':n===d?'cur':''}"></i>`).join('')}</div><span class="small muted">${cleared} of 5 levels cleared</span></div>
  <section class="panel hero chap" style="--c:var(--d${d})"><div class="chapnum">Level ${d}</div><h2 class="disp">${esc(DOM[d].n)}</h2><p class="muted" style="max-width:56ch">${esc(L.tag)}</p>${archie('point',`This lesson covers Domain ${d}, which is ${DOM[d].w}% of the exam. Read the key ideas and the common traps, and then try the practice set at the end.`)}
   <div class="xp"><div class="split small"><b>Worth ${DOM[d].w}% of the exam</b><span class="muted">Your mastery ${Math.round(ds.ready*100)}%, ${ds.seen} of ${ds.total} questions seen</span></div><div class="xpbar"><i style="width:${Math.max(2,Math.round(ds.ready*100))}%"></i></div></div></section>
  <div class="cols two">
   <div class="stack">
    <section class="panel stack" style="--c:var(--d${d})"><h3>Key moves</h3><ol class="moves">${L.moves.map(m=>`<li><span>${m}</span></li>`).join('')}</ol></section>
    <section class="panel stack"><h3>Objectives</h3><div>${TS.filter(t=>t.d===d).map(t=>{const s=tsStats(t.id);return `<div class="tsrow" style="--c:var(--d${d})"><span class="id">${t.id}</span><span>${esc(t.t)}</span><div class="ctl"><span class="small muted">${s.total?`${s.seen} of ${s.total} seen${s.seen?', '+pct(s.right,s.seen)+'% right':''}`:'no questions yet'}</span>${s.total?`<button class="btn ghost" data-act="tsdrill" data-v="${t.id}">Drill</button>`:''}</div></div>`;}).join('')}</div></section>
   </div>
   <div class="stack">
    <aside class="callout tip"><b>Pro tip</b><p>${esc(L.tip)}</p></aside>
    <aside class="callout warn"><b>Enemies in this level</b><ul>${L.foes.map(f=>`<li>${f}</li>`).join('')}</ul></aside>
    <aside class="callout secret"><b>Secret</b><p>${L.secret}</p></aside>
   </div>
  </div>
  <section class="panel stack"><div class="row"><button class="btn primary" data-act="quick" data-d="${d}">Run the Level ${d} drill</button><label class="check" style="grid-template-columns:24px auto;padding:0"><input type="checkbox" data-gdone="${d}" ${done[d]?'checked':''}><span>Mark this level cleared</span></label></div>
   <div class="row">${d>1?`<button class="btn" data-act="glevel" data-v="${d-1}">Previous level</button>`:''}${d<5?`<button class="btn" data-act="glevel" data-v="${d+1}">Next level</button>`:''}</div></section>`;
}
function vBoss(){
  return `<section class="panel stack"><h2>The six scenario bosses</h2>${archie('fight','Four of these six will be waiting on exam day. Learn every weakness.')}<p class="muted" style="max-width:62ch">Four of these six appear on your exam, drawn at random. Each boss has attack patterns (the traps it sets) and a weakness (the decision rules that beat it). Boss HP is the share of its questions you have not yet answered correctly.</p></section>
  <div class="grid3" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),1fr))">${BOSSES.slice(1).map((b,i)=>{const s=i+1,S=SC[s],st=bossStats(s);
   return `<article class="panel stack boss" style="--c:var(--d${S.doms[0]})"><div><span class="small muted">Boss ${s}</span><h3 class="disp" style="font-size:1.5rem;margin-top:2px">${esc(b.name)}</h3><p class="small muted" style="margin-top:2px">${esc(S.n)}</p></div>
    <div><div class="split small"><b>Boss HP</b><span class="muted">${st.hp}%, ${st.right} of ${st.total} beaten</span></div><div class="hp" role="img" aria-label="Boss HP ${st.hp} percent"><i style="width:${st.hp}%"></i></div></div>
    <div><b class="lbl">Arena</b><p class="small">${esc(S.b)}</p></div>
    <div><b class="lbl">Attack patterns</b><p class="small">${esc(S.traps)}</p></div>
    <div><b class="lbl">Weak to</b><div class="row" style="gap:6px;margin-top:4px">${b.weak.map(r=>`<span class="tag">Rule ${r}: ${esc(RULES[r].n)}</span>`).join('')}</div></div>
    <div><b class="lbl">Strategy</b><p class="small">${b.plan}</p></div>
    <button class="btn primary" data-act="scdrill" data-v="${s}">Fight this boss</button></article>`;}).join('')}</div>`;
}
function vBeast(){
  return `<section class="panel stack"><h2>The wrong-answer bestiary</h2>${archie('point','Spot one of these and you can cross out an option before you even finish reading.')}<p class="muted" style="max-width:62ch">Every distractor on the exam is one of five creatures. Learn their tells and you can cross out two options in seconds, before you even understand the question.</p><div class="row"><button class="btn primary" data-act="opendrill" data-v="shape">Hunt them in the drill</button></div></section>
  <div class="stack">${BEASTS.map((b,i)=>{const ex=SHAPEQ.filter(x=>x.s===i).slice(0,2);const st=store.drill.shape;
   return `<article class="panel beast" style="--c:var(--d${i+1})"><div class="glyphbox">${glyph(i)}</div><div class="stack">
    <div><span class="small muted">Creature ${i+1}, shape: ${esc(SHAPENAMES[i])}</span><h3 class="disp" style="font-size:1.6rem;margin-top:2px">${esc(b.name)}</h3></div>
    <div class="cols even"><div><b class="lbl">Habitat</b><p class="small">${esc(b.habitat)}</p><b class="lbl" style="margin-top:10px">Tells</b><ul class="tells">${b.tells.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>
    <div><b class="lbl">Counter</b><p class="small">${esc(b.counter)}</p>${b.rule?`<p class="small muted" style="margin-top:8px">Pairs with Rule ${b.rule}: ${esc(RULES[b.rule].n)}</p>`:''}</div></div>
    ${ex.length?`<div><b class="lbl">Seen in the wild</b>${ex.map(x=>`<p class="seen">${fmt(x.o)}</p>`).join('')}</div>`:''}</div></article>`;}).join('')}</div>`;
}
function vItems(){
  const cats=['All'].concat([...new Set(ITEMS.map(i=>i.c))]);
  const list=ITEMS.filter(i=>sub.icat==='All'||i.c===sub.icat);
  return `<section class="panel stack"><h2>Item compendium</h2><p class="muted" style="max-width:62ch">Everything you carry into the exam, with when to equip it and what it is commonly confused with.</p><div class="seg">${cats.map(c=>`<button data-act="icat" data-v="${esc(c)}" aria-pressed="${sub.icat===c}">${esc(c)}</button>`).join('')}</div></section>
  <div class="itemgrid">${list.map(i=>`<article class="item"><b class="iname">${esc(i.n)}</b><span class="tag" style="align-self:flex-start">${esc(i.k)}</span><p class="small"><b>Equip when:</b> ${i.u}</p><p class="small muted"><b>Not for:</b> ${i.x}</p></article>`).join('')}</div>`;
}
function vMaps(){
  return `<section class="panel stack"><h2>Maps</h2><p class="muted" style="max-width:62ch">Six flow diagrams for the ideas that show up again and again. Trace each path once with your finger and the scenarios will feel familiar.</p></section>
  ${DIAGS.map(g=>`<section class="panel"><div class="cols two"><div>${g.f()}</div><div class="stack dgnote"><div><span class="tag">Task ${g.t}</span><h3 style="margin-top:8px">${esc(g.n)}</h3></div><div><b>Remember</b><p>${g.m}</p></div><div><b>The trap</b><p>${esc(g.x)}</p></div></div></div></section>`).join('')}`;
}

/* ===== Trigger words (colleague cheat sheet, checked against the guide) ===== */
const TRIG=[
 {t:'inconsistent, unpredictable, hallucination',a:'Add structure and enforce outside the model',w:'Use schemas, validation, or structured state',v:'Refined',n:'Right for shape and fabrication problems. For inconsistent judgment (severity, false positives) a schema does not help: use explicit criteria plus two to four examples.'},
 {t:'invalid JSON, formatting issues, strict output',a:'Schema and tool enforcement',w:'Need guarantees, not prompting',v:'Solid',n:'Use <code>tool_use</code> with a JSON schema. Remember it fixes syntax, not meaning.'},
 {t:'missing data, guessing, hallucinated fields',a:'Allow null, retrieve, or clarify',w:'Prevent forced guessing',v:'Solid',n:'Nullable fields for absent values. Ask for identifiers when matches are ambiguous. A retry cannot create absent data.'},
 {t:'wrong tool, inconsistent routing',a:'Improve tool descriptions',w:'Tool clarity issue',v:'Solid',n:'The cheapest root cause. Do it before routers, classifiers, or merging tools.'},
 {t:'wrong order, sequence issues',a:'Force workflow or tool_choice',w:'Enforce sequencing programmatically',v:'Refined',n:'Prefer a prerequisite gate or hook that blocks later calls. A forced <code>tool_choice</code> only guarantees which tool is called first.'},
 {t:'slow, latency, expensive',a:'Parallelize, batch, or cache',w:'Optimization problem',v:'Careful',n:'Split this one. Slow or blocking: parallelize on the synchronous API. Expensive and nobody waits: batch (50% cheaper, up to 24 hours, no SLA). Prompt caching only needs to be known to exist.'},
 {t:'forgetting, long conversation',a:'Hybrid memory',w:'Summarize old, keep recent',v:'Refined',n:'Summaries drop exact amounts and dates. Keep a persistent case-facts block outside the summarized history, trim verbose tool output, and put key findings first.'},
 {t:'changing preferences, outdated behavior',a:'Structured state object',w:'State beats history',v:'Solid',n:'Same idea as the case-facts block: current values, updated on each correction, carried in every prompt.'},
 {t:'subagents missing data',a:'Explicit context passing',w:'Agents do not share memory automatically',v:'Solid',n:'The coordinator routes everything and puts complete findings in each prompt.'},
 {t:'research incomplete',a:'Iterative refinement loop',w:'One pass is not enough',v:'Refined',n:'If subagents succeeded but coverage is thin, suspect the coordinator\'s decomposition. Then evaluate the synthesis for gaps and re-delegate targeted queries.'},
 {t:'loss of precision, missing numbers',a:'Retrieve the original source',w:'Summaries are lossy',v:'Refined',n:'The guide\'s remedy is preservation: case-facts blocks, claim-source mappings with dates, and subagents that return metadata, not re-fetching later.'},
 {t:'too many tools, overlap',a:'Reduce scope and simplify',w:'Too many choices reduce accuracy',v:'Solid',n:'Four or five role-relevant tools per agent plus a scoped cross-role tool. Rewrite overlapping descriptions first.'},
 {t:'ambiguity, unclear request',a:'Ask for clarification',w:'Never guess',v:'Solid',n:'Multiple customer matches need more identifiers, not a heuristic pick. A policy gap or an explicit request for a human is an escalation, not a question.'},
 {t:'duplicate work, repeated calls',a:'Cache or deduplicate',w:'Avoid recomputation',v:'Careful',n:'For repeated PR comments, pass prior findings and report only new or unresolved issues. For duplicate generated tests, give Claude the existing test files.'},
 {t:'large inputs, overload',a:'Chunk processing',w:'Break large tasks into smaller parts',v:'Solid',n:'Per-file passes plus an integration pass for review. Chunk documents that exceed context limits and resubmit only the failures.'},
 {t:'conflicting sources',a:'Structured synthesis',w:'Preserve nuance',v:'Solid',n:'Annotate conflicts with attribution and dates. Never silently pick one number.'},
 {t:'vague outputs, inconsistent formats',a:'Structured parameters and enums',w:'Remove ambiguity',v:'Solid',n:'Enums with an other-plus-detail value and unclear. Few-shot examples also lock in format.'},
 {t:'agent drift, inconsistency',a:'Reinforce instructions',w:'Models deprioritize older instructions',v:'Careful',n:'A reminder is a probabilistic, prompt-level fix. If the rule must always hold, enforce it in code. For long inputs, put key instructions at the start.'},
 {t:'tool errors retried incorrectly',a:'Structured error handling',w:'Not all failures retry',v:'Solid',n:'<code>errorCategory</code>, <code>isRetryable</code>, what was attempted, and partial results. An empty result is not an error.'},
 {t:'compare approaches, branching',a:'Fork reasoning paths',w:'Explore independently',v:'Solid',n:'<code>fork_session</code> creates independent branches from a shared baseline.'},
 {t:'always, never, before any payment, compliance',a:'Hook or prerequisite gate',w:'A prompt is a request',v:'Added',n:'The sheet\'s "structure beats prompting" in its sharpest form. Prompts and examples always have a non-zero failure rate.'},
 {t:'false positives, severity drift',a:'Explicit criteria plus two to four examples',w:'Judgment needs definitions',v:'Added',n:'"Be conservative" does not draw a line. Categorical criteria and examples of ambiguous cases do.'},
 {t:'blocking check, someone is waiting',a:'Synchronous API',w:'Batches have no SLA',v:'Added',n:'Batches suit overnight work. Work backward from any SLA: wait for the next submission plus 24 hours.'},
 {t:'same session reviews its own code',a:'Independent reviewer instance',w:'Self-review keeps its own reasoning',v:'Added',n:'Better than extended thinking or "review more carefully" in the generating session.'},
 {t:'escalate on sentiment or self-confidence',a:'Escalate on request, policy gap, or no progress',w:'Unreliable proxies',v:'Added',n:'Sentiment is mood, not complexity, and self-reported confidence is poorly calibrated.'},
 {t:'skill output floods the chat',a:'context: fork',w:'Isolation axis',v:'Added',n:'From the colleague\'s study plan. <code>allowed-tools</code> is the other axis: permissions.'},
 {t:'skill must not use certain tools',a:'allowed-tools',w:'Permission axis',v:'Added',n:'The guide\'s wording is that it restricts tool access during execution. Current docs add <code>disallowed-tools</code> for removal.'},
 {t:'retry loop, value not in the document',a:'Nullable field plus review',w:'Retry needs the answer to exist in the input',v:'Added',n:'From the colleague\'s study plan: structural placement is retry-fixable, data absence is not.'},
 {t:'deciding when the agent loop ends',a:'stop_reason, not text or a cap',w:'A cap is only a backstop',v:'Added',n:'<code>tool_use</code> continues, <code>end_turn</code> stops. A turn limit can bound runaway loops but is not the primary stop.'}];
const KEYRULES=[
 {t:'Structure beats prompting',v:'Refined',n:'True when you need a guarantee. For judgment calls, criteria and examples are the prompt-level tools that work.'},
 {t:'Explicit state beats implicit memory',v:'Solid',n:'The case-facts block, in one line.'},
 {t:'Parallelize independent work',v:'Solid',n:'Several Task calls in one coordinator response.'},
 {t:'Retrieve for precision, summarize for speed',v:'Refined',n:'The guide warns that summaries lose numbers, so keep structured facts and sources rather than relying on summaries.'},
 {t:'Validation is required for critical workflows',v:'Solid',n:'Schema validation plus semantic checks, with retries only where feedback can help.'},
 {t:'Reduce ambiguity using schemas and enums',v:'Solid',n:'Add other plus detail and unclear to enums.'},
 {t:'Use coordinators for multi-agent orchestration',v:'Solid',n:'Route all subagent communication through the coordinator for observability and consistent error handling.'}];
CARDS.push(
 {d:0,f:'What is NOT on the exam (official guide)',b:'Fine-tuning, API authentication and billing, deploying or hosting MCP servers, computer use, vision, streaming, rate limits and pricing, OAuth, cloud provider specifics, benchmarking, prompt caching details beyond knowing it exists, and token counting. Third-party prep sites sometimes cover these.'},
 {d:0,f:'Agent loop: iteration cap versus stop_reason',b:'stop_reason decides the normal end: tool_use continues, end_turn stops. A turn limit is a safety backstop. The guide lists an arbitrary cap as the primary stopping mechanism as an anti-pattern.'},
 {d:3,f:'Skill frontmatter: which axis?',b:'allowed-tools is the permission axis (which tools). context: fork is the isolation axis (keep output out of the main chat). They combine. argument-hint prompts for a missing argument.'});
TRIG.forEach(r=>CARDS.push({d:6,f:'Trigger: '+r.t,b:r.a+'. '+r.w+'. '+r.n.replace(/<[^>]+>/g,'')}));
function vTrig(){
  const cats=['All','Solid','Refined','Careful','Added'];
  const list=TRIG.filter(r=>sub.tcat==='All'||r.v===sub.tcat);
  const cnt=v=>TRIG.filter(r=>r.v===v).length;
  return `<section class="panel stack"><h2>Trigger words</h2><p class="muted" style="max-width:66ch">A colleague's cheat sheet maps exam phrases to answer patterns. I checked each row against the official guide. <b>Solid</b> rows match it. <b>Refined</b> rows have the right idea but the exam adds a detail. <b>Careful</b> rows can mislead if you apply them blindly. <b>Added</b> rows are triggers the sheet lacks.</p>
   <div class="seg">${cats.map(c=>`<button data-act="tcat" data-v="${c}" aria-pressed="${sub.tcat===c}">${c}${c==='All'?'':' '+cnt(c)}</button>`).join('')}</div></section>
  <div class="stack">${list.map(r=>`<article class="panel trig" style="--c:var(--${r.v==='Solid'?'good':r.v==='Careful'?'bad':r.v==='Added'?'d4':'d1'})"><div class="split"><b class="tw">${esc(r.t)}</b><span class="vtag">${r.v}</span></div><div class="cols even"><div><b class="lbl">Answer pattern</b><p>${esc(r.a)}</p></div><div><b class="lbl">What to think</b><p>${esc(r.w)}</p></div></div><p class="small tn">${r.n}</p></article>`).join('')}</div>
  <section class="panel stack"><h3>The sheet's key rules, checked</h3>${KEYRULES.map(k=>`<div class="krule"><b>${esc(k.t)}</b><span class="vtag" style="--c:var(--${k.v==='Solid'?'good':'d1'})">${k.v}</span><p class="small">${k.n}</p></div>`).join('')}</section>`;
}
