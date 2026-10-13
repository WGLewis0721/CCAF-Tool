#!/usr/bin/env python3
"""Authoring aid, not part of the build. Reports guide bullets that no question seems to cover.

Usage: python scripts/coverage.py <exam-guide.pdf>
The guide text is read locally and never copied into the app. Matching is keyword overlap,
so treat the output as a list of places to look, not as a verdict. Needs: pip install pypdf
"""
import json, re, subprocess, sys
from pathlib import Path

import pypdf

root = Path(__file__).resolve().parent.parent
STOP = set("with that this from have been into when what which their there would should could about using used uses over only more than such also each other these those where while within without across between agent agents model models claude".split())

def tokens(s):
    return {w for w in re.findall(r"[a-z_][a-z_0-9]{3,}", s.lower()) if w not in STOP}

def guide_bullets(pdf):
    text = "\n".join((p.extract_text() or "") for p in pypdf.PdfReader(pdf).pages)
    text = re.sub(r"Claude Certification Program Exam guide\n?", "", text)
    text = re.sub(r"\[\[p\d+\]\]\n?", "", text)
    out = {}
    for m in re.finditer(r"Task Statement (\d\.\d):(.*?)(?=Task Statement \d\.\d:|\nDomain \d|\Z)", text, re.S):
        body = m.group(2)[:2200]
        bullets = [re.sub(r"\s+", " ", b).strip() for b in re.split(r"\n?•", body)[1:]]
        out[m.group(1)] = [b for b in bullets if len(b) > 25]
    return out

def questions():
    js = r"""
const fs=require('fs'),p=require('path');const c=p.join(process.argv[1],'src','content');
const f=['q-s1.js','q-s2.js','q-s3.js','q-s4.js','q-s5.js','q-s6.js','q-s7.js','q-fix.js','q-fix2.js','q-fix3.js','q-fix4.js'];
let s='const Q=[];';for(const x of f)s+=fs.readFileSync(p.join(c,x),'utf8')+String.fromCharCode(10);s+=';Q';
console.log(JSON.stringify(eval(s)));
"""
    return json.loads(subprocess.check_output(["node", "-e", js, str(root)]))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    bullets, qs = guide_bullets(sys.argv[1]), questions()
    rows = []
    for ts, items in bullets.items():
        pool = [(q["id"], tokens(q["q"] + " " + " ".join(q["o"]) + " " + q["e"])) for q in qs if q["ts"] == ts]
        for b in items:
            bt = tokens(b)
            best = max(((len(bt & t) / max(1, len(bt)), qid) for qid, t in pool), default=(0, "-"))
            rows.append((best[0], ts, b, best[1], len(pool)))
    rows.sort()
    print(f"{len(rows)} guide bullets across {len(bullets)} task statements. Lowest keyword overlap first:\n")
    for score, ts, b, qid, n in rows[:25]:
        print(f"- {ts} ({n} questions, best match {qid}, overlap {score:.0%}): {b[:150]}")
