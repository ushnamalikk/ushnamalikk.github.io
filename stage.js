/* The stage: a pinned pixel scene that follows the reader down the page.
   Each section of the page is a chapter; the scene changes per chapter and
   scroll progress inside a chapter moves the character. Five collectibles
   hidden in the text unlock a final chapter. The page reads fine without this. */
(function () {
  "use strict";
  var SP = window.USHNA_SPRITE;
  var cv = document.getElementById("stage");
  if (!SP || !cv) return;
  var ctx = cv.getContext("2d");
  var W = 146, H = 110, GROUND = 98;
  cv.width = W; cv.height = H;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var C = {
    K: "#33222A", q: "#FFFFFF", p: "#C97B94", P: "#A05B76", r: "#E5B6C5", R: "#F3DDE4",
    b: "#8A5A47", B: "#A9705A", d: "#6E4636", g: "#7BA37A", G: "#5E8A5D", y: "#F2C14E",
    s: "#C8C2C6", S: "#ECE7E9", n: "#3D3A44", o: "#8FB1C9", O: "#B9D0E0", t: "#D9A67A", T: "#EBC9A3",
    w: "#F7ECEF", i: "#6E5560", m: "#A2909A"
  };
  function grid(g, x, y, s, flip, pal) {
    s = s || 1; var w = g[0].length; pal = pal || C;
    for (var r = 0; r < g.length; r++) for (var c = 0; c < g[r].length; c++) {
      var col = pal[g[r][c]];
      if (g[r][c] !== "." && col) { ctx.fillStyle = col; ctx.fillRect(x + (flip ? w - 1 - c : c) * s, y + r * s, s, s); }
    }
  }
  function rect(col, x, y, w, h) { ctx.fillStyle = C[col] || col; ctx.fillRect(x, y, w, h); }

  /* ---------- props ---------- */
  var A = {
    dome: ["......KKKK......", "....KKssssKK....", "...KssssssssK...", "..KssssssssssK..", ".KKKKKKKKKKKKKK.", ".KssKssKssKssKs.", ".KssKssKssKssKs."],
    screen: ["KKKKKKKKKKKKKKKKKK", "KqqqqqqqqqqqqqqqqK", "KqqqqqqqqqqqqqqqqK", "KqqqqqqqqqqqqqqqqK", "KqqqqqqqqqqqqqqqqK", "KqqqqqqqqqqqqqqqqK", "KqqqqqqqqqqqqqqqqK", "KqqqqqqqqqqqqqqqqK", "KqqqqqqqqqqqqqqqqK", "KqqqqqqqqqqqqqqqqK", "KKKKKKKKKKKKKKKKKK", ".......KnnnK......", "....KKKKKKKKKKK..."],
    desk: ["KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", "KBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBK", "KbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbK", "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", "KddK..............................................KddK", "KddK..............................................KddK", "KddK..............................................KddK"],
    paper: ["KKKKKKKK", "KqqqqqqK", "KqPPPqqK", "KqqqqqqK", "KqPPPPqK", "KqqqqqqK", "KqPPPqqK", "KqqqqqqK", "KqqqqqqK", "KKKKKKKK"],
    shelf: ["KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", "KBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBK", "KBKppKPPKggKyyKKppKGGKPPKyyKppKPPKBK", "KBKppKPPKggKyyKKppKGGKPPKyyKppKPPKBK", "KBKppKPPKggKyyKKppKGGKPPKyyKppKPPKBK", "KBKppKPPKggKyyKKppKGGKPPKyyKppKPPKBK", "KBKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKBK", "KBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBK", "KBKGGKyyKppKPPKKKKggKPPKppKyyKGGKKBK", "KBKGGKyyKppKPPKKKKggKPPKppKyyKGGKKBK", "KBKGGKyyKppKPPKKKKggKPPKppKyyKGGKKBK", "KBKGGKyyKppKPPKKKKggKPPKppKyyKGGKKBK", "KBKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKBK", "KBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBK", "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK"],
    board: ["KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", "KssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssK", "KsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsK", "KsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsK", "KsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsK", "KsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsK", "KsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsK", "KsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsK", "KsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsK", "KsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsK", "KsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsK", "KsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsK", "KsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsK", "KsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsK", "KsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsK", "KsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqsK", "KssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssK", "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK"],
    palm: ["...gGg...", "..gGGGg..", ".gGgKgGg.", "gG.gKg.Gg", "....K....", "....K....", "....K....", "....K....", "....K....", "....K....", "....K....", "....K....", "....K....", "....K....", "....K....", "....K....", "....K....", "....K....", "....K....", "....K....", "....K....", "....K....", "...KKK..."],
    tower: ["...KKKKKK...", "..KttttttK..", "..KtKKKKtK..", "..KttttttK..", "..KKKKKKKK..", "...KttttK...", "...KtKKtK...", "...KttttK...", "...KttttK...", "...KtKKtK...", "...KttttK...", "...KttttK...", "...KtKKtK...", "...KttttK...", "...KttttK...", "...KtKKtK...", "...KttttK...", "...KttttK...", "...KtKKtK...", "...KttttK...", "...KttttK...", "...KttttK...", "...KttttK...", "...KttttK...", "...KttttK...", "...KttttK...", "...KttttK...", "...KttttK...", "...KttttK...", "...KttttK...", "...KttttK...", "...KttttK...", "..KKttttKK..", ".KttttttttK.", "KKKKKKKKKKKK"],
    arch: ["..KKKK..", ".KttttK.", "KttttttK", "KttttttK", "KttttttK", "KttttttK", "KttttttK", "KttttttK", "KttttttK", "KttttttK"],
    mailbox: ["..KKKKKKK.", ".KPPPPPPPK", "KPPPPPPPPPK", "KPqqqqqqqPK", "KPPPPPPPPPK", "KPPPPPPPPPK", "KKKKKKKKKKK", "....KnnK...", "....KnnK...", "....KnnK...", "....KnnK...", "....KnnK...", "....KnnK...", "...KKKKKK.."],
    envelope: ["KKKKKKKKKK", "KqKqqqqKqK", "KqqKqqKqqK", "KqqqKKqqqK", "KqqqqqqqqK", "KKKKKKKKKK"],
    snowflake: [".K.", "KKK", ".K."],
    cloud: ["....qqqq....", "..qqqqqqqq..", "qqqqqqqqqqqq", ".qqqqqqqqqq."],
    cap: ["..KKKKKKKK..", ".KKKKKKKKKK.", "KKKKKKKKKKKK", "....KKKK....", "....KKKK...."]
  };

  var SNOW = []; for (var si = 0; si < 22; si++) { var r1 = Math.sin(si * 12.9898) * 43758.5453, r2 = Math.sin(si * 78.233) * 9631.7; SNOW.push([Math.floor((r1 - Math.floor(r1)) * W), Math.floor((r2 - Math.floor(r2)) * 90), si % 5]); }

  /* ---------- chapters ---------- */
  var chapters = [
    { id: "about", pose: "wave", target: 60, scene: sceneAbout },
    { id: "research", pose: "sit", target: 56, scene: sceneResearch },
    { id: "publications", pose: "hold", target: 40, scene: scenePubs },
    { id: "teaching", pose: "write", target: 44, scene: sceneTeaching },
    { id: "education", pose: "walk", target: 116, scene: sceneEducation },
    { id: "contact", pose: "idle", target: 88, scene: sceneContact },
    { id: "unlocked", pose: "cheer", target: 60, scene: sceneUnlocked }
  ];
  var secs = chapters.map(function (c) { return document.getElementById(c.id); });

  var cur = 0, prog = 0, fade = 0, prev = -1, lastScroll = -1, moveT = 0, t = 0;
  var px = 8, blinkT = 0, envY = -10;

  function readScroll() {
    var vh = window.innerHeight, line = vh * 0.38, best = 0, bestP = 0;
    var remaining = (document.documentElement.scrollHeight - vh) - window.scrollY;
    if (remaining < vh * 0.62) line = Math.min(vh - 1, line + (vh * 0.62 - remaining));
    for (var i = 0; i < secs.length; i++) {
      var s = secs[i]; if (!s || s.hidden) continue;
      var r = s.getBoundingClientRect();
      if (r.top <= line) { best = i; bestP = Math.max(0, Math.min(1, (line - r.top) / Math.max(1, r.height))); }
    }
    if (best !== cur) { prev = cur; cur = best; fade = reduce ? 0 : 1; }
    prog = bestP;
  }

  /* ---------- scenes: (p = progress, now = seconds) ---------- */
  function sky(top, bottom) {
    rect(top, 0, 0, W, GROUND); rect(bottom, 0, GROUND, W, H - GROUND); rect("K", 0, GROUND, W, 1);
  }
  function indoor() {
    rect("R", 0, 0, W, GROUND); rect("w", 0, GROUND, W, H - GROUND);
    for (var y = GROUND; y < H; y += 6) for (var x = ((y / 6) | 0) % 2 ? 6 : 0; x < W; x += 12) rect("#FBF3F5", x, y, 6, 6);
    rect("p", 0, GROUND - 3, W, 3); rect("K", 0, GROUND, W, 1);
  }
  function building(x, y, w, h, col, dome) {
    rect("K", x - 1, y - 1, w + 2, h + 2); rect(col, x, y, w, h);
    for (var cx = x + 4; cx < x + w - 4; cx += 8) rect("K", cx, y + 6, 1, h - 6);
    if (dome) grid(A.dome, x + (w - 16) / 2, y - 7);
  }
  function sceneAbout(p, now) {
    sky("#FBEEF1", "#E9D3DA");
    grid(A.cloud, 10 + Math.sin(now * 0.3) * 3, 12); grid(A.cloud, 104 + Math.cos(now * 0.25) * 3, 24);
    building(48, GROUND - 40, 56, 40, "S", true);
    rect("K", 70, GROUND - 14, 12, 14); rect("B", 71, GROUND - 13, 10, 13);
  }
  function sceneResearch(p, now) {
    indoor();
    var blink = ((now * 2) | 0) % 2;
    // search screen (left) and chat screen (right)
    grid(A.screen, 24, GROUND - 36); grid(A.screen, 104, GROUND - 36);
    rect("s", 27, GROUND - 33, 12, 2); rect("P", 27, GROUND - 29, 9, 1); rect("s", 27, GROUND - 27, 11, 1); rect("P", 27, GROUND - 24, 7, 1);
    if (blink) rect("p", 27, GROUND - 22, 6, 1);
    rect("r", 107, GROUND - 33, 9, 3); rect("p", 111, GROUND - 29, 8, 3); rect("r", 107, GROUND - 25, 7, 3);
    if (!blink) rect("p", 110, GROUND - 21, 9, 3);
  }
  function scenePubs(p, now) {
    indoor(); grid(A.shelf, 92, GROUND - 46); grid(A.shelf, 4, GROUND - 46);
  }
  function sceneTeaching(p, now) {
    indoor(); grid(A.board, 42, 18);
    // lines appear as the reader moves through the chapter
    var lines = [[48, 26, 20], [48, 31, 34], [48, 36, 26], [48, 41, 40], [48, 46, 18], [72, 26, 22]];
    var n = Math.floor(p * 7);
    for (var i = 0; i < Math.min(n, lines.length); i++) rect(i % 3 === 1 ? "P" : "i", lines[i][0], lines[i][1], lines[i][2], 1);
  }
  function sceneEducation(p, now) {
    // three places pan by as she walks: Lahore, Stanford, Iowa
    var off = -Math.round(p * 2 * W);
    sky("#FBEEF1", "#E9D3DA");
    // Lahore: arches
    building(off + 24, GROUND - 34, 96, 34, "T", false);
    for (var i = 0; i < 5; i++) grid(A.arch, off + 30 + i * 18, GROUND - 12);
    // Stanford: tower and palms
    grid(A.tower, off + W + 66, GROUND - 35); grid(A.palm, off + W + 20, GROUND - 23); grid(A.palm, off + W + 112, GROUND - 23);
    // Iowa: dome, snow
    building(off + 2 * W + 44, GROUND - 40, 56, 40, "S", true);
    if (p > 0.6) for (var s = 0; s < SNOW.length; s++) rect("q", Math.round(off + 2 * W + SNOW[s][0]), Math.round((now * (9 + SNOW[s][2]) + SNOW[s][1]) % (GROUND - 4)), 2, 2);
  }
  function sceneContact(p, now) {
    sky("#FBEEF1", "#E9D3DA"); grid(A.cloud, 90 + Math.sin(now * 0.3) * 3, 14);
    grid(A.mailbox, 112, GROUND - 14);
    if (p > 0.45) { envY = Math.min(GROUND - 22, envY + 0.6); grid(A.envelope, 113, envY); } else envY = -10;
  }
  function sceneUnlocked(p, now) {
    sky("#FBEEF1", "#E9D3DA");
    for (var i = 0; i < 12; i++) { var yy = ((now * 25 + i * 31) % (H + 10)) - 10; rect(i % 2 ? "p" : "y", (i * 53) % W, yy, 2, 4); }
    grid(A.cap, 64, GROUND - 48 - Math.abs(Math.sin(now * 3)) * 8);
  }

  /* ---------- main loop ---------- */
  var lastT = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - lastT) / 1000); lastT = now; t = now / 1000;
    readScroll();
    var ch = chapters[cur];
    var y = window.scrollY; if (y !== lastScroll) { moveT = reduce ? 0 : 0.18; lastScroll = y; }
    moveT = Math.max(0, moveT - dt); if (fade > 0) fade = Math.max(0, fade - dt * 3.2);
    // where she stands in this chapter
    var tx = ch.pose === "walk" ? 8 + prog * (W - 24) : Math.min(ch.target, 8 + prog * 2.4 * (ch.target - 8));
    if (reduce) px = tx; else px += (tx - px) * Math.min(1, dt * 7);
    var walking = Math.abs(tx - px) > 0.6 && moveT > 0;

    cv.dataset.chapter = ch.id; cv.dataset.prog = prog.toFixed(2);
    ch.scene(prog, t);
    var fr, dir = tx >= px;
    blinkT -= dt; if (blinkT < -0.12) blinkT = 2.5 + Math.random() * 3;
    if (walking) fr = ((t * 8) | 0) % 2 ? "walk1" : "walk2";
    else if (ch.pose === "wave" || ch.pose === "cheer") fr = ((t * 2.5) | 0) % 2 ? "cheer" : "idle";
    else if (ch.pose === "hold" || ch.pose === "write") fr = "cheer";
    else fr = blinkT < 0 ? "blink" : "idle";
    var x = Math.round(px), yy = GROUND - SP.h + 2;
    rect("rgba(51,34,42,.12)", x + 3, GROUND - 1, SP.w - 6, 2);
    grid(SP.frames[fr] || SP.frames.idle, x, yy, 1, walking && !dir, SP.palette);
    if (!walking && ch.pose === "hold") grid(A.paper, x + SP.w - 3, yy + 8);
    if (!walking && ch.pose === "write") rect("P", x + SP.w - 2, yy + 12, 3, 1);
    if (ch.pose === "sit") { grid(A.desk, 20, GROUND - 22); grid(A.desk, 72, GROUND - 22); }   // desk in front of her
    if (fade > 0) { rect("rgba(250,240,242," + fade + ")", 0, 0, W, H); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- collectibles ---------- */
  var KEY = "ushna-found", found = {};
  try { found = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
  var items = [].slice.call(document.querySelectorAll(".find")), counter = document.getElementById("stage-count"),
      unlocked = document.getElementById("unlocked");
  function refresh() {
    var n = 0; items.forEach(function (el) { if (found[el.getAttribute("data-find")]) { el.classList.add("got"); n++; } });
    if (counter) counter.textContent = n + " / " + items.length + " found";
    if (unlocked) unlocked.hidden = n < items.length;
  }
  items.forEach(function (el) {
    el.setAttribute("role", "button"); el.setAttribute("tabindex", "0");
    function get() {
      var id = el.getAttribute("data-find"); if (found[id]) return;
      found[id] = 1; try { localStorage.setItem(KEY, JSON.stringify(found)); } catch (e) {}
      el.classList.add("pop"); refresh();
    }
    el.addEventListener("click", get);
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); get(); } });
  });
  refresh();
})();
