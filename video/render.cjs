// Renderiza a cena quadro a quadro (1080x1920) e manda para o ffmpeg.
//   node render.cjs --preview 1.0,5.2,20     -> prev/t1.0.jpg ...
//   node render.cjs --workers 3 --fps 60     -> sem_audio.mp4
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const VID = __dirname;
const PROJ = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  let p;
  if (u.startsWith('/proj/')) p = path.join(PROJ, u.slice(6));
  else if (u.startsWith('/video/')) p = path.join(VID, u.slice(7));
  else p = path.join(VID, u.slice(1));
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'max-age=3600' });
    res.end(data);
  });
});

(async () => {
  await new Promise((r) => server.listen(0, r));
  const URL = `http://127.0.0.1:${server.address().port}/cena.html`;
  const R = JSON.parse(fs.readFileSync(path.join(VID, 'roteiro.json'), 'utf8'));
  const fps = Number(opt('fps', 60));

  async function openPage() {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
    page.on('pageerror', (e) => console.log('[erro]', e.message));
    await page.goto(URL);
    await page.waitForFunction('window.ready === true || window.buildError', null, { timeout: 120000 });
    const err = await page.evaluate('window.buildError');
    if (err) throw new Error(err);
    return { browser, page };
  }
  const shot = async (page, t) => { await page.evaluate((t) => window.renderFrame(t), t); return page.screenshot({ type: 'jpeg', quality: 94 }); };

  const preview = opt('preview');
  if (preview) {
    fs.mkdirSync(path.join(VID, 'prev'), { recursive: true });
    const { browser, page } = await openPage();
    for (const t of preview.split(',').map(Number)) fs.writeFileSync(path.join(VID, 'prev', `t${t}.jpg`), await shot(page, t));
    await browser.close();
  } else {
    const total = Math.round(R.dur * fps);
    const workers = Number(opt('workers', 3));
    const per = Math.ceil(total / workers);
    const dir = path.join(VID, 'chunks');
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const t0 = Date.now();
    let done = 0;
    await Promise.all(Array.from({ length: workers }, async (_, w) => {
      const a = w * per, b = Math.min(total, a + per);
      const { browser, page } = await openPage();
      const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', '-g', String(fps), path.join(dir, `p${w}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
      for (let f = a; f < b; f++) {
        const jpg = await shot(page, f / fps);
        if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
        done++;
        if (done % 120 === 0) { const el = (Date.now() - t0) / 1000; console.log(`${done}/${total} quadros, ${el.toFixed(0)} s, faltam ~${((el / done) * (total - done)).toFixed(0)} s`); }
      }
      ff.stdin.end();
      await new Promise((r) => ff.on('close', r));
      await browser.close();
    }));
    fs.writeFileSync(path.join(dir, 'lista.txt'), Array.from({ length: workers }, (_, w) => `file '${path.join(dir, `p${w}.mp4`)}'`).join('\n'));
    await new Promise((r) => spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'lista.txt'), '-c', 'copy', path.join(VID, 'sem_audio.mp4')], { stdio: 'inherit' }).on('close', r));
    console.log('ok', ((Date.now() - t0) / 1000).toFixed(0), 's');
  }
  server.close();
})().catch((e) => { console.error(e); process.exit(1); });
