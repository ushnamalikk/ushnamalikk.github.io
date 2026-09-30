/* Source Catch — a small arcade game for ushnamalikk.github.io.
   Catch reliable sources, dodge AI hallucinations. Also animates the
   pixel character in the sidebar. The page works fully without this file. */
(function () {
  "use strict";
  var SP = window.USHNA_SPRITE;
  if (!SP) return;

  /* ---------- pixel drawing ---------- */
  function drawGrid(ctx, grid, pal, x, y, s) {
    for (var r = 0; r < grid.length; r++) {
      var row = grid[r];
      for (var c = 0; c < row.length; c++) {
        var col = pal[row[c]];
        if (col) { ctx.fillStyle = col; ctx.fillRect(x + c * s, y + r * s, s, s); }
      }
    }
  }
  var PAL = SP.palette;
  var ITEM_PAL = {
    K: "#33222A", W: "#ffffff", p: "#f3dfe5", R: "#C97B94", r: "#A05B76",
    Y: "#f2c14e", y: "#d9a13a", G: "#e9b6c6", g: "#d48aa3", L: "#f7eef1"
  };
  var ITEMS = {
    paper: { kind: "good", pts: 1, grid: [
      "..KKKKKKK...",
      "..KWWWWWKK..",
      "..KWWWWWKWK.",
      "..KWWWWWKKKK",
      "..KWRRRWWWWK",
      "..KWWWWWWWWK",
      "..KWRRRRRWWK",
      "..KWWWWWWWWK",
      "..KWRRRRWWWK",
      "..KWWWWWWWWK",
      "..KWWWWWWWWK",
      "..KKKKKKKKKK"] },
    star: { kind: "bonus", pts: 3, grid: [
      ".....KK.....",
      ".....KYK....",
      "....KYYYK...",
      "KKKKKYYYKKKK",
      "KYYYYYYYYYYK",
      ".KYYYYYYYYK.",
      "..KYYYYYYK..",
      "..KYYYYYYK..",
      ".KYYYKKYYYK.",
      ".KYYK..KYYK.",
      "KYYK....KYYK",
      "KKK......KKK"] },
    ghost: { kind: "bad", pts: 0, grid: [
      "...KKKKKK...",
      "..KGGGGGGK..",
      ".KGGGGGGGGK.",
      ".KGKKGGKKGK.",
      ".KGKKGGKKGK.",
      ".KGGGGGGGGK.",
      ".KGGGKKGGGK.",
      ".KGGKGGKGGK.",
      ".KGGGGKGGGK.",
      ".KGGGGGGGGK.",
      ".KGKGGKGGKGK",
      ".KKKKKKKKKK."] }
  };

  /* ---------- sidebar idle character ---------- */
  var side = document.getElementById("pixel-me");
  if (side) {
    var sctx = side.getContext("2d"), S = 3;
    side.width = SP.w * S; side.height = SP.h * S;
    var frame = "idle", nextBlink = 2000 + Math.random() * 3000, t0 = performance.now(), hover = false;
    side.addEventListener("mouseenter", function () { hover = true; });
    side.addEventListener("mouseleave", function () { hover = false; });
    (function loop(now) {
      var dt = now - t0; t0 = now;
      nextBlink -= dt;
      if (hover) frame = (Math.floor(now / 300) % 2) ? "cheer" : "idle";
      else if (nextBlink < 0) { frame = "blink"; if (nextBlink < -140) { frame = "idle"; nextBlink = 2500 + Math.random() * 3500; } }
      else frame = "idle";
      sctx.clearRect(0, 0, side.width, side.height);
      drawGrid(sctx, SP.frames[frame], PAL, 0, 0, S);
      requestAnimationFrame(loop);
    })(t0);
  }

  /* ---------- game ---------- */
  var card = document.getElementById("gm"),
      cv = document.getElementById("gm-canvas");
  if (!card || !cv) return;
  var ctx = cv.getContext("2d");
  var W = 240, H = 320, PS = 2;              // logical size, pixel scale
  cv.width = W; cv.height = H;
  var scoreEl = document.getElementById("gm-score"),
      bestEl = document.getElementById("gm-best"),
      livesEl = document.getElementById("gm-lives"),
      msgEl = document.getElementById("gm-msg");

  var BEST_KEY = "ushna-source-catch-best";
  function getBest() { try { return +localStorage.getItem(BEST_KEY) || 0; } catch (e) { return 0; } }
  function setBest(v) { try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) {} }

  var g = null, raf = 0, lastT = 0, keys = {}, pointerX = null;
  var PW = SP.w * PS, PH = SP.h * PS, IW = 12 * PS;

  function reset() {
    g = { state: "ready", score: 0, lives: 3, best: getBest(),
          px: (W - PW) / 2, items: [], spawnIn: 0.8, t: 0, face: "idle", faceT: 0,
          walkT: 0, flash: 0, floats: [] };
    hud();
    say("Catch reliable sources.<br>Dodge the hallucinations.", "Press <b>space</b> or tap to start");
  }
  function hud() {
    scoreEl.textContent = g.score;
    bestEl.textContent = g.best;
    var h = "";
    for (var i = 0; i < 3; i++) h += '<span class="' + (i < g.lives ? "on" : "") + '">&#9829;</span>';
    livesEl.innerHTML = h;
  }
  function say(big, small) {
    msgEl.innerHTML = big ? '<div class="gm-big">' + big + '</div><div class="gm-small">' + (small || "") + '</div>' : "";
    msgEl.style.display = big ? "flex" : "none";
  }
  function start() {
    if (g.state === "over") reset();
    g.state = "playing"; say("");
    lastT = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  }
  function gameOver() {
    g.state = "over";
    var newBest = g.score > g.best;
    if (newBest) { g.best = g.score; setBest(g.best); }
    hud();
    g.face = newBest ? "cheer" : "oops"; g.faceT = 99;
    say((newBest ? "New best! " : "") + g.score + " reliable source" + (g.score === 1 ? "" : "s") + " found",
        "Press <b>space</b> or tap to play again");
    draw();
  }

  function spawn() {
    var r = Math.random(), type;
    var badP = Math.min(0.45, 0.22 + g.score * 0.006);
    if (r < badP) type = "ghost"; else if (r < badP + 0.08) type = "star"; else type = "paper";
    g.items.push({ type: type, x: 4 + Math.random() * (W - IW - 8), y: -IW, wob: Math.random() * 6.28 });
  }

  function tick(now) {
    var dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    if (g.state !== "playing") return;
    g.t += dt;
    var speed = 150;
    var dir = 0;
    if (keys.ArrowLeft || keys.a || keys.A) dir -= 1;
    if (keys.ArrowRight || keys.d || keys.D) dir += 1;
    if (pointerX !== null) {
      var target = pointerX - PW / 2, d = target - g.px;
      if (Math.abs(d) > 3) dir = d > 0 ? 1 : -1;
    }
    g.px = Math.max(0, Math.min(W - PW, g.px + dir * speed * dt));
    g.walkT = dir ? g.walkT + dt : 0;

    g.spawnIn -= dt;
    if (g.spawnIn <= 0) { spawn(); g.spawnIn = Math.max(0.42, 1.0 - g.score * 0.012); }

    var fall = 55 + Math.min(120, g.score * 3.2);
    var py = H - PH - 6;
    for (var i = g.items.length - 1; i >= 0; i--) {
      var it = g.items[i];
      it.y += fall * dt * (it.type === "ghost" ? 0.9 : 1);
      it.x += Math.sin(g.t * 3 + it.wob) * 12 * dt;
      // collision with player's upper body
      if (it.y + IW > py + 6 && it.y < py + PH - 10 && it.x + IW > g.px + 6 && it.x < g.px + PW - 6) {
        var def = ITEMS[it.type];
        if (def.kind === "bad") {
          g.lives--; g.face = "oops"; g.faceT = 0.7; g.flash = 0.25;
          g.floats.push({ x: it.x, y: it.y, txt: "?!", t: 0, col: "#A05B76" });
          if (g.lives <= 0) { g.items.splice(i, 1); hud(); return gameOver(); }
        } else {
          g.score += def.pts; g.face = "cheer"; g.faceT = 0.35;
          g.floats.push({ x: it.x, y: it.y, txt: "+" + def.pts, t: 0, col: def.kind === "bonus" ? "#d9a13a" : "#A05B76" });
        }
        g.items.splice(i, 1); hud(); continue;
      }
      if (it.y > H) g.items.splice(i, 1);
    }
    for (var f = g.floats.length - 1; f >= 0; f--) { g.floats[f].t += dt; g.floats[f].y -= 30 * dt; if (g.floats[f].t > 0.8) g.floats.splice(f, 1); }
    if (g.faceT > 0) { g.faceT -= dt; if (g.faceT <= 0) g.face = "idle"; }
    if (g.flash > 0) g.flash -= dt;
    draw();
    raf = requestAnimationFrame(tick);
  }

  function draw() {
    ctx.fillStyle = "#FAF0F2"; ctx.fillRect(0, 0, W, H);
    // faint grid floor line
    ctx.fillStyle = "rgba(51,34,42,.13)"; ctx.fillRect(0, H - 4, W, 1);
    for (var i = 0; i < g.items.length; i++) {
      var it = g.items[i];
      drawGrid(ctx, ITEMS[it.type].grid, ITEM_PAL, Math.round(it.x), Math.round(it.y), PS);
    }
    var fr = g.face;
    if (fr === "idle" && g.walkT > 0) fr = (Math.floor(g.walkT * 8) % 2) ? "walk1" : "walk2";
    drawGrid(ctx, SP.frames[fr], PAL, Math.round(g.px), H - PH - 6, PS);
    ctx.font = "bold 11px 'Avenir Next', Helvetica, Arial, sans-serif"; ctx.textAlign = "center";
    for (var f = 0; f < g.floats.length; f++) {
      var fl = g.floats[f]; ctx.globalAlpha = 1 - fl.t / 0.8; ctx.fillStyle = fl.col;
      ctx.fillText(fl.txt, fl.x + IW / 2, fl.y); ctx.globalAlpha = 1;
    }
    if (g.flash > 0) { ctx.fillStyle = "rgba(201,123,148," + (g.flash * 0.9) + ")"; ctx.fillRect(0, 0, W, H); }
  }

  /* ---------- open / close ---------- */
  var backdrop = document.getElementById("gm-backdrop"), opener = document.querySelectorAll("[data-play]"), lastFocus = null;
  function open() {
    lastFocus = document.activeElement;
    backdrop.hidden = false; document.body.classList.add("gm-open");
    reset(); draw(); cv.focus();
  }
  function close() {
    cancelAnimationFrame(raf); backdrop.hidden = true; document.body.classList.remove("gm-open");
    if (g) g.state = "closed";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  for (var o = 0; o < opener.length; o++) opener[o].addEventListener("click", function (e) { e.preventDefault(); open(); });
  document.getElementById("gm-close").addEventListener("click", close);
  backdrop.addEventListener("click", function (e) { if (e.target === backdrop) close(); });

  document.addEventListener("keydown", function (e) {
    if (backdrop.hidden) return;
    if (e.key === "Escape") return close();
    if (e.key === " " || e.code === "Space" || e.key === "Enter") { e.preventDefault(); if (g.state !== "playing") start(); return; }
    if (e.key in { ArrowLeft: 1, ArrowRight: 1, a: 1, d: 1, A: 1, D: 1 }) { keys[e.key] = true; e.preventDefault(); }
  });
  document.addEventListener("keyup", function (e) { delete keys[e.key]; });

  function px(e) { var r = cv.getBoundingClientRect(); return (e.clientX - r.left) * (W / r.width); }
  cv.addEventListener("pointerdown", function (e) {
    e.preventDefault(); cv.setPointerCapture(e.pointerId);
    if (g.state !== "playing") { start(); return; }
    pointerX = px(e);
  });
  cv.addEventListener("pointermove", function (e) { if (pointerX !== null) pointerX = px(e); });
  cv.addEventListener("pointerup", function () { pointerX = null; });
  cv.addEventListener("pointercancel", function () { pointerX = null; });
  msgEl.addEventListener("pointerdown", function (e) { e.preventDefault(); if (g.state !== "playing") start(); });
  document.addEventListener("visibilitychange", function () { if (document.hidden && g && g.state === "playing") { g.state = "ready"; say("Paused", "Press <b>space</b> or tap to resume"); } });
})();
