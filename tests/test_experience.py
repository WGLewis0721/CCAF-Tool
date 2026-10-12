"""Study itinerary, references, routing, map representations, and motion checks."""
import os, json, re
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
URL=os.environ.get('CCAF_TEST_URL',(ROOT/'dist/index.html').as_uri())
OUT=ROOT/'tests/screenshots'
OUT.mkdir(parents=True,exist_ok=True)

def route(page,path):
    base=URL.split('#')[0]
    page.goto(base+'#'+path,wait_until='networkidle')
    page.wait_for_function('!!window.__ccarf')
    page.evaluate('window.__ccarf.hints(false)')

def check_width(page,label):
    assert page.evaluate('document.documentElement.scrollWidth-innerWidth')==0,label

def run(p,engine,width):
    browser=getattr(p,engine).launch()
    context=browser.new_context(viewport={'width':width,'height':900},reduced_motion='reduce')
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    route(page,'learn/plan?week=1')
    assert page.locator('.subtabs button').first.inner_text()=='Study plan'
    assert page.locator('.study-step').count()==10
    assert page.locator('.study-targeted').get_attribute('open') is None
    page.locator('#plan-p1a').check()
    assert page.evaluate('window.__ccarf.store().plan.p1a')==1
    page.locator('#step-p1b a.study-link').click()
    assert page.locator('.study-question-context').inner_text()=='Domain 1 · practice · 10 questions'
    assert page.locator('.study-return a').get_attribute('href').endswith('week=1&step=p1b')
    text=page.locator('.qtext').inner_text()
    page.locator('.opts .opt').first.click()
    if page.locator('[data-act="check"]').count():
        index=1
        while not page.locator('[data-act="check"]').is_enabled():
            page.locator('.opts .opt').nth(index).click();index+=1
        page.locator('[data-act="check"]').click()
    assert page.locator('.explain').is_visible()
    assert '#page=' in page.locator('.explain .study-sources a').first.get_attribute('href')
    page.reload(wait_until='networkidle')
    assert page.locator('.qtext').inner_text()==text
    assert page.locator('.explain').is_visible()
    page.locator('.study-return a').click()
    assert page.locator('#plan-p1a').is_checked()
    assert not page.locator('#plan-p1b').is_checked()
    page.locator('.study-weeks a').nth(1).click()
    page.locator('#step-p2a a.study-link').first.click()
    assert page.locator('#study-session-dialog').is_visible()
    page.locator('[data-act="studyswitch"]').click()
    assert page.locator('.study-question-context').inner_text().startswith('Domain 2')
    page.go_back(wait_until='networkidle')
    assert page.locator('.study-plan').is_visible()
    assert page.locator('.study-weeks a[aria-current]').inner_text().startswith('02')
    page.go_forward(wait_until='networkidle')
    assert page.locator('.study-question-context').inner_text().startswith('Domain 2')
    for week in range(1,5):
        route(page,f'learn/plan?week={week}')
        assert page.locator('.study-plan .study-step').count()==4
        for row in page.locator('.study-plan .study-step').all():
            assert row.locator('a').count()>0
    route(page,'learn/exercise?id=3')
    assert 'extraction' in page.locator('.exercise-title h2').inner_text().lower()
    assert page.locator('.exercise-steps li').count()==5
    assert page.locator('.exercise-brief .study-sources a').first.get_attribute('href').endswith('#page=25')
    route(page,'learn/scenarios?scenario=3')
    assert page.locator('[data-scenario="3"]').get_attribute('open') is not None
    assert 'Multi-agent research' in page.locator('[data-scenario="3"] summary').inner_text()
    route(page,'learn/lesson?domain=3&task=3.2')
    assert page.locator('.chapnum').inner_text()=='Level 3'
    assert page.locator('.lesson-walkthrough').is_visible()
    assert page.locator('.model-flow,.lesson-visual').count()==0
    page.locator('[data-act="lessonbeat"][data-v="2"]').click()
    assert 'Personal' in page.locator('.walkthrough-result').inner_text()
    page.screenshot(path=str(OUT/f'journey-{engine}-{width}-lesson.png'),full_page=True)
    for model in range(8):
        route(page,f'learn/diagrams?model={model}')
        assert page.locator('.model-flow').count()==1
        assert page.locator('.lesson-walkthrough').count()==0
        assert page.locator('.diagram-reference .study-sources a').count()>0
        check_width(page,f'{engine} {width} model {model}')
    page.screenshot(path=str(OUT/f'journey-{engine}-{width}-diagram.png'),full_page=True)
    route(page,'learn/triggers')
    assert page.locator('.trigger-table th').all_inner_texts()==['Trigger words','Answer pattern','What to think']
    total=page.locator('tbody .trig').count()
    assert total>20
    assert page.locator('tbody .trig').first.locator('td').count()==3
    page.locator('[data-act="tcat"][data-v="Solid"]').click()
    assert 0<page.locator('tbody .trig').count()<total
    page.screenshot(path=str(OUT/f'journey-{engine}-{width}-triggers.png'),full_page=True)
    check_width(page,f'{engine} {width} triggers')
    route(page,'campaign?task=1.2')
    assert page.locator('.cmap [data-k^="ts:"]').count()==30
    assert page.locator('.selinfo h3').inner_text()=='Task 1.2'
    page.locator('[data-act="mapview"][data-v="written"]').click()
    assert page.locator('.written-task [data-k^="ts:"]').count()==30
    assert page.locator('.written-task [data-k="ts:1.2"]').get_attribute('aria-pressed')=='true'
    page.locator('.written-domain').nth(1).locator('summary').click()
    page.locator('.written-task [data-k="ts:2.1"]').click()
    page.locator('[data-act="mapview"][data-v="map"]').click()
    assert page.locator('.selinfo h3').inner_text()=='Task 2.1'
    assert page.locator('.cmap [data-k="ts:2.1"] .selc').count()==1
    page.locator('[data-act="motiontoggle"]').click()
    assert page.locator('body').get_attribute('data-study-motion')=='paused'
    assert page.locator('.cmap').evaluate('(svg)=>svg.animationsPaused()')
    route(page,'practice/cards?domain=0')
    assert page.locator('[data-act="deck"][data-v="0"]').get_attribute('aria-pressed')=='true'
    route(page,'practice/drill?kind=shape')
    assert page.locator('.quote').is_visible()
    route(page,'practice/mock')
    assert page.locator('[data-act="mockstart"]').is_visible()
    assert page.locator('.timer').count()==0
    route(page,'learn/plan?week=1')
    page.screenshot(path=str(OUT/f'journey-{engine}-{width}-plan.png'),full_page=True)
    check_width(page,f'{engine} {width} plan')
    assert not errors,errors
    context.close();browser.close()
    return {'engine':engine,'width':width,'trigger_rows':total,'passed':True,'errors':errors}

with sync_playwright() as p:
    results=[run(p,'chromium',1180),run(p,'webkit',390),run(p,'chromium',320)]
print(json.dumps({'url':URL,'results':results},indent=2))
