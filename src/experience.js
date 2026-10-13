const studyUI=store.studyUI||(store.studyUI={week:1,mapView:'map',diagram:0,motion:true});
let routeApplying=false, pendingStudyRoute=null, studyOrigin=null, lessonBeat=1;
let studyMotionTimers=[], studyAnimations=[], lastStudyScene='', lastStudyPath='', lastCardFace=false;
const taskPage=id=>SOURCES.pages[id]||5;
const guideLink=(page,label)=>`<a href="${SOURCES.guide}#page=${page}" target="_blank" rel="noopener">${esc(label)} <span aria-hidden="true">↗</span></a>`;
const docLink=id=>{const source=SOURCES.docs[id];return source?`<a href="${source[1]}" target="_blank" rel="noopener">${esc(source[0])} <span aria-hidden="true">↗</span></a>`:'';};
function sourceLine(ids,extra=[]){
  const tasks=[...new Set(ids.filter(id=>SOURCES.pages[id]))];
  const docs=[...new Set(tasks.flatMap(id=>SOURCES.taskDocs[id]||[]).concat(extra))];
  return `<div class="study-sources" aria-label="References">${tasks.map(id=>guideLink(taskPage(id),`Exam guide · Task ${id} · p. ${taskPage(id)}`)).join('')}${docs.map(docLink).join('')}</div>`;
}
function studyLink(path,label,cls=''){return `<a class="study-link ${cls}" href="#${path}">${esc(label)}<span aria-hidden="true"> →</span></a>`;}
function studyArt(name,cls=''){return `<svg class="study-art ${cls}" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><use href="#study-art-${name}" width="100" height="100"/></svg>`;}
function mapSprite(position,x,y,width,height){return `<foreignObject class="map-art" x="${x}" y="${y}" width="${width}" height="${height}"><div xmlns="http://www.w3.org/1999/xhtml" class="map-sprite" style="background-position:${position}% 0%"></div></foreignObject><rect class="map-hit-area" x="${x}" y="${y}" width="${width}" height="${height}" fill="transparent" stroke="none" pointer-events="all"/>`;}
function mapOutpost(col){return `<g class="ico"><ellipse cx="0" cy="16" rx="19" ry="6" fill="${col}" opacity=".25"/><ellipse cx="0" cy="16" rx="19" ry="6" fill="none" stroke="${col}" stroke-width="1.7"/>${mapSprite(0,-24,-30,48,48)}</g>`;}
function mapFort(hp){return `<g class="ico">${mapSprite(50,-40,-45,80,80)}<rect x="-27" y="-44" width="54" height="4" rx="2" fill="#263243"/><rect x="-27" y="-44" width="${54*hp/100}" height="4" rx="2" fill="#DB5A50"/></g>`;}
function mapCreep(){return `<g class="ico">${mapSprite(100,-29,-32,58,58)}</g>`;}
function learnOverview(cur){
  return `<div class="learn-overview" aria-label="How Learn fits together">${[
    ['archive','Begin','Study plan','Your four-week route','learn/plan'],
    ['controller','Understand','Lessons & mechanisms','Diagrams and decision rules','learn/lesson?domain=1'],
    ['tools','Apply','Scenarios & signals','Use ideas in context','learn/scenarios'],
    ['messages','Reference','Terms & syllabus','Find the exact objective','learn/syllabus']
  ].map(([art,role,title,caption,path])=>`<a href="#${path}">${studyArt(art)}<span><small>${role}</small><b>${title}</b><em>${caption}</em></span></a>`).join('')}</div>`;
}
const practicePath=d=>`practice/questions?domain=${d}&count=10`;
const lessonPath=(d,task)=>`learn/lesson?domain=${d}${task?'&task='+task:''}`;
const scenarioPath=(s,practice=false)=>`${practice?'practice/questions':'learn/scenarios'}?scenario=${s}${practice?'&count=10':''}`;
const PLAN_DEST={
  p1a:{title:'Find your footing',text:'Read the exam format and blueprint, then explore the scenarios and Domain 1.',links:[[lessonPath(1),'Domain 1 lesson'],['learn/rules','Decision rules'],[scenarioPath(1),'Scenario 1 brief']],pages:[[2,'Exam details · §3 p. 2'],[3,'Blueprint & scenarios · §§4–5 p. 3'],[5,'All domain objectives · §6 p. 5 onward']]},
  p1b:{title:'Domain 1 practice',text:'Three rounds of 10 questions. Review each explanation; aim for 70% or better as a study target.',links:[[practicePath(1),'Practice 10 Domain 1 questions']],tasks:['1.1']},
  p1c:{title:'Build a multi-tool agent',text:'Exercise 1 brings together loop control, structured errors, hooks, and escalation.',links:[['learn/exercise?id=1','Exercise 1 brief'],[scenarioPath(1,true),'Scenario 1 questions']],pages:[[24,'Exercise 1 · pp. 24–25']],docs:['loop','hooks','results']},
  p1d:{title:'Keep the facts fresh',text:'Review both decks twice.',links:[['practice/cards?domain=0','Exam-facts flashcards'],['practice/cards?domain=1','Domain 1 flashcards']],pages:[[2,'Exam facts · p. 2'],[5,'Domain 1 · p. 5']]},
  p2a:{title:'Tools and Claude Code',text:'Three rounds of 10 in each domain. Rounds can revisit questions; they do not imply 30 unique items.',links:[[practicePath(2),'10 Domain 2 questions'],[practicePath(3),'10 Domain 3 questions']],pages:[[9,'Domain 2 · pp. 9–12'],[12,'Domain 3 · pp. 12–16']]},
  p2b:{title:'Configure a team workflow',text:'Exercise 2: project memory, path rules, skills, and MCP configuration.',links:[['learn/exercise?id=2','Exercise 2 brief'],[lessonPath(3,'3.2'),'Skills lesson'],[lessonPath(2,'2.4'),'MCP lesson']],pages:[[25,'Exercise 2 · p. 25']],docs:['rules','skills','mcp','workflow']},
  p2c:{title:'Distinguish similar tools',text:'Write descriptions for a confusable tool pair and test ambiguous requests.',links:[[lessonPath(2,'2.1'),'Tool-design lesson'],['practice/questions?task=2.1&count=10','Task 2.1 questions']],tasks:['2.1']},
  p2d:{title:'Recognize the signal',text:'Work toward 9 of 10 in Spot the tell, then revisit the wording that tripped you up.',links:[['practice/drill?kind=tell','Spot the tell · 10 rounds'],['learn/triggers','Trigger-word reference']],pages:[[5,'Detailed objectives · §6']]},
  p3a:{title:'Output and reliability',text:'Three rounds of 10 in each domain, with repeated practice clearly labeled.',links:[[practicePath(4),'10 Domain 4 questions'],[practicePath(5),'10 Domain 5 questions']],pages:[[16,'Domain 4 · pp. 16–19'],[19,'Domain 5 · pp. 19–23']]},
  p3b:{title:'Build an extraction pipeline',text:'Exercise 3: nullable fields, validation feedback, batch work, and human review.',links:[['learn/exercise?id=3','Exercise 3 brief'],[lessonPath(4,'4.4'),'Validation lesson'],[scenarioPath(6,true),'Scenario 6 questions']],pages:[[25,'Exercise 3 · pp. 25–26']],docs:['schema','batch']},
  p3c:{title:'Build a research pipeline',text:'Exercise 4: explicit handoffs, timeouts, conflicting findings, and sources.',links:[['learn/exercise?id=4','Exercise 4 brief'],[scenarioPath(3,true),'Scenario 3 questions']],pages:[[26,'Exercise 4 · p. 26']],docs:['subagents','context']},
  p3d:{title:'Read the wrong-answer shapes',text:'Practice labeling a distractor in under ten seconds. This taxonomy is an app study aid.',links:[['practice/drill?kind=shape','Name the shape · 10 rounds'],['learn/rules?section=shapes','Five-shape reference']],pages:[[27,'Sample questions · pp. 27–33']]},
  p4a:{title:'Rehearse the exam',text:'Take two full 120-minute mocks. The clock begins only when you start.',links:[['practice/mock','Mock setup'],['learn/syllabus?section=history','Previous mock reports']],pages:[[2,'Exam format · p. 2']]},
  p4b:{title:'Review weak tasks',text:'Use your actual answers to find what needs attention. Each task below links straight to practice and its lesson.',links:[],dynamic:true,pages:[[5,'Task objectives · §6']]},
  p4c:{title:'Bring the rules together',text:'Review the ten rules, five distractor shapes, and your missed answers.',links:[['learn/rules','Ten decision rules'],['learn/rules?section=shapes','Five wrong-answer shapes'],['practice/questions?mode=missed&count=20','Review missed questions']],pages:[[27,'Sample questions · p. 27']]},
  p4d:{title:'Prepare for exam day',text:'Check your name/ID, appointment instructions, testing setup, and start time against the source policies.',links:[],pages:[[33,'Registration · §§11–12 pp. 33–34'],[34,'Policies · p. 34'],[35,'Exam-day rules · §13 p. 35']]},
  f1:{title:'Skill configuration',text:'Review guide-tested fields and the separate current-docs fields.',links:[[lessonPath(3,'3.2'),'Skills lesson'],['learn/terms?term=allowed-tools','allowed-tools'],['learn/terms?term=context%3A%20fork','context: fork'],['learn/terms?term=argument-hint','argument-hint']],tasks:['3.2'],docs:['skills']},
  f2:{title:'Permission and isolation',text:'Explain which tools a skill can use, where it runs, and how the two settings combine.',links:[[lessonPath(3,'3.2'),'Level 3 key moves'],['learn/terms?term=context','Skill field reference']],tasks:['3.2']},
  f3:{title:'Check your skill choices',text:'Consider a skill restricted to Read and Grep, then combine isolation and permissions.',links:[[lessonPath(3,'3.2')+'&section=selfcheck','Skill self-check'],['practice/questions?task=3.2&count=10','Task 3.2 practice']],tasks:['3.2']},
  f4:{title:'Retry, or handle it differently?',text:'Sort format, field, absent-value, conflicting-source, and truncated-input failures.',links:[[lessonPath(4,'4.4')+'&section=failures','Five failure patterns'],[lessonPath(4,'4.4'),'Validation and retry lesson']],tasks:['4.4','5.6']},
  f5:{title:'Pick the mechanism',text:'Aim for 9 of 10, then practice the two task areas directly.',links:[['practice/drill?kind=axis','Pick the axis · 10 rounds'],['practice/questions?task=3.2&count=10','Task 3.2 questions'],['practice/questions?task=4.4&count=10','Task 4.4 questions']],tasks:['3.2','4.4']},
  f6:{title:'Apply the axis question',text:'For each pair, name what the mechanism actually operates on.',links:[['practice/drill?kind=axis','Practice mechanism pairs'],['learn/rules','Decision-rule reference']],pages:[[5,'Detailed objectives · §6']]}
};
function weakTaskLinks(){
  const weak=TS.filter(t=>{const s=tsStats(t.id);return s.seen&&s.right/s.seen<.8;});
  if(!weak.length)return `<p class="small muted">${Object.keys(store.answers).length?'No reviewed task is below 80% right. The syllabus shows your remaining objectives.':'Your weak-task list appears after practice.'}</p>${studyLink('learn/syllabus','Open the task syllabus')}`;
  return weak.map(t=>`<div class="study-weak-task"><b>${t.id}</b><span>${esc(t.t)}</span>${studyLink(`practice/questions?task=${t.id}&count=10`,'Practice')}${studyLink(lessonPath(t.d,t.id),'Lesson')}${studyLink(`campaign?task=${t.id}`,'Map')}</div>`).join('');
}
function studyStep(id){
  const item=PLAN_DEST[id];
  return `<article class="study-step" id="step-${id}"><input type="checkbox" id="plan-${id}" data-plan="${id}" ${store.plan[id]?'checked':''}><div><label for="plan-${id}">${esc(item.title)}</label><p>${esc(item.text)}</p><div class="study-step-links">${item.links.map(([path,label])=>studyLink(path,label)).join('')}</div>${item.dynamic?weakTaskLinks():''}<div class="study-sources">${(item.pages||[]).map(([page,label])=>guideLink(page,label)).join('')}${(item.docs||[]).map(docLink).join('')}</div>${item.tasks?sourceLine(item.tasks):''}</div></article>`;
}
function vStudyPlan(){
  const weeks=PLAN.filter(w=>!w.x),fix=PLAN.find(w=>w.x);const week=Math.min(4,Math.max(1,+studyUI.week||1));
  const total=PLAN.reduce((n,w)=>n+w.items.length,0),done=PLAN.flatMap(w=>w.items).filter(([id])=>store.plan[id]).length;
  return `<section class="study-plan"><div class="split"><div><h2>Four-week study plan</h2><p class="small muted">${done} of ${total} steps complete${store.planStart?'. Started '+esc(store.planStart):''}.</p></div><div class="row">${!store.planStart?'<button class="btn ghost" data-act="planstart">Set today as start date</button>':''}${guideLink(3,'Exam blueprint')}</div></div>
  <nav class="study-weeks" aria-label="Study week">${weeks.map((w,i)=>`<a href="#learn/plan?week=${i+1}" ${week===i+1?'aria-current="step"':''}><span>0${i+1}</span><b>${['Foundation','Tools & workflows','Output & reliability','Exam rehearsal'][i]}</b><small>${['Exam shape · Domain 1','Domains 2 + 3','Domains 4 + 5','Mocks + targeted review'][i]}</small></a>`).join('')}</nav>
  <h3 class="study-week-label">Week ${week} <span>${esc(weeks[week-1].t)}</span></h3>${weeks[week-1].items.map(([id])=>studyStep(id)).join('')}</section>
  <details class="study-targeted"><summary>Targeted review <span>${fix.items.filter(([id])=>store.plan[id]).length} of 6 complete</span></summary>${fix.items.map(([id])=>studyStep(id)).join('')}</details>`;
}
const EXERCISES=[null,
 {title:'Build a multi-tool agent with escalation logic',domains:[1,2,5],tasks:['1.1','1.4','1.5','2.1','2.2','5.2'],scenario:1,steps:['Describe 3–4 tools, including a confusable pair.','Implement loop control with stop_reason.','Return categorized errors and a retryable flag.','Intercept a threshold rule before tool execution.','Test a request with several concerns.']},
 {title:'Configure Claude Code for a team workflow',domains:[3,2],tasks:['3.1','3.2','3.3','3.4','2.4'],scenario:2,steps:['Create shared project instructions.','Test path-scoped rules on matching files.','Configure an isolated skill and tool permissions.','Use environment expansion for MCP credentials.','Compare plan mode and direct execution on different tasks.']},
 {title:'Build a structured extraction pipeline',domains:[4,5],tasks:['4.3','4.4','4.5','5.5'],scenario:6,steps:['Design required, optional, and nullable fields.','Return specific validation feedback on a retry.','Test examples with differing source formats.','Plan a 100-document batch and failed-item handling.','Evaluate field-level routing to human review.']},
 {title:'Design and debug a research pipeline',domains:[1,2,5],tasks:['1.2','1.3','5.3','5.6'],scenario:3,steps:['Delegate to two or more specialist agents.','Compare parallel and sequential work.','Keep claims paired with source metadata.','Simulate a timeout and return structured failure context.','Preserve conflicting findings with attribution.']}
];
function vExercise(){
  const id=studyUI.exercise||1,e=EXERCISES[id],page=SOURCES.exercisePages[id];
  return learnHead('exercise')+`<section class="panel exercise-brief"><div class="exercise-title">${studyArt(id===4?'provenance':id===3?'validation':id===2?'archive':'tools')}<div><span class="kicker">Official preparation exercise ${id}</span><h2>${esc(e.title)}</h2><p class="small muted">Domains ${e.domains.join(', ')} · hands-on work in your own development environment.</p></div></div><div class="study-sources">${guideLink(page,`Full exercise · p. ${page}${id===1||id===3?' onward':''}`)}</div><ol class="exercise-steps">${e.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><h3>Supporting lessons</h3><div class="study-step-links">${e.tasks.map(task=>studyLink(lessonPath(+task[0],task),`Task ${task}`)).join('')}${studyLink(scenarioPath(e.scenario,true),`Scenario ${e.scenario} questions`)}</div>${sourceLine(e.tasks)}<p class="small muted">This brief summarizes the guide. The linked original has the full requirements.</p></section>`;
}
function vStudyScenarios(){
  return `<section class="panel stack"><h2>The six scenarios</h2><p class="muted">Each brief connects the situation, common traps, relevant domains, and a matching question set.</p><div>${SC.slice(1).map(s=>`<details class="rule scenario-rule" data-scenario="${s.id}" ${studyUI.scenario===s.id?'open':''} style="--c:var(--d${s.doms[0]})"><summary><span class="scenario-portrait">${studyArt('keep')}</span><span class="rt"><span class="small muted">Scenario ${s.id}</span><b>${esc(s.n)}</b><span class="rtell">Domains ${s.doms.join(', ')}</span></span></summary><div class="rbody"><div><b>Setup</b>${esc(s.b)}</div><div><b>Watch for</b>${esc(s.traps)}</div><div class="study-step-links">${studyLink(scenarioPath(s.id,true),'Practice this scenario')}${s.doms.map(d=>studyLink(lessonPath(d),`Domain ${d} lesson`)).join('')}</div><div class="study-sources">${guideLink(s.id===1?3:4,`Exam scenarios · §5 p. ${s.id===1?3:4}`)}</div></div></details>`).join('')}</div></section><details class="panel"><summary><h2 style="display:inline">Exam-day tactics</h2></summary><ol class="exercise-steps">${TACTICS.map(t=>`<li>${esc(t)}</li>`).join('')}</ol>${guideLink(2,'Official exam format · p. 2')}</details><section class="panel stack"><h2>The guide’s four exercises</h2><div class="exercise-menu">${EXERCISES.slice(1).map((e,i)=>`<div>${studyArt(i===3?'provenance':i===2?'validation':i===1?'archive':'tools')}<div>${studyLink(`learn/exercise?id=${i+1}`,`${i+1}. ${e.title}`)}<p class="small muted">Domains ${e.domains.join(', ')}</p></div></div>`).join('')}</div></section>`;
}

const LESSON_SCENES=[null,
 {art:'controller',title:'A response is not always a finished task',task:'1.1',beats:[['Situation','Claude returns a tool_use response.'],['Decision','Run the requested tools and append their results.'],['Reasoning','Continue the loop. end_turn, rather than a word such as “done,” ends the turn.']]},
 {art:'tools',title:'Two tools look interchangeable',task:'2.1',beats:[['Situation','The model keeps choosing the wrong tool from a similar pair.'],['Decision','Clarify each tool’s purpose, inputs, outputs, and boundaries.'],['Reasoning','Fix the descriptions before adding a routing layer.']]},
 {art:'archive',title:'A team needs one shared convention',task:'3.1',beats:[['Situation','A coding standard must apply to everyone who clones the repository.'],['Decision','Put the shared standard in project-level CLAUDE.md.'],['Reasoning','Personal user-level instructions do not travel through the repository.']]},
 {art:'validation',title:'Valid JSON contains a missing fact',task:'4.4',beats:[['Situation','An extraction passes the schema, but a source value is absent.'],['Decision','Allow null or route the absence to review.'],['Reasoning','A retry cannot create missing evidence. Validation must check meaning as well as shape.']]},
 {art:'provenance',title:'Two sources disagree',task:'5.6',beats:[['Situation','Credible sources report different values for the same claim.'],['Decision','Keep each value with its source and date.'],['Reasoning','Show the conflict in the synthesis rather than quietly selecting one value.']]}
];
const MODELS=DIAGS.concat([{...lessonVisual(2),t:'2.1, 2.2'},{...lessonVisual(5),t:'5.1, 5.6'}]);
function lessonPreview(d){
  const scene=LESSON_SCENES[d],beat=scene.beats[lessonBeat];
  return `<div class="lesson-walkthrough"><div class="walkthrough-art">${studyArt(scene.art)}<span>Worked decision</span></div><div class="walkthrough-body"><h3>${esc(scene.title)}</h3><div class="walkthrough-stages" role="group" aria-label="Worked decision stages">${scene.beats.map(([label],i)=>`<button type="button" data-act="lessonbeat" data-v="${i}" aria-pressed="${lessonBeat===i}"><span>0${i+1}</span>${label}</button>`).join('')}</div><p class="walkthrough-result" aria-live="polite">${esc(beat[1])}</p><div class="row">${studyLink(`learn/diagrams?model=${d===1?0:d===3?2:d===4?5:d===5?7:6}`,'Open the complete mechanism model')}${studyLink(`practice/questions?task=${scene.task}&count=10`,'Practice this decision')}</div></div></div>${sourceLine([scene.task])}`;
}
function lessonSelfChecks(d){
  if(d===3)return `<section class="panel skill-selfchecks" id="study-skills-check"><h3>Skill self-check</h3><details><summary>Which guide-tested field sets tool permissions?</summary><p><code>allowed-tools</code> is the guide’s permission field. <code>context: fork</code> controls isolation, and <code>argument-hint</code> prompts for an argument. Current documentation includes additional fields; use the linked frontmatter reference for those.</p></details><details><summary>Can permission and isolation settings combine?</summary><p>Yes. A skill can use both <code>allowed-tools</code> and <code>context: fork</code>. They operate on different axes.</p></details>${sourceLine(['3.2'])}</section>`;
  if(d===4)return `<section class="panel failure-reference" id="study-failures"><h3>Five failure patterns</h3>${[
    ['Wrong field','Use validation feedback and examples that identify the intended mapping.'],
    ['Wrong format','Retry with the source, failed output, and specific validation error.'],
    ['Absent value','Use null or review. Repeating the request cannot create evidence.'],
    ['Conflicting sources','Keep both findings with attribution and surface the conflict.'],
    ['Cut-off scan','Recover the missing portion with targeted retrieval or chunking.']
  ].map(([name,answer])=>`<details><summary>${name}</summary><p>${answer}</p></details>`).join('')}${sourceLine(['4.4','5.4','5.6'])}</section>`;
  return '';
}
function scoreDomainTrace(result){
  return [1,2,3,4,5].map(d=>{const score=result.dom[d],percent=score.n?pct(score.c,score.n):0;return `<div class="report-domain" style="--c:var(--d${d})"><span class="report-domain-name"><b>Domain ${d}</b>${esc(DOM[d].n)}</span><div class="report-domain-track" role="img" aria-label="Domain ${d}: ${score.n?percent+' percent correct':'no questions'}"><span style="width:${percent}%"></span></div><span class="report-domain-value">${score.n?percent+'%':'—'}<small>${score.c} of ${score.n} right</small></span></div>`;}).join('');
}
const node=(art,title,detail,cls='')=>`<div class="model-node ${cls}">${studyArt(art)}<b>${title}</b><span>${detail}</span></div>`;
const arrow=(label='')=>`<div class="model-arrow" aria-hidden="true"><span>↓</span>${label?`<small>${label}</small>`:''}</div>`;
function modelFlow(index){
  if(index===0)return `<div class="model-flow agent-model" data-model="loop"><div class="model-row">${node('messages','Messages','Context and history','model-stage')}${arrow()}${node('controller','Claude','Read stop_reason','model-stage')}${arrow('tool_use')}${node('tools','Tool results','Append results to messages','model-stage')}</div><div class="model-branches"><div><b>tool_use</b><span>Run tools → append results → call Claude again</span></div><div><b>end_turn</b><span>Return the answer. No further tool call.</span></div></div><p class="model-footnote">A turn limit is a backstop. Reply wording and the mere presence of text are not stopping rules.</p></div>`;
  if(index===1)return `<div class="model-flow coordinator-model">${node('controller','Coordinator','Plan → delegate → merge','model-stage')}<div class="model-distribution"><span>↓ Findings in each prompt</span><span>↓ Several calls can run in parallel</span></div><div class="model-row">${node('tools','Web search','Claims + source URLs','model-stage')}${node('archive','Document analysis','Evidence + metadata','model-stage')}${node('provenance','Synthesis','Sources stay paired with findings','model-stage')}</div><p class="model-footnote">The guide’s model passes findings explicitly. Do not assume shared context. The coordinator’s tool permissions must support delegation.</p></div>`;
  if(index===2)return `<div class="model-flow config-model">${[
    ['User','~/.claude/CLAUDE.md','Personal instructions; not shared through git.'],
    ['Project','CLAUDE.md or .claude/CLAUDE.md','Shared conventions that travel with the repository.'],
    ['Path-scoped','.claude/rules/*.md','paths globs activate rules for matching files.'],
    ['Directory','packages/api/CLAUDE.md','Instructions for that folder and descendants.']
  ].map(([scope,file,caption],i)=>`<div class="config-scope model-stage">${studyArt('archive')}<span class="scope-number">0${i+1}</span><div><b>${scope}</b><code>${file}</code><p>${caption}</p></div></div>`).join('')}<p class="model-footnote"><code>/memory</code> shows which instruction files are loaded.</p></div>`;
  if(index===3)return `<div class="model-flow hook-model"><div class="model-row">${node('messages','Requested action','Example: refund amount 800','model-stage')}${arrow()}${node('validation','Pre-tool hook','Example threshold: amount > 500','model-stage')}</div><div class="model-branches"><div class="model-stage"><b>Above threshold</b>${studyArt('provenance')}<span>Block the call → escalate to a human</span></div><div class="model-stage"><b>Within threshold</b>${studyArt('tools')}<span>Run the tool → normalize the raw result</span></div></div><p class="model-footnote">Example values illustrate interception. A required rule belongs in code, rather than stronger prompt wording.</p></div>`;
  if(index===4){const wait=studyUI.batchWait===8?8:4,finish=wait+24,ok=finish<=30;return `<div class="model-flow batch-model"><div class="split"><h3>Submission wait + processing window</h3><div class="seg" aria-label="Example submission interval"><button data-act="batchwait" data-v="4" aria-pressed="${wait===4}">Every 4 hours</button><button data-act="batchwait" data-v="8" aria-pressed="${wait===8}">Every 8 hours</button></div></div><div class="batch-timeline" role="img" aria-label="Example: ${wait} hours waiting plus 24 hours processing ends at hour ${finish}, ${ok?'before':'after'} a 30-hour deadline."><div class="batch-bars"><span class="batch-wait" style="width:${wait/36*100}%">${wait}h wait</span><span class="batch-work" style="width:${24/36*100}%">24h processing window</span><span class="batch-deadline" style="left:${30/36*100}%"><b>30h deadline</b></span></div><div class="batch-ticks">${[0,6,12,18,24,30,36].map(hour=>`<span>${hour}h</span>`).join('')}</div></div><div class="batch-outcome ${ok?'fits':'late'}" aria-live="polite"><b>${wait} + 24 = ${finish} hours</b><span>${ok?'Fits this example deadline':'Misses this example deadline'}</span></div><p class="model-footnote">This is the app’s planning example. Batches suit asynchronous work; do not use them for a blocking check. The guide’s up-to-24-hour window is not a latency SLA.</p></div>`;}
  if(index===6)return `<div class="model-flow tool-model"><div class="model-row">${node('messages','Request','The task and its boundaries','model-stage')}${arrow()}${node('controller','Description + scope','Purpose, inputs, outputs, and role','model-stage')}${arrow()}${node('tools','Selected tool','Runs the intended action','model-stage')}</div><div class="model-branches"><div><b>Success</b><span>Return a useful result</span></div><div><b>Failure</b><span>Return the error category, retryability, and recovery context</span></div></div></div>`;
  if(index===7)return `<div class="model-flow context-model"><div class="model-row">${node('provenance','Findings + sources','Claims, dates, exact values','model-stage')}${arrow()}${node('archive','Structured case facts','Keep current values separate from prose','model-stage')}${arrow()}${node('messages','Compact summary','Reduce history without discarding facts','model-stage')}</div><div class="model-branches"><div class="model-stage"><b>Next turn</b><span>Carry the case facts and their sources forward</span></div><div><b>Conflicting evidence</b><span>Preserve both findings and annotate the disagreement</span></div></div></div>`;
  return `<div class="model-flow retry-model"><div class="model-row">${node('messages','Extract','Schema + explicit criteria','model-stage')}${arrow()}${node('validation','Validate','Shape and meaning','model-stage')}</div><div class="model-branches three"><div class="model-stage"><b>Valid</b>${studyArt('validation')}<span>Accept the result</span></div><div class="model-stage"><b>Format / structure error</b>${studyArt('tools')}<span>Retry with the document, failed output, and specific error</span></div><div class="model-stage"><b>Value absent from source</b>${studyArt('provenance')}<span>Use null or review. Retry cannot create evidence.</span></div></div></div>`;
}
function vDiagramLibrary(){
  const index=Math.min(MODELS.length-1,Math.max(0,+studyUI.diagram||0)),diagram=MODELS[index];
  return `<section class="diagram-intro"><div><h2>Mechanism models</h2><p>Follow a complete process, compare its branches, and jump to the related lesson or question set.</p></div>${studyArt('controller')}</section><nav class="model-picker" aria-label="Mechanism model">${MODELS.map((model,i)=>`<a href="#learn/diagrams?model=${i}" ${index===i?'aria-current="true"':''}><span>0${i+1}</span>${esc(model.n)}</a>`).join('')}</nav><section class="panel diagram-reference"><div class="split"><h2>${esc(diagram.n)}</h2><button class="btn ghost" data-act="modelplay">Replay the process</button></div>${modelFlow(index)}<div class="model-caption"><p>${diagram.m}</p><details><summary>Common trap</summary><p>${esc(diagram.x)}</p></details></div><div class="study-step-links">${studyLink(lessonPath(+diagram.t[0],diagram.t.split(',')[0].trim()),'Read the guided lesson')}${diagram.t.split(',').map(id=>studyLink(`practice/questions?task=${id.trim()}&count=10`,`Task ${id.trim()} questions`)).join('')}</div>${sourceLine(diagram.t.split(',').map(id=>id.trim()))}</section>`;
}
function writtenCampaign(){
  return `<div class="written-campaign" aria-label="Written exam-domain map">${[1,2,3,4,5].map(d=>`<details class="written-domain" ${!csel||csel.startsWith('ts:'+d+'.')||csel.startsWith('boss:')&&SC[+csel.slice(5)]?.doms.includes(d)?'open':''} style="--c:var(--d${d})"><summary><span class="domain-number">${d}</span><strong>${esc(DOM[d].n)}</strong><span>${DOM[d].w}%</span></summary>${TS.filter(t=>t.d===d).map(t=>{const state=tsState(t.id),stats=tsStats(t.id);return `<div class="written-task"><button data-act="csel" data-k="ts:${t.id}" aria-pressed="${csel==='ts:'+t.id}"><span>${t.id}</span><b>${esc(t.t)}</b><span class="task-status" style="--status:${STC[state]}">${STN[state]}${stats.seen?' · '+stats.right+'/'+stats.seen+' right':''}</span></button><div class="written-actions">${studyLink(`practice/questions?task=${t.id}&count=10`,'Practice')}${studyLink(lessonPath(d,t.id),'Lesson')}${guideLink(taskPage(t.id),`Guide p. ${taskPage(t.id)}`)}</div></div>`;}).join('')}</details>`).join('')}<details class="written-domain"><summary><strong>Six exam scenarios</strong><span>4 appear on the exam</span></summary>${SC.slice(1).map(s=>`<div class="written-task"><button data-act="csel" data-k="boss:${s.id}" aria-pressed="${csel==='boss:'+s.id}"><span>S${s.id}</span><b>${esc(s.n)}</b><span>Domains ${s.doms.join(', ')}</span></button><div class="written-actions">${studyLink(scenarioPath(s.id,true),'Practice')}${studyLink(scenarioPath(s.id),'Scenario brief')}${guideLink(3,'Exam guide · §5')}</div></div>`).join('')}</details></div>`;
}
function currentStudyPath(){
  if(view==='home')return 'home';
  if(view==='map')return 'campaign'+(csel?.startsWith('ts:')?'?task='+csel.slice(3):csel?.startsWith('boss:')?'?scenario='+csel.slice(5):'');
  if(view==='cards')return 'practice/cards?domain='+cardCfg.d;
  if(view==='mock')return 'practice/mock';
  if(view==='practice')return sub.practice==='q'?`practice/questions?domain=${cfg.d}&scenario=${cfg.sc}&task=${cfg.ts}&mode=${cfg.mode}&count=${cfg.n}`:'practice/drill?kind='+sub.practice;
  if(view==='guide')return sub.guide==='walk'?lessonPath(sub.glevel,studyUI.task)+(studyUI.section?'&section='+studyUI.section:''):sub.guide==='maps'?'learn/diagrams?model='+studyUI.diagram:sub.guide==='trig'?'learn/triggers':`learn/terms?category=${encodeURIComponent(sub.icat)}${studyUI.term?'&term='+encodeURIComponent(studyUI.term):''}`;
  if(view==='library')return sub.library==='plan'?`learn/plan?week=${studyUI.week}${studyUI.step?'&step='+studyUI.step:''}`:sub.library==='exercise'?'learn/exercise?id='+studyUI.exercise:sub.library==='playbook'?'learn/rules'+(studyUI.section==='shapes'?'?section=shapes':''):sub.library==='scenarios'?'learn/scenarios'+(studyUI.scenario?'?scenario='+studyUI.scenario:''):'learn/syllabus'+(studyUI.section==='history'?'?section=history':'');
  return 'home';
}
function applyStudyRoute(path,{initial=false,force=false}={}){
  const [name,query='']=path.split('?'),params=new URLSearchParams(query);
  const number=(key,min,max,fallback)=>{const raw=params.get(key);const n=raw===null?fallback:Number(raw);return Number.isInteger(n)&&n>=min&&n<=max?n:fallback;};
  if(name==='practice/questions'&&!force&&((mock&&!mock.done)||(sess&&sess.items.some(item=>!item.done)))){
    const same=!mock&&cfg.d===number('domain',0,5,0)&&cfg.sc===number('scenario',0,6,0)&&cfg.ts===(params.get('task')||'')&&cfg.mode===(params.get('mode')||'smart')&&cfg.n===number('count',0,200,10);
    if(!same){pendingStudyRoute=path;render();requestAnimationFrame(()=>$('#study-session-dialog [data-act="studyresume"]')?.focus());return;}
  }
  routeApplying=true;pendingStudyRoute=null;studyUI.task='';studyUI.scenario=0;
  if(name==='home')view='home';
  else if(name==='campaign'){
    view='map';const task=TS.find(t=>t.id===params.get('task')),scenario=number('scenario',0,6,0);if(task)csel='ts:'+task.id;else if(scenario)csel='boss:'+scenario;
  }else if(name==='practice/questions'){
    const task=TS.find(t=>t.id===params.get('task'));
    const nextCfg={d:number('domain',0,5,0),sc:number('scenario',0,6,0),ts:task?.id||'',mode:['smart','new','missed','tough','flag','off'].includes(params.get('mode'))?params.get('mode'):'smart',n:number('count',0,200,10)};
    const same=JSON.stringify(cfg)===JSON.stringify(nextCfg)&&sess;
    cfg=nextCfg;view='practice';sub.practice='q';dr=null;
    if(!same){sess=null;const items=buildQueue(pool(),cfg.n);if(items.length)sess={items:items.map(q=>mkItem(q)),i:0};}
  }else if(name==='practice/cards'){view='cards';const domain=number('domain',-1,6,-1);if(cardCfg.d!==domain)cardQ=null;cardCfg.d=domain;flipped=false;}
  else if(name==='practice/mock'){view='mock';}
  else if(name==='practice/drill'){view='practice';sub.practice=['tell','shape','axis'].includes(params.get('kind'))?params.get('kind'):'tell';startDrill(sub.practice,false);}
  else if(name==='learn/lesson'){
    view='guide';sub.guide='walk';const task=TS.find(t=>t.id===params.get('task'));sub.glevel=task?.d||number('domain',1,5,1);studyUI.task=task?.id||'';studyUI.section=['selfcheck','failures'].includes(params.get('section'))?params.get('section'):'';lessonBeat=1;
  }else if(name==='learn/diagrams'){view='guide';sub.guide='maps';studyUI.diagram=number('model',0,MODELS.length-1,0);}
  else if(name==='learn/triggers'){view='guide';sub.guide='trig';}
  else if(name==='learn/terms'){view='guide';sub.guide='items';const category=params.get('category');sub.icat=ITEMS.some(item=>item.c===category)?category:'All';studyUI.term=params.get('term')||'';}
  else if(name==='learn/plan'){view='library';sub.library='plan';studyUI.week=number('week',1,4,studyUI.week||1);studyUI.step=Object.hasOwn(PLAN_DEST,params.get('step'))?params.get('step'):'';}
  else if(name==='learn/exercise'){view='library';sub.library='exercise';studyUI.exercise=number('id',1,4,1);}
  else if(name==='learn/scenarios'){view='library';sub.library='scenarios';studyUI.scenario=number('scenario',0,6,0);}
  else if(name==='learn/rules'){view='library';sub.library='playbook';studyUI.section=params.get('section')==='shapes'?'shapes':'';}
  else if(name==='learn/syllabus'){view='library';sub.library='syllabus';studyUI.section=params.get('section')==='history'?'history':'';}
  else {view='library';sub.library='plan';}
  store.view=view;save();enterNext=true;
  if(!initial){history.pushState(null,'','#'+path);render();window.scrollTo(0,0);}
  routeApplying=false;
  if(!initial)requestAnimationFrame(focusStudyDestination);
}
function focusStudyDestination(){
  let target=null;
  if(view==='library'&&sub.library==='plan'&&studyUI.step)target=$('#step-'+studyUI.step);
  if(view==='guide'&&sub.guide==='walk'&&studyUI.task)target=$('.tsrow[data-task="'+studyUI.task+'"]');
  if(view==='guide'&&sub.guide==='walk'&&studyUI.section==='selfcheck')target=$('#study-skills-check');
  if(view==='guide'&&sub.guide==='walk'&&studyUI.section==='failures')target=$('#study-failures');
  if(view==='library'&&sub.library==='scenarios'&&studyUI.scenario){target=$('[data-scenario="'+studyUI.scenario+'"]');if(target)target.open=true;}
  if(view==='library'&&sub.library==='playbook'&&studyUI.section==='shapes')target=$('#study-shapes');
  if(view==='library'&&sub.library==='syllabus'&&studyUI.section==='history')target=$('#study-history');
  if(view==='guide'&&sub.guide==='items'&&studyUI.term)target=Array.from(document.querySelectorAll('.item')).find(item=>item.querySelector('.iname')?.textContent.toLowerCase().includes(studyUI.term.toLowerCase()));
  if(target)target.scrollIntoView({block:'center'});
}
function studyReturnBanner(){return studyOrigin&&!(view==='library'&&sub.library==='plan')?`<div class="study-return">${studyLink(`learn/plan?week=${studyOrigin.week}&step=${studyOrigin.step}`,'← Back to study plan')}<span>Week ${studyOrigin.week} · same step</span></div>`:'';}
function studySessionDialog(){return pendingStudyRoute?`<div class="study-session-overlay"><section id="study-session-dialog" class="panel" role="dialog" aria-modal="true" aria-labelledby="study-session-title"><h2 id="study-session-title">You have a session in progress</h2><p>Resume it, or leave it and open this linked question set. Completed practice answers stay saved.</p><div class="row"><button class="btn primary" data-act="studyresume">Resume current session</button><button class="btn" data-act="studyswitch">Leave session and open set</button></div></section></div>`:'';}
function experienceAct(a,d){
  if(a==='printtab'){window.print();return true;}
  if(a==='exportprogress'){exportProgress();return true;}
  if(a==='importcancel'){importPreview=null;importError='';render();return true;}
  if(a==='importconfirm'){applyImport();return true;}
  if(a==='printsheet'){printSheet();return true;}
  if(a==='resetyes'){
    Object.keys(studyUI).forEach(key=>delete studyUI[key]);Object.assign(studyUI,{week:1,mapView:'map',diagram:0,motion:true});studyOrigin=null;pendingStudyRoute=null;sess=null;mock=null;dr=null;
    try{sessionStorage.removeItem(KEY+'-plan-origin');sessionStorage.removeItem(KEY+'-practice');}catch{}
  }
  if(a==='gtab'){sub.guide=d.v;studyUI.task='';lessonBeat=1;go('guide');return true;}
  if(a==='ltab'){sub.library=d.v;go('library');return true;}
  if(a==='csel'){studyUI.selection=d.k||null;save();}
  if(a==='mapview'){studyUI.mapView=d.v==='written'?'written':'map';save();enterNext=true;render();return true;}
  if(a==='lessonbeat'){lessonBeat=Math.min(2,Math.max(0,+d.v));render();return true;}
  if(a==='glevel'){lessonBeat=1;studyUI.task='';}
  if(a==='modelplay'){playStudyModel();return true;}
  if(a==='batchwait'){studyUI.batchWait=+d.v;render();return true;}
  if(a==='motiontoggle'){studyUI.motion=studyUI.motion===false;save();render();return true;}
  if(a==='studyswitch'){const path=pendingStudyRoute;mock=null;clearMock();sess=null;if(path)applyStudyRoute(path,{force:true});return true;}
  if(a==='studyresume'){pendingStudyRoute=null;go(mock&&!mock.done?'mock':'practice');return true;}
  if(a==='cgo'&&d.v==='learn'){openGuide('walk',sub.glevel||1);return true;}
  return false;
}

const RULE_TASKS=[null,['1.4','1.5'],['4.1','4.2'],['2.1'],['1.1','2.2'],['1.3'],['2.3'],['5.5','4.6'],['2.2','5.3'],['4.5'],['5.1','5.6']];
function triggerTasks(row){
  return [
    ['4.1','4.3','4.4'],['4.3'],['4.3','5.2'],['2.1'],['1.4','2.3'],['1.3','4.5'],['5.1'],['5.1'],['1.3'],['1.2','1.6'],['5.1','5.6'],['2.1','2.3'],['5.2'],['3.5','3.6'],['4.6','5.4'],['5.6'],['4.1','4.2','4.3'],['5.1'],['2.2','5.3'],['1.7'],['1.4','1.5'],['4.1','4.2'],['4.5'],['4.6'],['5.2','5.5'],['3.2'],['3.2'],['4.4'],['1.1']
  ][TRIG.indexOf(row)]||[];
}
function termTasks(item){
  return [
    ['2.5'],['2.5'],['2.5'],['2.5'],['2.5'],['1.1'],['2.3'],['2.3'],['2.3'],['4.3'],['4.5'],['4.5'],['3.1'],['3.1'],['3.3'],['3.2'],['3.2'],['3.2'],['3.2'],['3.4'],['3.6'],['3.6'],['3.1'],['5.1'],['1.7'],['2.4'],['2.4'],['2.4'],['3.2'],['3.2'],['3.2'],['3.2'],['1.6'],['1.6'],['1.6','2.3'],['1.3'],['1.2','1.6'],['1.6','3.5']
  ][ITEMS.indexOf(item)]||[];
}
function experienceInner(html){
  if(view==='guide'&&sub.guide==='items')html=html.replaceAll('<article class="item">','<article class="item">'+studyArt('archive'));
  if(view==='library'&&sub.library==='syllabus')html+=`<div class="study-sources">${guideLink(3,'Official blueprint · p. 3')}${guideLink(33,'Scoring and registration · p. 33')}</div>`;
  if(view==='practice'&&sub.practice!=='q')html='<div class="drill-object">'+studyArt(sub.practice==='shape'?'creeps':sub.practice==='axis'?'controller':'messages')+'</div>'+html;
  if(view==='mock'&&mock?.done)html+=sourceLine(Object.keys(mock.res.tsMiss||{}));
  if(view==='practice'&&sub.practice==='q')html=`<div class="study-question-context"><span>${cfg.ts?'Task '+cfg.ts:cfg.d?'Domain '+cfg.d:cfg.sc?'Scenario '+cfg.sc:'All domains'} · ${cfg.mode==='missed'?'missed answers':cfg.mode==='off'?'official samples':'practice'}${sess?' · '+sess.items.length+' questions':''}</span></div>`+html;
  if(view==='library'&&sub.library==='scenarios')html=html.replace('<div class="grid3">','<div class="grid3 exercise-cards">');
  const footer=view==='mock'&&mock&&!mock.done?'':`<div class="study-utility"><span>Unofficial study aid. Guide ${esc(SOURCES.version)}, checked ${esc(SOURCES.verified)}.</span>${guideLink(1,'Original exam guide')}<button class="btn ghost" data-act="motiontoggle" aria-pressed="${studyUI.motion===false}">${studyUI.motion===false?'Resume motion':'Pause motion'}</button></div>`;
  return studyReturnBanner()+html+footer+studySessionDialog();
}
function stopStudyMotion(){studyMotionTimers.forEach(clearTimeout);studyMotionTimers=[];studyAnimations.forEach(animation=>animation.cancel());studyAnimations=[];}
function studyAnimate(element,frames,duration=300){
  if(!element||studyUI.motion===false||reduceMo()||document.hidden||(view==='mock'&&mock&&!mock.done))return;
  const animation=element.animate(frames,{duration,easing:'cubic-bezier(.2,0,0,1)'});studyAnimations.push(animation);
}
function playStudyModel(){
  stopStudyMotion();const nodes=Array.from(document.querySelectorAll('.model-flow .model-stage'));
  nodes.forEach(node=>node.classList.remove('model-active'));
  if(studyUI.motion===false||reduceMo()||document.hidden)return;
  nodes.forEach((node,index)=>{
    const delay=Math.min(index*280,1200);
    studyMotionTimers.push(setTimeout(()=>{nodes.forEach(other=>other.classList.remove('model-active'));node.classList.add('model-active');studyAnimate(node,[{transform:'translateY(3px)',opacity:.7},{transform:'translateY(0)',opacity:1}],280);},delay));
  });
  studyMotionTimers.push(setTimeout(()=>nodes.forEach(node=>node.classList.remove('model-active')),1800));
}
const studyObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  const svg=entry.target;
  if(typeof svg.pauseAnimations==='function'){if(!entry.isIntersecting||studyUI.motion===false||reduceMo()||document.hidden)svg.pauseAnimations();else svg.unpauseAnimations();}
}),{threshold:.05});
function experienceAfterRender(){
  if(!store.studyUI){store.studyUI=studyUI;save();}
  const scene=[view,sub.guide,sub.library,sub.glevel,studyUI.diagram,studyUI.week,cardQ?.[0]].join('|');
  const changed=scene!==lastStudyScene;lastStudyScene=scene;
  stopStudyMotion();studyObserver.disconnect();
  document.body.dataset.studyMotion=studyUI.motion===false?'paused':'on';
  document.body.dataset.studyExam=String(view==='mock'&&!!mock&&!mock.done);
  document.querySelectorAll('.cmap').forEach(svg=>{studyObserver.observe(svg);if(studyUI.motion===false||reduceMo())svg.pauseAnimations?.();});
  if(changed){
    const candidates=Array.from(document.querySelectorAll(view==='home'?'.hero-copy,.hero-scout,.mode':view==='map'?'.mapwrap,.console':'.pagehead,.learn-overview,.study-plan,.diagram-reference'));
    candidates.slice(0,2).forEach((element,index)=>studyAnimate(element,[{opacity:.45,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],280+index*50));
    if(view==='guide'&&sub.guide==='maps')studyMotionTimers.push(setTimeout(playStudyModel,300));
  }
  const explanation=$('.explain');if(explanation)studyAnimate(explanation,[{opacity:.3,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],260);
  const walkthrough=$('.walkthrough-result');if(walkthrough)studyAnimate(walkthrough,[{opacity:.3,transform:'translateX(5px)'},{opacity:1,transform:'translateX(0)'}],260);
  if(view==='cards'){
    if(lastCardFace!==flipped)studyAnimate($('.flipper'),[{transform:`rotateY(${flipped?0:180}deg)`},{transform:`rotateY(${flipped?180:0}deg)`}],360);
    else if(changed)studyAnimate($('.flipwrap'),[{opacity:.4,transform:'translateY(9px) rotate(-1deg)'},{opacity:1,transform:'translateY(0) rotate(0)'}],320);
    lastCardFace=flipped;
  }else lastCardFace=false;
  if(view==='map'&&csel){const marker=$(`.cmap [data-k="${csel}"] .map-art`);studyAnimate(marker,[{transform:'translateY(-4px)'},{transform:'translateY(-1px)'}],300);}
  const path=currentStudyPath();
  if(!routeApplying&&!coach.open&&!pendingStudyRoute&&location.hash.slice(1)!==path){
    try{if(lastStudyPath&&lastStudyPath!==path)history.pushState(null,'','#'+path);else history.replaceState(null,'','#'+path);}catch{}
  }
  lastStudyPath=path;
  try{if(sess)sessionStorage.setItem(KEY+'-practice',JSON.stringify({cfg,sess}));else sessionStorage.removeItem(KEY+'-practice');}catch{}
  if(studyOrigin)try{sessionStorage.setItem(KEY+'-plan-origin',JSON.stringify(studyOrigin));}catch{}
}
function experienceBoot(){
  const spriteSheet=document.getElementById('study-campaign-sheet')?.getAttribute('href');
  if(spriteSheet)document.documentElement.style.setProperty('--campaign-sheet',`url("${spriteSheet}")`);
  try{
    const saved=JSON.parse(sessionStorage.getItem(KEY+'-practice')||'null');
    if(saved?.sess?.items?.length&&saved.sess.items.every(item=>byId[item.id]&&Array.isArray(item.perm)&&item.perm.length===byId[item.id].o.length&&new Set(item.perm).size===item.perm.length&&item.perm.every(index=>Number.isInteger(index)&&index>=0&&index<byId[item.id].o.length)&&Array.isArray(item.sel)&&item.sel.every(index=>item.perm.includes(index)))&&Number.isInteger(saved.sess.i)&&saved.sess.i>=0&&saved.sess.i<=saved.sess.items.length){cfg=saved.cfg;sess=saved.sess;}
    const origin=JSON.parse(sessionStorage.getItem(KEY+'-plan-origin')||'null');if(origin&&origin.week>=1&&origin.week<=4&&Object.hasOwn(PLAN_DEST,origin.step))studyOrigin=origin;
  }catch{}
  if(location.hash.length>1)applyStudyRoute(location.hash.slice(1),{initial:true,force:true});
  if(view==='map'&&!csel&&studyUI.selection&&/^(ts:[1-5]\.[1-7]|boss:[1-6]|creep:[0-4])$/.test(studyUI.selection))csel=studyUI.selection;
  requestAnimationFrame(focusStudyDestination);
}
document.addEventListener('click',event=>{
  const link=event.target.closest('a.study-link,a[href^="#learn/"],a[href^="#practice/"],a[href^="#campaign"]');
  if(!link||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;
  event.preventDefault();
  const step=link.closest('.study-step');if(step){studyOrigin={week:studyUI.week,step:step.id.slice(5),scroll:window.scrollY};}
  applyStudyRoute(link.getAttribute('href').slice(1));
});
document.addEventListener('change',event=>{
  const input=event.target;if(input.matches('input[data-plan]'))requestAnimationFrame(()=>$('#'+input.id)?.focus({preventScroll:true}));
},true);
window.addEventListener('popstate',()=>{if(location.hash&&location.hash!=='#study-main'){applyStudyRoute(location.hash.slice(1),{initial:true,force:true});routeApplying=true;render();routeApplying=false;requestAnimationFrame(focusStudyDestination);}});
window.addEventListener('hashchange',()=>{if(location.hash!=='#study-main'&&location.hash.slice(1)!==currentStudyPath()){applyStudyRoute(location.hash.slice(1),{initial:true,force:true});routeApplying=true;render();routeApplying=false;requestAnimationFrame(focusStudyDestination);}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopStudyMotion();document.querySelectorAll('.cmap').forEach(svg=>svg.pauseAnimations?.());}else applyMotionPreferences();});
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>{if(reduceMo())stopStudyMotion();});
document.addEventListener('keydown',event=>{
  if(!pendingStudyRoute)return;
  if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();pendingStudyRoute=null;render();}
  if(event.key==='Tab'){
    const controls=Array.from(document.querySelectorAll('#study-session-dialog button'));const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
},true);

(function(){
  let opened=[];
  window.addEventListener('beforeprint',()=>{opened=[...document.querySelectorAll('#app details:not([open])')];opened.forEach(x=>x.open=true);});
  window.addEventListener('afterprint',()=>{opened.forEach(x=>x.open=false);opened=[];});
})();

function sheetHtml(){
  const weights=[1,2,3,4,5].map(d=>`<li><b>D${d} ${DOM[d].w}%</b> ${esc(DOM[d].n)}</li>`).join('');
  const rules=RULES.slice(1).map((r,i)=>`<li><b>${i+1}. ${esc(r.n)}.</b> ${esc(r.fix)}</li>`).join('');
  const shapes=SHAPES.map(s=>`<li><b>${esc(s.n)}.</b> ${esc(s.d)}</li>`).join('');
  const tactics=TACTICS.map(t=>`<li>${esc(t)}</li>`).join('');
  const trig=TRIG.map(r=>`<tr><td>${esc(r.t)}</td><td>${esc(r.a)}</td></tr>`).join('');
  return `<h1>CCAR-F exam-day sheet</h1><p class="s-note">Unofficial study aid built from the public exam guide ${esc(SOURCES.version)}, checked ${esc(SOURCES.verified)}. Check the guide for anything that matters.</p>
  <p><b>Format.</b> 60 items, 120 minutes, closed book, 4 of 6 scenarios, pass at 720 of 1,000.</p><ul class="s-weights">${weights}</ul>
  <div class="s-cols"><section><h2>Tactics</h2><ul>${tactics}</ul><h2>Five wrong-answer shapes</h2><ul>${shapes}</ul></section>
  <section><h2>Ten decision rules</h2><ul>${rules}</ul></section></div>
  <h2>Trigger words</h2><table><thead><tr><th>When you see</th><th>Think</th></tr></thead><tbody>${trig}</tbody></table>`;
}
function printSheet(){
  let el=document.getElementById('sheet');if(el)el.remove();
  el=document.createElement('div');el.id='sheet';el.innerHTML=sheetHtml();document.body.appendChild(el);
  document.body.classList.add('sheet-print');
  const done=()=>{document.body.classList.remove('sheet-print');el.remove();window.removeEventListener('afterprint',done);};
  window.addEventListener('afterprint',done);
  window.print();
}

/* ---------- progress export and import ---------- */
let importPreview=null,importError='';
function freshStore(){return {answers:{},cards:{},rate:{},flags:{},mocks:[],days:[],examDate:'',view:'library',drill:{tell:{n:0,c:0},shape:{n:0,c:0},axis:{n:0,c:0}},plan:{},planStart:'',guide:{done:{}}};}
function exportProgress(){
  const {studyUI:_ui,...data}=store;
  const payload={app:'ccarf-study',v:1,exported:new Date().toISOString(),data};
  const blob=new Blob([JSON.stringify(payload)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`ccarf-progress-${today()}.json`;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function cleanProgress(o){
  const isObj=x=>x&&typeof x==='object'&&!Array.isArray(x),num=x=>typeof x==='number'&&isFinite(x),date=x=>typeof x==='string'&&/^\d{4}-\d\d-\d\d$/.test(x);
  if(!isObj(o)||o.app!=='ccarf-study'||o.v!==1||!isObj(o.data))return null;
  const d=o.data,out=freshStore(),qids=new Set(Q.map(q=>q.id)),ckeys=new Set(CARDS.map(cardKey));
  if(isObj(d.answers))for(const [k,a] of Object.entries(d.answers))if(qids.has(k)&&isObj(a)&&num(a.n)&&num(a.c))out.answers[k]={n:Math.max(0,Math.floor(a.n)),c:Math.max(0,Math.floor(a.c)),last:!!a.last,t:num(a.t)?a.t:Date.now()};
  if(isObj(d.cards))for(const [k,c] of Object.entries(d.cards))if(ckeys.has(k)&&isObj(c)&&num(c.box)&&num(c.due))out.cards[k]={box:Math.min(4,Math.max(0,Math.floor(c.box))),due:c.due};
  if(isObj(d.flags))for(const k of Object.keys(d.flags))if(qids.has(k)&&d.flags[k])out.flags[k]=true;
  if(isObj(d.rate))for(const [k,v] of Object.entries(d.rate))if(k.length<20&&(num(v)||typeof v==='string'&&v.length<20))out.rate[k]=v;
  if(Array.isArray(d.mocks))out.mocks=d.mocks.filter(m=>isObj(m)&&typeof m.date==='string'&&num(m.pct)&&num(m.scaled)).slice(-100).map(m=>({date:String(m.date).slice(0,20),pct:m.pct,scaled:m.scaled,mins:num(m.mins)?m.mins:0,dom:isObj(m.dom)?Object.fromEntries(Object.entries(m.dom).filter(([k,v])=>/^[1-5]$/.test(k)&&num(v))):{}}));
  if(Array.isArray(d.days))out.days=[...new Set(d.days.filter(date))].slice(-500);
  if(d.examDate===''||date(d.examDate))out.examDate=d.examDate||'';
  if(isObj(d.drill))for(const k of ['tell','shape','axis'])if(isObj(d.drill[k])&&num(d.drill[k].n)&&num(d.drill[k].c))out.drill[k]={n:d.drill[k].n,c:d.drill[k].c};
  if(isObj(d.plan))for(const [k,v] of Object.entries(d.plan))if(k.length<20)out.plan[k]=!!v;
  if(date(d.planStart))out.planStart=d.planStart;
  if(isObj(d.guide)&&isObj(d.guide.done))for(const n of [1,2,3,4,5])if(d.guide.done[n])out.guide.done[n]=true;
  if(d.hints===false)out.hints=false;
  if(d.lastLearn==='guide'||d.lastLearn==='library')out.lastLearn=d.lastLearn;
  return out;
}
function applyImport(){
  const p=importPreview;if(!p)return;
  store=Object.assign(freshStore(),p.data,{view:'library',studyUI});
  importPreview=null;importError='';save();render();
}
function progressPanel(){
  const p=importPreview,err=importError;
  const preview=p?`<div class="import-preview" role="status"><p><b>Replace the progress in this browser?</b> The file has ${Object.keys(p.data.answers).length} answered questions, ${Object.keys(p.data.cards).length} reviewed cards, ${p.data.mocks.length} mock results, and ${p.data.days.length} study days.</p><div class="row"><button class="btn primary" data-act="importconfirm">Replace my progress</button><button class="btn" data-act="importcancel">Cancel</button></div></div>`:'';
  return `<section class="panel stack" id="study-progress"><h3>Your progress</h3><p class="small muted">Progress lives in this browser only. Save it to a file to move it to another browser or device, or to keep a backup.</p>
  <div class="row"><button class="btn" data-act="exportprogress">Save progress to a file</button><label class="btn file-btn">Load progress from a file<input type="file" id="progressFile" accept="application/json,.json" hidden></label></div>
  ${err?`<p class="small" role="alert">${esc(err)}</p>`:''}${preview}
  <h3 style="margin-top:12px">Reset</h3><p class="small muted">Clears all progress stored in this browser.</p>${resetAsk?`<div class="row"><span class="small"><b>Erase everything?</b></span><button class="btn primary" data-act="resetyes">Yes, erase</button><button class="btn" data-act="resetno">Cancel</button></div>`:`<div><button class="btn" data-act="resetask">Reset progress</button></div>`}</section>`;
}
document.addEventListener('change',e=>{
  const t=e.target;if(!t||t.id!=='progressFile')return;
  const f=t.files&&t.files[0];if(!f)return;
  if(f.size>2000000){importError='That file is too large to be a progress file.';importPreview=null;render();return;}
  const r=new FileReader();
  r.onload=()=>{let o=null;try{o=JSON.parse(r.result);}catch{}
    const data=cleanProgress(o);
    if(data){importPreview={data};importError='';}else{importPreview=null;importError='That file is not a progress file from this tool.';}
    render();};
  r.onerror=()=>{importError='The file could not be read.';render();};
  r.readAsText(f);
});
