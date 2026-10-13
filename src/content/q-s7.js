Q.push(
{id:"g-01",sc:2,d:3,ts:"3.2",r:0,q:"A team skill must only ever call Read and Grep, never Write or Bash. Which setting does the exam guide point to, and why would `context: fork` not do the job?",
o:["Configure `allowed-tools` in the skill's frontmatter. `context: fork` only isolates the conversation context and says nothing about which tools may run","Set `context: fork`, because a forked subagent is automatically limited to read-only tools","Set `argument-hint` to list Read and Grep so developers know which tools are allowed","Describe the restriction in the skill's `description` so Claude chooses not to use other tools"],a:[0],
e:"Tool access and context isolation are different axes. The guide's wording is that `allowed-tools` restricts tool access during skill execution, while `context: fork` keeps verbose output out of the main conversation. Current Claude Code docs add a nuance worth knowing: `allowed-tools` pre-approves tools, and a separate `disallowed-tools` field removes tools from the pool."},

{id:"g-02",sc:2,d:3,ts:"3.2",r:0,q:"Can one skill use both `context: fork` and `allowed-tools`, and what is each doing?",
o:["Yes. `context: fork` isolates the skill's work and output in its own context, while `allowed-tools` governs which tools it may use","No. They conflict, so a forked skill cannot declare any tool settings","Yes, but `context: fork` then overrides `allowed-tools` and the list is ignored","No. `allowed-tools` only works in skills that run in the main conversation"],a:[0],
e:"They act on different axes, isolation and permissions, so they combine without conflict. This is the check the cross-cutting pattern calls for: ask which axis a mechanism actually operates on."},

{id:"g-03",sc:2,d:3,ts:"3.2",r:0,ext:1,q:"A `/deploy` skill has real side effects. It should run only when a developer types the command, never because Claude decided the moment was right. Which frontmatter field fits?",
o:["`disable-model-invocation: true`","`user-invocable: false`","`context: fork`","`allowed-tools: Read`"],a:[0],
e:"This field is in the Claude Code skills docs rather than the exam guide, so treat it as extra credit. `disable-model-invocation: true` stops Claude from loading the skill on its own while `/deploy` still works. `user-invocable: false` is the reverse, hiding it from the menu so only Claude can invoke it."},

{id:"g-04",sc:6,d:4,ts:"4.4",r:8,q:"An extraction log reads: 'vendor name extracted correctly but placed in the `customer_name` field.' Is a retry with error feedback a good fix?",
o:["Yes. The right value exists in the source, so a retry with the document, the failed output, and the specific error can redirect its placement","No. Any failed extraction should go straight to human review","No. The field should be made nullable so the model can skip it","Yes, but only if the identical request is resent unchanged"],a:[0],
e:"Ask whether the correct answer exists somewhere in the input. It does here, so feedback can correct the placement. Resending the identical request repeats the same mistake."},

{id:"g-05",sc:6,d:4,ts:"4.4",r:0,q:"The log says: 'tax ID field is blank because the scanned invoice was cut off before that section.' What is the correct architectural response?",
o:["Allow null for the field and flag the record for review or a re-scan, because a retry cannot recover text that was never captured","Retry with a stronger instruction to find the tax ID","Fill the field with the most common tax ID seen in earlier invoices","Raise the sampling temperature so the model tries harder"],a:[0],
e:"Data absence is not retry-fixable. The value is not in the input, so the system needs a nullable field plus a review or fallback path. Guessing a value would manufacture data."},

{id:"g-06",sc:6,d:4,ts:"4.4",r:0,q:"Four extraction failures are logged. Which one is the clearest candidate for a retry with error feedback?",
o:["A due date returned as 'March 4th' where the schema requires ISO 8601","The invoice has no due date printed anywhere","Page 3 of 4 is missing from the scan","The invoice prints two different totals that disagree"],a:[0],
e:"A format mismatch can be fixed when the model is shown the validation error. The other three are absence or source conflict: they need a nullable field, a re-scan, or a conflict flag, not another attempt."},

{id:"g-07",sc:5,d:4,ts:"4.5",r:9,q:"Developers say the blocking pre-merge review is too slow. A teammate sees the word 'expensive' in the ticket and suggests the Message Batches API. What is the better change?",
o:["Keep it synchronous and run the independent per-file review passes concurrently","Move it to batches, since a 50% saving is worth the wait","Move it to batches and poll until it finishes","Add a larger model so each pass finishes sooner"],a:[0],
e:"Batches can take up to 24 hours with no latency guarantee, so they suit work nobody is waiting for. A blocking check needs the synchronous API, and independent passes can run in parallel to cut the wait."},

{id:"g-08",sc:5,d:4,ts:"4.1",r:2,q:"The code reviewer is inconsistent about severity: the same pattern is 'critical' in one run and 'minor' in the next. A colleague sees the word 'inconsistent' and proposes a strict JSON schema for the output. Why is that the wrong tool?",
o:["A schema fixes the shape of the output, not the judgment behind it. Define explicit severity criteria with concrete examples for each level","A schema can never be used with a code reviewer","Schemas only work for extraction, not for classification","The schema would make the severity values random"],a:[0],
e:"'Inconsistent' can mean inconsistent shape or inconsistent judgment. Shape problems get schemas. Judgment problems get explicit criteria and a few targeted examples."},

{id:"g-09",sc:1,d:5,ts:"5.1",r:10,q:"A customer corrects their shipping address in turn 4 and again in turn 11, yet the agent confirms the turn-4 address at checkout. What design fixes this?",
o:["Keep the current values in a structured case-facts block that is updated on each correction and included in every prompt","Rely on the conversation history so the agent finds the latest address","Summarize the whole conversation more aggressively every few turns","Ask the customer to repeat the address at the end"],a:[0],
e:"Explicit state beats implicit memory. A persistent facts block outside the summarized history always holds the current value, while history and summaries can bury or blur a correction. Asking the customer to repeat shifts the burden."},

{id:"g-10",sc:3,d:1,ts:"1.1",r:4,q:"A teammate wants the agent loop to end by setting `maxTurns` to a fixed number and nothing else. What is the right view?",
o:["Terminate on `stop_reason` being `end_turn`. A turn limit is a safety backstop, never the primary stopping mechanism","`maxTurns` alone is the standard way to end an agent loop","End the loop when the response contains the word 'done'","End the loop as soon as the response contains any text"],a:[0],
e:"The guide calls out arbitrary iteration caps as the primary stopping mechanism as an anti-pattern, along with parsing natural language and checking for assistant text. Anthropic's agent guidance does mention a maximum number of iterations as a control, which is consistent: use it to bound runaway loops, and let `stop_reason` decide the normal end."},

{id:"g-11",sc:3,d:1,ts:"1.2",r:0,q:"Every subagent in the research system finished without errors, but the final report has no section on music and film. What should the coordinator do?",
o:["Evaluate the synthesis for coverage gaps and re-delegate targeted queries for the missing topics, then re-synthesize","Widen every subagent's search by default on all future runs","Rerun the entire pipeline with identical instructions","Tell the synthesis agent to infer the missing sections from general knowledge"],a:[0],
e:"When the subagents did their assigned work, look at the coordinator: it decomposed the topic too narrowly. A refinement loop that checks coverage and re-delegates targeted queries closes the gap without waste."},

{id:"g-12",sc:1,d:1,ts:"1.4",r:1,q:"A cheat sheet says 'wrong order, sequence issues: force the workflow with `tool_choice`.' The support agent must verify identity before any refund. Is a forced `tool_choice` enough?",
o:["No. Forcing a named tool guarantees only that tool runs first. Use a programmatic prerequisite that blocks later calls until verification is complete","Yes. A forced `tool_choice` enforces the whole sequence for the entire conversation","Yes, as long as the system prompt also says identity must be verified first","No. Sequence can only be enforced with few-shot examples"],a:[0],
e:"Forced selection can make a specific tool the first call, but it does not gate every later call. A prerequisite gate or hook that blocks process_refund until verification succeeds is the programmatic guarantee."},

{id:"g-13",sc:5,d:4,ts:"4.5",r:9,q:"A CI pipeline runs a nightly job that generates tests for the whole repo and a pre-merge check that blocks each PR. The team wants to cut API cost. Which plan fits?",
o:["Send the nightly generation through the Batches API and keep the pre-merge check synchronous","Send both jobs through the Batches API so that every call gets the 50% discount on cost","Keep both jobs synchronous, because the Batches API offers no latency guarantee for either one","Send the pre-merge check through the Batches API and have the pipeline poll until it completes"],a:[0],
e:"Batches save 50% but can take up to 24 hours with no SLA. That suits the overnight job. A check that blocks a PR needs a bounded wait, so it stays synchronous."},

{id:"g-14",sc:2,d:3,ts:"3.3",r:3,q:"Test conventions must apply to `*.test.tsx` files that live in dozens of directories across the repo. Which setup is the most maintainable?",
o:["A rule file in `.claude/rules/` with a `paths` glob that matches `**/*.test.tsx`","A separate CLAUDE.md in every directory that happens to contain a test file","One section in the root CLAUDE.md that asks Claude to apply it only to test files","A skill that engineers must remember to invoke by hand before editing any test"],a:[0],
e:"Path-specific rules load only when matching files are in play and do not depend on directory layout. Per-directory files multiply maintenance, and an instruction in the root file loads everywhere."},

{id:"g-15",sc:1,d:2,ts:"2.2",r:8,q:"The `lookup_order` tool times out. What should the MCP tool return so the agent can recover well?",
o:["An error result with a failure category, a retryable flag, and any partial results it has","An empty result list, so the agent treats the timeout as the customer having no orders","A short generic message that says the operation failed, so the agent does not guess","A thrown exception that ends the agent loop, so a person can look at it right away"],a:[0],
e:"A structured error lets the agent decide whether to retry, try an alternative, or escalate. An empty result hides the failure, and a generic message or a crash removes the information needed to recover."},

{id:"g-16",sc:1,d:5,ts:"5.2",r:4,q:"A customer writes 'I want to talk to a person.' The agent could probably solve the issue. What should happen?",
o:["Escalate right away and honor the request, without trying to investigate first","Try to resolve the issue first and escalate only if the customer's tone gets worse","Ask the customer to confirm the request twice before handing the case to a human","Escalate only when the agent's self-reported confidence drops below a set threshold"],a:[0],
e:"An explicit request for a human is the customer's call. The guide says to honor an explicit request immediately. Sentiment and self-reported confidence are unreliable proxies, and extra confirmation steps only add friction."},

{id:"g-17",sc:5,d:4,ts:"4.6",r:7,q:"The session that generated a change is asked to review its own output and rarely finds problems. Which change improves the review most?",
o:["Run the review in a separate, independent instance that does not carry the generation reasoning","Ask the same session to review again with a stricter instruction and extended thinking turned on","Keep the same session but tell it to act as a skeptical senior engineer who has never seen the code","Compact the session first so that the earlier reasoning is shortened before it reviews its own work"],a:[0],
e:"A model keeps the reasoning context from generation, which makes it less likely to question its own decisions. An independent instance reviews the output without that context. Stricter wording, role-play, and compaction all leave the same bias in place."},

{id:"g-18",sc:4,d:3,ts:"3.4",r:3,q:"A developer needs one null check added to a single function in a single file. The fix is clear. Which approach is right?",
o:["Use direct execution, because the change is small, well scoped, and confined to one file","Use plan mode first, because every change to production code should start with a written plan","Use plan mode with an exploration subagent, so that the whole repo is mapped before editing","Ask Claude to propose three alternative designs and compare them before it touches the file"],a:[0],
e:"Plan mode pays off for large, ambiguous, multi-file, or architectural work. A single clear edit is faster and just as safe with direct execution."},

{id:"g-19",sc:4,d:5,ts:"5.4",r:10,q:"During a long exploration of a large unfamiliar codebase, the session starts forgetting early findings. Which approach holds up best?",
o:["Write key findings to a scratchpad file and use subagents for deep dives that return summaries","Load every file in the repository up front so that nothing needs to be re-read later on","Raise the maximum output tokens so that each answer can carry more of the earlier findings","Open a fresh session for each question and rely on the model to rediscover what matters"],a:[0],
e:"Persisting findings outside the conversation and isolating verbose exploration in subagents keeps the main context focused. Loading everything or restarting loses the signal."},

{id:"g-20",sc:6,d:4,ts:"4.2",r:2,q:"Extraction output varies in format across invoice layouts, and the schema is already enforced. What is the proportionate fix?",
o:["Add two to four few-shot examples that show the varied layouts and the expected output","Add one sentence to the system prompt that tells the model to always stay consistent","Fine-tune a custom model on hundreds of labeled invoices before changing the prompt at all","Set the temperature to zero so the model returns exactly the same shape every time it runs"],a:[0],
e:"Targeted few-shot examples of the problem cases are the cheap root-cause fix for inconsistent formatting. A reminder is probabilistic, fine-tuning is oversized, and temperature does not control layout choices."},

{id:"g-21",sc:1,d:1,ts:"1.1",r:4,q:"An agent calls `lookup_order` three times in a row with the same arguments and never uses the answer. Which cause is most likely?",
o:["Tool results are not being appended to the conversation between iterations, so the model cannot reason about them","The loop ends on `end_turn` too early, so the agent never gets a chance to read what the tool returned","The `max_tokens` setting is too low for the agent to describe what it learned from the lookup result","The system prompt has too few examples of a lookup being followed by a different tool call in the next step"],a:[0],
e:"The loop depends on each result being added to the history so the next call can build on it. Without that, the model sees no new information and repeats itself."},

{id:"g-22",sc:1,d:1,ts:"1.1",r:3,q:"A team replaces model-driven tool selection with a fixed decision tree for every support ticket. New request types keep failing. What is the core limit of the tree?",
o:["It only covers the cases its authors anticipated, while the model can reason about which tool to call from context","It cannot call more than one tool per ticket, because a decision tree only ever has one active branch at a time","It makes every ticket slower, since each branch must be evaluated by the model before any tool can be called","It removes the need for tool descriptions, so the model can no longer tell what each tool is meant to do"],a:[0],
e:"Decision trees are predictable but rigid. The model-driven loop lets Claude choose the next tool from context, which is what handles requests nobody planned for."},

{id:"g-23",sc:2,d:3,ts:"3.5",r:3,q:"Claude's fixes for a migration script keep mishandling null values. Which input most improves the next iteration?",
o:["Specific test cases with example input and expected output for the null cases, then iterate on any failures","A prose description of what a correct migration should do, written in general terms for the whole script","A request to rewrite the whole script from scratch and be more thorough about every possible edge case","A larger thinking budget with the same request, so the model has more room to consider the null handling"],a:[0],
e:"Concrete examples with expected outputs define the edge case exactly, and sharing test failures guides each pass. General descriptions and bigger budgets leave the target vague."},

{id:"g-24",sc:3,d:2,ts:"2.3",r:6,q:"A research subagent uses a generic `fetch_url` tool and sometimes loads unrelated pages. What is the better design?",
o:["Replace it with a constrained tool such as `load_document` that validates document URLs before fetching","Keep `fetch_url` and add a line to the subagent's prompt that warns it to only open relevant pages","Add a second generic tool, `search_any`, so the subagent can confirm each page before it opens it","Let the coordinator fetch every URL on the subagent's behalf and pass the full page text back to it"],a:[0],
e:"Constrained tools that fit the role beat generic ones. Validation inside the tool is a guarantee, while a prompt warning is only a request."},

{id:"g-25",sc:4,d:1,ts:"1.7",r:0,q:"Two refactoring approaches must be compared starting from the same analysis of a large codebase. What is the best way to run them?",
o:["Fork the session from the shared analysis and explore each approach in its own branch","Run both approaches one after the other in a single session so the second can learn from the first","Start two brand new sessions and repeat the full codebase analysis in each of them from the beginning","Ask the model to describe both approaches in one reply and then pick the winner from that description"],a:[0],
e:"Forking keeps the shared baseline and gives each approach an independent path, so neither contaminates the other and the analysis is not repeated."},

{id:"g-26",sc:5,d:4,ts:"4.6",r:7,q:"A review pipeline wants to route findings to human attention. How should it use model self-reported confidence?",
o:["Collect it per finding and route low-confidence items to review, with thresholds calibrated on labeled data","Drop every finding below 0.9 automatically, because anything under that score is almost certainly noise","Treat the raw scores as true probabilities and set the review cutoff wherever it feels most convenient","Ignore confidence entirely and send every single finding to a human reviewer for a manual decision"],a:[0],
e:"Per-finding confidence is useful for routing only after it is calibrated against labeled examples. Raw scores can be badly off, and sending everything to humans wastes limited reviewer time."}
);
