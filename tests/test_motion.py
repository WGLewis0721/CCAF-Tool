"""Verify visible motion, pause/reduced-motion behavior, and keyboard access."""
from pathlib import Path
import os,json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
URL=os.environ.get('CCAF_TEST_URL',(ROOT/'dist/index.html').as_uri()).split('#')[0]

def run(p,engine,width):
    browser=getattr(p,engine).launch()
    page=browser.new_page(viewport={'width':width,'height':900})
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(URL+'#learn/diagrams?model=0',wait_until='networkidle')
    page.evaluate('window.__ccarf.hints(false)')
    page.locator('[data-act="modelplay"]').click()
    page.wait_for_timeout(80)
    assert page.locator('.model-stage.model-active').count()==1
    first=page.locator('.model-active').inner_text()
    page.wait_for_timeout(300)
    assert page.locator('.model-stage.model-active').count()==1
    assert page.locator('.model-active').inner_text()!=first
    page.locator('[data-act="motiontoggle"]').click()
    assert page.locator('body').get_attribute('data-study-motion')=='paused'
    page.locator('[data-act="modelplay"]').click()
    assert page.locator('.model-active').count()==0
    page.locator('[data-act="motiontoggle"]').click()
    page.goto(URL+'#practice/cards?domain=1',wait_until='networkidle')
    assert page.locator('.flipper').get_attribute('aria-label').startswith('Question:')
    page.locator('.flipper').click()
    page.wait_for_timeout(80)
    assert page.locator('.flipper').evaluate('(element)=>element.getAnimations().some(animation=>animation.playState==="running")')
    assert page.locator('.flipper').get_attribute('aria-label').startswith('Answer:')
    assert page.locator('.face.fr').get_attribute('aria-hidden')=='true'
    assert page.locator('.face.bk').get_attribute('aria-hidden')=='false'
    page.wait_for_timeout(400)
    page.emulate_media(reduced_motion='reduce')
    page.locator('.flipper').click()
    assert page.locator('.flipper').evaluate('(element)=>element.getAnimations().length')==0
    page.goto(URL+'#home',wait_until='networkidle')
    page.locator('.skip-link').focus();page.keyboard.press('Enter')
    assert page.locator('h1').inner_text().startswith('Build')
    assert page.locator('.hero2').is_visible()
    assert page.evaluate('document.activeElement.id')=='study-main'
    page.goto(URL+'#campaign',wait_until='networkidle')
    marker=page.locator('[data-k="ts:1.1"]');marker.focus();page.keyboard.press('Enter')
    assert page.locator('.selinfo h3').inner_text()=='Task 1.1'
    assert page.locator('.cmap').evaluate('(svg)=>svg.animationsPaused()')
    assert not errors,errors
    browser.close()
    return {'engine':engine,'width':width,'motion':'passed','keyboard':'passed','errors':errors}

with sync_playwright() as p:
    results=[run(p,'chromium',1180),run(p,'webkit',390)]
print(json.dumps({'url':URL,'results':results},indent=2))
