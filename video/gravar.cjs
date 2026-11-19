// Grava um trecho do site em "câmera lenta": o tempo da página corre K vezes mais devagar
// (relógio do JS, requestAnimationFrame, timers e animações CSS/WAAPI), e cada quadro do
// screencast guarda o horário real. Na montagem, tempo virtual = (real - início) / K.
//   node gravar.cjs <tour|busca|sinuca> <pasta>
const { chromium } = require('playwright');
const fs = require('fs');
const K = Number(process.env.K || 6);
const DPR = Number(process.env.DPR || 1.8);
const [SEG, OUT] = process.argv.slice(2);
const BASE = process.env.BASE || 'http://localhost:5173/';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  await ctx.addInitScript((K) => {
    const rn = performance.now.bind(performance);
    const base = rn();
    performance.now = () => base + (rn() - base) / K;
    const dn = Date.now; const d0 = dn();
    Date.now = () => d0 + (dn() - d0) / K;
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => raf((ts) => cb(base + (ts - base) / K));
    const st = window.setTimeout.bind(window), si = window.setInterval.bind(window);
    window.setTimeout = (fn, ms = 0, ...a) => st(fn, (ms || 0) * K, ...a);
    window.setInterval = (fn, ms = 0, ...a) => si(fn, (ms || 0) * K, ...a);
    try { localStorage.setItem('mamadi:tema', 'dark'); } catch {}
  }, K);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('[erro]', e.message));
  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async (f) => {
    const name = `f${String(frames.length).padStart(5, '0')}.jpg`;
    fs.writeFileSync(`${OUT}/${name}`, Buffer.from(f.data, 'base64'));
    frames.push({ t: f.metadata.timestamp, name });
    cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  const rate = async () => { await cdp.send('Animation.enable').catch(() => {}); await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / K }).catch(() => {}); };
  const vwait = (s) => page.waitForTimeout(s * 1000 * K);
  const marks = [];
  let t0 = 0;
  const mark = (label) => marks.push({ label, v: (Date.now() / 1000 - t0) / K });
  const glide = (sel, off = 104, ms = 1200) => page.evaluate(([sel, off, ms]) => new Promise((res) => {
    const el = typeof sel === 'number' ? null : document.querySelector(sel);
    const y1 = el ? el.getBoundingClientRect().top + scrollY - off : sel;
    const y0 = scrollY; const a = performance.now();
    const f = () => { const k = Math.min(1, (performance.now() - a) / ms); const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; window.scrollTo(0, y0 + (y1 - y0) * e); if (k < 1) requestAnimationFrame(f); else res(); };
    requestAnimationFrame(f);
  }), [sel, off, ms]);
  const drag = async (x, y, dy, secs, steps = 30) => {
    await page.mouse.move(x, y); await page.mouse.down();
    for (let i = 1; i <= steps; i++) { const k = i / steps; const e = 1 - Math.pow(1 - k, 2); await page.mouse.move(x, y + dy * e); await page.waitForTimeout((secs * 1000 * K) / steps); }
    await page.mouse.up();
  };

  const start = async (url) => {
    await page.goto(url, { waitUntil: 'commit' });
    await rate();
    await page.waitForLoadState('domcontentloaded');
    await rate();
    await page.waitForLoadState('networkidle').catch(() => {});
    await rate();
  };

  if (SEG === 'tour') {
    await start(BASE);
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: Math.round(390 * DPR), maxHeight: Math.round(844 * DPR), everyNthFrame: 1 });
    t0 = Date.now() / 1000; mark('heroi');
    await vwait(3.4);
    mark('puxa');
    const tag = await page.locator('.pull-tag').boundingBox();
    await drag(tag.x + tag.width / 2, tag.y + tag.height / 2, 190, 1.3);
    await vwait(2.0);
    mark('promos');
    await vwait(2.2);
    mark('desafio');
    await glide('.desafio', 260, 1200);
    await vwait(1.5);
    mark('breja');
    await glide('#sec-cervejas', 104, 1400);
    await vwait(2.1);
    mark('skate');
    await glide('#sec-copao', 104, 1000);
    await vwait(1.7);
    mark('rainha');
    await glide('#sec-drinks', 104, 1000);
    await vwait(1.3);
    mark('fala');
    await page.tap('#sec-drinks .dono__fig');
    await vwait(2.4);
    mark('ficha');
    await page.tap('#sec-drinks .fala__pick');
    await vwait(2.8);
    mark('fim');
  } else if (SEG === 'busca') {
    await start(BASE + '#/cardapio');
    await page.evaluate(() => window.scrollTo(0, 0));
    await vwait(0.6);
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: Math.round(390 * DPR), maxHeight: Math.round(844 * DPR), everyNthFrame: 1 });
    t0 = Date.now() / 1000; mark('inicio');
    await vwait(0.5);
    mark('abre');
    await page.tap('.nav__search');
    await vwait(0.9);
    mark('digita');
    await page.locator('.search__input').focus();
    for (const ch of 'drink do Lula') { await page.keyboard.type(ch); await page.waitForTimeout(80 * K); }
    await vwait(2.6);
    mark('fim');
  } else if (SEG === 'sinuca') {
    await start(BASE + '#/cardapio');
    await page.evaluate(() => { const el = document.querySelector('.desafio'); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 260); });
    await vwait(0.8);
    await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: Math.round(390 * DPR), maxHeight: Math.round(844 * DPR), everyNthFrame: 1 });
    t0 = Date.now() / 1000; mark('cartaz');
    await vwait(0.8);
    mark('abre');
    await page.tap('.desafio__card');
    await vwait(1.3);
    mark('escolhe');
    await page.locator('.sn__field--0 input').fill('Gui');
    await page.locator('.sn__field--1 input').fill('Bia');
    for (let i = 0; i < 2; i++) { await page.tap('.sn-pick--0 .sn-pick__arrow >> nth=1'); await vwait(0.45); }
    for (let i = 0; i < 1; i++) { await page.tap('.sn-pick--1 .sn-pick__arrow >> nth=1'); await vwait(0.45); }
    await vwait(0.6);
    mark('vs');
    await page.getByRole('button', { name: /Começar/ }).tap();
    await vwait(2.4);
    mark('tacada');
    const box = await page.locator('.sn__gl').boundingBox();
    await drag(box.x + box.width / 2, box.y + box.height * 0.6, 150, 0.9, 24);
    await vwait(2.6);
    mark('roleta');
    await page.evaluate(() => window.__sinucaDemo && window.__sinucaDemo(0));
    await vwait(4.6);
    mark('fim');
  }
  await cdp.send('Page.stopScreencast').catch(() => {});
  await page.waitForTimeout(300);
  const list = frames.map((f) => ({ v: +((f.t - t0) / K).toFixed(4), name: f.name })).filter((f) => f.v >= -0.5);
  fs.writeFileSync(`${OUT}/frames.json`, JSON.stringify({ K, marks, frames: list }, null, 1));
  const dur = marks[marks.length - 1].v;
  console.log(SEG, 'quadros', list.length, 'duração virtual', dur.toFixed(2), 's', '≈', (list.length / dur).toFixed(1), 'qps');
  console.log(marks.map((m) => `${m.label}@${m.v.toFixed(2)}`).join(' '));
  await browser.close();
})();
