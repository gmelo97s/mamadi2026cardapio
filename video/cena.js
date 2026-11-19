// Cena do vídeo de apresentação: tudo é calculado a partir do tempo t (quadro a quadro).
// window.renderFrame(t) desenha o instante t (s) e resolve quando as imagens da tela carregaram.
(async () => {
  const R = await fetch('roteiro.json').then((r) => r.json());
  const $ = (id) => document.getElementById(id);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const eOut = (k) => 1 - Math.pow(1 - clamp(k), 3);
  const eIn = (k) => Math.pow(clamp(k), 3);
  const eBack = (k) => { k = clamp(k); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
  const ph = (t, a, b) => clamp((t - a) / (b - a));

  // garrafinhas do muro
  const CORES = ['#43d1dc', '#1ec8a6', '#e7b4c6', '#2b64c9', '#e2cd3b', '#b8708f', '#f3dde2'];
  let seed = 17;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const bottles = Array.from({ length: 16 }, (_, i) => {
    const side = i % 2 === 0;
    const x = side ? rnd() * 15 : 85 + rnd() * 15;
    return { x: rnd() < 0.2 ? 20 + rnd() * 60 : x, y: (i / 16) * 100 + rnd() * 6, s: 46 + rnd() * 60, r: -50 + rnd() * 100, c: CORES[Math.floor(rnd() * CORES.length)], f: 0.3 + rnd() * 0.5, p: rnd() * 6.28, o: 0.32 + rnd() * 0.25 };
  });
  const bwrap = $('bottles');
  const bEls = bottles.map((b) => {
    const el = document.createElement('i');
    el.className = 'gf';
    el.style.width = `${b.s}px`;
    el.style.background = `linear-gradient(90deg, color-mix(in srgb, ${b.c}, #fff 12%), ${b.c} 45%, color-mix(in srgb, ${b.c} 78%, #000))`;
    el.style.opacity = b.o;
    bwrap.appendChild(el);
    return el;
  });

  // legendas
  const caps = R.legendas.map((c) => {
    const el = document.createElement('div');
    el.className = 'cap';
    el.style.setProperty('--cor', c.cor);
    el.style.setProperty('--cor2', c.cor2 || '#7a2604');
    el.innerHTML = `<span class="cap__k">${c.k}</span><span class="cap__t">${c.t}</span>`;
    el.style.opacity = 0;
    $('caps').appendChild(el);
    return { ...c, el };
  });
  // adesivos
  const ads = R.adesivos.map((a) => {
    const m = R.crew[a.id];
    const el = document.createElement('div');
    el.className = 'ad';
    el.style.height = `${a.h}px`;
    el.style.left = a.x != null ? `${a.x}px` : '';
    el.style.right = a.right != null ? `${a.right}px` : '';
    el.style.top = `${a.y}px`;
    el.innerHTML = `<img src="${m.img}" alt=""><span class="ad__plate" style="--cor:${m.cor}">${m.nome}</span>`;
    el.style.opacity = 0;
    $('ads').appendChild(el);
    return { ...a, el };
  });

  // cartela de abertura
  const title = $('title');
  title.innerHTML = `<div class="card__bg"></div>
    <img class="logo" id="tLogo" src="/proj/public/brand/cap-poster.webp" alt="" style="top:250px">
    <div class="big" id="tBig" style="top:820px;font-size:170px">Cardápio</div>
    <div class="plate" id="tPlate" style="top:1090px">novo</div>
    <div class="hand" id="tHand" style="top:1300px">agora com a turma do muro</div>`;
  // cartela final
  const end = $('end');
  end.innerHTML = `<div class="card__bg"></div>
    <img class="logo" id="eLogo" src="/proj/public/brand/cap-poster.webp" alt="" style="top:150px;width:400px;height:400px;margin-left:-200px">
    <div class="plate" id="ePlate" style="top:600px;font-size:80px">cardápio novo no ar</div>
    <div class="info" id="e1" style="top:780px"><b>link na bio</b> · @mamadifood</div>
    <div class="info" id="e2" style="top:850px">Rua João Guimarães Rosa, 241</div>
    <div class="info" id="e3" style="top:910px">em frente à Praça Roosevelt · SP</div>
    <div class="hand" id="e4" style="top:1010px;font-size:50px;color:#fa5a0a">comida de mãe, drink de diva</div>
    <div class="crew" id="eCrew">${R.lineup.map((id) => `<span class="m"><img src="${R.crew[id].img}" alt=""></span>`).join('')}</div>`;

  // índice dos quadros de cada trecho gravado
  const seek = (list, v) => {
    let lo = 0, hi = list.length - 1;
    if (v <= list[0][0]) return list[0][1];
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (list[mid][0] <= v) lo = mid; else hi = mid - 1; }
    return list[lo][1];
  };
  const sa = $('sa'), sb = $('sb');
  const setImg = (img, src) => { if (img.dataset.src === src) return null; img.dataset.src = src; img.src = src; return img.decode().catch(() => {}); };

  window.renderFrame = async (t) => {
    const waits = [];
    // fundo: garrafinhas flutuando
    bottles.forEach((b, i) => {
      const y = ((b.y - t * b.f * 1.6) % 100 + 100) % 100;
      const dx = Math.sin(t * 0.7 + b.p) * 10, rot = b.r + Math.sin(t * 0.5 + b.p) * 6;
      bEls[i].style.transform = `translate(${(b.x / 100) * 1080 + dx}px, ${(y / 100) * 2000 - 80}px) rotate(${rot}deg)`;
    });
    $('glow').style.transform = `scale(${1 + Math.sin(t * 1.3) * 0.04})`;

    // abertura
    const T0 = R.titulo[1];
    const tOut = ph(t, T0 - 0.45, T0);
    title.style.display = t < T0 ? 'block' : 'none';
    if (t < T0) {
      const lg = eBack(ph(t, 0.05, 0.95));
      $('tLogo').style.transform = `scale(${lerp(0.15, 1, lg)}) rotate(${lerp(-540, 0, eOut(ph(t, 0.05, 0.95)))}deg)`;
      $('tLogo').style.opacity = clamp(t / 0.15);
      const bg = ph(t, 0.9, 1.15);
      $('tBig').style.transform = `scale(${lerp(2.2, 1, eOut(bg))})`;
      $('tBig').style.opacity = bg;
      const pl = ph(t, 1.2, 1.42);
      $('tPlate').style.transform = `translateX(-50%) skewX(-12deg) scale(${lerp(2, 1, eOut(pl))})`;
      $('tPlate').style.opacity = pl;
      $('tHand').style.opacity = ph(t, 1.6, 2.0);
      $('tHand').style.transform = `translateY(${lerp(20, 0, eOut(ph(t, 1.6, 2.0)))}px) rotate(-2deg)`;
      title.style.opacity = 1 - eIn(tOut);
      title.style.transform = `scale(${1 + eIn(tOut) * 0.25})`;
    }
    // celular
    const E0 = R.fim[0];
    const pin = eOut(ph(t, T0 - 0.45, T0 + 0.1));
    const pout = eIn(ph(t, E0, E0 + 0.5));
    const phone = $('phone');
    phone.style.opacity = Math.min(pin, 1 - pout);
    phone.style.transform = `translateY(${pout * 260}px) scale(${lerp(1.12, 1, pin) * (1 - pout * 0.08)})`;

    // tela: trecho atual e o anterior se dissolvendo
    const FADE = R.fade;
    let cur = null, prev = null;
    for (let i = 0; i < R.telas.length; i++) {
      const s = R.telas[i];
      if (t >= s.t0 && t < s.t1) { cur = s; if (i > 0 && t - s.t0 < FADE) prev = R.telas[i - 1]; }
    }
    if (!cur) cur = t < R.telas[0].t0 ? R.telas[0] : R.telas[R.telas.length - 1];
    const vOf = (s) => s.v0 + clamp(t, s.t0 - 10, s.t1 + 10) - s.t0;
    const fa = `/video/${seek(R.frames[cur.seg], vOf(cur))}`;
    const pa = setImg(sa, fa); if (pa) waits.push(pa);
    if (prev) {
      const fb = `/video/${seek(R.frames[prev.seg], prev.v0 + (prev.t1 - prev.t0) - 0.02)}`;
      const pb = setImg(sb, fb); if (pb) waits.push(pb);
      sb.style.opacity = 1;
      sa.style.opacity = eOut((t - cur.t0) / FADE);
      sb.style.zIndex = 0; sa.style.zIndex = 1;
    } else {
      sb.style.opacity = 0; sa.style.opacity = 1;
    }

    // legendas
    for (const c of caps) {
      const a = ph(t, c.t0, c.t0 + 0.4), z = ph(t, c.t1 - 0.25, c.t1);
      const on = t >= c.t0 && t < c.t1;
      c.el.style.opacity = on ? Math.min(clamp(a * 2), 1 - z) : 0;
      if (on) c.el.style.transform = `translateX(${lerp(-120, 0, eBack(a)) + z * 40}px) skewX(-12deg)`;
    }
    // adesivos
    for (const a of ads) {
      const on = t >= a.t0 && t < a.t1;
      const k = ph(t, a.t0, a.t0 + 0.55), z = ph(t, a.t1 - 0.3, a.t1);
      a.el.style.opacity = on ? 1 - z : 0;
      if (on) {
        const bob = Math.sin((t - a.t0) * 3.2) * 2.2;
        a.el.style.transform = `translateY(${(1 - eBack(k)) * 120 + z * 80}px) scale(${lerp(0.6, 1, eBack(k)) * (1 - z * 0.2)}) rotate(${(a.rot || 0) + bob}deg)`;
      }
    }

    // cartela final
    end.style.display = t >= E0 ? 'block' : 'none';
    if (t >= E0) {
      const u = t - E0;
      end.style.opacity = eOut(ph(u, 0.15, 0.55));
      $('eLogo').style.transform = `scale(${lerp(0.2, 1, eBack(ph(u, 0.3, 1.0)))}) rotate(${lerp(-200, 0, eOut(ph(u, 0.3, 1.0)))}deg)`;
      const pl = ph(u, 0.8, 1.02);
      $('ePlate').style.opacity = pl;
      $('ePlate').style.transform = `translateX(-50%) skewX(-12deg) scale(${lerp(2, 1, eOut(pl))})`;
      ['e1', 'e2', 'e3', 'e4'].forEach((id, i) => { const k = ph(u, 1.15 + i * 0.18, 1.5 + i * 0.18); $(id).style.opacity = k; $(id).style.transform = `translateY(${(1 - eOut(k)) * 24}px)${id === 'e4' ? ' rotate(-2deg)' : ''}`; });
      [...$('eCrew').children].forEach((el, i) => { const k = ph(u, 1.3 + i * 0.11, 1.85 + i * 0.11); el.style.opacity = clamp(k * 3); el.style.transform = `translateY(${(1 - eBack(k)) * 160}px) rotate(${Math.sin(u * 3 + i) * 2.5}deg)`; });
    }
    // clarões nas viradas
    let fl = 0;
    for (const f of R.flashes) fl = Math.max(fl, 1 - ph(t, f, f + 0.22));
    $("flash").style.opacity = (fl * 0.3).toFixed(3);
    if (R.flashes.every((f) => t < f || t > f + 0.22)) $('flash').style.opacity = 0;

    await Promise.all(waits);
  };
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  window.ready = true;
})().catch((e) => { window.buildError = String(e && e.stack || e); });
