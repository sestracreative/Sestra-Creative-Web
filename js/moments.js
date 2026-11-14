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

  /* ---------- 1. word-highlight: frases que se entintan con el scroll ----------
     Solo en las frases que se leen como declaración: "Cómo trabajamos" y las citas de clientes. */
  var WH = [], busy = false;
  function splitOne(el) {
    var walker = D.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [], n;
    while ((n = walker.nextNode())) if (n.nodeValue.trim() && !(n.parentElement && n.parentElement.classList.contains("mo-w"))) nodes.push(n);
    nodes.forEach(function (tn) {
      var frag = D.createDocumentFragment();
      tn.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(D.createTextNode(part)); return; }
        var sp = D.createElement("span"); sp.className = "mo-w"; sp.textContent = part; frag.appendChild(sp);
      });
      tn.parentNode.replaceChild(frag, tn);
    });
    el.classList.add("mo-wh");
    return { el: el, words: [].slice.call(el.querySelectorAll(".mo-w")) };
  }
  function collect() {
    if (busy) return;
    busy = true;
    var els = [].slice.call(D.querySelectorAll("#mf-t, #testimonios .quote p"));
    WH = els.map(function (el) { return el.querySelector(".mo-w") ? { el: el, words: [].slice.call(el.querySelectorAll(".mo-w")) } : splitOne(el); });
    busy = false;
    drawWords();
  }
  function drawWords() {
    var vh = W.innerHeight, red = reduced();
    WH.forEach(function (o) {
      if (red) { o.words.forEach(function (w) { w.classList.add("is-on"); }); return; }
      var r = o.el.getBoundingClientRect(), start = vh * 0.85, end = vh * 0.45;
      var t = clamp((start - r.top) / Math.max(1, (start - end) + r.height));
      var k = Math.round(t * o.words.length);
      o.words.forEach(function (w, i) { w.classList.toggle("is-on", i < k); });
    });
  }
  collect();
  ["mf-t", "testimonios"].forEach(function (id) {
    var el = D.getElementById(id); if (!el) return;
    new MutationObserver(function () { if (!busy) { clearTimeout(el._t); el._t = setTimeout(collect, 30); } }).observe(el, { childList: true, subtree: true });
  });

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
      var img = D.createElement("img"); img.setAttribute("data-src", p.src); img.alt = p[lang()]; img.decoding = "async"; img.width = 2000; img.height = 1334;
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
    var load = function () { pics.forEach(function (f) { var im = f.firstChild; if (im && !im.src) im.src = im.getAttribute("data-src"); }); };
    if ("IntersectionObserver" in W) {
      var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { load(); io.disconnect(); } }, { rootMargin: "1500px 0px" });
      io.observe(sec);
    } else load();
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
    // avance continuo: cada foto se descubre a lo largo de todo su tramo, sin pausas;
    // al terminar de descubrirse la última, la sección se suelta y la página sigue
    var p = clamp(-r.top / Math.max(1, total)), n = pics.length, steps = n - 1, k = 0;
    pics.forEach(function (pic, i) {
      var u = i === 0 ? 1 : clamp(p * steps - (i - 1));
      var e = 1 - Math.pow(1 - u, 2);
      pic.style.setProperty("--c", ((1 - e) * 100).toFixed(2) + "%");
      pic.style.setProperty("--z", (1.05 - 0.05 * e).toFixed(4));
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
      sec.style.setProperty("--hold", ((pics.length - 1) * 0.7).toFixed(2));
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

  /* ---------- 3. la marca del pie ocupa justo el ancho de la página ---------- */
  var fw = D.querySelector(".ft-word");
  function fitWord() {
    if (!fw) return;
    var spans = fw.querySelectorAll("span"); if (!spans.length) return;
    fw.style.fontSize = "100px";
    var stacked = W.matchMedia("(max-width:700px)").matches, wdt;
    if (stacked) wdt = Math.max.apply(null, [].map.call(spans, function (x) { return x.getBoundingClientRect().width; }));
    else wdt = spans[spans.length - 1].getBoundingClientRect().right - spans[0].getBoundingClientRect().left;
    wdt -= 20; // espacio de letra que queda después de la última letra (.2em)
    var target = fw.clientWidth;
    if (wdt > 0 && target > 0) fw.style.fontSize = (100 * target / wdt).toFixed(2) + "px";
  }
  if (fw) {
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(fitWord);
    fitWord();
    W.addEventListener("load", fitWord);
  }

  /* ---------- 4. el menú lleva cada sección justo debajo de la barra ---------- */
  var topBar = D.querySelector("header.top");
  function setHdr() {
    if (!topBar) return;
    // en celular la barra se esconde al bajar, así que el salto no deja espacio para ella
    var hides = W.matchMedia("(max-width:860px)").matches;
    D.documentElement.style.setProperty("--hdr", (hides ? 0 : topBar.offsetHeight) + "px");
  }
  setHdr();

  /* ---------- 5. tarjeta del día elegido, junto al calendario ---------- */
  var dc = D.getElementById("daycard");
  // hora del atardecer en Tamarindo (10.30 N, 85.84 O, UTC-6), fórmula de la NOAA
  function sunset(date) {
    var rad = Math.PI / 180, lat = 10.30, lng = -85.84;
    var start = Date.UTC(date.getFullYear(), 0, 0), n = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 864e5);
    var g = 2 * Math.PI / 365 * (n - 1 + 0.5);
    var eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    var dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    var ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(lat * rad) * Math.cos(dec)) - Math.tan(lat * rad) * Math.tan(dec)) / rad;
    var mins = 720 - 4 * (lng - ha) - eq + (-6) * 60;
    var h = Math.floor(mins / 60), m = Math.round(mins % 60); if (m === 60) { h++; m = 0; }
    return { h: h, m: m };
  }
  function drawDay() {
    if (!dc) return;
    var en = lang() === "en";
    var sel = D.querySelector("#cal .day.sel"), iso = sel && sel.dataset.iso;
    var slotEl = D.querySelector("#slot label.on"), slot = slotEl ? slotEl.textContent.trim().replace(/\s*\(.*\)\s*$/, "") : "";
    var html = '<p class="dk-k">' + (en ? "Your session" : "Tu sesión") + "</p>";
    if (iso) {
      var p = iso.split("-"), d = new Date(+p[0], +p[1] - 1, +p[2]);
      var day = d.toLocaleDateString(en ? "en-US" : "es-CR", { weekday: "long", day: "numeric", month: "long" });
      var ss = sunset(d), hh = ss.h > 12 ? ss.h - 12 : ss.h, mm = ("0" + ss.m).slice(-2);
      html += '<p class="dk-d">' + day.charAt(0).toUpperCase() + day.slice(1) + "</p>" +
        '<dl class="dk-l"><div><dt>' + (en ? "Time slot" : "Franja") + "</dt><dd>" + slot + "</dd></div>" +
        "<div><dt>" + (en ? "Sunset in Tamarindo" : "Atardecer en Tamarindo") + "</dt><dd>" + hh + ":" + mm + (en ? " p.m." : " p. m.") + "</dd></div></dl>" +
        '<p class="dk-n">' + (en ? "We confirm the exact time by WhatsApp." : "La hora exacta la confirmamos por WhatsApp.") + "</p>";
    } else {
      html += '<p class="dk-d dk-empty">' + (en ? "Pick a day on the calendar" : "Elige un día en el calendario") + "</p>" +
        '<p class="dk-n">' + (en ? "Green days are open. For drone and exteriors, the last light of the afternoon works best." : "Los días en verde están libres. Para drone y exteriores, la última luz de la tarde es la que mejor funciona.") + "</p>";
    }
    dc.innerHTML = html;
  }
  if (dc) {
    drawDay();
    ["cal", "slot"].forEach(function (id) { var el = D.getElementById(id); if (el) new MutationObserver(function () { drawDay(); }).observe(el, { subtree: true, attributes: true, attributeFilter: ["class"], childList: true }); });
    new MutationObserver(drawDay).observe(D.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  /* ---------- un solo bucle de scroll ---------- */
  var ticking = false;
  function frame() { ticking = false; drawWords(); drawChapters(); }
  W.addEventListener("scroll", function () { if (!ticking) { ticking = true; W.requestAnimationFrame(frame); } }, { passive: true });
  var rt = 0;
  W.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { setHdr(); sync(); frame(); fitWord(); }, 120); });
  W.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", function () { sync(); frame(); });
})();
