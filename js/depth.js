/* BORRADOR "PROFUNDIDAD": agrega capas, movimiento y piezas nuevas sobre el sitio actual.
   Se enciende/apaga con el panel de la esquina para comparar con el original. */
(function () {
  "use strict";
  var W = window, D = document, H = D.documentElement;
  var reduced = function () { return W.matchMedia("(prefers-reduced-motion: reduce)").matches; };
  var on = function () { return H.classList.contains("dp"); };
  var lang = function () { return (H.lang || "es").slice(0, 2) === "en" ? "en" : "es"; };
  var $ = function (s, r) { return (r || D).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); };

  var TX = {
    es: {
      words: ["Fotografía", "Drone", "Video", "Recorridos 360°", "Planos 2D", "Redes"],
      st: [["100", "+", "propiedades fotografiadas en Costa Rica"], ["1–3", "", "días hábiles para la entrega"], ["4", "", "servicios en un solo equipo"], ["2", "", "idiomas: atendemos en español e inglés"]],
      phK: "Video y contenido", phT: "Así se ve tu propiedad en redes.",
      phL: "Reels de 30 a 60 segundos, tomas aéreas y un banco de clips en bruto para que publiques con constancia en Instagram y TikTok.",
      chips: ["Reels 30–60 s", "Tomas aéreas", "Banco de clips", "Formato vertical"],
      tags: [["Reel", "30–60 s"], ["Drone", "Tomas aéreas"], ["Banco", "Clips de 3–8 s"], ["9:16", "Listo para redes"]],
      hint: "Toca una opción para ver un ejemplo en el teléfono.", vert: "Zona segura para textos", clip: "Clip",
      t2: ["Entrega", "1–3 días"],
      pnl: "Borrador", p1: "Profundidad", p2: "Botones píldora"
    },
    en: {
      words: ["Photography", "Drone", "Video", "360° tours", "2D floor plans", "Social"],
      st: [["100", "+", "properties photographed in Costa Rica"], ["1–3", "", "business days to delivery"], ["4", "", "services, one team"], ["2", "", "languages: Spanish and English"]],
      phK: "Video & content", phT: "This is how your property looks on social.",
      phL: "30 to 60 second reels, aerial shots and a bank of raw clips so you can post consistently on Instagram and TikTok.",
      chips: ["Reels 30–60 s", "Aerials", "Clip bank", "Vertical format"],
      tags: [["Reel", "30–60 s"], ["Drone", "Aerial shots"], ["Bank", "3–8 s clips"], ["9:16", "Ready for social"]],
      hint: "Tap an option to see an example on the phone.", vert: "Safe zone for text", clip: "Clip",
      t2: ["Delivery", "1–3 days"],
      pnl: "Draft", p1: "Depth", p2: "Pill buttons"
    }
  };
  var t = function () { return TX[lang()]; };

  var ICON = {
    heart: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z'/%3E%3C/svg%3E\")",
    msg: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M4 4h16v12H8l-4 4z'/%3E%3C/svg%3E\")",
    send: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M2 21l21-9L2 3v7l15 2-15 2z'/%3E%3C/svg%3E\")"
  };
  var side = '';

  /* ---------- piezas nuevas ---------- */
  function build() {
    var x = t();
    // portada: indicador de scroll
    var hero = $("#inicio");
    if (hero && !$(".dp-cue", hero)) { var c = D.createElement("div"); c.className = "dp-cue dp-only"; c.setAttribute("aria-hidden", "true"); hero.appendChild(c); }

    // cinta de servicios + fotos (después del manifiesto)
    var mq = $("#dp-marq");
    if (!mq) { mq = D.createElement("section"); mq.id = "dp-marq"; mq.className = "dp-marq dp-only"; mq.setAttribute("aria-hidden", "true"); var mf = $(".manifesto"); mf.parentNode.insertBefore(mq, mf.nextSibling); }
    var w = x.words.map(function (s, i) { return '<span class="' + (i % 2 ? "" : "f") + '">' + s + '</span><i>✦</i>'; }).join("");
    var pics = ["galC", "galK", "galR", "galE", "galL", "galD", "galG", "galN", "galI", "galS"];
    var strip = pics.map(function (p, i) { return '<figure style="--r:' + (i % 2 ? 1.2 : -1.2) + 'deg"><img src="img/sm/' + p + '.webp" data-full="img/' + p + '.webp" alt="" loading="lazy" decoding="async"></figure>'; }).join("");
    mq.innerHTML = '<div class="dp-words">' + w + w + '</div><div class="dp-strip">' + strip + strip + '</div>';

    // números
    var st = $("#dp-stats");
    if (!st) { st = D.createElement("section"); st.id = "dp-stats"; st.className = "dp-stats dp-only"; var tm = $("#testimonios"); tm.parentNode.insertBefore(st, tm); }
    st.innerHTML = '<div class="wrap">' + x.st.map(function (s, i) {
      return '<div class="dp-stat dp-up" style="--d:' + (i * 0.08) + 's"><b data-n="' + s[0] + '">' + s[0] + '<em>' + s[1] + '</em></b><span>' + s[2] + '</span></div>';
    }).join("") + '</div>';

    // teléfonos (antes de la banda de detalles)
    var ph = $("#dp-phones");
    if (!ph) { ph = D.createElement("section"); ph.id = "dp-phones"; ph.className = "dp-phones dp-only"; var dt = $("#detalles") || $("#proceso"); dt.parentNode.insertBefore(ph, dt); }
    var md = ph.dataset.mode ? +ph.dataset.mode : 0;
    ph.innerHTML = '<div class="wrap"><div class="dp-up"><span class="k">' + x.phK + '</span><h2 style="margin-top:14px">' + x.phT + '</h2><p class="l">' + x.phL + '</p>' +
      '<div class="dp-chips" role="group">' + x.chips.map(function (c, i) { return '<button type="button" data-m="' + i + '" aria-pressed="' + (i === md) + '">' + c + "</button>"; }).join("") + '</div>' +
      '<p class="dp-hint">' + x.hint + '</p></div>' +
      '<div class="dp-stage" aria-hidden="true">' +
      '<div class="dp-ph l" data-par="-0.06"><div class="scr"><img src="img/sm/est-03.webp" alt="" loading="lazy"><div class="dp-ui"><b><i></i>sestracreative</b>Villa · Guanacaste</div></div></div>' +
      '<div class="dp-ph c" data-par="0.04"><div class="scr">' +
        '<div class="dp-mode" data-m="0"><div class="dp-prog"><i></i></div><video muted loop playsinline preload="none" poster="assets/hero-dron2-cel-poster.webp" data-src="assets/hero-dron2-cel.mp4"></video><div class="dp-ui"><b><i></i>sestracreative</b>Guanacaste desde el aire ✦</div></div>' +
        '<div class="dp-mode" data-m="1"><video muted loop playsinline preload="none" poster="assets/op-marina-poster.webp" data-src="assets/op-marina.mp4"></video><div class="dp-ui"><b><i></i>sestracreative</b>Marina · drone 4K</div></div>' +
        '<div class="dp-mode" data-m="2"><div class="dp-bank">' +
          '<div class="cl"><video muted loop playsinline preload="none" poster="assets/hero-dron2-cel-poster.webp" data-src="assets/hero-dron2-cel.mp4"></video><span>' + x.clip + ' 1 · 0:06</span></div>' +
          '<div class="cl"><img src="img/sm/galN.webp" alt=""><span>' + x.clip + ' 2 · 0:04</span></div>' +
          '<div class="cl"><video muted loop playsinline preload="none" poster="assets/op-marina-poster.webp" data-src="assets/op-marina.mp4"></video><span>' + x.clip + ' 3 · 0:08</span></div>' +
          '<div class="cl"><img src="img/sm/galI.webp" alt="" style="animation-delay:-3s"><span>' + x.clip + ' 4 · 0:05</span></div>' +
        '</div></div>' +
        '<div class="dp-mode" data-m="3"><div class="dp-vert"><img src="img/sm/galF.webp" alt=""><div class="safe"></div><span class="dim">1080 × 1920 · 9:16</span><span class="lbl">' + x.vert + '</span></div></div>' +
      '</div></div>' +
      '<div class="dp-ph r" data-par="-0.1"><div class="scr"><img src="img/sm/galD.webp" alt="" loading="lazy"><div class="dp-ui"><b><i></i>sestracreative</b>Patio con piscina</div></div></div>' +
      '<div class="dp-tag t1" style="left:2%;top:16%"><b></b><span></span></div>' +
      '<div class="dp-tag t2" style="right:0;bottom:14%;animation-delay:-3s"><b>' + x.t2[0] + '</b>' + x.t2[1] + '</div>' +
      '</div></div>';
    $$(".dp-chips button", ph).forEach(function (b) { b.addEventListener("click", function () { setMode(+b.dataset.m); }); });
    setMode(md);

    // manifiesto: segunda foto encimada
    var mfp = $("figure.mf-pic"), grid = $(".mf-grid");
    if (mfp && grid && !$(".dp-float", grid)) {
      var f = D.createElement("div"); f.className = "dp-float dp-only"; f.setAttribute("data-par", "-0.12");
      f.innerHTML = '<img src="img/sm/galP.webp" alt="" loading="lazy" decoding="async">'; grid.appendChild(f);
      var mi = $("img", mfp); if (mi) { mi.src = "img/galQ.webp"; mi.alt = lang() === "en" ? "Infinity pool terrace facing the bay at sunset" : "Terraza con piscina infinita frente a la bahía al atardecer"; }
    }

    // marca del pie: letras sueltas
    var fw = $("footer .ft-word");
    if (fw && !fw.dataset.dpSplit) {
      fw.dataset.dpSplit = "1"; var n = 0;
      $$("span", fw).forEach(function (sp) { sp.innerHTML = sp.textContent.split("").map(function (ch) { return '<span class="ch" style="--i:' + (n++) + '">' + ch + "</span>"; }).join(""); });
    }
    panelText();
    observe();
  }

  /* ---------- teléfono: cada opción muestra un ejemplo ---------- */
  var bankTimer = null;
  function setMode(m) {
    var ph = $("#dp-phones"); if (!ph) return; ph.dataset.mode = m; var x = t();
    $$(".dp-chips button", ph).forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.m === m)); });
    var tg = $(".dp-tag.t1", ph); if (tg) { $("b", tg).textContent = x.tags[m][0]; $("span", tg).textContent = x.tags[m][1]; }
    $$(".dp-ph.c .dp-mode", ph).forEach(function (el) {
      var act = +el.dataset.m === m; el.classList.toggle("on", act);
      $$("video", el).forEach(function (v) {
        if (act) { if (!v.src && v.dataset.src) v.src = v.dataset.src; var pr = v.play && v.play(); pr && pr.catch && pr.catch(function () {}); }
        else if (v.pause) v.pause();
      });
    });
    clearInterval(bankTimer);
    if (m === 2) {
      var cls = $$(".dp-bank .cl", ph), k = 0;
      var tick = function () { cls.forEach(function (c, i) { c.classList.toggle("on", i === k); }); k = (k + 1) % cls.length; };
      tick(); bankTimer = setInterval(tick, 1400);
    }
  }
  function reelProgress() {
    var v = $('#dp-phones .dp-mode[data-m="0"] video'), bar = $("#dp-phones .dp-prog i");
    if (v && bar && v.duration) bar.style.width = (v.currentTime / v.duration * 100) + "%";
    W.requestAnimationFrame(reelProgress);
  }

  /* ---------- tira de fotos: se mueve sola, se arrastra y se abre en grande ---------- */
  function strip() {
    var st = $(".dp-strip"); if (!st || st.dataset.dp) return; st.dataset.dp = 1;
    var hold = 0, last = 0, pos = st.scrollLeft;
    var pause = function () { hold = Date.now() + 2600; };
    ["pointerdown", "touchstart", "wheel"].forEach(function (e) { st.addEventListener(e, pause, { passive: true }); });
    st.addEventListener("mouseenter", function () { hold = Infinity; });
    st.addEventListener("mouseleave", function () { hold = 0; });
    st.addEventListener("scroll", function () { if (Math.abs(st.scrollLeft - pos) > 2) { pause(); pos = st.scrollLeft; } }, { passive: true });
    // arrastrar con mouse en computadora
    var drag = null;
    st.addEventListener("mousedown", function (e) { drag = { x: e.clientX, l: st.scrollLeft, moved: false }; st.style.cursor = "grabbing"; e.preventDefault(); });
    W.addEventListener("mousemove", function (e) { if (!drag) return; var d = e.clientX - drag.x; if (Math.abs(d) > 4) drag.moved = true; st.scrollLeft = drag.l - d; });
    W.addEventListener("mouseup", function () { if (drag) { st.style.cursor = ""; setTimeout(function () { drag = null; }, 0); } });
    st.addEventListener("click", function (e) {
      if (drag && drag.moved) return;
      var f = e.target.closest("figure"); if (!f) return;
      var src = $("img", f).getAttribute("data-full") || $("img", f).getAttribute("src"), btn = null;
      $$("#galx .gi").forEach(function (g) { var im = $("img", g); if (!btn && im && im.getAttribute("src") === src) btn = g; });
      if (btn) btn.click();
    });
    function loop(ts) {
      var dt = last ? Math.min(64, ts - last) : 16; last = ts;
      if (on() && !reduced() && Date.now() > hold) {
        var half = st.scrollWidth / 2;
        st.scrollLeft += dt * 0.035; if (st.scrollLeft >= half) st.scrollLeft -= half;
        pos = st.scrollLeft;
      }
      W.requestAnimationFrame(loop);
    }
    W.requestAnimationFrame(loop);
  }

  /* ---------- menú del celular: flecha en vez de barra ---------- */
  function navMore() {
    var ns = $(".navstrip"); if (!ns) return; var sc = $(".wrap", ns);
    if (!$(".dp-navmore", ns)) {
      var b = D.createElement("button"); b.type = "button"; b.className = "dp-navmore"; b.setAttribute("aria-label", "Más opciones"); b.textContent = "›";
      b.addEventListener("click", function () { var end = ns.classList.contains("dp-end"); sc.scrollTo({ left: end ? 0 : sc.scrollWidth, behavior: "smooth" }); });
      ns.appendChild(b);
      sc.addEventListener("scroll", upd, { passive: true });
      if (!reduced()) ns.classList.add("dp-nudge");
    }
    function upd() { var more = sc.scrollWidth > sc.clientWidth + 4; ns.classList.toggle("dp-more", more); ns.classList.toggle("dp-end", more && sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 6); }
    upd();
  }


  /* ---------- visor de fotos y videos en vidrio ---------- */
  var VIDS = { "hero-dron2-poster.webp": "assets/hero-dron2-1080p60.mp4", "op-marina-poster.webp": "assets/op-marina.mp4", "hero-dron2-cel-poster.webp": "assets/hero-dron2-cel.mp4" };
  function viewer() {
    $$("dialog.lb").forEach(function (lb) {
      if (lb.dataset.dp) return; lb.dataset.dp = 1;
      var img = $("img", lb); if (!img) return;
      var sw = D.createElement("div"); sw.className = "dp-stagewrap";
      img.parentNode.insertBefore(sw, img); sw.appendChild(img);
      var v = D.createElement("video"); v.className = "dp-lbv"; v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute("playsinline", ""); v.controls = false; sw.appendChild(v);
      var top = D.createElement("div"); top.className = "dp-lbtop"; top.setAttribute("aria-hidden", "true");
      top.innerHTML = '<span class="mark" style="--w:16px"><i class="a"></i><i class="b"></i></span>Sestra Creative'; lb.appendChild(top);
      var rail = D.createElement("div"); rail.className = "dp-rail"; lb.appendChild(rail);
      var cur = -1, total = 0, railFor = 0;
      function idx() { var n = $(".lb-cap-n", lb); if (!n) return [0, 1]; var m = n.textContent.match(/(\d+)\s*\/\s*(\d+)/); return m ? [+m[1] - 1, +m[2]] : [0, 1]; }
      function sync() {
        if (!lb.open) { v.pause(); cur = -1; return; }
        var r = idx(), i = r[0]; total = r[1];
        // video si la imagen es la portada de un video
        var key = (img.getAttribute("src") || "").split("/").pop().split("?")[0];
        if (VIDS[key]) { lb.classList.add("dp-isvid"); if (v.getAttribute("src") !== VIDS[key]) { v.src = VIDS[key]; v.poster = img.src; } var pr = v.play(); pr && pr.catch && pr.catch(function () {}); }
        else { lb.classList.remove("dp-isvid"); v.pause(); }
        // animación al cambiar
        var el = lb.classList.contains("dp-isvid") ? v : img;
        el.style.setProperty("--dx", cur < 0 ? "0px" : ((i > cur && !(cur === 0 && i === total - 1)) || (cur === total - 1 && i === 0) ? "40px" : "-40px"));
        el.classList.remove("dp-swap"); void el.offsetWidth; el.classList.add("dp-swap");
        cur = i;
        // miniaturas: solo cuando se abre el portafolio completo
        var gal = $$("#galx .gi img");
        if (total > 1 && total === gal.length) {
          if (railFor !== total) {
            rail.innerHTML = gal.map(function (g, k) { return '<button type="button" data-k="' + k + '" aria-label="' + (k + 1) + '"><img src="' + g.getAttribute("src").replace(/^img\/(gal[A-S])\.webp$/, "img/sm/$1.webp") + '" alt="" loading="lazy"></button>'; }).join("");
            railFor = total;
            $$("button", rail).forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); go(+b.dataset.k); }); });
          }
          rail.hidden = false;
          $$("button", rail).forEach(function (b, k) { b.classList.toggle("on", k === i); });
          var on1 = $("button.on", rail); if (on1) rail.scrollTo({ left: on1.offsetLeft - rail.clientWidth / 2 + on1.clientWidth / 2, behavior: "smooth" });
        } else { rail.hidden = true; }
      }
      function go(k) { var i = idx()[0], d = k - i, btn = $(d > 0 ? ".lb-n" : ".lb-p", lb); for (var j = 0; j < Math.abs(d); j++) btn.click(); }
      new MutationObserver(sync).observe(img, { attributes: true, attributeFilter: ["src"] });
      new MutationObserver(sync).observe(lb, { attributes: true, attributeFilter: ["open"] });
      lb.addEventListener("close", function () { v.pause(); cur = -1; });
      // tocar fuera de la foto también cierra
      lb.addEventListener("click", function (e) { if (e.target === sw || e.target === lb) { lb.close ? lb.close() : lb.removeAttribute("open"); } });
    });
  }


  /* ---------- CELULAR: carruseles, plegables y "leer más" ---------- */
  var MT = {
    es: { more: "Leer más", less: "Ver menos", faqAll: "Ver todas las preguntas", faqLess: "Ver menos preguntas", opts: "opciones", added: "agregado", addedN: "agregados", inc: "Toca para ver qué incluye" , sum: "Ver detalle" },
    en: { more: "Read more", less: "Show less", faqAll: "See all questions", faqLess: "Show fewer questions", opts: "options", added: "added", addedN: "added", inc: "Tap to see what's included", sum: "See details" }
  };
  var mt = function () { return MT[lang()]; };
  var small = function () { return W.matchMedia("(max-width:640px)").matches; };

  function carousel(box, hintOnce) {
    if (!box) return;
    box.classList.add("dp-car");
    var dots = box.nextElementSibling && box.nextElementSibling.classList.contains("dp-dots") ? box.nextElementSibling : null;
    if (!dots) { dots = D.createElement("div"); dots.className = "dp-dots"; box.parentNode.insertBefore(dots, box.nextSibling); }
    function items() { return Array.prototype.filter.call(box.children, function (c) { return c.offsetParent !== null || !small(); }); }
    function draw() {
      var it = items(); if (it.length < 2) { dots.innerHTML = ""; return; }
      it.forEach(function (c) { c.classList.add("dp-in"); });
      dots.innerHTML = it.map(function (_, i) { return '<button type="button" aria-label="' + (i + 1) + '"></button>'; }).join("") + '<span class="n"></span>';
      $$("button", dots).forEach(function (b, i) { b.addEventListener("click", function () { var c = items()[i]; box.scrollTo({ left: c.offsetLeft - (box.clientWidth - c.clientWidth) / 2, behavior: "smooth" }); }); });
      upd();
    }
    function upd() {
      var it = items(), mid = box.scrollLeft + box.clientWidth / 2, k = 0, best = 1e9;
      it.forEach(function (c, i) { var d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid); if (d < best) { best = d; k = i; } });
      $$("button", dots).forEach(function (b, i) { b.classList.toggle("on", i === k); });
      var n = $(".n", dots); if (n) n.textContent = (k + 1) + " / " + it.length;
    }
    box.addEventListener("scroll", function () { W.requestAnimationFrame(upd); }, { passive: true });
    if ("MutationObserver" in W) new MutationObserver(function (m) {
      if (!box.classList.contains("dp-car")) box.classList.add("dp-car");
      if (m.some(function (x) { return x.type === "childList"; })) setTimeout(function () { draw(); box.scrollLeft = 0; var o = $(".on", box); if (o && small()) box.scrollLeft = o.offsetLeft - (box.clientWidth - o.clientWidth) / 2; }, 30);
    }).observe(box, { childList: true, attributes: true, attributeFilter: ["class"] });
    draw();
    if (hintOnce && "IntersectionObserver" in W && !reduced()) {
      var io2 = new IntersectionObserver(function (es) { if (es[0].isIntersecting && small()) { box.classList.add("dp-hint"); io2.disconnect(); } }, { threshold: 0.6 });
      io2.observe(box);
    }
    return { draw: draw, box: box };
  }

  function collapsible(wrap, toggleQ, bodiesQ, startOpen, summaryFn) {
    // toggleQ / bodiesQ: funciones que devuelven los elementos actuales (el sitio a veces los vuelve a dibujar)
    if (!wrap) return;
    var isOpen = !!startOpen, sm = null;
    function apply() {
      var toggle = toggleQ(); if (!toggle) return null;
      wrap.classList.add("dp-coll"); wrap.classList.toggle("dp-closed", !isOpen);
      toggle.classList.add("dp-tg"); toggle.setAttribute("role", "button"); toggle.setAttribute("tabindex", "0"); toggle.setAttribute("aria-expanded", String(isOpen));
      bodiesQ().forEach(function (b) { if (b) b.classList.add("dp-cbody"); });
      if (!$(".dp-toggle-i", toggle)) {
        var ic = D.createElement("span"); ic.className = "dp-toggle-i"; ic.setAttribute("aria-hidden", "true"); ic.textContent = "⌄"; toggle.appendChild(ic);
        if (summaryFn) { sm = D.createElement("span"); sm.className = "dp-sumtxt"; toggle.insertBefore(sm, ic); }
      }
      upd(); return toggle;
    }
    function set(open) { isOpen = open; apply(); }
    function upd() { if (sm && summaryFn) sm.textContent = summaryFn(); }
    wrap.addEventListener("click", function (e) { var t = e.target.closest(".dp-tg"); if (!t || !wrap.contains(t) || !small()) return; e.preventDefault(); set(!isOpen); });
    wrap.addEventListener("keydown", function (e) { var t = e.target.closest(".dp-tg"); if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); set(!isOpen); } });
    var busy = false;
    if ("MutationObserver" in W) new MutationObserver(function () { if (busy) return; busy = true; W.requestAnimationFrame(function () { apply(); busy = false; }); })
      .observe(wrap, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    apply();
    return { upd: upd, set: set };
  }

  function clampMore(p) {
    if (!p || p.dataset.dpClamp) return; p.dataset.dpClamp = 1; p.classList.add("dp-clamp");
    var b = D.createElement("button"); b.type = "button"; b.className = "dp-morebtn"; b.textContent = mt().more + " ⌄";
    p.parentNode.insertBefore(b, p.nextSibling);
    function fit() { var need = small() && p.classList.contains("dp-clamp") && p.scrollHeight > p.clientHeight + 4; b.hidden = !(need || !p.classList.contains("dp-clamp")) || !small(); }
    b.addEventListener("click", function () { var open = p.classList.toggle("dp-clamp"); b.textContent = open ? mt().more + " ⌄" : mt().less + " ⌃"; fit(); });
    p._dpFit = fit; setTimeout(fit, 100);
  }

  var colls = [];
  function mobile() {
    if (H.dataset.dpMob) return; H.dataset.dpMob = 1;
    // carruseles
    carousel($("#quotes"), true);
    carousel($("#plans"), true);
    carousel($("#process"), false);
    carousel($("#pkgs"), true);
    // paquete elegido al centro
    var pk = $("#pkgs"); if (pk) setTimeout(function () { var on1 = $(".opt.on", pk); if (on1 && small()) pk.scrollLeft = on1.offsetLeft - (pk.clientWidth - on1.clientWidth) / 2; }, 400);
    // plegables
    var inc = $("#pk-inc"); if (inc) collapsible(inc, function () { return $(".lbl", inc); }, function () { return [$("ul", inc)]; }, false, function () { return lang() === "en" ? "Delivery in 1–3 business days · travel · VAT · files" : "Entrega en 1–3 días hábiles · traslado · IVA · archivos"; });
    [["#extras", "#xv-lbl"], ["#extras2", "#xd-lbl"]].forEach(function (q) {
      var list = $(q[0]); if (!list) return; var field = list.closest(".field"), lab = $(q[1]);
      var note = $(".small", field);
      var c = collapsible(field, function () { return $(q[1]); }, function () { return [$(q[0]), note && note !== lab ? note : null]; }, false, function () {
        var L2 = $(q[0]) || list, n = $$(".xrow", L2).length, on = $$(".xrow.on, .xrow:has(input:checked)", L2).length;
        return "· " + n + " " + mt().opts + (on ? " · " + on + " " + (on > 1 ? mt().addedN : mt().added) : "");
      });
      if (c) { colls.push(c); field.addEventListener("change", function () { setTimeout(c.upd, 30); }); }
    });
    var sum = $("aside#sum");
    if (sum) collapsible(sum, function () { return $(":scope > h3", sum); }, function () { var h3 = $(":scope > h3", sum); return Array.prototype.filter.call(sum.children, function (c) { return c !== h3 && !c.classList.contains("tot"); }); }, false);
    // leer más
    // preguntas: primero 6
    var fq = $("#faqs");
    if (fq && $$("details", fq).length > 6) {
      fq.classList.add("dp-few");
      var b = D.createElement("button"); b.type = "button"; b.className = "dp-morebtn"; b.style.marginTop = "6px";
      var fqText = function () { b.textContent = fq.classList.contains("dp-few") ? mt().faqAll + " (" + $$("details", fq).length + ") ⌄" : mt().faqLess + " ⌃"; };
      b.addEventListener("click", function () { fq.classList.toggle("dp-few"); fqText(); });
      fq.parentNode.insertBefore(b, fq.nextSibling); b._txt = fqText; fqText();
    }
    W.addEventListener("resize", function () { $$("[data-dp-clamp]").forEach(function (p) { p._dpFit && p._dpFit(); }); });
  }
  function mobileText() {
    $$("[data-dp-clamp]").forEach(function (p) { var b = p.nextElementSibling; if (b && b.classList.contains("dp-morebtn")) b.textContent = p.classList.contains("dp-clamp") ? mt().more + " ⌄" : mt().less + " ⌃"; p._dpFit && p._dpFit(); });
    $$(".dp-morebtn").forEach(function (b) { b._txt && b._txt(); });
    colls.forEach(function (c) { c.upd(); });
  }

  /* ---------- dónde estoy: sección activa y progreso ---------- */
  var NAVMAP = { "#servicios": ["#servicios", "#dp-phones", "#detalles"], "#portafolio": ["#portafolio", "#antes-despues", "#dp-stats", "#testimonios", "#nosotros"], "#paquetes": ["#proceso", "#paquetes"], "#planes": ["#operadores"], "#faq": ["#faq", "#contacto"] };
  function spy() {
    var top = $(".top"); if (!top) return;
    if (!$(".dp-prog-top", top)) { var pb = D.createElement("div"); pb.className = "dp-prog-top dp-only"; pb.innerHTML = "<i></i>"; top.appendChild(pb); }
    var max = D.documentElement.scrollHeight - W.innerHeight; top.style.setProperty("--pp", max > 0 ? (W.scrollY / max).toFixed(4) : 0);
    var probe = W.innerHeight * 0.4, act = null;
    Object.keys(NAVMAP).forEach(function (k) { NAVMAP[k].forEach(function (q) { var e = $(q); if (!e || !e.offsetHeight) return; var r = e.getBoundingClientRect(); if (r.top <= probe && r.bottom > probe) act = k; }); });
    $$('.nav a, .navstrip a').forEach(function (a) {
      var on1 = a.getAttribute("href") === act; if (a.classList.contains("dp-act") === on1) return; a.classList.toggle("dp-act", on1);
      if (on1 && a.closest(".navstrip")) { var sc = a.closest(".wrap"); if (sc) sc.scrollTo({ left: a.offsetLeft - 20, behavior: "smooth" }); }
    });
  }

  function placeFloat() {
    var mfp = $("figure.mf-pic"), f = $(".dp-float"), g = $(".mf-grid");
    if (!mfp || !f || !g) return;
    var r = mfp.getBoundingClientRect(), gr = g.getBoundingClientRect();
    f.style.left = (r.left - gr.left - r.width * 0.16) + "px";
    f.style.top = (r.top - gr.top + r.height * 0.52) + "px";
    f.style.width = (r.width * 0.38) + "px";
  }

  /* ---------- aparición con scroll ---------- */
  var io;
  function observe() {
    if (!("IntersectionObserver" in W)) { $$(".dp-rv,.dp-up,.ft-word").forEach(function (e) { e.classList.add("dp-in"); }); return; }
    if (!io) io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; el.classList.add("dp-in"); io.unobserve(el);
        if (el.classList.contains("dp-stat")) count(el);
        if (el.id === "ad-ba") sweep(el);
        if (el.tagName === "VIDEO" && el.dataset.src && !el.src) { el.src = el.dataset.src; el.play && el.play().catch(function () {}); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    $$("#galx .gi").forEach(function (g, i) { if (g.offsetParent && !g.dataset.dp) { g.dataset.dp = 1; g.classList.add("dp-rv"); g.style.setProperty("--d", ((i % 4) * 0.08) + "s"); io.observe(g); } });
    $$("figure.quote, .ab-copy, .ab-people .person, article.plan, a.need, .sec-head, .dp-up").forEach(function (g, i) {
      if (g.dataset.dp) return; g.dataset.dp = 1; if (!g.classList.contains("dp-up")) { g.classList.add("dp-up"); g.style.setProperty("--d", ((i % 3) * 0.1) + "s"); } io.observe(g);
    });
    var ba = $("#ad-ba"); if (ba && !ba.dataset.dp) { ba.dataset.dp = 1; io.observe(ba); }
    var fw = $("footer .ft-word"); if (fw && !fw.dataset.dpo) { fw.dataset.dpo = 1; io.observe(fw); }
    
  }

  // los números cuentan desde 0
  function count(el) {
    var b = $("b", el), raw = b.dataset.n, em = $("em", b), tail = em ? em.outerHTML : "";
    if (reduced() || !/^\d+$/.test(raw)) return;
    var end = +raw, t0 = null;
    function step(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 1400), e = 1 - Math.pow(1 - k, 3);
      b.innerHTML = Math.round(end * e) + tail; if (k < 1) W.requestAnimationFrame(step); }
    W.requestAnimationFrame(step);
  }

  // el comparador se mueve solo una vez para que se note que se puede deslizar
  function sweep(box) {
    var r = $('input[type="range"]', box); if (!r || reduced()) return;
    var keys = [[0, 50], [700, 22], [1500, 78], [2200, 50]], t0 = null;
    function val(ms) { for (var i = 1; i < keys.length; i++) if (ms <= keys[i][0]) { var a = keys[i - 1], b = keys[i], k = (ms - a[0]) / (b[0] - a[0]); k = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; return a[1] + (b[1] - a[1]) * k; } return 50; }
    function step(ts) { if (!t0) t0 = ts; var ms = ts - t0; r.value = val(ms); r.dispatchEvent(new Event("input", { bubbles: true }));
      if (ms < 2200) W.requestAnimationFrame(step); }
    setTimeout(function () { W.requestAnimationFrame(step); }, 300);
  }

  /* ---------- scroll: menú, parallax, línea del proceso ---------- */
  var ticking = false;
  function frame() {
    ticking = false;
    var y = W.scrollY, vh = W.innerHeight, top = $(".top");
    if (top) top.classList.toggle("dp-clear", on() && y < 40);
    if (on()) spy();
    if (!on() || reduced()) { clearPar(); return; }
    $$("[data-par]").forEach(function (el) {
      var r = el.getBoundingClientRect(); if (r.bottom < -200 || r.top > vh + 200) return;
      var c = (r.top + r.height / 2 - vh / 2), s = +el.getAttribute("data-par");
      var base = el.classList.contains("l") ? "translateX(-70%) rotate(-9deg) " : el.classList.contains("r") ? "translateX(70%) rotate(9deg) " : "";
      el.style.transform = base + "translate3d(0," + (c * s) + "px,0)";
    });
    [["figure.mf-pic img", 0.08], ["figure.ct-pic img", 0.08], ["figure.op-pics video", 0.06]].forEach(function (p) {
      var el = $(p[0]); if (!el) return; var r = el.parentNode.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return;
      el.style.transform = "translate3d(0," + ((r.top + r.height / 2 - vh / 2) * -p[1]) + "px,0) scale(1.14)";
    });
    var pr = $("#process");
    if (pr) {
      var r2 = pr.getBoundingClientRect(), p = Math.min(1, Math.max(0, (vh * 0.85 - r2.top) / (vh * 0.5)));
      pr.style.setProperty("--p", p.toFixed(3));
      $$("li", pr).forEach(function (li, i, a) { li.classList.toggle("dp-on", p >= (i / a.length) + 0.02 || p === 1); });
    }
  }
  function clearPar() {
    $$("[data-par], figure.mf-pic img, figure.ct-pic img, figure.op-pics video").forEach(function (el) { el.style.transform = ""; });
  }
  function req() { if (!ticking) { ticking = true; W.requestAnimationFrame(frame); } }

  /* ---------- panel de comparación ---------- */
  function panel() {
    var p = D.createElement("div"); p.className = "dp-panel";
    p.innerHTML = '<button class="min" type="button" aria-label="Minimizar">–</button><span class="ttl">✦ <small></small></span>' +
      '<label><span class="a"></span><input type="checkbox" id="dp-t1" checked></label>' +
      '';
    D.body.appendChild(p);
    if (W.innerWidth < 700) p.classList.add("mini");
    $("#dp-t1").addEventListener("change", function (e) { H.classList.toggle("dp", e.target.checked); clearPar(); placeFloat(); req(); equalize(); });
    $(".min", p).addEventListener("click", function () { p.classList.toggle("mini"); });
    panelText();
  }
  function panelText() {
    var p = $(".dp-panel"); if (!p) return; var x = t();
    $(".ttl small", p).textContent = x.pnl; $("label .a", p).textContent = x.p1; 
  }

  // espacio que se comen las hojas: se lo devolvemos a la sección de antes
  // orden: qué hacemos antes que las pruebas; equipo antes del precio
  function reorder() {
    var main = $("main"); if (!main || main.dataset.dpOrder) return; main.dataset.dpOrder = 1;
    var order = ["#inicio", "#necesitas", ".manifesto", "#dp-marq", "#servicios", "#dp-phones", "#detalles", "#portafolio", "#antes-despues", "#dp-stats", "#testimonios", "#nosotros", "#proceso", "#paquetes", "#planes", "#operadores", "#faq", "#contacto"];
    var els = order.map(function (q) { return main.querySelector(":scope > " + q); }).filter(Boolean);
    var rest = Array.prototype.filter.call(main.children, function (c) { return els.indexOf(c) < 0; });
    els.concat(rest).forEach(function (e) { main.appendChild(e); });
  }
  var SHEETS = [".manifesto", "#antes-despues", "#proceso", "#faq", "#contacto", "#testimonios", "#nosotros", "#portafolio", "#operadores", "#dp-phones"];
  function spacers() {
    $$(".dp-spacer").forEach(function (e) { e.remove(); });
    SHEETS.forEach(function (sel) {
      var el = $(sel); if (!el) return; var prev = el.previousElementSibling;
      while (prev && (prev.offsetHeight === 0 || getComputedStyle(prev).display === "none")) prev = prev.previousElementSibling;
      if (!prev || prev.id === "servicios") return;
      var sp = D.createElement("div"); sp.className = "dp-spacer dp-only"; sp.setAttribute("aria-hidden", "true"); prev.appendChild(sp);
    });
  }
  // mismo aire arriba y abajo en cada sección
  var EQ = [".manifesto", "#portafolio", "#antes-despues", "#dp-stats", "#testimonios", "#dp-phones", "#detalles", "#proceso", "#paquetes", "#operadores", "#faq", "#contacto"];
  function equalize() {
    var secs = EQ.map(function (q) { return $(q); }).filter(function (e) { return e && e.offsetHeight; });
    secs.forEach(function (s) { s.style.paddingTop = s.style.paddingBottom = ""; });
    if (!on()) return;
    H.classList.add("dp-measure");
    var all = $$("main > section, main > .dp-only").filter(function (e) { return e.offsetHeight > 0; });
    var res = secs.map(function (s) {
      var r = s.getBoundingClientRect(), i = all.indexOf(s), nx = all[i + 1], nTop = nx ? nx.getBoundingClientRect().top : r.bottom;
      var top = Infinity, bot = -Infinity;
      (function walk(e) {
        Array.prototype.forEach.call(e.children, function (c) {
          if (c.classList.contains("dp-spacer") || c.hidden || !c.offsetHeight) return;
          var cs = getComputedStyle(c);
          if (c.classList.contains("wrap") || (c.tagName === "DIV" && c.children.length && cs.backgroundColor === "rgba(0, 0, 0, 0)" && cs.borderTopWidth === "0px" && !c.querySelector(":scope>img"))) walk(c);
          else { var b = c.getBoundingClientRect(); top = Math.min(top, b.top); bot = Math.max(bot, b.bottom); }
        });
      })(s);
      return { s: s, t: top - r.top, b: nTop - bot };
    });
    H.classList.remove("dp-measure");
    res.forEach(function (x) {
      if (!isFinite(x.t) || !isFinite(x.b) || Math.abs(x.t - x.b) < 6) return;
      var target = Math.max(32, Math.round((x.t + x.b) / 2)), cs = getComputedStyle(x.s);
      x.s.style.paddingTop = Math.max(0, parseFloat(cs.paddingTop) + target - x.t) + "px";
      x.s.style.paddingBottom = Math.max(0, parseFloat(cs.paddingBottom) + target - x.b) + "px";
    });
  }
  // todo lo que abre WhatsApp se ve verde WhatsApp, con su logo
  function waLook() {
    $$("a.btn, button.btn").forEach(function (b) {
      var href = b.getAttribute("href") || "";
      if (/wa\.me|whatsapp/i.test(href) || /whatsapp/i.test(b.textContent) || b.dataset.wa) b.classList.add("dp-wa");
    });
  }
  function hdr() { var t = $(".top"); if (t && on()) H.style.setProperty("--hdr", t.offsetHeight + "px"); }
  function init() {
    H.classList.add("dp"); H.classList.add("dp-pill");
    build(); placeFloat(); frame(); strip(); navMore(); reelProgress(); viewer(); reorder(); mobile(); spacers(); hdr(); waLook(); setTimeout(equalize, 300); setTimeout(equalize, 1800);
    W.addEventListener("scroll", req, { passive: true });
    var eqT; W.addEventListener("resize", function () { placeFloat(); navMore(); hdr(); req(); clearTimeout(eqT); eqT = setTimeout(equalize, 250); });
    // al cambiar idioma, rehacer textos propios
    $$(".lang button").forEach(function (b) { b.addEventListener("click", function () { setTimeout(function () { build(); strip(); mobileText(); waLook(); }, 60); }); });
    // la galería y otras piezas se arman con JS del sitio: volver a observar cuando cambian
    var g = $("#galx"); if (g && "MutationObserver" in W) new MutationObserver(function () { observe(); }).observe(g, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style", "hidden"] });
    $("#gal-more") && $("#gal-more").addEventListener("click", function () { setTimeout(observe, 80); });
    setTimeout(placeFloat, 800);
  }
  if (D.readyState === "complete") setTimeout(init, 50); else W.addEventListener("load", function () { setTimeout(init, 50); });
})();
