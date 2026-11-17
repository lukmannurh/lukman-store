// Sweep responsif Lukman Store: semua lebar umum + landscape.
// Jalankan: node test-responsive.cjs (server lokal 127.0.0.1:8322 harus jalan)
const { chromium } = require('/home/hatch/workspace/custom-skills/ui-ux-pro-max/node_modules/playwright');
const BASE = 'http://127.0.0.1:8322/';
const WIDTHS = [
  { w: 320, h: 568, name: '320-iphone-se' },
  { w: 360, h: 800, name: '360-android' },
  { w: 375, h: 667, name: '375-iphone' },
  { w: 390, h: 844, name: '390-iphone14' },
  { w: 414, h: 896, name: '414-iphone-plus' },
  { w: 430, h: 932, name: '430-iphone-promax' },
  { w: 768, h: 1024, name: '768-ipad-potret' },
  { w: 820, h: 1180, name: '820-ipad-air' },
  { w: 1024, h: 768, name: '1024-ipad-lanskap' },
  { w: 1280, h: 800, name: '1280-laptop' },
  { w: 1440, h: 900, name: '1440-desktop' },
  { w: 1920, h: 1080, name: '1920-fullhd' },
  { w: 844, h: 390, name: '844x390-lanskap-hp' },
];
const results = [];
function check(name, ok, detail = '') { results.push({ name, ok }); console.log((ok ? 'PASS' : 'FAIL') + ' | ' + name + (detail ? ' | ' + detail : '')); }

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const v of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const tag = v.name + ' (' + v.w + 'x' + v.h + ')';

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(tag + ': tanpa overflow horizontal', overflow <= 1, 'overflow=' + overflow + 'px');

    const header = await page.evaluate(() => {
      const h = document.querySelector('.header-inner');
      return { scroll: h.scrollWidth, client: h.clientWidth };
    });
    check(tag + ': header muat', header.scroll <= header.client + 1, 'scroll=' + header.scroll + ' client=' + header.client);

    const menuVisible = await page.locator('#menuBtn').isVisible();
    const navVisible = await page.locator('#mainNav').isVisible();
    check(tag + ': nav atau menu tampil', menuVisible || navVisible, 'menu=' + menuVisible + ' nav=' + navVisible);

    // Tap target: semua tombol/chip interaktif utama >= 44px tinggi
    const small = await page.evaluate(() => {
      const bad = [];
      document.querySelectorAll('button, .chip, .main-nav a, .service-link').forEach(el => {
        const r = el.getBoundingClientRect();
        const visible = r.width > 0 && r.height > 0 && getComputedStyle(el).display !== 'none';
        if (visible && r.height < 44) bad.push(el.tagName + '.' + (el.className.baseVal !== undefined ? '' : el.className) + ' h=' + Math.round(r.height));
      });
      return bad;
    });
    check(tag + ': target sentuh >= 44px', small.length === 0, small.slice(0, 4).join(', '));

    // Drawer buka/tutup di lebar ini
    await page.locator('[data-add="ml-epic"]').click();
    await page.locator('#cartBtn').click();
    const open = await page.locator('#cartDrawer').isVisible();
    await page.locator('#cartClose').click();
    const closed = await page.locator('#cartDrawer').isHidden();
    check(tag + ': drawer buka/tutup', open && closed);

    check(tag + ': tanpa pageerror', errors.length === 0, errors.join('; '));
    await page.screenshot({ path: '/tmp/store-' + v.name + '.png' });
    await ctx.close();
  }
  await browser.close();
  const fails = results.filter(r => !r.ok);
  console.log('\nRINGKASAN: ' + (results.length - fails.length) + '/' + results.length + ' lolos, ' + fails.length + ' gagal.');
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error('ERROR:', e.message); process.exit(2); });
