// Checks the question bank and flashcards before a build.
// Usage: node scripts/validate.js   (exits with code 1 if any check fails)
const fs = require('fs');
const path = require('path');

const content = path.join(__dirname, '..', 'src', 'content');
const files = ['q-s1.js', 'q-s2.js', 'q-s3.js', 'q-s4.js', 'q-s5.js', 'q-s6.js', 'q-s7.js', 'q-fix.js', 'q-fix2.js', 'q-fix3.js'];
let src = 'const Q=[];';
for (const f of files) src += fs.readFileSync(path.join(content, f), 'utf8') + '\n';
src += 'const CARDS=[];' + fs.readFileSync(path.join(content, 'cards.js'), 'utf8') + '\n';
src += fs.readFileSync(path.join(content, '..', 'guide.js'), 'utf8') + '\n;({Q,CARDS})';
const { Q, CARDS } = eval(src);

const ids = new Set();
const tsRe = /^[1-5]\.[1-7]$/;
let bad = 0;
for (const q of Q) {
  const err = [];
  if (ids.has(q.id)) err.push('duplicate id');
  ids.add(q.id);
  if (!q.o || q.o.length < 4) err.push('fewer than 4 options');
  if (!q.a || !q.a.length || q.a.some(i => i < 0 || i >= q.o.length)) err.push('bad answer index');
  if (new Set(q.o).size !== q.o.length) err.push('duplicate options');
  if (!tsRe.test(q.ts) || +q.ts[0] !== q.d) err.push('task statement does not match domain: ' + q.ts + ' d' + q.d);
  if (q.sc < 1 || q.sc > 6) err.push('scenario out of range');
  if (q.r < 0 || q.r > 10) err.push('rule out of range');
  if (q.a.length > 1 && !/Select (TWO|THREE)/.test(q.q)) err.push('multi-answer question does not say how many to pick');
  if (/[—–]/.test(JSON.stringify(q))) err.push('contains an em or en dash');
  if (/\b[A-D]\. |option [A-D]|Option [A-D]/.test(q.e)) err.push('explanation refers to an option letter (options shuffle)');
  if (err.length) { bad++; console.log(q.id, err.join('; ')); }
}
for (const c of CARDS) {
  if (/[—–]/.test(c.f + c.b)) { bad++; console.log('card contains a dash:', c.f); }
}

const byDomain = {};
Q.forEach(q => { byDomain[q.d] = (byDomain[q.d] || 0) + 1; });
const longest = Q.filter(q => q.a.length === 1 && q.o[0].length === Math.max(...q.o.map(o => o.length))).length;
console.log(`questions ${Q.length}, flashcards ${CARDS.length}, problems ${bad}`);
console.log('questions by domain', byDomain);
console.log(`single-answer questions where the correct option is the longest: ${longest} of ${Q.filter(q => q.a.length === 1).length}`);
process.exitCode = bad ? 1 : 0;
