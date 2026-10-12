Q.push(
{id:"s6-01",sc:6,d:4,ts:"4.3",r:1,q:"You need extraction output that always conforms to your schema. Which approach is most reliable?",
o:["Define an extraction tool whose input schema is your JSON schema and read the structured data from the `tool_use` response","Ask Claude in the prompt to 'respond only in valid JSON'","Parse free text with regular expressions","Ask for JSON and retry until it parses"],a:[0],
e:"Tool use with a JSON schema is the most reliable path to schema-compliant output and removes JSON syntax errors. Asking nicely or retrying relies on probabilistic compliance."},

{id:"s6-02",sc:6,d:4,ts:"4.3",r:0,q:"Incoming documents may be invoices, receipts, or contracts, each with its own extraction tool, and you do not know the type in advance. You must guarantee Claude calls a tool rather than replying in text. What `tool_choice` do you set?",
o:["`any`","`auto`","`none`","`{\"type\": \"tool\", \"name\": \"extract_invoice\"}`"],a:[0],
e:"`any` forces a tool call while letting the model choose which. `auto` allows a plain text reply, `none` disables tools, and forcing one named tool is wrong when the type is unknown."},

{id:"s6-03",sc:6,d:4,ts:"4.3",r:0,q:"With strict schemas via tool use, which problem can still occur?",
o:["Line items that do not sum to the stated total, or values placed in the wrong fields (semantic errors)","Missing closing braces in the JSON","Trailing commas","Strings where numbers were required"],a:[0],
e:"Schemas eliminate syntax errors but do not prevent semantic ones. Those need validation logic that checks meaning, such as totals."},

{id:"s6-04",sc:6,d:4,ts:"4.3",r:1,q:"Some documents simply do not contain a PO number, but your schema marks it required and the model sometimes invents one. What is the right schema change?",
o:["Make the field optional (nullable) so the model can return null when the source lacks it","Add an instruction 'never hallucinate'","Fill missing PO numbers with a placeholder after extraction","Reject all documents without a PO number"],a:[0],
e:"Required fields push a model to fabricate values when the source is silent. Optional or nullable fields let absence be represented honestly."},

{id:"s6-05",sc:6,d:4,ts:"4.3",r:0,q:"Your `document_category` enum covers five known types, but new categories appear occasionally and some documents are truly ambiguous. What schema design handles both?",
o:["Add `other` with a companion detail string for new categories, and `unclear` for ambiguous cases","Use a free-text category field only","Force every document into the closest of the five","Add 20 more enum values"],a:[0],
e:"An `other` plus detail pattern keeps categories extensible, and an `unclear` value keeps ambiguous cases from being forced into a wrong bucket."},

{id:"s6-06",sc:6,d:4,ts:"4.4",r:8,q:"An extraction fails validation because a date came back in the wrong format. What retry gives the best chance of correction?",
o:["A follow-up request containing the original document, the failed extraction, and the specific validation error","Resend the identical request unchanged","Ask the model to try harder","Discard the document"],a:[0],
e:"Retry-with-error-feedback gives the model what it needs to correct a format or structural mistake. Identical retries repeat the same mistake."},

{id:"s6-07",sc:6,d:4,ts:"4.4",r:0,q:"Which failure is a retry with error feedback LEAST likely to fix?",
o:["A required tax ID exists only in an external attachment that was not provided","A date returned in the wrong format","A value placed in the wrong field","A malformed nested structure"],a:[0],
e:"Retries help with format or structural errors. They cannot recover information that is absent from the source document."},

{id:"s6-08",sc:6,d:4,ts:"4.4",r:0,q:"Invoices sometimes contain a stated total that disagrees with the line items. What design flags this reliably?",
o:["Extract both `stated_total` and a `calculated_total`, and add a `conflict_detected` boolean for inconsistent source data","Trust the stated total","Trust the sum of line items silently","Ask the model whether the invoice looks right"],a:[0],
e:"Extracting both values and surfacing a conflict flag lets downstream logic and reviewers see the discrepancy instead of hiding it."},

{id:"s6-09",sc:6,d:4,ts:"4.2",r:2,q:"Extraction quality drops on documents with unusual structure: citations inline in some, in bibliographies in others, and informal measurements like 'about a dozen'. What helps most?",
o:["Few-shot examples showing correct extraction across varied document structures and informal formats","A longer description of every possible layout","A bigger model","Reject unusual documents"],a:[0],
e:"Examples across varied structures reduce empty or hallucinated extractions and generalize to new layouts better than longer prose."},

{id:"s6-10",sc:6,d:4,ts:"4.3",r:0,q:"Source documents write dates and currencies in many formats. Your schema is strict, but values still arrive inconsistent. What do you add?",
o:["Format normalization rules in the prompt alongside the strict output schema","Nothing; the schema already guarantees formats","A second schema","A manual cleanup step for every record"],a:[0],
e:"Schemas fix structure, not how messy source values are interpreted. Normalization rules in the prompt handle inconsistent source formatting."},

{id:"s6-11",sc:6,d:4,ts:"4.5",r:0,q:"In a batch of 100 documents, 7 fail because they exceed context limits. What is the efficient recovery?",
o:["Use `custom_id` to identify the failures and resubmit only those, modified (for example, chunked)","Resubmit all 100 unchanged","Discard the 7","Switch the whole workload to real-time calls"],a:[0],
e:"`custom_id` correlates results to requests, so you can resubmit only failures with changes that address the cause."},

{id:"s6-12",sc:6,d:4,ts:"4.5",r:0,q:"Before batch-processing 50,000 documents, what should you do to reduce rework costs?",
o:["Refine the prompt on a small sample set first to maximize first-pass success","Submit everything and fix failures afterward","Split into 50,000 single-document batches","Skip prompt work; batches are cheap"],a:[0],
e:"A flawed prompt multiplied by a huge volume is expensive. Iterating on a sample first raises first-pass success and cuts resubmission."},

{id:"s6-13",sc:6,d:5,ts:"5.5",r:0,q:"Overall extraction accuracy is 97%, and the team wants to automate and drop human review. What should you check first?",
o:["Accuracy broken down by document type and field, since the aggregate may hide poor performance on specific segments","Whether the overall figure is above 95%","Whether the model sounds confident","Throughput per hour"],a:[0],
e:"An aggregate can mask weak document types or fields. Validate by segment before automating."},

{id:"s6-14",sc:6,d:5,ts:"5.5",r:0,q:"How do you keep measuring error rates on extractions the model is highly confident about, and catch new kinds of errors?",
o:["Stratified random sampling of high-confidence extractions for ongoing review","Review only the low-confidence ones","Stop checking once accuracy is high","Review the most recent 10 records"],a:[0],
e:"Stratified random sampling measures error rates in the confident segment and surfaces novel patterns that confidence scores miss."},

{id:"s6-15",sc:6,d:5,ts:"5.5",r:7,q:"You want to route uncertain extractions to scarce human reviewers. What is the sound design?",
o:["Have the model output field-level confidence, calibrate review thresholds on a labeled validation set, and route low-confidence or contradictory sources to review","Review a random 5% of everything","Route everything to humans","Set a confidence threshold at 0.8 because it sounds reasonable"],a:[0],
e:"Confidence scores are useful only when calibrated against labeled data, and routing should prioritize limited reviewer capacity. An arbitrary threshold has no evidence behind it."},

{id:"s6-16",sc:6,d:5,ts:"5.5",r:7,q:"Why shouldn't you pick the review threshold by what feels reasonable (say, 0.8)?",
o:["Raw self-reported confidence is not necessarily calibrated; thresholds must be calibrated against labeled validation data","Because confidence scores are always random","Because humans cannot review extractions","Because thresholds must always be 0.99"],a:[0],
e:"A model's stated confidence may not match its actual accuracy, so calibration on labeled data decides where to set the threshold."},

{id:"s6-17",sc:6,d:5,ts:"5.1",r:10,q:"A long extraction prompt buries the critical output instructions in the middle of a very large input. Results ignore them. What mitigates the position effect?",
o:["Place key instructions and a summary at the beginning (and organize the rest with clear section headers)","Place them in the middle","Make the input longer","Repeat them in a separate chat"],a:[0],
e:"Models reliably process the start and end of long inputs; leading with the key material and structuring the rest reduces omissions."}
);
