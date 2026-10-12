"""End-to-end check of the built study tool (optional).

Setup:  pip install playwright && python -m playwright install chromium
Run:    python scripts/build.py && python tests/test_ui.py
Screenshots land in tests/screenshots/.
"""
import asyncio
import pathlib
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
F = (ROOT / 'dist' / 'index.html').as_uri()
SP_DIR = ROOT / 'tests' / 'screenshots'
SP_DIR.mkdir(parents=True, exist_ok=True)
SP = str(SP_DIR) + '/'
FONTCSS = ''

async def nav_go(pg,w,v):
    if w>860:
        await pg.click(f'.rnav [data-go={v}]')
    else:
        if not await pg.evaluate("document.querySelector('.mnav').classList.contains('open')"):
            await pg.click('.mnav-tog'); await pg.wait_for_timeout(500)
        await pg.click(f'.mnav [data-go={v}]')

async def run(b,w,h,scheme,tag,errs):
    ctx=await b.new_context(viewport={'width':w,'height':h},color_scheme=scheme)
    pg=await ctx.new_page()
    pg.on('pageerror',lambda e:errs.append(tag+' pageerror '+str(e)))
    pg.on('console',lambda m:errs.append(tag+' console '+m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None)
    await pg.goto(F); await pg.evaluate('window.__ccarf.hints(false)'); await pg.wait_for_timeout(1800)
    await pg.screenshot(path=SP+tag+'-home0.png',full_page=True)
    # practice
    await pg.keyboard.press('2'); await pg.wait_for_selector('.qtext')
    for i in range(10):
        multi=await pg.evaluate("document.querySelector('.qtext') && /Choose 2/.test(document.querySelector('.tag.alt')?.textContent||'')")
        multi=await pg.evaluate("!!document.querySelector('[data-act=check]')")
        await pg.click('.opt >> nth=0')
        if multi:
            await pg.click('.opt >> nth=1'); await pg.click('[data-act=check]')
        await pg.wait_for_selector('.explain')
        if i==0: await pg.wait_for_timeout(500); await pg.screenshot(path=SP+tag+'-practice.png',full_page=True)
        await pg.click('[data-act=next]')
    await pg.wait_for_selector('text=Session complete')
    await pg.screenshot(path=SP+tag+'-done.png',full_page=True)
    # drills
    for kind,lab in (('tell','Spot the tell'),('shape','Name the shape'),('axis','Pick the axis')):
        await nav_go(pg,w,'practice')
        await pg.click(f'[data-act=ptab][data-v={kind}]')
        await pg.click('[data-act=drillstart]')
        for i in range(10):
            await pg.click('.opt >> nth=0')
            if i==0: await pg.screenshot(path=SP+tag+'-drill-'+kind+'.png',full_page=True)
            await pg.click('[data-act=dnext]')
        await pg.wait_for_selector('text=Round complete')
    # mock
    await nav_go(pg,w,'practice'); await pg.click('[data-act=ptab][data-v=mock]')
    await pg.click('[data-act=mockstart]')
    await pg.screenshot(path=SP+tag+'-mock.png',full_page=False)
    n=await pg.evaluate("document.querySelectorAll('.qmap button').length")
    print(tag,'mock items',n)
    for i in range(60):
        await pg.click('.opt >> nth=0')
        if i<59: await pg.click('[data-act=mnext]')
    await pg.click('[data-act=mconfirm]'); await pg.click('[data-act=mfinish]')
    await pg.wait_for_selector('text=Score report')
    await pg.screenshot(path=SP+tag+'-mockres.png',full_page=True)
    # cards
    await nav_go(pg,w,'practice'); await pg.click('[data-act=ptab][data-v=cards]')
    await pg.click('.flipper'); await pg.wait_for_timeout(700)
    await pg.screenshot(path=SP+tag+'-cards.png',full_page=True)
    await pg.click('[data-act=cardyes]')
    # library
    await nav_go(pg,w,'learn'); await pg.click('[data-act=ltab][data-v=playbook]')
    await pg.wait_for_timeout(1300); await pg.screenshot(path=SP+tag+'-lib-playbook.png',full_page=True)
    for t in ('scenarios','plan','syllabus'):
        await pg.click(f'[data-act=ltab][data-v={t}]')
        if t=='plan':
            await pg.click('[data-act=planstart]'); await pg.click('input[data-plan=p1a]')
        await pg.screenshot(path=SP+tag+'-lib-'+t+'.png',full_page=True)
    # guidebook
    await nav_go(pg,w,'learn'); await pg.click('[data-act=gtab][data-v=walk]')
    await pg.wait_for_timeout(200)
    await pg.wait_for_timeout(1300); await pg.screenshot(path=SP+tag+'-g-walk.png',full_page=True)
    await pg.click('[data-act=glevel][data-v="3"]'); await pg.click('input[data-gdone="3"]')
    for t in ('items','maps','trig'):
        await pg.click(f'[data-act=gtab][data-v={t}]'); await pg.wait_for_timeout(150)
        await pg.screenshot(path=SP+tag+'-g-'+t+'.png',full_page=True)
    cnt=await pg.evaluate("document.querySelectorAll('.trig').length")
    print(tag,'trig rows',cnt)
    chips=await pg.evaluate("[...document.querySelectorAll('[data-act=tcat]')].map(b=>b.dataset.v)")
    print(tag,'tcat',chips)
    if len(chips)>1:
        await pg.click(f'[data-act=tcat] >> nth=1'); await pg.wait_for_timeout(100)
        print(tag,'trig filtered',await pg.evaluate("document.querySelectorAll('.trig').length"))
    await pg.screenshot(path=SP+tag+'-g-trig2.png',full_page=True)
    await pg.keyboard.press('Control+k'); await pg.keyboard.type('1.4'); await pg.wait_for_timeout(150)
    await pg.screenshot(path=SP+tag+'-pal.png')
    await pg.keyboard.press('Enter'); await pg.wait_for_selector('.qtext')
    print(tag,'palette drill ok')
    await nav_go(pg,w,'learn'); await pg.click('[data-act=ltab][data-v=plan]')
    print(tag,'reslinks',await pg.evaluate("document.querySelectorAll('.reslink').length"),'fix block',await pg.evaluate("/Fix list/.test(document.body.textContent)"))
    await nav_go(pg,w,'home'); await pg.wait_for_timeout(1500)
    await pg.screenshot(path=SP+tag+'-home1.png',full_page=True)
    await nav_go(pg,w,'map'); await pg.wait_for_timeout(1200)
    await pg.screenshot(path=SP+tag+'-map.png',full_page=True)
    # campaign selections
    for k in ('ts:1.1','boss:3','creep:1'):
        await pg.click(f'[data-k="{k}"]'); await pg.wait_for_timeout(250)
        print(tag,k,'cmds',await pg.evaluate("[...document.querySelectorAll('.cmd:not(.empty)')].map(b=>b.dataset.hk+':'+b.textContent.trim()).join(' | ')"))
        await pg.screenshot(path=SP+tag+'-sel-'+k.replace(':','-')+'.png',full_page=False)
    await pg.keyboard.press('Escape'); await pg.wait_for_timeout(150)
    # coach tour
    await pg.click('#fairy .fbody' if w>860 else '.mnav-archie'); await pg.wait_for_selector('#coach .cbox')
    n=0
    while True:
        await pg.wait_for_timeout(450)
        await pg.screenshot(path=SP+tag+'-coach-%02d.png'%n)
        n+=1
        fin=await pg.evaluate("document.querySelector('#coach [data-act=cnext]').textContent")
        await pg.click('#coach [data-act=cnext]')
        if fin=='Finish' or n>30: break
    print(tag,'coach steps',n,'closed',await pg.evaluate("document.querySelector('#coach').hidden"))
    # Archie hints and the mobile menu
    await pg.evaluate('window.__ccarf.hints(true)')
    await nav_go(pg,w,'map'); await pg.wait_for_timeout(300)
    await pg.click('[data-k="ts:2.1"]'); await pg.wait_for_timeout(200)
    await pg.evaluate('window.__ccarf.hint()'); await pg.wait_for_timeout(1300)
    await pg.screenshot(path=SP+tag+'-hint.png',full_page=False)
    print(tag,'hint text',await pg.evaluate("(document.querySelector('#fairy .fbub:not([hidden]) p')||document.querySelector('#mbub:not([hidden]) p')||{}).textContent"))
    await pg.click('[data-h=close]'); await pg.wait_for_timeout(900)
    if w<=860:
        await nav_go(pg,w,'learn'); await pg.wait_for_timeout(600)
        print(tag,'menu open after page change',await pg.evaluate("document.querySelector('.mnav').classList.contains('open')"))
        await pg.wait_for_timeout(3600)
        print(tag,'menu collapsed later',not await pg.evaluate("document.querySelector('.mnav').classList.contains('open')"))
        await pg.screenshot(path=SP+tag+'-pill-closed.png',full_page=False)
    else:
        print(tag,'docked',await pg.evaluate("document.querySelector('#fairy').className"))
    sw=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth")
    st=await pg.evaluate("JSON.stringify({seen:Object.keys(window.__ccarf.store().answers).length,mocks:window.__ccarf.store().mocks.length,drill:window.__ccarf.store().drill})")
    print(tag,'hscroll',sw,st)
    await ctx.close()

async def main():
    errs=[]
    async with async_playwright() as p:
        b=await p.chromium.launch()
        await run(b,1180,900,'light','d',errs)
        await run(b,400,820,'dark','m',errs)
        await b.close()
    print('errors', errs)
    if errs:
        raise SystemExit(1)

asyncio.run(main())
