// Click-through test Lukman Store (R-35). Jalankan: node test-clickthrough.cjs
// Server lokal harus jalan di http://127.0.0.1:8322 (python3 -m http.server 8322).
const { chromium } = require('/home/hatch/workspace/custom-skills/ui-ux-pro-max/node_modules/playwright');
const BASE = 'http://127.0.0.1:8322/';
const results = [];
function check(name, ok, detail = '') { results.push({ name, ok, detail }); console.log((ok ? 'PASS' : 'FAIL') + ' | ' + name + (detail ? ' | ' + detail : '')); }

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(BASE, { waitUntil: 'networkidle' });

  // 1. Drawer tersembunyi saat load
  check('drawer hidden saat load', await page.locator('#cartDrawer').isHidden());
  check('overlay hidden saat load', await page.locator('#cartOverlay').isHidden());

  // 2. 10 kartu produk tampil
  check('10 kartu produk', (await page.locator('.product-card').count()) === 10, 'count=' + await page.locator('.product-card').count());

  // 2b. Showcase hero: 3 kartu akun unggulan DATAR + tambah lalu hapus
  check('showcase 3 kartu', (await page.locator('.show-card').count()) === 3, 'count=' + await page.locator('.show-card').count());
  check('showcase tanpa dekor', (await page.locator('.show-decor').count()) === 0);
  const scTransform = await page.evaluate(() => { const el = document.querySelector('.show-card'); return el ? getComputedStyle(el).transform : ''; });
  check('showcase kartu datar (tanpa transform)', scTransform === 'none', scTransform);
  await page.locator('.showcase-cards [data-add]').first().click();
  check('showcase tambah: cart count 1', (await page.locator('#cartCount').innerText()) === '1');
  await page.locator('#cartBtn').click();
  await page.locator('[data-remove="ml-glory"]').click();
  check('showcase hapus: cart count 0', (await page.locator('#cartCount').innerText()) === '0');
  check('drawer kosong tampil', await page.locator('.cart-empty').isVisible());
  await page.locator('#cartClose').click();

  // 3. Tambah 2 akun, hitung total, buka drawer
  await page.locator('[data-add="coc-th13"]').click();
  await page.locator('[data-add="ml-mythic"]').click();
  check('cart count 2', (await page.locator('#cartCount').innerText()) === '2');
  await page.locator('#cartBtn').click();
  check('drawer terbuka', await page.locator('#cartDrawer').isVisible());
  check('total Rp1.300.000', (await page.locator('#cartTotal').innerText()) === 'Rp1.300.000', await page.locator('#cartTotal').innerText());

  // 4. Tutup via X
  await page.locator('#cartClose').click();
  check('tutup via X', await page.locator('#cartDrawer').isHidden());
  // 5. Tutup via overlay
  await page.locator('#cartBtn').click();
  await page.locator('#cartOverlay').click({ position: { x: 100, y: 400 } });
  check('tutup via overlay', await page.locator('#cartDrawer').isHidden());
  // 6. Tutup via Escape
  await page.locator('#cartBtn').click();
  await page.keyboard.press('Escape');
  check('tutup via Escape', await page.locator('#cartDrawer').isHidden());

  // 7. Tombol tambah jadi state "Di Keranjang" (disabled), Hapus di drawer
  const addBtn = page.locator('[data-add="coc-th13"]');
  check('tombol tambah jadi Di Keranjang', (await addBtn.innerText()).includes('Di Keranjang'));
  check('tombol Di Keranjang disabled', await addBtn.isDisabled());
  await page.locator('#cartBtn').click();
  await page.locator('[data-remove="coc-th13"]').click();
  check('hapus item: sisa 1 item', (await page.locator('.cart-item').count()) === 1);
  check('total jadi Rp850.000', (await page.locator('#cartTotal').innerText()) === 'Rp850.000', await page.locator('#cartTotal').innerText());
  check('cart count 1', (await page.locator('#cartCount').innerText()) === '1');

  // 8. Checkout memanggil wa.me dengan nomor toko (stub window.open, tanpa jaringan)
  await page.evaluate(() => { window.__opened = null; window.open = (u) => { window.__opened = u; return null; }; });
  await page.locator('#checkoutBtn').click();
  const opened = await page.evaluate(() => window.__opened);
  check('checkout ke wa.me nomor toko', typeof opened === 'string' && opened.startsWith('https://wa.me/6285156084217?text='), String(opened).slice(0, 60));
  await page.locator('#cartClose').click();

  // 9. Salin pesanan
  await page.locator('#cartBtn').click();
  await page.locator('#copyBtn').click();
  await page.waitForTimeout(300);
  check('salin pesanan: catatan berubah', (await page.locator('#cartNote').innerText()).includes('disalin'), await page.locator('#cartNote').innerText());
  await page.locator('#cartClose').click();

  // 10. Filter ML = 4 kartu, search mythic = 2
  await page.locator('[data-filter="ml"]').click();
  check('filter ML = 4 kartu', (await page.locator('.product-card').count()) === 4);
  await page.locator('[data-filter="semua"]').click();
  await page.locator('#searchInput').fill('mythic');
  check('search mythic = 2 kartu', (await page.locator('.product-card').count()) === 2, await page.locator('#resultsNote').innerText());
  await page.locator('#searchInput').fill('zzz');
  check('search kosong: pesan tampil', (await page.locator('#resultsNote').innerText()).includes('Tidak ada akun'));
  await page.locator('#searchInput').fill('');

  // 11. Link jasa + QR download + nav anchor
  const svc = await page.locator('.service-link').evaluateAll(els => els.map(e => e.href));
  check('7 link jasa ke wa.me toko', svc.length === 7 && svc.every(h => h.startsWith('https://wa.me/6285156084217')), svc.length + ' link');
  check('unduh QR href qris-qr.jpg', (await page.locator('a[download]').getAttribute('href')) === 'qris-qr.jpg');
  check('nav 5 anchor ada', (await page.locator('.main-nav a').count()) === 5);

  // 12. Focus ring nyata via Tab
  await page.keyboard.press('Tab');
  const focus = await page.evaluate(() => {
    const el = document.activeElement; const cs = getComputedStyle(el);
    return { tag: el.tagName, cls: el.className, outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor };
  });
  check('focus-visible Tab: outline 3px solid', focus.outline.includes('solid') && focus.outline.includes('3px'), JSON.stringify(focus));

  // 13. QR tinggal SATU (bagian bayar), tampil + dimensi
  check('QR hanya 1 di halaman', (await page.locator('.qr-card img').count()) === 1);
  const qr = page.locator('.qr-card img').first();
  check('gambar QR tampil', await qr.isVisible());
  check('QR punya width/height', (await qr.getAttribute('width')) === '400' && (await qr.getAttribute('height')) === '400');
  check('QR bayar loading lazy', (await qr.getAttribute('loading')) === 'lazy');

  // 14. Tidak ada console error
  check('0 console/page error', errors.length === 0, errors.join(' ; '));

  await page.screenshot({ path: '/tmp/store-desktop.png', fullPage: true });

  // 15. Mobile 390: menu, drawer, overflow
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const m = await mctx.newPage();
  m.on('console', mm => { if (mm.type() === 'error') errors.push('mobile: ' + mm.text()); });
  await m.goto(BASE, { waitUntil: 'networkidle' });
  check('mobile: tombol Menu tampil', await m.locator('#menuBtn').isVisible());
  await m.locator('#menuBtn').click();
  check('mobile: menu terbuka', await m.locator('#mainNav').isVisible());
  await m.locator('.main-nav a[href="#jasa"]').click();
  check('mobile: klik link menutup menu', await m.locator('#mainNav').isHidden());
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('mobile 390: tanpa overflow horizontal', overflow <= 1, 'overflow=' + overflow + 'px');
  await m.locator('[data-add="ml-epic"]').click();
  await m.locator('#cartBtn').click();
  check('mobile: drawer buka', await m.locator('#cartDrawer').isVisible());
  await m.locator('#cartClose').click();
  check('mobile: drawer tutup via X', await m.locator('#cartDrawer').isHidden());
  await m.screenshot({ path: '/tmp/store-mobile.png', fullPage: true });

  // 16. 360px overflow
  const sctx = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const s = await sctx.newPage();
  await s.goto(BASE, { waitUntil: 'networkidle' });
  const ov360 = await s.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('360px: tanpa overflow horizontal', ov360 <= 1, 'overflow=' + ov360 + 'px');

  await browser.close();
  const fails = results.filter(r => !r.ok);
  console.log('\nRINGKASAN: ' + (results.length - fails.length) + '/' + results.length + ' lolos, ' + fails.length + ' gagal.');
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error('ERROR:', e.message); process.exit(2); });
