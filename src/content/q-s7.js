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
e:"Forced selection can make a specific tool the first call, but it does not gate every later call. A prerequisite gate or hook that blocks process_refund until verification succeeds is the programmatic guarantee."}
);
