Q.push(
{id:"s5-01",sc:5,d:3,ts:"3.6",r:0,off:1,q:"Your pipeline script runs `claude \"Analyze this pull request for security issues\"` but the job hangs indefinitely. Logs show Claude Code is waiting for interactive input. What is the correct way to run it in an automated pipeline?",
o:["Add the `-p` flag: `claude -p \"Analyze this pull request for security issues\"`","Set the environment variable `CLAUDE_HEADLESS=true` before running","Redirect stdin from `/dev/null`","Add a `--batch` flag"],a:[0],
e:"`-p` (or `--print`) is the documented non-interactive mode: it processes the prompt, prints the result, and exits. The environment variable and `--batch` flag do not exist, and the stdin trick is a workaround that does not address Claude Code's syntax."},

{id:"s5-02",sc:5,d:4,ts:"4.5",r:9,off:1,q:"Your team wants to cut API costs. Two workflows use real-time Claude calls: (1) a blocking pre-merge check that must finish before developers can merge, and (2) a technical-debt report generated overnight for next-morning review. Your manager proposes moving both to the Message Batches API for the 50% savings. How should you evaluate this?",
o:["Use batch processing for the technical-debt report only, and keep real-time calls for pre-merge checks","Switch both to batch processing and poll for completion","Keep real-time calls for both to avoid batch result ordering problems","Switch both to batch processing with a timeout that falls back to real-time if batches are slow"],a:[0],
e:"Batches save 50% but can take up to 24 hours with no latency guarantee, which blocks developers on pre-merge checks and is perfect for overnight reports. Relying on 'often faster' is not acceptable for blocking work, results can be matched with `custom_id` (so ordering is not a problem), and a fallback adds complexity when matching each API to its use case is simpler."},

{id:"s5-03",sc:5,d:4,ts:"4.6",r:0,off:1,q:"A pull request modifies 14 files in a stock-tracking module. Your single-pass review of all files together gives inconsistent results: detailed feedback on some files, superficial comments on others, missed obvious bugs, and contradictory feedback (flagging a pattern in one file while approving identical code elsewhere). How should you restructure the review?",
o:["Split into focused passes: analyze each file individually for local issues, then run a separate integration-focused pass for cross-file data flow","Require developers to split large PRs into 3 to 4 files before the automated review runs","Switch to a model with a larger context window so all 14 files get adequate attention","Run three independent full-PR passes and flag only issues that appear in at least two of them"],a:[0],
e:"The root cause is attention dilution across many files. Per-file passes give consistent depth, and an integration pass catches cross-file issues. Asking developers to split PRs shifts the burden, a larger window does not fix attention quality, and requiring consensus would suppress real bugs found only intermittently."},

{id:"s5-04",sc:5,d:3,ts:"3.6",r:0,q:"CI needs findings in a machine-parseable format so a script can post them as inline PR comments. Which flags do you use with Claude Code?",
o:["`-p` with `--output-format json` and `--json-schema`","`--interactive` with `--verbose`","`--resume` with `--fork`","`-p` only, and parse the prose with regular expressions"],a:[0],
e:"`--output-format json` with `--json-schema` produces structured, schema-conforming output for automation. Parsing prose is fragile, and the other flag combinations are unrelated to structured output."},

{id:"s5-05",sc:5,d:3,ts:"3.6",r:10,q:"Every new commit on a PR triggers another review run, and developers complain about duplicate comments on issues that were already reported. Which TWO changes help? Select TWO.",
o:["Include the prior review findings in the context of the new run","Instruct Claude to report only new or still-unaddressed issues","Lower the number of files per review to one","Disable the review after the first run"],a:[0,1],
e:"Give the reviewer the previous findings and tell it to report only what is new or still unresolved. Reducing scope or disabling the review removes value instead of fixing duplication."},

{id:"s5-06",sc:5,d:3,ts:"3.6",r:10,q:"Claude's generated tests often duplicate scenarios the project already tests. What is the most direct fix?",
o:["Provide the existing test files in context so generation avoids suggesting scenarios already covered","Ask for fewer tests","Tell Claude tests should be unique","Delete the existing tests"],a:[0],
e:"Claude can only avoid duplicates it can see. Supplying the existing tests is the direct fix; vague instructions to be unique have nothing to be based on."},

{id:"s5-07",sc:5,d:3,ts:"3.6",r:0,q:"CI-invoked Claude produces low-value tests that ignore your fixtures and conventions. Where should you record testing standards, valuable test criteria, and available fixtures?",
o:["In `CLAUDE.md`, which provides project context to CI-invoked Claude Code","In a wiki that Claude cannot read","In each developer's local notes","In the commit messages"],a:[0],
e:"CLAUDE.md is the mechanism for providing project context (testing standards, fixtures, review criteria) to Claude Code, including in CI."},

{id:"s5-08",sc:5,d:4,ts:"4.6",r:7,q:"The same Claude session that generated a feature is asked to review it, and it rarely finds problems. What is a more effective review design?",
o:["Use a second, independent Claude instance without the generator's reasoning context to review the code","Ask the same session to review more carefully","Turn on extended thinking in the same session and review again","Ask the generating session to rate its own confidence"],a:[0],
e:"A model keeps the reasoning context from generating the code, so it is less likely to question its own decisions. A fresh instance reviews without that bias, which beats self-review instructions or extended thinking."},

{id:"s5-09",sc:5,d:4,ts:"4.1",r:2,q:"Your review prompt says 'be conservative and only report high-confidence findings', yet developers still see many false positives. What is the better fix?",
o:["Replace it with specific categorical criteria that define what to report (bugs, security) and what to skip (minor style, local patterns)","Add 'be very conservative' and repeat it","Raise the model's temperature","Tell developers to ignore low-severity comments"],a:[0],
e:"General instructions like 'be conservative' do not improve precision. Explicit criteria for which issues to report and which to skip do, for example flagging a comment only when it contradicts actual code behavior."},

{id:"s5-10",sc:5,d:4,ts:"4.1",r:0,q:"One review category (naming comments) has a very high false-positive rate and developers have started ignoring all review output. What should you do while you improve it?",
o:["Temporarily disable that category to restore trust while you refine the prompt for it","Keep it enabled and ask developers to be patient","Disable the entire review system permanently","Raise the severity of the noisy category"],a:[0],
e:"High false-positive categories erode trust in accurate categories too. Disable the noisy one temporarily, improve it, then bring it back."},

{id:"s5-11",sc:5,d:4,ts:"4.1",r:2,q:"The reviewer labels similar issues 'critical' in one run and 'minor' in another. What fixes severity consistency?",
o:["Define explicit severity criteria with concrete code examples for each level","Ask it to be consistent","Run it three times and pick the median","Let developers set severity afterward"],a:[0],
e:"Concrete examples per severity level anchor classification. Telling a model to be consistent, voting across runs, or deferring to humans do not define the boundary."},

{id:"s5-12",sc:5,d:4,ts:"4.2",r:2,q:"Which few-shot approach most improves judgment on ambiguous review cases?",
o:["Two to four targeted examples of ambiguous situations that show the reasoning for why one action was chosen over plausible alternatives","Twenty examples of obvious cases","One example of a perfect review","No examples; add longer prose rules"],a:[0],
e:"A few targeted examples of ambiguous cases with the reasoning behind the choice teach judgment that generalizes. Piles of obvious cases do not address ambiguity."},

{id:"s5-13",sc:5,d:4,ts:"4.2",r:2,q:"Review comments come back in inconsistent formats and are hard to act on. What most reliably fixes the format?",
o:["Few-shot examples that show the exact desired format: location, issue, severity, and suggested fix","A stricter instruction to 'use a consistent format'","Post-processing with regex","Asking the model to apologize for inconsistency"],a:[0],
e:"Examples demonstrating the output format are the most effective way to get consistent, actionable output when detailed instructions alone are not enough."},

{id:"s5-14",sc:5,d:4,ts:"4.2",r:2,q:"The reviewer keeps flagging acceptable local conventions as bugs. Which few-shot content reduces this while still generalizing?",
o:["Examples that distinguish acceptable code patterns from genuine issues","More examples of real bugs only","A list of every acceptable pattern in the codebase","A rule telling it to flag fewer things"],a:[0],
e:"Showing both acceptable patterns and real issues teaches the boundary. Only-bug examples bias toward flagging, exhaustive lists do not generalize, and a vague quota is not a criterion."},

{id:"s5-15",sc:5,d:4,ts:"4.4",r:0,q:"Developers dismiss certain findings, and you want to learn which kinds of code constructs trigger the dismissed ones. What do you add?",
o:["A `detected_pattern` field on each structured finding so dismissals can be analyzed by pattern","A free-text 'notes' field","A counter of total findings","Nothing; read dismissed comments by hand"],a:[0],
e:"Tracking which code construct triggered each finding enables systematic analysis of dismissal patterns and targeted prompt fixes."},

{id:"s5-16",sc:5,d:4,ts:"4.5",r:9,q:"You need results within 30 hours and batch processing can take up to 24 hours. Which submission schedule guarantees the SLA?",
o:["Submit a batch every 4 hours","Submit a batch every 8 hours","Submit a batch every 12 hours","Submit one batch per day"],a:[0],
e:"Worst case wait before submission plus 24 hours of processing must stay under 30 hours, so submissions must be at most 6 hours apart; 4 hours leaves margin. 8, 12, or 24 hours would break the SLA."},

{id:"s5-17",sc:5,d:4,ts:"4.5",r:9,q:"A workflow needs Claude to call tools mid-request and use the tool results before answering. Can it run through the Message Batches API?",
o:["No; batch requests do not support multi-turn tool calling within a single request","Yes; batches handle tool loops natively","Yes, if you add `custom_id` fields","Yes, but only for tools that return text"],a:[0],
e:"The Batches API cannot execute tools mid-request and return the results, so tool-loop workflows need the synchronous API. `custom_id` only correlates requests and responses."}
);
