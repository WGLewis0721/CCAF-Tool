Q.push(
{id:"s3-01",sc:3,d:1,ts:"1.2",r:3,off:1,q:"After running the system on 'impact of AI on creative industries', every subagent finished successfully: the search agent found relevant articles, the document agent summarized papers, and the synthesis agent produced coherent output. But the final report covers only visual arts and misses music, writing, and film. The coordinator's logs show it split the topic into 'AI in digital art creation', 'AI in graphic design', and 'AI in photography'. What is the most likely root cause?",
o:["The coordinator's task decomposition is too narrow, so the subagent assignments do not cover all relevant domains","The synthesis agent lacks instructions for spotting coverage gaps in what it receives","The web search agent's queries are not comprehensive enough and need to cover more creative sectors","The document analysis agent is filtering out non-visual sources with overly restrictive relevance criteria"],a:[0],
e:"The logs show the coordinator only ever assigned visual-arts subtopics, and the subagents did their assigned work correctly. The problem is what they were assigned. The other options blame downstream agents that behaved correctly within their scope."},

{id:"s3-02",sc:3,d:5,ts:"5.3",r:8,off:1,q:"The web search subagent times out while researching a complex topic. How should the failure information flow back to the coordinator for the best recovery?",
o:["Return structured error context: failure type, the attempted query, any partial results, and potential alternative approaches","Retry with exponential backoff inside the subagent and return a generic 'search unavailable' status only after all retries are exhausted","Catch the timeout inside the subagent and return an empty result set marked as successful","Propagate the exception to a top-level handler that terminates the whole research workflow"],a:[0],
e:"Structured context lets the coordinator decide whether to retry with a modified query, try an alternative, or proceed with partial results. A generic status hides what it needs, an empty 'success' suppresses the error, and terminating everything throws away recoverable work."},

{id:"s3-03",sc:3,d:2,ts:"2.3",r:6,off:1,q:"The synthesis agent often needs to verify specific claims. Today it returns control to the coordinator, which invokes the web search agent and then re-invokes synthesis, adding 2 to 3 round trips and about 40% latency. Your evaluation shows 85% of verifications are simple fact-checks (dates, names, statistics) and 15% need deeper investigation. What is the most effective approach?",
o:["Give the synthesis agent a scoped `verify_fact` tool for simple lookups, and keep delegating complex verifications through the coordinator","Have the synthesis agent batch all verification needs and return them to the coordinator at the end of its pass","Give the synthesis agent the full set of web search tools so it can handle any verification directly","Have the web search agent proactively cache extra context around each source in case synthesis needs it"],a:[0],
e:"A narrow tool covers the common 85% case at low cost while preserving the coordination pattern for the hard 15% (least privilege). Batching creates blocking dependencies, full search tools over-provision synthesis, and speculative caching cannot reliably predict what will be needed."},

{id:"s3-04",sc:3,d:1,ts:"1.3",r:5,q:"A coordinator is supposed to delegate work to subagents but never does; it just attempts everything itself. What configuration item should you check first?",
o:["That the coordinator's `allowedTools` includes `Task` (the tool used to spawn subagents)","That each subagent has at least 18 tools","That the coordinator prompt is at least 2,000 words","That subagents share a memory store with the coordinator"],a:[0],
e:"A coordinator can only invoke subagents if the subagent-spawning tool is allowed. (Claude Code's docs now call this tool Agent; the exam guide uses Task.) Tool count, prompt length, and shared memory are irrelevant, and subagents do not share memory anyway."},

{id:"s3-05",sc:3,d:1,ts:"1.3",r:5,q:"The synthesis subagent's report has no citations and invents details. Its prompt from the coordinator reads only 'Synthesize the research findings.' What is wrong?",
o:["Subagents do not inherit the coordinator's context; the findings must be passed explicitly in the subagent's prompt","The synthesis agent needs more tools","The synthesis agent needs a higher iteration limit","The coordinator should store findings in shared memory"],a:[0],
e:"A subagent starts with a blank context. Unless the prior agents' findings are included in its prompt, it has nothing real to synthesize. There is no shared memory or automatic inheritance to rely on."},

{id:"s3-06",sc:3,d:1,ts:"1.3",r:0,q:"Research takes too long because the coordinator launches the web-search subagent, waits, then launches the document-analysis subagent in a later turn, although the two are independent. How do you speed it up?",
o:["Have the coordinator emit multiple subagent (Task) calls in a single response so they run in parallel","Merge both subagents into one with a combined prompt","Add a third subagent to supervise the first two","Ask subagents to answer faster"],a:[0],
e:"Independent subagents run in parallel when the coordinator issues multiple spawn calls in one response, not across separate turns. Merging or adding supervisors changes the architecture without addressing sequencing."},

{id:"s3-07",sc:3,d:1,ts:"1.2",r:3,q:"The coordinator sends every query through the full four-agent pipeline, even trivial factual questions that need one quick search. What should change?",
o:["Have the coordinator analyze the query and dynamically select which subagents to invoke","Hard-code a longer pipeline for consistency","Remove the coordinator and let users call subagents directly","Always run all subagents but ignore their results for simple queries"],a:[0],
e:"A coordinator's role includes deciding which subagents to use based on query complexity, instead of always running the whole pipeline."},

{id:"s3-08",sc:3,d:1,ts:"1.2",r:3,q:"Two search subagents keep researching the same sources and producing overlapping findings. What is the best fix?",
o:["Have the coordinator partition the research scope, assigning each agent distinct subtopics or source types","Tell each agent to avoid duplicates without telling it what the other covers","Run them sequentially and delete duplicates by hand","Give each agent the other's full conversation history"],a:[0],
e:"Partitioning scope up front minimizes duplication. Subagents cannot avoid overlap they know nothing about, and manual dedup or shared history are workarounds."},

{id:"s3-09",sc:3,d:1,ts:"1.2",r:0,q:"The first-pass report has gaps in two subtopics. What pattern lets the system fix this itself?",
o:["An iterative refinement loop: the coordinator evaluates the synthesis for gaps, re-delegates targeted queries to search and analysis subagents, and re-invokes synthesis until coverage is sufficient","Ship the report and let users file gap tickets","Run the identical pipeline again and hope for different results","Ask the synthesis agent to write longer sections"],a:[0],
e:"Coordinator-driven refinement closes gaps with targeted follow-up queries. The other options either shift work to users or repeat the same run."},

{id:"s3-10",sc:3,d:1,ts:"1.2",r:8,q:"Why should all subagent communication route through the coordinator rather than directly between subagents? Select TWO.",
o:["Observability: one place to see and log what flows between agents","Consistent error handling and controlled information flow","It lets subagents share a hidden memory","It guarantees lower token cost in every case"],a:[0,1],
e:"Hub-and-spoke gives the coordinator visibility, consistent error handling, and control over what each agent sees. Subagents do not share memory, and token savings are not guaranteed."},

{id:"s3-11",sc:3,d:1,ts:"1.3",r:2,q:"The coordinator gives each subagent rigid step-by-step procedures. When a source type is unexpected, subagents follow the steps and produce poor results. What is a better way to prompt them?",
o:["Specify the research goal and quality criteria, and let the subagent decide how to get there","Add more numbered steps to cover every unexpected case","Remove all instructions","Tell subagents to stop if anything is unexpected"],a:[0],
e:"Goal-and-criteria prompts leave subagents room to adapt. Rigid procedures cannot anticipate every case, and stopping at the first surprise wastes the run."},

{id:"s3-12",sc:3,d:2,ts:"2.3",r:6,q:"The synthesis agent sometimes tries to run web searches itself and does them poorly. What is the principled fix?",
o:["Restrict its tool set to the tools relevant to synthesis, and give it a scoped fact-checking tool if needed","Add a prompt line saying 'do not search the web'","Give it better web search tools","Remove the web search agent"],a:[0],
e:"Agents misuse tools outside their specialization, so scope tool access to the role. A prompt instruction is probabilistic, and better search tools or removing the specialist go the wrong way."},

{id:"s3-13",sc:3,d:2,ts:"2.1",r:3,q:"A subagent confuses `analyze_content` and `analyze_document`, which have near-identical descriptions. What is the best change?",
o:["Rename `analyze_content` to something specific such as `extract_web_results` and give it a description covering inputs, outputs, and when to use it","Add a router that picks one before each call","Combine both into one `analyze` tool","Tell the agent to try both and pick the better output"],a:[0],
e:"Overlapping, vague tools cause misrouting. Renaming and re-describing to eliminate functional overlap is the direct fix. A router is over-engineered, one merged tool hides the distinction, and calling both wastes work."},

{id:"s3-14",sc:3,d:2,ts:"2.3",r:1,q:"In a pipeline you want an `extract_metadata` tool to always run before any enrichment tools, and then let the model continue freely. Which API setting does this?",
o:["Force that tool on the first request with `tool_choice: {\"type\": \"tool\", \"name\": \"extract_metadata\"}`, then process later steps in follow-up turns","Set `tool_choice` to `none`","Mention the order in a system prompt comment","Set `tool_choice` to `auto` and hope the order is followed"],a:[0],
e:"Forced tool selection guarantees a specific tool is called first. `auto` lets the model skip it, and `none` disables tools. A prompt comment is only a request."},

{id:"s3-15",sc:3,d:2,ts:"2.2",r:8,q:"A search subagent hits a transient timeout. What is the best error handling across the hierarchy?",
o:["Retry locally in the subagent, and only propagate errors it cannot resolve, with what was attempted and any partial results","Propagate every timeout to the coordinator immediately","Swallow the error and return no results","Abort the workflow on the first failure"],a:[0],
e:"Local recovery for transient problems keeps the coordinator uncluttered; unresolved failures go up with context. Forwarding everything, hiding failures, or aborting are the over- and under-reaction anti-patterns."},

{id:"s3-16",sc:3,d:5,ts:"5.3",r:8,q:"Some sources were unavailable, so the report cannot cover every subtopic. How should the synthesis output reflect that?",
o:["Include coverage annotations showing which findings are well supported and which topic areas have gaps because sources were unavailable","Present the report as complete so users trust it","Omit the weak sections silently","Fill the gaps with plausible general knowledge"],a:[0],
e:"Coverage annotations make limits visible. Hiding gaps or filling them with unsourced content undermines trust in the whole report."},

{id:"s3-17",sc:3,d:5,ts:"5.6",r:10,q:"Two credible sources report different adoption figures for the same technology (12% and 18%). What should the synthesis agent do?",
o:["Keep both values with source attribution and annotate the conflict","Choose the more recent value silently","Average the two numbers","Drop the statistic from the report"],a:[0],
e:"Conflicting values from credible sources are annotated with attribution, not arbitrarily resolved. The coordinator or reader decides how to reconcile."},

{id:"s3-18",sc:3,d:5,ts:"5.6",r:10,q:"After several summarization steps the final report states claims but cannot say where they came from. What fix preserves attribution?",
o:["Require subagents to output structured claim-source mappings (source URL, document name, relevant excerpt) that downstream agents preserve and merge","Tell the synthesis agent to add citations at the end","Keep sources in a separate document nobody reads","Have a reviewer guess the sources from the claims"],a:[0],
e:"Provenance survives only if it travels with each claim through every step as structured data. Adding citations afterward means reconstructing what was already lost."},

{id:"s3-19",sc:3,d:5,ts:"5.6",r:10,q:"A report flags a 2019 figure and a 2024 figure for the same metric as contradictory. What prevents this misreading?",
o:["Require publication or data-collection dates in subagents' structured outputs so temporal differences are not mistaken for conflicts","Delete the older figure","Ask the model to guess which is correct","Present both figures without any context"],a:[0],
e:"Dates in the structured output let the synthesis agent see that the values come from different times, which is not the same as disagreement."},

{id:"s3-20",sc:3,d:5,ts:"5.6",r:10,q:"The final report mixes financial figures, breaking news, and technical findings. Which formatting is best?",
o:["Render each content type appropriately: financial data as tables, news as prose, technical findings as structured lists","Convert everything to bullet points for uniformity","Convert everything to prose for readability","Convert everything to a single table"],a:[0],
e:"Different content types read best in different forms. Forcing one format hurts clarity and can lose structure."},

{id:"s3-21",sc:3,d:5,ts:"5.1",r:10,q:"The synthesis agent receives 30 findings concatenated in one long input and omits the ones in the middle. What mitigates this 'lost in the middle' effect?",
o:["Place a key-findings summary at the beginning and organize detailed results under explicit section headers","Put the most important finding in the middle so it is protected","Double the input length","Ask the model to read slowly"],a:[0],
e:"Models process the start and end of long inputs most reliably, so lead with a summary and structure the rest with headers."},

{id:"s3-22",sc:3,d:5,ts:"5.1",r:10,q:"Downstream agents have small context budgets, but upstream agents return long reasoning chains. What should change?",
o:["Modify upstream agents to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning","Truncate the outputs mechanically after 500 tokens","Give downstream agents a bigger prompt","Skip the downstream agents"],a:[0],
e:"Compact structured returns keep the signal and the metadata downstream needs. Blind truncation can cut exactly the part that mattered."}
);
