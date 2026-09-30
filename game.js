/* Game mode: a pixel version of me runs and jumps across the actual page.
   Platforms are the rules under headings and rows; five papers are scattered
   near the content. Off by default; the page is unchanged without it. */
(function () {
  "use strict";
  var SP = window.USHNA_SPRITE, cv = document.getElementById("gm-canvas"), toggle = document.getElementById("gm-toggle");
  if (!SP || !cv || !toggle) return;
  var ctx = cv.getContext("2d"), help = document.getElementById("gm-help"),
      countEl = document.getElementById("gm-n"), doneEl = document.getElementById("gm-done");

  /* sprite frames pre-rendered once at 1x, drawn scaled with smoothing off */
  var S = 1.6, PW = SP.w, PH = SP.h, frames = {};
  Object.keys(SP.frames).forEach(function (name) {
    var c = document.createElement("canvas"); c.width = PW; c.height = PH; var x = c.getContext("2d");
    var g = SP.frames[name];
    for (var r = 0; r < g.length; r++) for (var q = 0; q < g[r].length; q++) {
      var col = SP.palette[g[r][q]]; if (col) { x.fillStyle = col; x.fillRect(q, r, 1, 1); }
    }
    frames[name] = c;
  });
  var paper = (function () {
    var g = ["KKKKKKKK", "KqqqqqqK", "KqPPPqqK", "KqqqqqqK", "KqPPPPqK", "KqqqqqqK", "KqPPPqqK", "KqqqqqqK", "KqqqqqqK", "KKKKKKKK"],
        pal = { K: "#33222A", q: "#ffffff", P: "#C97B94" }, c = document.createElement("canvas"); c.width = 8; c.height = 10;
    var x = c.getContext("2d");
    for (var r = 0; r < g.length; r++) for (var q = 0; q < 8; q++) { x.fillStyle = pal[g[r][q]]; x.fillRect(q, r, 1, 1); }
    return c;
  })();

  var on = false, plats = [], items = [], found = 0, keys = {}, raf = 0, lastT = 0, dpr = 1, relayoutT = 0;
  var p = { x: 0, y: 0, vx: 0, vy: 0, w: PW * S - 8, h: PH * S, ground: false, face: 1, walkT: 0, t: 0 };
  var GRAV = 1900, SPEED = 190, JUMP = 600;

  function docRect(el) { var r = el.getBoundingClientRect(); return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height }; }

  function layout() {
    plats = []; var main = document.querySelector("main"), mr = docRect(main);
    var els = main.querySelectorAll("h2, .row, .pub, .theme, .news li");
    for (var i = 0; i < els.length; i++) { var r = docRect(els[i]); plats.push({ x: r.x, y: r.y + r.h, w: r.w }); }
    plats.push({ x: mr.x - 40, y: mr.y + mr.h + 24, w: mr.w + 80, floor: true });
    // walls: keep her inside the main column with a little slack
    p.minX = mr.x - 30; p.maxX = mr.x + mr.w + 30 - p.w;
    var anchors = ["#pub-chi26 .t", "#pub-cscw26 .t", "#pub-pnas .t", "#teaching .row .t", "#education .row .t"];
    if (!items.length) anchors.forEach(function (sel, i) {
      var el = document.querySelector(sel); if (!el) return; var r = docRect(el);
      items.push({ x: r.x + r.w - 40 - (i % 2) * 60, y: r.y - 30, got: false, bob: i * 1.3 });
    });
  }

  function start() {
    on = true; document.body.classList.add("gm-on"); toggle.classList.add("on"); toggle.setAttribute("aria-pressed", "true"); help.hidden = false;
    resize(); layout();
    var h2 = document.querySelector("main h2"), r = docRect(h2);
    p.x = r.x + 16; p.y = r.y + r.h - p.h - 1; p.vx = p.vy = 0; p.face = 1;
    lastT = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  }
  function stop() {
    on = false; document.body.classList.remove("gm-on"); toggle.classList.remove("on"); toggle.setAttribute("aria-pressed", "false"); help.hidden = true;
    doneEl.classList.remove("show"); keys = {}; cancelAnimationFrame(raf);
  }
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(window.innerWidth * dpr); cv.height = Math.round(window.innerHeight * dpr);
  }

  function tick(now) {
    var dt = Math.min(0.04, (now - lastT) / 1000); lastT = now; p.t += dt;
    relayoutT += dt; if (relayoutT > 0.5) { relayoutT = 0; layout(); }
    var dir = (keys.ArrowRight || keys.d ? 1 : 0) - (keys.ArrowLeft || keys.a ? 1 : 0);
    p.vx = dir * SPEED; if (dir) p.face = dir;
    if ((keys[" "] || keys.ArrowUp || keys.w) && p.ground) { p.vy = -JUMP; p.ground = false; }
    p.vy += GRAV * dt;
    var oldBottom = p.y + p.h;
    p.x = Math.max(p.minX, Math.min(p.maxX, p.x + p.vx * dt));
    p.y += p.vy * dt;
    p.ground = false;
    if (p.vy >= 0) for (var i = 0; i < plats.length; i++) {
      var pl = plats[i];
      if (p.x + p.w > pl.x && p.x < pl.x + pl.w && oldBottom <= pl.y + 1 && p.y + p.h >= pl.y) { p.y = pl.y - p.h; p.vy = 0; p.ground = true; break; }
    }
    if (p.vy > 900) p.vy = 900;
    p.walkT = dir && p.ground ? p.walkT + dt : 0;
    // papers
    for (var k = 0; k < items.length; k++) {
      var it = items[k]; if (it.got) continue;
      var iy = it.y + Math.sin(p.t * 3 + it.bob) * 3;
      if (p.x < it.x + 16 && p.x + p.w > it.x && p.y < iy + 20 && p.y + p.h > iy) {
        it.got = true; found++; countEl.textContent = found;
        if (found === items.length) doneEl.classList.add("show");
      }
    }
    // keep her on screen: the page follows her when she leaves the middle band
    var top = window.scrollY, vh = window.innerHeight;
    if (p.y < top + 90) window.scrollTo(0, p.y - 90);
    else if (p.y + p.h > top + vh - 90) window.scrollTo(0, p.y + p.h - vh + 90);
    draw();
    raf = requestAnimationFrame(tick);
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.imageSmoothingEnabled = false;
    var ox = -window.scrollX, oy = -window.scrollY;
    ctx.fillStyle = "#C97B94";
    for (var i = 0; i < plats.length; i++) {
      var pl = plats[i], y = pl.y + oy; if (y < -4 || y > window.innerHeight + 4) continue;
      ctx.fillRect(pl.x + ox, y, pl.w, pl.floor ? 3 : 2);
    }
    for (var k = 0; k < items.length; k++) {
      var it = items[k]; if (it.got) continue;
      var iy = it.y + Math.sin(p.t * 3 + it.bob) * 3 + oy;
      ctx.fillStyle = "rgba(201,123,148,.18)"; ctx.fillRect(it.x + ox - 4, iy - 4, 24, 28);
      ctx.drawImage(paper, it.x + ox, iy, 16, 20);
    }
    var fr = !p.ground ? "walk1" : (p.walkT ? ((Math.floor(p.walkT * 9) % 2) ? "walk1" : "walk2") : "idle");
    var sx = p.x + ox - 4, sy = p.y + oy;
    ctx.fillStyle = "rgba(51,34,42,.10)"; ctx.fillRect(sx + 6, sy + p.h - 2, PW * S - 12, 3);
    ctx.save();
    if (p.face < 0) { ctx.translate(sx + PW * S, sy); ctx.scale(-1, 1); ctx.drawImage(frames[fr], 0, 0, PW * S, PH * S); }
    else ctx.drawImage(frames[fr], sx, sy, PW * S, PH * S);
    ctx.restore();
  }

  toggle.addEventListener("click", function () { on ? stop() : start(); });
  var MOVE = { ArrowLeft: 1, ArrowRight: 1, ArrowUp: 1, " ": 1, a: 1, d: 1, w: 1 };
  document.addEventListener("keydown", function (e) {
    if (!on) return;
    if (e.key === "Escape") return stop();
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (MOVE[k]) { keys[k] = true; e.preventDefault(); }
  });
  document.addEventListener("keyup", function (e) { var k = e.key.length === 1 ? e.key.toLowerCase() : e.key; delete keys[k]; });
  window.addEventListener("resize", function () { if (on) { resize(); layout(); } });
})();
