/* Momentos de la página (adaptados de taste-skill, MIT):
   1) word-highlight: la frase de "Cómo trabajamos" se entinta palabra por palabra con el scroll.
   2) photo-chapters: Servicios se cuenta con fotos a todo el ancho; cada foto se descubre desde abajo
      sobre la anterior y el panel cambia de capítulo.
   Sin script o con movimiento reducido: todo queda visible y quieto. */
(function () {
  "use strict";
  var W = window, D = document;
  var reduced = function () { return W.matchMedia("(prefers-reduced-motion: reduce)").matches; };
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

  /* ---------- 1. word-highlight ---------- */
  var mf = D.getElementById("mf-t"), words = [], busy = false;
  function splitWords() {
    if (!mf || busy) return;
    busy = true;
    var walker = D.createTreeWalker(mf, NodeFilter.SHOW_TEXT), nodes = [], n;
    while ((n = walker.nextNode())) if (n.nodeValue.trim() && !(n.parentElement && n.parentElement.classList.contains("mo-w"))) nodes.push(n);
    nodes.forEach(function (tn) {
      var frag = D.createDocumentFragment();
      tn.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(D.createTextNode(part)); return; }
        var s = D.createElement("span"); s.className = "mo-w"; s.textContent = part; frag.appendChild(s);
      });
      tn.parentNode.replaceChild(frag, tn);
    });
    words = [].slice.call(mf.querySelectorAll(".mo-w"));
    mf.classList.add("mo-wh");
    busy = false;
    drawWords();
  }
  function drawWords() {
    if (!words.length) return;
    if (reduced()) { words.forEach(function (w) { w.classList.add("is-on"); }); return; }
    var r = mf.getBoundingClientRect(), vh = W.innerHeight, start = vh * 0.85, end = vh * 0.45;
    var t = clamp((start - r.top) / Math.max(1, (start - end) + r.height));
    var k = Math.round(t * words.length);
    words.forEach(function (w, i) { w.classList.toggle("is-on", i < k); });
  }
  if (mf) {
    splitWords();
    new MutationObserver(function () { if (!busy && !mf.querySelector(".mo-w")) splitWords(); }).observe(mf, { childList: true, characterData: true, subtree: true });
  }

  /* ---------- 2. photo-chapters en Servicios ---------- */
  var PICS = [
    { src: "img/est-07.webp", es: "Sala con ventanales y vista al mar al atardecer", en: "Living room with floor-to-ceiling windows and sunset sea view" },
    { src: "img/galB.webp", es: "Vista aérea de una villa con piscina entre jardines", en: "Aerial view of a villa with pool among gardens" },
    { src: "img/galJ.webp", es: "Terraza techada con vista a la bahía", en: "Covered terrace overlooking the bay" },
    { src: "img/est-02.webp", es: "Habitación con vista al mar al atardecer", en: "Bedroom with sunset ocean view" }
  ];
  var sec = D.getElementById("servicios"), svcs = D.getElementById("svcs");
  var pc = null, chapters = [], pics = [], count = null, on = -1, live = false;
  var lang = function () { return (D.documentElement.lang || "es").slice(0, 2) === "en" ? "en" : "es"; };
  function buildChapters() {
    if (!sec || !svcs) return;
    var items = [].slice.call(svcs.querySelectorAll(".svc"));
    if (items.length < 2) return;
    if (pc) pc.remove();
    pc = D.createElement("div"); pc.className = "pc";
    var stage = D.createElement("div"); stage.className = "pc-stage";
    var panel = D.createElement("div"); panel.className = "pc-panel";
    count = D.createElement("p"); count.className = "pc-count"; count.setAttribute("aria-hidden", "true");
    var list = D.createElement("ol"); list.className = "pc-list";
    chapters = []; pics = [];
    items.forEach(function (it, i) {
      var p = PICS[i % PICS.length];
      var fig = D.createElement("figure"); fig.className = "pc-pic";
      var img = D.createElement("img"); img.src = p.src; img.alt = p[lang()]; img.loading = "lazy"; img.decoding = "async"; img.width = 2000; img.height = 1334;
      fig.appendChild(img); stage.appendChild(fig); pics.push(fig);
      var li = D.createElement("li"); li.className = "pc-ch";
      var h = it.querySelector("h3"), d = it.querySelector("p");
      li.innerHTML = "<h3></h3><p></p>";
      li.firstChild.textContent = h ? h.textContent : "";
      li.lastChild.textContent = d ? d.textContent : "";
      list.appendChild(li); chapters.push(li);
    });
    panel.appendChild(count); panel.appendChild(list); stage.appendChild(panel);
    pc.appendChild(stage);
    svcs.parentNode.insertBefore(pc, svcs.nextSibling);
    sec.classList.add("pc-ready");
    on = -1; sync();
  }
  function show(k) {
    if (k === on) return; on = k;
    chapters.forEach(function (c, i) { c.classList.toggle("is-on", i === k); });
    if (count) count.textContent = ("0" + (k + 1)).slice(-2) + " / " + ("0" + chapters.length).slice(-2);
  }
  function drawChapters() {
    if (!live) return;
    var r = sec.getBoundingClientRect(), total = sec.offsetHeight - W.innerHeight;
    var p = clamp(-r.top / Math.max(1, total)), n = pics.length, seg = 1 / n, k = 0;
    pics.forEach(function (pic, i) {
      var u = i === 0 ? 1 : clamp((p - (i - 0.25) * seg) / (0.45 * seg));
      var e = easeOut(u);
      pic.style.setProperty("--c", ((1 - e) * 100).toFixed(2) + "%");
      pic.style.setProperty("--z", (1.06 - 0.06 * e).toFixed(4));
      if (u >= 0.5) k = i;
    });
    show(k);
  }
  function sync() {
    if (!pc) return;
    var want = !reduced() && W.innerHeight >= 600;
    live = want;
    sec.classList.toggle("pc-live", want);
    if (want) {
      var top = D.querySelector("header.top");
      sec.style.setProperty("--navh", (top ? top.offsetHeight : 64) + "px");
      sec.style.setProperty("--hold", pics.length <= 3 ? 2 : 3);
      drawChapters();
    } else {
      pics.forEach(function (p) { p.style.removeProperty("--c"); p.style.removeProperty("--z"); });
      chapters.forEach(function (c) { c.classList.add("is-on"); });
    }
  }
  if (sec && svcs) {
    var t0 = 0;
    var tryBuild = function () { clearTimeout(t0); t0 = setTimeout(buildChapters, 30); };
    new MutationObserver(tryBuild).observe(svcs, { childList: true, subtree: true });
    if (svcs.children.length) buildChapters();
  }

  /* ---------- un solo bucle de scroll ---------- */
  var ticking = false;
  function frame() { ticking = false; drawWords(); drawChapters(); }
  W.addEventListener("scroll", function () { if (!ticking) { ticking = true; W.requestAnimationFrame(frame); } }, { passive: true });
  var rt = 0;
  W.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { sync(); frame(); }, 120); });
  W.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", function () { sync(); frame(); });
})();
