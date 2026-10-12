"""Responsive browser checks against the built file or CCAF_TEST_URL."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
URL = os.environ.get('CCAF_TEST_URL', (ROOT / 'dist/index.html').as_uri())
OUT = ROOT / 'tests/screenshots'
OUT.mkdir(parents=True, exist_ok=True)
PROFILES = [
    ('desktop', 'chromium', 1440, 1000, False, 'dark'),
    ('iphone', 'webkit', 390, 844, True, 'light'),
    ('samsung', 'chromium', 412, 915, True, 'dark'),
    ('small-phone', 'chromium', 320, 740, True, 'light'),
    ('tablet', 'webkit', 768, 1024, True, 'dark'),
]


def no_overflow(page, label):
    overflow = page.evaluate('document.documentElement.scrollWidth - innerWidth')
    assert overflow == 0, f'{label}: document overflow {overflow}px'


def run(playwright, profile):
    name, engine, width, height, mobile, scheme = profile
    browser = getattr(playwright, engine).launch()
    context = browser.new_context(viewport={'width': width, 'height': height},
                                  is_mobile=mobile, has_touch=mobile,
                                  device_scale_factor=2 if mobile else 1,
                                  color_scheme=scheme, reduced_motion='reduce')
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(URL, wait_until='networkidle')
    page.evaluate('window.__ccarf.hints(false)')
    assert page.locator('.mode').count() == 6
    assert page.locator('.mode[data-mk="1"] .mt').inner_text() == 'Campaign Mode'
    assert page.evaluate('window.__ccarf.Q.length') == 124
    assert page.evaluate('window.__ccarf.CARDS.length') == 128
    assert page.locator('h1').count() == 1
    assert page.locator('#archtip').inner_text() == 'Hi, I am Archie. Pick a mode below, or press 6 and I will show you around first.'
    no_overflow(page, name + ' home')
    for image in page.locator('.mode img').all():
        image.scroll_into_view_if_needed()
        assert image.evaluate('(image) => image.complete && image.naturalWidth > 0')
    page.evaluate('scrollTo(0,0)')
    page.screenshot(path=str(OUT / f'release-{name}-home.png'), full_page=True)
    assert page.locator('.hero-actions [data-act="coach"]').is_visible()
    before = page.evaluate('JSON.stringify(window.__ccarf.store())')
    page.locator('.pattern-reason summary').click()
    assert page.locator('.pattern-reason').get_attribute('open') is not None
    assert page.evaluate('JSON.stringify(window.__ccarf.store())') == before
    page.locator('.pattern-reason summary').click()
    page.locator('.hero-actions [data-act="quick"]').click()
    page.wait_for_selector('.qtext')
    selected = page.locator('.opts .opt').first
    selected.click()
    check = page.locator('[data-act="check"]')
    if check.count():
        page.locator('.opts .opt').nth(1).click()
        check.click()
    page.wait_for_selector('.explain')
    assert page.evaluate('Object.keys(window.__ccarf.store().answers).length') == 1
    saved = page.evaluate('JSON.stringify(window.__ccarf.store().answers)')
    no_overflow(page, name + ' practice')
    page.screenshot(path=str(OUT / f'release-{name}-practice.png'), full_page=True)
    page.reload(wait_until='networkidle')
    assert page.evaluate('JSON.stringify(window.__ccarf.store().answers)') == saved
    page.evaluate('window.__ccarf.go("home")')
    assert page.locator('.hero-actions [data-act="quick"]').inner_text().startswith('Continue with Domain')
    assert page.locator('#archtip').inner_text().startswith('Welcome back. Your readiness is ')
    page.locator('.mode[data-mk="1"]').click()
    assert page.locator('h1').inner_text() == 'Campaign Mode'
    assert page.locator('.cmap [data-k^="ts:"]').count() == 30
    page.locator('[data-k="ts:1.1"]').click()
    assert page.locator('.selinfo h3').inner_text() == 'Task 1.1'
    no_overflow(page, name + ' campaign')
    assert page.locator('.cmap').evaluate('(svg) => svg.animationsPaused()')
    page.screenshot(path=str(OUT / f'release-{name}-campaign.png'), full_page=True)
    page.evaluate('window.__ccarf.go("learn")')
    for level in range(1, 6):
        page.locator(f'[data-act="glevel"][data-v="{level}"]').first.click()
        assert page.locator('.lesson-visual svg').count() == 1
        assert page.locator('.chap .archie .bubble').text_content().startswith(f'ArchieThis lesson covers Domain {level},')
        page.locator('.lesson-reason summary').click()
        assert page.locator('.lesson-reason').get_attribute('open') is not None
        no_overflow(page, name + f' lesson {level}')
    page.locator('input[data-gdone="5"]').check()
    assert page.evaluate('window.__ccarf.store().guide.done[5]') == 1
    page.screenshot(path=str(OUT / f'release-{name}-lesson.png'), full_page=True)
    page.locator('[data-act="gtab"][data-v="maps"]').click()
    assert page.locator('.dgsvg').count() == 6
    no_overflow(page, name + ' diagrams')
    page.keyboard.press('Control+k')
    page.locator('#pal input').fill('1.4')
    page.keyboard.press('Enter')
    page.wait_for_selector('.qtext')
    assert not errors, f'{name}: JavaScript errors {errors}'
    context.close()
    browser.close()
    return {'profile': name, 'engine': engine, 'viewport': [width, height],
            'question_count': 124, 'flashcard_count': 128, 'errors': errors, 'passed': True}


with sync_playwright() as playwright:
    results = [run(playwright, profile) for profile in PROFILES]
print(json.dumps({'url': URL, 'results': results}, indent=2))
