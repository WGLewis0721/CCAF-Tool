"""Checks for the integrated study aids: print buttons, three rules, shape detail, setup lesson link, missed-item sources, footer date."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
URL=os.environ.get('CCAF_TEST_URL',(ROOT/'dist/index.html').as_uri())

def route(page,path):
    page.goto(URL.split('#')[0]+'#'+path,wait_until='networkidle')
    page.wait_for_function('!!window.__ccarf')
    page.evaluate('window.__ccarf.hints(false)')

with sync_playwright() as p:
    for engine,width in (('chromium',1280),('chromium',390)):
        b=getattr(p,engine).launch()
        page=b.new_context(viewport={'width':width,'height':900},reduced_motion='reduce').new_page()
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        for path in ('learn/rules','learn/triggers','learn/terms'):
            route(page,path)
            assert page.locator('[data-act=printtab]').count()==1,path
        route(page,'learn/rules')
        assert page.locator('.shape-more').count()==5
        assert 'Counter.' in page.locator('.shape-more').first.text_content()
        for d in range(1,6):
            route(page,f'learn/lesson?domain={d}')
            assert page.locator('.threerules li').count()==3,d
        route(page,'practice/cards')
        page.evaluate("document.querySelector('[data-act=ptab][data-v=q]').click()")
        page.locator('[data-act=cfg][data-k=d][data-v="3"]').click()
        assert page.locator('.study-link:has-text("Read the Domain 3 lesson first")').count()==1
        route(page,'learn/lesson?domain=2')
        assert page.locator('.threerules .general a[href^="https://"]').count()==1
        r=page.evaluate('''()=>{const c=window.__ccarf,s=c.store(),now=Date.now();
          s.answers={};c.Q.forEach(q=>{s.answers[q.id]={n:1,c:1,last:true,t:now}});const fresh=c.ready();
          c.Q.forEach(q=>{s.answers[q.id].t=now-70*86400000});const old=c.ready();
          c.Q.forEach(q=>{s.answers[q.id].t=now-14*86400000});const edge=c.ready();
          s.examDate='';const u0=c.urgency();
          const d=new Date(now+5*86400000);s.examDate=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
          return {fresh,old,edge,u0,u5:c.urgency(),days:c.daysToExam()}}''')
        assert r['fresh']>0.9 and abs(r['edge']-r['fresh'])<1e-9,r
        assert 0.45*r['fresh']<r['old']<0.55*r['fresh'],r
        assert r['u0']==0 and r['u5']==1 and r['days'] in (4,5,6),r
        # tough mode
        route(page,'practice/cards')
        page.evaluate("(()=>{const c=window.__ccarf,s=c.store();s.answers={};s.answers[c.Q[0].id]={n:3,c:1,last:false,t:Date.now()};s.answers[c.Q[1].id]={n:3,c:3,last:true,t:Date.now()};})()")
        page.evaluate("document.querySelector('[data-act=ptab][data-v=q]').click()")
        page.locator('[data-act=cfg][data-k=d][data-v="0"]').click()
        page.locator('[data-act=cfg][data-k=mode][data-v=tough]').click()
        assert '1 question matches' in page.locator('.panel .muted.small').first.inner_text() or '1 question matches' in page.locator('#study-main').inner_text()
        # exam-day sheet
        route(page,'learn/rules')
        page.evaluate("window.print=()=>{};document.querySelector('[data-act=printsheet]').click()")
        assert page.locator('#sheet h1').inner_text()=='CCAR-F exam-day sheet'
        assert page.locator('#sheet .s-cols li').count()>=15
        assert page.locator('#sheet tbody tr').count()==29
        page.emulate_media(media='print')
        assert page.locator('#app').evaluate('e=>getComputedStyle(e).display')=='none'
        assert page.locator('#sheet').evaluate('e=>getComputedStyle(e).display')=='block'
        page.emulate_media(media='screen')
        page.evaluate("document.getElementById('sheet')&&document.getElementById('sheet').remove();document.body.classList.remove('sheet-print')")
        # export and import
        route(page,'learn/syllabus')
        page.evaluate("(()=>{const c=window.__ccarf,s=c.store();s.answers={};c.Q.slice(0,5).forEach(q=>{s.answers[q.id]={n:2,c:1,last:true,t:Date.now()}});s.examDate='2031-01-15';})()")
        with page.expect_download() as dl:
            page.locator('[data-act=exportprogress]').click()
        path=dl.value.path()
        import json as _j
        payload=_j.loads(open(path,encoding='utf8').read())
        assert payload['app']=='ccarf-study' and len(payload['data']['answers'])==5 and 'studyUI' not in payload['data']
        page.evaluate("window.__ccarf.store().answers={}")
        page.locator('#progressFile').set_input_files(path)
        page.wait_for_selector('.import-preview')
        assert '5 answered questions' in page.locator('.import-preview').inner_text()
        page.locator('[data-act=importconfirm]').click()
        assert page.evaluate("Object.keys(window.__ccarf.store().answers).length")==5
        assert page.evaluate("window.__ccarf.store().examDate")=='2031-01-15'
        bad=ROOT/'tests'/'screenshots'/'bad-progress.json'
        bad.write_text('{"hello":1}',encoding='utf8')
        route(page,'learn/syllabus')
        page.locator('#progressFile').set_input_files(str(bad))
        page.wait_for_selector('[role=alert]')
        assert 'not a progress file' in page.locator('[role=alert]').inner_text()
        p2=page.context.new_page()
        # baseline
        route(p2,'home')
        p2.evaluate("window.__ccarf.store().answers={}")
        route(p2,'home')
        p2.locator('[data-act=baseline]').first.click()
        assert 'of 15' in p2.locator('#study-main').inner_text()
        p2.close()
        route(page,'learn/plan')
        assert 'checked 20' in page.locator('.study-utility').inner_text()
        page.emulate_media(media='print')
        route(page,'learn/rules')
        page.emulate_media(media='print')
        assert page.locator('.rail').evaluate('e=>getComputedStyle(e).display')=='none'
        assert page.locator('.panel').first.evaluate('e=>getComputedStyle(e).backgroundColor')=='rgba(0, 0, 0, 0)'
        assert page.evaluate('document.documentElement.scrollWidth-innerWidth')==0
        assert not errors,errors
        print(engine,width,'ok')
        b.close()
