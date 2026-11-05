/* Sestra Creative · parche 21: portafolio unido (galería con "ver más"), antes y después centrado (interiores/exteriores,
   con versión sin editar cuando exista), testimonios en su sección, carrusel interactivo, fotos en paquetes y en varias propiedades.
   Independiente del script principal: solo lee CONFIG, PHOTOS e I18N (globales) y el atributo lang de <html>. */
(function () {
  var D = document, H = D.documentElement, W = window;
  var IMG = "img/";
  var PH = W.PHOTOS || {};
  function L() { return H.lang === "en" ? "en" : "es"; }
  function $(id) { return D.getElementById(id); }
  function mk(tag, cls, html) { var e = D.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
  function safe(fn) { try { fn(); } catch (e) { if (W.console) console.error("site2", e); } }

  /* ---------- textos ---------- */
  var T = {
    es: {
      more: "Ver todas las fotos", less: "Ver menos fotos",
      adK: "Antes y después", adT: "Del HDR al estilo revista.",
      adL: "Desliza sobre la foto para comparar. Algunas incluyen también la versión original.",
      gIn: "Interiores", gEx: "Exteriores", pick: "Elegir foto",
      raw: "Original", hdr: "HDR", mag: "Estilo revista", only: "Ver solo", vs: "vs", cmpTo: "Versión de la izquierda",
      slider: "Mover el divisor", tmK: "Testimonios", tmT: "Lo que dicen nuestros clientes.",
      open: "Ver en grande", close: "Cerrar", prev: "Foto anterior", next: "Foto siguiente",
      bPrev: "Fotos anteriores", bNext: "Más fotos", bandL: "Detalles con estilo revista",
      mfAlt: "Sala con ventanales frente al mar, luz de atardecer",
      opAlt: ["Vista aérea de una casa de tejas entre los árboles", "Vista aérea de una piscina y su jardín"],
      opSoon: "<b>Próximamente:</b> galerías de stock y bancos de clips listos para tus anuncios y redes.",
      opH3: "¿Prefieres una propuesta a tu medida?",
      mf: "Para un administrador, las fotos venden dos veces: a los huéspedes que reservan y a los dueños que te confían su propiedad. Por eso las hacemos con <em>luz real y cada espacio en orden</em>, con entrega en 1 a 3 días hábiles.",
      proof: "Según Airbnb, los anuncios con fotos profesionales reciben en promedio 19 % más reservas.", proofSrc: "Fuente: Airbnb, 2025",
      needK: "¿Qué necesitas?",
      need: [["Administro alquileres vacacionales", "Contenido constante para todas tus unidades, con precio por volumen.", "#operadores"],
             ["Tengo un hotel", "Fotos, drone y contenido para temporada y promociones.", "#operadores"],
             ["Soy agente inmobiliario", "Fotos y drone para tu listado, con entrega en 1 a 3 días hábiles.", "#paquetes"],
             ["Tengo una propiedad", "Elige tu paquete, mira el total y reserva la fecha.", "#paquetes"]],
      abK: "Quiénes somos", abT: "Somos Cris y Domi.",
      abP: "Sestra Creative nace en Tamarindo de dos personas que se complementan: uno detrás de la cámara y la otra al lado del cliente. Trabajamos juntos cada sesión, de la primera conversación a la entrega.",
      abCris: "Fotografía, drone y edición. Ha fotografiado más de 50 propiedades en Guanacaste.",
      abDomi: "Clientes, redes y contenido. Tu contacto desde la primera conversación hasta la entrega.",
      abPromise: ["Entrega en 1 a 3 días hábiles", "Fotos propias, tomadas por nosotros", "Precios claros, IVA aparte"],
      abWa: "Escribirnos por WhatsApp", abMsg: "Hola Cris y Domi, vi la página de Sestra Creative y quiero información.",
      sample: "¿No sabes qué paquete elegir? Pídenos ejemplos de una propiedad como la tuya", sampleMsg: "Hola, ¿me pueden enviar ejemplos de fotos de una propiedad parecida a la mía? Es: ",
      incT: "Ver qué incluye cada paquete", incFor: "Para", incPh: "Fotos editadas", incDl: "Entrega",
      incCommon: [["Edición", "HDR incluida. El estilo revista se agrega como extra."], ["Formato", "Alta resolución y versión liviana para web, en un enlace de Google Drive."], ["Drone", "Opcional: se agrega en el paso 2."], ["Clima", "Si el clima no ayuda, reprogramamos la sesión."]],
      priv: "Ver aviso de privacidad", privT: "Aviso de privacidad",
      privB: ["<b>Responsables:</b> Cristofer Segura y Dominique Estrada (Sestra Creative), Tamarindo, Guanacaste, Costa Rica.",
              "<b>Qué datos pedimos:</b> nombre, WhatsApp o teléfono y propiedad o ubicación (obligatorios); empresa, correo y notas (opcionales). Sin los obligatorios no podemos responder tu solicitud.",
              "<b>Para qué:</b> responder tu solicitud, coordinar la sesión, cotizar y facturar. No vendemos ni compartimos tus datos con terceros para publicidad.",
              "<b>Dónde se guardan:</b> en una hoja de cálculo de Google y en conversaciones de WhatsApp (Google y Meta actúan como proveedores). Si hay factura, los datos necesarios se reportan a Hacienda.",
              "<b>Cuánto tiempo:</b> mientras dure la relación y lo que exija la ley tributaria.",
              "<b>Tus derechos:</b> puedes pedir acceso, corrección o eliminación de tus datos (Ley 8968) escribiéndonos por WhatsApp. Respondemos en un máximo de 5 días hábiles."],
      privClose: "Cerrar"
    },
    en: {
      more: "See all photos", less: "Show fewer photos",
      adK: "Before and after", adT: "From HDR to the magazine look.",
      adL: "Drag across the photo to compare. Some also include the original version.",
      gIn: "Interiors", gEx: "Exteriors", pick: "Choose photo",
      raw: "Original", hdr: "HDR", mag: "Magazine style", only: "Show only", vs: "vs", cmpTo: "Left-hand version",
      slider: "Move the divider", tmK: "Testimonials", tmT: "What our clients say.",
      open: "View larger", close: "Close", prev: "Previous photo", next: "Next photo",
      bPrev: "Previous photos", bNext: "More photos", bandL: "Magazine-style details",
      mfAlt: "Living room with floor-to-ceiling windows facing the ocean, sunset light",
      opAlt: ["Aerial view of a tile-roof house among the trees", "Aerial view of a pool and garden"],
      opSoon: "<b>Coming soon:</b> stock galleries and clip banks ready for your listings and social media.",
      opH3: "Prefer a tailored proposal?",
      mf: "For a property manager, photos sell twice: to the guests who book and to the owners who trust you with their homes. That's why we shoot with <em>real light and every space in order</em>, with delivery in 1 to 3 business days.",
      proof: "According to Airbnb, listings with professional photos get 19% more bookings on average.", proofSrc: "Source: Airbnb, 2025",
      needK: "What do you need?",
      need: [["I manage vacation rentals", "Steady content for all your units, with volume pricing.", "#operadores"],
             ["I run a hotel", "Photos, drone and content for the season and promotions.", "#operadores"],
             ["I'm a real estate agent", "Photos and drone for your listing, delivered in 1 to 3 business days.", "#paquetes"],
             ["I own a property", "Pick your package, see the total and book the date.", "#paquetes"]],
      abK: "About us", abT: "We are Cris and Domi.",
      abP: "Sestra Creative was born in Tamarindo from two people who complement each other: one behind the camera, the other by the client's side. We work every session together, from the first conversation to delivery.",
      abCris: "Photography, drone and editing. Has photographed more than 50 properties in Guanacaste.",
      abDomi: "Clients, social media and content. Your contact from the first conversation to delivery.",
      abPromise: ["Delivery in 1 to 3 business days", "Our own photos, taken by us", "Clear prices, VAT shown separately"],
      abWa: "Message us on WhatsApp", abMsg: "Hi Cris and Domi, I saw the Sestra Creative website and I'd like more information.",
      sample: "Not sure which package? Ask us for examples of a property like yours", sampleMsg: "Hi, could you send me example photos of a property similar to mine? It is: ",
      incT: "See what each package includes", incFor: "For", incPh: "Edited photos", incDl: "Delivery",
      incCommon: [["Editing", "HDR included. Magazine style can be added as an extra."], ["Format", "High resolution and a lighter web version, in a Google Drive link."], ["Drone", "Optional: add it in step 2."], ["Weather", "If the weather doesn't help, we reschedule the session."]],
      priv: "See privacy notice", privT: "Privacy notice",
      privB: ["<b>Responsible:</b> Cristofer Segura and Dominique Estrada (Sestra Creative), Tamarindo, Guanacaste, Costa Rica.",
              "<b>What we ask for:</b> name, WhatsApp or phone and property or location (required); company, email and notes (optional). Without the required details we can't answer your request.",
              "<b>Why:</b> to answer your request, schedule the session, quote and invoice. We don't sell or share your data with third parties for advertising.",
              "<b>Where it's kept:</b> in a Google spreadsheet and in WhatsApp conversations (Google and Meta act as providers). If we invoice, the required details are reported to the tax authority (Hacienda).",
              "<b>How long:</b> for as long as we work together and as required by tax law.",
              "<b>Your rights:</b> you can ask to access, correct or delete your data (Costa Rica Law 8968) by messaging us on WhatsApp. We reply within 5 business days."],
      privClose: "Close"
    }
  };
  /* textos del script principal que cambian */
  var OVR = {
    "nav.work": { es: "Portafolio", en: "Portfolio" },
    "wk.k": { es: "Portafolio", en: "Portfolio" },
    "ba.l0": { es: "Original", en: "Original" },
    "ba.t1": { es: "Original → Estándar", en: "Original → Standard" },
    "ba.pending": { es: "Pendiente: la misma foto original, estándar y estilo revista", en: "Pending: the same photo original, standard and magazine style" },
    "hero.cta1": { es: "Reservar sesión", en: "Book a session" },
    "ct.book": { es: "Reservar sesión", en: "Book a session" },
    "pl.cta": { es: "Pedir propuesta sin compromiso", en: "Get a free proposal" },
    "hero.f2s": { es: "propiedades fotografiadas en Guanacaste", en: "properties photographed in Guanacaste" },
    "hero.f3b": { es: "Foto + drone + redes", en: "Photo + drone + social" },
    "hero.f3s": { es: "en una sola visita", en: "in a single visit" },
    "op.k": { es: "Planes y volumen", en: "Plans and volume" },
    "s4.consent": { es: "He leído el aviso de privacidad y autorizo a Sestra Creative a usar mis datos para responder mi solicitud y coordinar el servicio (Ley 8968).", en: "I have read the privacy notice and authorize Sestra Creative to use my details to answer my request and coordinate the service (Costa Rica Law 8968)." },
    "op.lead": { es: "Para operadores y hoteles: contenido constante con un plan mensual, o una propuesta por volumen para todas tus unidades.", en: "For operators and hotels: steady content with a monthly plan, or a volume proposal for all your units." },
    "wk.lead": { es: "Interiores, exteriores y drone en Guanacaste. Toca una foto para verla en grande.", en: "Interiors, exteriors and drone in Guanacaste. Tap a photo to see it larger." }
  };
  function applyOvr() {
    var l = L();
    Object.keys(OVR).forEach(function (k) {
      if (W.I18N) { if (W.I18N.es) W.I18N.es[k] = OVR[k].es; if (W.I18N.en) W.I18N.en[k] = OVR[k].en; }
      Array.prototype.forEach.call(D.querySelectorAll('[data-i18n="' + k + '"]'), function (e) { e.textContent = OVR[k][l]; });
    });
    Array.prototype.forEach.call(D.querySelectorAll("[data-plan]"), function (a) { a.textContent = OVR["pl.cta"][l]; });
  }

  /* ---------- visor de fotos (uno para todo) ---------- */
  var lb = mk("dialog", "lb"); lb.id = "lb2";
  lb.innerHTML = '<button class="lb-x" type="button">&times;</button><button class="lb-p" type="button">&lsaquo;</button><img alt=""><p></p><button class="lb-n" type="button">&rsaquo;</button>';
  D.body.appendChild(lb);
  var lbList = [], lbI = 0;
  function lbShow() {
    var l = L(), it = lbList[lbI], im = lb.querySelector("img"), cap = lb.querySelector("p");
    im.src = it.src; im.alt = it.alt[l];
    cap.textContent = it.alt[l];
    if (lbList.length > 1) { var n = mk("span", "lb-cap-n"); n.textContent = (lbI + 1) + " / " + lbList.length; cap.appendChild(n); }
    lb.querySelector(".lb-p").hidden = lb.querySelector(".lb-n").hidden = lbList.length < 2;
    lb.querySelector(".lb-x").setAttribute("aria-label", T[l].close); lb.querySelector(".lb-p").setAttribute("aria-label", T[l].prev); lb.querySelector(".lb-n").setAttribute("aria-label", T[l].next);
  }
  function lbOpen(list, i) { lbList = list; lbI = i; lbShow(); if (lb.showModal) lb.showModal(); else lb.setAttribute("open", ""); }
  function lbStep(k) { lbI = (lbI + k + lbList.length) % lbList.length; lbShow(); }
  function lbClose() { if (lb.close) lb.close(); else lb.removeAttribute("open"); }
  lb.querySelector(".lb-x").onclick = lbClose;
  lb.querySelector(".lb-p").onclick = function () { lbStep(-1); };
  lb.querySelector(".lb-n").onclick = function () { lbStep(1); };
  lb.addEventListener("click", function (e) { if (e.target === lb) lbClose(); });
  lb.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") lbStep(-1); if (e.key === "ArrowRight") lbStep(1); });
  (function () { var x0 = null; lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 45) lbStep(dx < 0 ? 1 : -1); }, { passive: true }); })();

  /* ---------- 1. portafolio: una sola galería ---------- */
  function A(es, en) { return { es: es, en: en }; }
  var GAL = [
    ["galA", A("Terraza techada con piscina infinita y vista al mar", "Covered terrace with infinity pool and ocean view")],
    ["@vista", A("La villa y la bahía desde el drone", "The villa and the bay from the drone")],
    ["@isabella", A("Piscina y patio al anochecer, desde el drone", "Pool and patio at dusk, from the drone")],
    ["@t360", A("Piscina infinita con vista a la playa", "Infinity pool overlooking the beach")],
    ["galB", A("Vista aérea de una piscina y su jardín", "Aerial view of a pool and garden")],
    ["@luna", A("Cocina abierta con la piscina iluminada al anochecer", "Open kitchen with the pool lit at dusk")],
    ["@malinche", A("Piscina larga entre árboles en una casa de estilo colonial", "Long pool among trees at a colonial-style house")],
    ["galD", A("Patio con piscina de azulejo turquesa y sala exterior", "Courtyard with turquoise-tile pool and outdoor lounge")],
    ["galH", A("Sala luminosa con sofás y mesa de madera", "Bright living room with sofas and a wooden coffee table")],
    ["@paz", A("Terraza techada con sala exterior junto a la piscina", "Covered terrace with outdoor lounge by the pool")],
    ["galR", A("Piscina en un jardín con árboles grandes", "Pool in a garden with large trees")],
    ["@amigos", A("Cocina con isla y techo de madera, abierta al jardín", "Kitchen with island and wood ceiling, open to the garden")],
    ["galF", A("Terraza con muebles junto a una piscina infinita al atardecer", "Terrace with loungers beside an infinity pool at sunset")],
    ["@aventura", A("Patio interior con piscina y sala exterior", "Inner courtyard with pool and outdoor lounge")],
    ["galG", A("Piscina frente a una casa blanca con pérgola", "Pool in front of a white house with a pergola")],
    ["galI", A("Cocina con techo de madera e isla", "Kitchen with wood ceiling and island")],
    ["@refugio", A("Comedor y sala con techo de madera y ventanales en arco", "Dining and living room with wood ceiling and arched windows")],
    ["galJ", A("Terraza con persianas de madera y vista al mar", "Terrace with wood slats and ocean view")],
    ["galK", A("Patio con pérgola, piscina y camas de sol", "Patio with pergola, pool and sun loungers")],
    ["galL", A("Piscina angosta con sala exterior techada", "Narrow pool with covered outdoor lounge")],
    ["galM", A("Vista de la bahía desde la propiedad", "Bay view from the property")],
    ["galN", A("Habitación con cama blanca y puerta al jardín", "Bedroom with white bed and garden door")],
    ["galO", A("Baño con doble lavamanos y mueble de madera", "Bathroom with double sink and wood cabinet")],
    ["galP", A("Habitación con espejo de piso y ropa de cama blanca", "Bedroom with floor mirror and white bedding")],
    ["galS", A("Baño con tina frente a la ventana", "Bathroom with a tub by the window")]
  ].map(function (g) {
    var src = g[0].charAt(0) === "@" ? PH[g[0].slice(1)] : IMG + g[0] + ".webp";
    return src ? { src: src, alt: g[1] } : null;
  }).filter(Boolean);
  var galOpen = false;
  function galVisible() {
    var g = $("galx"); if (!g) return 0;
    var cols = getComputedStyle(g).gridTemplateColumns.split(" ").filter(Boolean).length;
    return cols >= 4 ? 9 : cols === 3 ? 6 : 5;   /* 3 filas con la primera foto doble */
  }
  function galApply() {
    var g = $("galx"), b = $("gal-more"); if (!g || !b) return;
    var n = galVisible();
    Array.prototype.forEach.call(g.children, function (el, i) { el.hidden = !galOpen && i >= n; });
    b.hidden = GAL.length <= n;
    var t = T[L()];
    b.textContent = galOpen ? t.less : t.more + " (" + GAL.length + ")";
    b.setAttribute("aria-expanded", String(galOpen));
  }
  function buildPortfolio() {
    var sec = $("portafolio"); if (!sec) return;
    var wrap = sec.querySelector(".wrap");
    /* quitar lo que era por casa: tarjetas, notas, comparadores viejos */
    ["work", "batabs", "ba", "batabs2", "ba2"].forEach(function (id) { var e = $(id); if (e) e.hidden = true; });
    Array.prototype.forEach.call(sec.querySelectorAll('[data-i18n="ba.title"],[data-i18n="ba2.title"],[data-i18n="wk.note"]'), function (e) { e.hidden = true; });
    var grid = mk("div", "gal"); grid.id = "galx";
    var more = mk("button", "btn ghost gal-more"); more.type = "button"; more.id = "gal-more"; more.setAttribute("aria-controls", "galx");
    var head = sec.querySelector(".sec-head");
    head.parentNode.insertBefore(grid, head.nextSibling);
    var mw = mk("div", "gal-more-w"); mw.appendChild(more); grid.parentNode.insertBefore(mw, grid.nextSibling);
    more.onclick = function () {
      galOpen = !galOpen; galApply();
      if (!galOpen) { var r = grid.getBoundingClientRect(); if (r.top < 0) W.scrollTo({ top: W.scrollY + r.top - 90, behavior: "smooth" }); }
    };
    W.addEventListener("resize", galApply);
  }
  function drawPortfolio() {
    var g = $("galx"); if (!g) return;
    var l = L(), t = T[l];
    g.innerHTML = GAL.map(function (x, i) {
      return '<button type="button" class="gi' + (i === 0 ? " big" : "") + '" data-i="' + i + '" aria-label="' + esc(t.open + ": " + x.alt[l]) + '"><img src="' + x.src + '" alt="' + esc(x.alt[l]) + '"' + (i < 5 ? "" : ' loading="lazy"') + ' decoding="async"></button>';
    }).join("");
    Array.prototype.forEach.call(g.children, function (b) { b.onclick = function () { lbOpen(GAL, +b.dataset.i); }; });
    galApply();
  }

  /* ---------- 2. antes y después ---------- */
  function P(i, g, es, en) { return { g: g, name: A(es, en), raw: null, hdr: IMG + "rev-" + i + ".webp", mag: IMG + "est-" + i + ".webp", th: IMG + "th-" + i + ".webp" }; }
  var CMP = [];
  if (PH.baRaw && PH.baStd && PH.baEd) CMP.push({ g: "in", name: A("Sala", "Living room"), raw: PH.baRaw, hdr: PH.baStd, mag: PH.baEd, th: PH.baEd });
  CMP.push(P("00", "in", "Cocina y comedor", "Kitchen and dining"), P("02", "in", "Habitación con vista al mar", "Bedroom with ocean view"),
    P("06", "in", "Sala de billar frente al mar", "Billiards room by the ocean"), P("08", "in", "Cocina con techo de madera", "Kitchen with wood ceiling"),
    P("10", "in", "Sala amplia", "Spacious living room"), P("11", "in", "Habitación principal", "Main bedroom"),
    P("04", "ex", "Entrada con mármol verde", "Entry with green marble"));
  if (PH.baExStd && PH.baExEd) CMP.push({ g: "ex", name: A("Exterior y piscina", "Exterior and pool"), raw: null, hdr: PH.baExStd, mag: PH.baExEd, th: PH.baExEd });
  CMP.push(P("01", "ex", "Patio con piscina al atardecer", "Pool courtyard at dusk"));
  /* Para sumar la foto sin editar de otra pareja: poner raw: "img/raw-XX.webp" en su línea. */
  var cg = "in", ci = 0, mode = null, pos = 50;
  function items() { return CMP.filter(function (c) { return c.g === cg; }); }
  function modes(c) { return c.raw ? [["raw", "mag"], ["hdr", "mag"]] : [["hdr", "mag"]]; }
  function buildCompare() {
    var por = $("portafolio"); if (!por) return;
    var s = mk("section", "ad"); s.id = "antes-despues"; s.setAttribute("aria-labelledby", "ad-t");
    s.innerHTML = '<div class="wrap"><div class="sec-head ad-head"><span class="eyebrow" id="ad-k"></span><h2 id="ad-t"></h2><p class="lead" id="ad-l"></p></div>' +
      '<div class="ad-box"><div class="ad-groups batabs" id="ad-g" role="group"></div><div class="cmp-th" id="ad-th" role="group"></div>' +
      '<div class="ba ph has-img" id="ad-ba"></div></div></div>';
    por.parentNode.insertBefore(s, por.nextSibling);
  }
  function setPos(v) {
    pos = Math.max(0, Math.min(100, +v)); var b = $("ad-ba"); if (!b) return;
    b.style.setProperty("--p", pos + "%"); var r = b.querySelector("input"); if (r && +r.value !== pos) r.value = pos;
    var ab = $("ad-ab"); if (ab && ab.children.length === 2) { ab.children[0].setAttribute("aria-pressed", String(pos >= 75)); ab.children[1].setAttribute("aria-pressed", String(pos <= 25)); }
  }
  function drawCompare() {
    if (!$("ad-ba")) return;
    var l = L(), t = T[l], list = items(); if (ci >= list.length) ci = 0;
    var c = list[ci], ms = modes(c); if (!mode || !ms.some(function (m) { return m.join() === mode.join(); })) mode = ms[0];
    $("ad-k").textContent = t.adK; $("ad-t").textContent = t.adT; $("ad-l").textContent = t.adL;
    var nIn = CMP.filter(function (x) { return x.g === "in"; }).length, nEx = CMP.length - nIn;
    $("ad-g").innerHTML = '<button type="button" data-g="in" aria-pressed="' + (cg === "in") + '">' + t.gIn + '</button><button type="button" data-g="ex" aria-pressed="' + (cg === "ex") + '">' + t.gEx + "</button>";
    Array.prototype.forEach.call($("ad-g").children, function (b) { b.onclick = function () { if (cg !== b.dataset.g) { cg = b.dataset.g; ci = 0; mode = null; drawCompare(); } }; });
    var th = $("ad-th"); th.setAttribute("aria-label", t.pick);
    th.innerHTML = list.map(function (q, i) { return '<button type="button" data-i="' + i + '" aria-pressed="' + (i === ci) + '" aria-label="' + esc(q.name[l]) + '"><img src="' + q.th + '" alt="" decoding="async"></button>'; }).join("");
    Array.prototype.forEach.call(th.children, function (b) { b.onclick = function () { ci = +b.dataset.i; mode = null; drawCompare(); }; });
    var a = mode[0], b = mode[1], ba = $("ad-ba");
    ba.innerHTML = '<img alt="' + esc(c.name[l] + ": " + t[a]) + '" src="' + c[a] + '" decoding="async"><div class="ba-top"><img alt="' + esc(c.name[l] + ": " + t[b]) + '" src="' + c[b] + '" decoding="async"></div><div class="ba-bar"></div>' +
      (c.raw ? '<div class="l l1 ad-left" role="group" aria-label="' + esc(t.cmpTo) + '"><button type="button" data-a="raw" aria-pressed="' + (a === "raw") + '">' + t.raw + '</button><button type="button" data-a="hdr" aria-pressed="' + (a === "hdr") + '">' + t.hdr + "</button></div>" : '<span class="l l1">' + t[a] + "</span>") +
      '<span class="l l2">' + t[b] + '</span><input type="range" min="0" max="100" value="' + pos + '" aria-label="' + esc(t.slider + ": " + t[a] + " / " + t[b]) + '">';
    ba.querySelector("input").addEventListener("input", function (e) { setPos(e.target.value); });
    Array.prototype.forEach.call(ba.querySelectorAll(".ad-left button"), function (x) { x.onclick = function (e) { e.stopPropagation(); if (mode[0] !== x.dataset.a) { mode = [x.dataset.a, "mag"]; drawCompare(); } }; });
    setPos(pos);
  }

  /* ---------- 3. testimonios en su propia sección ---------- */
  function buildTestimonials() {
    var q = $("quotes"), ad = $("antes-despues") || $("portafolio"); if (!q || !ad) return;
    var s = mk("section", "tm"); s.id = "testimonios"; s.setAttribute("aria-labelledby", "tm-t");
    s.innerHTML = '<div class="wrap"><div class="sec-head"><span class="eyebrow" id="tm-k"></span><h2 id="tm-t"></h2></div></div>';
    var w = s.firstChild, note = D.querySelector('[data-i18n="tm.note"]'), cl = D.querySelector("#portafolio .clients");
    w.appendChild(q); if (cl) cl.remove(); if (note) note.remove();
    ad.parentNode.insertBefore(s, ad.nextSibling);
  }
  function drawTestimonials() { var t = T[L()]; if ($("tm-k")) { $("tm-k").textContent = t.tmK; $("tm-t").textContent = t.tmT; } }

  /* ---------- 4. manifiesto con foto ---------- */
  function buildManifesto() {
    var mf = D.querySelector(".manifesto .wrap"); if (!mf || mf.querySelector(".mf-grid")) return;
    var g1 = mk("div", "mf-grid"), txt = mk("div"); while (mf.firstChild) txt.appendChild(mf.firstChild);
    g1.appendChild(txt); g1.appendChild(mk("figure", "mf-pic", '<img src="' + IMG + 'est-07.webp" alt="" loading="lazy" decoding="async">')); mf.appendChild(g1);
  }

  /* ---------- 5. carrusel bajo servicios ---------- */
  var BAND = [
    ["est-03", A("Habitación con pared de madera y puertas al balcón", "Bedroom with a wood wall and balcony doors")],
    ["est-05", A("Baño con doble lavamanos y persianas de madera", "Bathroom with double sink and wood slat shutters")],
    ["est-09", A("Sala con techo de madera y sofá grande", "Living room with a wood ceiling and large sofa")],
    ["est-10", A("Sala amplia con arte textil y vista al jardín", "Spacious living room with textile art and garden view")],
    ["est-02", A("Habitación con ventanales hacia el mar al atardecer", "Bedroom with windows to the ocean at sunset")],
    ["est-06", A("Sala de billar con ventanales frente al mar", "Billiards room with windows facing the ocean")],
    ["est-08", A("Cocina con techo de madera e isla", "Kitchen with wood ceiling and island")]
  ].map(function (b) { return { src: IMG + b[0] + ".webp", alt: b[1] }; });
  function buildBand() {
    var proc = $("proceso"); if (!proc) return;
    var s = mk("section", "band"); s.id = "detalles";
    s.innerHTML = '<div class="wrap"><div class="band-wrap"><div class="band-grid" id="band" tabindex="-1"></div>' +
      '<button type="button" class="band-nav band-p" id="band-p">&lsaquo;</button><button type="button" class="band-nav band-n" id="band-n">&rsaquo;</button></div></div>';
    proc.parentNode.insertBefore(s, proc);
    function go(k) { var g = $("band"), f = g.firstElementChild; if (!f) return; var stepW = f.getBoundingClientRect().width + parseFloat(getComputedStyle(g).columnGap || 16); g.scrollBy({ left: k * stepW, behavior: "smooth" }); }
    $("band-p").onclick = function () { go(-1); }; $("band-n").onclick = function () { go(1); };
    $("band").addEventListener("scroll", bandEdges, { passive: true }); W.addEventListener("resize", bandEdges);
  }
  function bandEdges() {
    var g = $("band"); if (!g) return;
    $("band-p").disabled = g.scrollLeft < 4; $("band-n").disabled = g.scrollLeft + g.clientWidth > g.scrollWidth - 4;
  }
  function drawBand() {
    var g = $("band"); if (!g) return; var l = L(), t = T[l];
    g.setAttribute("role", "group"); g.setAttribute("aria-label", t.bandL);
    g.innerHTML = BAND.map(function (b, i) { return '<button type="button" class="bi" data-i="' + i + '" aria-label="' + esc(t.open + ": " + b.alt[l]) + '"><img src="' + b.src + '" alt="' + esc(b.alt[l]) + '" loading="lazy" decoding="async"></button>'; }).join("");
    Array.prototype.forEach.call(g.children, function (b) { b.onclick = function () { lbOpen(BAND, +b.dataset.i); }; });
    $("band-p").setAttribute("aria-label", t.bPrev); $("band-n").setAttribute("aria-label", t.bNext);
    bandEdges();
  }

  /* ---------- 6. fotos en paquetes ---------- */
  var PKG_PH = {
    base: [IMG + "pkC.webp", A("Sala y cocina abiertas de un espacio moderno", "Open living room and kitchen in a modern space")],
    pro: [IMG + "pkH.webp", A("Patio de una casa blanca con sala exterior", "Courtyard of a white house with outdoor lounge")],
    ultra: [IMG + "pkV.webp", A("Villa frente al mar al atardecer, desde el drone", "Oceanfront villa at sunset, from the drone")]
  };
  function decoratePkgs() {
    var box = $("pkgs"); if (!box) return; var l = L();
    Array.prototype.forEach.call(box.querySelectorAll(".opt"), function (lab) {
      var inp = lab.querySelector("input"); if (!inp || lab.querySelector(".pk-ph")) return;
      var p = PKG_PH[inp.value]; if (!p) return;
      var f = mk("span", "pk-ph", '<img src="' + p[0] + '" alt="' + esc(p[1][l]) + '" loading="lazy" decoding="async">');
      lab.insertBefore(f, inp.nextSibling);
    });
  }

  /* ---------- 7. fotos en varias propiedades ---------- */
  function buildOperators() {
    var s = $("operadores"); if (!s || s.querySelector(".op-grid")) return;
    var w = s.querySelector(".wrap"), form = $("opform"), calc = s.querySelector(".calc"), plans = $("plans"), head = s.querySelector(".sec-head"); if (!form) return;
    if (calc) calc.hidden = true;                                   /* calculadora de noches: quitada */
    var pl = $("planes"); if (pl) pl.hidden = true;                 /* Planes se une a esta sección */
    if (plans && head) { head.parentNode.insertBefore(plans, head.nextSibling); var soon = mk("p", "op-soon"); soon.id = "op-soon"; plans.parentNode.insertBefore(soon, plans.nextSibling); }
    var g = mk("div", "op-grid"), left = mk("div", "op-left"), fig = mk("figure", "op-pics");
    var h3 = mk("h3", "op-h3"); h3.id = "op-h3"; left.appendChild(h3);
    fig.innerHTML = '<img class="a" src="' + IMG + 'galE.webp" alt="" loading="lazy" decoding="async">';
    w.insertBefore(g, form); left.appendChild(form); g.appendChild(left); g.appendChild(fig);
    Array.prototype.forEach.call(D.querySelectorAll('a[href="#planes"]'), function (a) { a.setAttribute("href", "#operadores"); });
  }
  function drawOperators() {
    var t = T[L()], f = D.querySelector(".op-pics"); if (f) f.querySelector(".a").alt = t.opAlt[0];
    if ($("op-soon")) $("op-soon").innerHTML = t.opSoon;
    if ($("op-h3")) $("op-h3").textContent = t.opH3;
  }

  /* ---------- 8. redes con íconos ---------- */
  var ICO = {
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" class="f"/></svg>',
    tt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3.5v11a3.6 3.6 0 1 1-3.6-3.6"/><path d="M14 3.5c.4 2.6 2.3 4.4 5 4.6"/></svg>',
    web: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.2-3.6-8.5s1.2-6.1 3.6-8.5z"/></svg>'
  };
  function buildSocial() {
    var box = D.querySelector(".contact .links"); if (!box || box.dataset.ico) return; box.dataset.ico = "1";
    Array.prototype.slice.call(box.children).forEach(function (row) {
      var first = row.firstChild, label = first && first.nodeType === 3 ? first.textContent.trim() : "";
      var k = /insta/i.test(label) ? "ig" : /tiktok/i.test(label) ? "tt" : "web";
      if (first && first.nodeType === 3) row.removeChild(first);
      var ic = mk("span", "soc-ic", ICO[k]); var sr = mk("span", "sr-only"); sr.textContent = label + ": ";
      row.insertBefore(sr, row.firstChild); row.insertBefore(ic, row.firstChild);
      row.classList.add("soc");
      if (k === "web" && row.tagName !== "A") {   /* la web también es un enlace */
        var a = mk("a", row.className); a.href = "https://sestracreative.com"; a.target = "_blank"; a.rel = "noopener";
        while (row.firstChild) a.appendChild(row.firstChild); a.removeAttribute("style"); row.parentNode.replaceChild(a, row);
      }
    });
    /* mover las redes a la columna izquierda, debajo de los botones, y poner una foto a la derecha */
    var grid = D.querySelector(".contact .grid"), left = grid && grid.firstElementChild;
    if (grid && left && left !== box) {
      left.classList.add("ct-left"); box.classList.add("soc-row"); left.appendChild(box);
      grid.appendChild(mk("figure", "ct-pic", '<img src="' + IMG + 'est-01.webp" alt="" loading="lazy" decoding="async">'));
    }
  }

  /* ---------- 9. extras elegidos resaltados ---------- */
  function syncExtras() {
    var x = $("extras"); if (!x) return;
    Array.prototype.forEach.call(x.querySelectorAll(".xrow"), function (r) {
      var cb = r.querySelector('input[type="checkbox"]'), out = r.querySelector("output");
      r.classList.toggle("on", cb ? cb.checked : out ? (+out.textContent || 0) > 0 : false);
    });
  }
  function bindExtras() {
    var x = $("extras"); if (!x) return;
    x.addEventListener("change", function () { setTimeout(syncExtras, 0); });
    x.addEventListener("click", function () { setTimeout(syncExtras, 0); });
    new MutationObserver(function () { syncExtras(); }).observe(x, { childList: true });
    syncExtras();
  }

  /* ---------- 10. antes y después: pase automático del divisor ---------- */
  var adPauseUntil = 0;
  function adPause() { adPauseUntil = performance.now() + 8000; }
  function autoCompare() {
    if (!W.requestAnimationFrame || (W.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    var box = $("antes-despues"); if (!box) return;
    var ba = $("ad-ba");   /* solo se pausa si se toca el deslizador, no al cambiar de foto */
    ["pointerdown", "touchstart", "keydown", "input"].forEach(function (ev) { ba.addEventListener(ev, function (e) { if (!(e.target.closest && e.target.closest(".ad-left"))) adPause(); }, { passive: true }); });
    var vis = false;
    if ("IntersectionObserver" in W) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; }, { threshold: 0.35 }).observe($("ad-ba"));
    var segs = [[90, 1700], [90, 1100], [10, 2300], [10, 1400], [50, 1300], [50, 900]]   /* solo el 80 % central */, si = 0, t0 = 0, from = pos;
    function tick(now) {
      if (!t0) t0 = now;
      if (now < adPauseUntil || !vis || D.hidden) { t0 = now; from = pos; W.requestAnimationFrame(tick); return; }
      var sg = segs[si], k = Math.min(1, (now - t0) / sg[1]), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      setPos(from + (sg[0] - from) * e);
      if (k >= 1) { si = (si + 1) % segs.length; t0 = now; from = pos; }
      W.requestAnimationFrame(tick);
    }
    W.requestAnimationFrame(tick);
  }

  /* ---------- 11. todas las imágenes se abren en grande ---------- */
  function zoomable(el, getList, label) {
    if (!el || el.dataset.zoom) return; el.dataset.zoom = "1";
    el.classList.add("zoomable"); el.setAttribute("role", "button"); el.setAttribute("tabindex", "0");
    function go(e) { var im = el.querySelector("img"); if (!im || !im.getAttribute("src")) return; e.preventDefault(); e.stopPropagation(); var r = getList(im); lbOpen(r.list, r.i || 0); }
    el.addEventListener("click", go);
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") go(e); });
    el.setAttribute("aria-label", label);
  }
  function single(im) { var l = L(); return { list: [{ src: im.getAttribute("src"), alt: { es: im.alt || T.es.open, en: im.alt || T.en.open } }], i: 0 }; }
  function bindZoomAll() {
    var t = T[L()];
    zoomable($("ph-hero"), single, t.open);
    zoomable(D.querySelector(".mf-pic"), single, t.open);
    zoomable(D.querySelector(".op-pics"), single, t.open);
    zoomable(D.querySelector(".ct-pic"), single, t.open);
    Array.prototype.forEach.call(D.querySelectorAll(".pk-ph"), function (f) {
      /* dentro de una tarjeta de paquete: botón aparte para no elegir el paquete al abrir la foto */
      if (f.querySelector(".pk-zoom")) return;
      var b = mk("button", "pk-zoom", '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>'); b.type = "button";
      b.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); var im = f.querySelector("img"); lbOpen(single(im).list, 0); });
      f.appendChild(b);
    });
    Array.prototype.forEach.call(D.querySelectorAll(".pk-zoom"), function (b) { b.setAttribute("aria-label", T[L()].open); });
    var ba = $("ad-ba");
    if (ba && !ba.querySelector(".ad-zoom")) {   /* el comparador ya recibe el arrastre: lleva su propio botón */
      var z = mk("button", "ad-zoom", '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>'); z.type = "button";
      ba.appendChild(z);
    }
    var z2 = ba && ba.querySelector(".ad-zoom");
    if (z2) {
      z2.setAttribute("aria-label", t.open);
      z2.onclick = function (e) { e.preventDefault(); e.stopPropagation(); var l = L(), c = items()[ci], ms = mode || ["hdr", "mag"], tt = T[l];
        lbOpen([{ src: c[ms[0]], alt: { es: c.name.es + ": " + T.es[ms[0]], en: c.name.en + ": " + T.en[ms[0]] } }, { src: c[ms[1]], alt: { es: c.name.es + ": " + T.es[ms[1]], en: c.name.en + ": " + T.en[ms[1]] } }], 0); };
      z2.addEventListener("pointerdown", function (e) { e.stopPropagation(); });
    }
  }

  /* ---------- 12. textos de portada y manifiesto, prueba de Airbnb ---------- */
  function drawHeroText() {
    var t = T[L()]; var mf = $("mf-t"); if (mf) mf.innerHTML = t.mf;
    var facts = D.querySelector(".hero .facts"); if (!facts) return;
    var pr = $("hero-proof");
    if (!pr) { pr = mk("p", "hero-proof"); pr.id = "hero-proof"; facts.parentNode.insertBefore(pr, facts.nextSibling); }
    pr.innerHTML = esc(t.proof) + ' <a href="https://www.airbnb.com/photography" target="_blank" rel="noopener">' + esc(t.proofSrc) + "</a>";
  }

  /* ---------- 13. rutas por tipo de cliente, justo después de la portada ---------- */
  var NEED_IC = [
    '<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M4 21V5h10v16"/><path d="M14 9h6v12"/><path d="M7 8h4M7 12h4M7 16h4M17 13h0M17 17h0"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/><circle cx="12" cy="10" r="1.5"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M14 8a4 4 0 1 0-4 4"/><path d="M10 12l9 9M16 18l2-2M18 20l2-2"/></svg>'
  ];
  function buildNeeds() {
    var hero = $("inicio"); if (!hero || $("necesitas")) return;
    var s = mk("section", "needs"); s.id = "necesitas"; s.setAttribute("aria-labelledby", "need-k");
    s.innerHTML = '<div class="wrap"><span class="eyebrow" id="need-k"></span><div class="need-grid" id="need-grid"></div></div>';
    hero.parentNode.insertBefore(s, hero.nextSibling);
  }
  function drawNeeds() {
    var g = $("need-grid"); if (!g) return; var t = T[L()];
    $("need-k").textContent = t.needK;
    g.innerHTML = t.need.map(function (n, i) { return '<a class="need" href="' + n[2] + '"><span class="need-ic" aria-hidden="true">' + NEED_IC[i] + '</span><span class="need-t"><b>' + esc(n[0]) + "</b><span>" + esc(n[1]) + '</span></span><span class="need-go" aria-hidden="true">&rarr;</span></a>'; }).join("");
  }

  /* ---------- 14. quiénes somos ---------- */
  function waLink(msg) { var n = (W.CONFIG && CONFIG.whatsapp) || ""; return "https://wa.me/" + n + "?text=" + encodeURIComponent(msg); }
  function buildAbout() {
    var tm = $("testimonios"); if (!tm || $("nosotros")) return;
    var s = mk("section", "about"); s.id = "nosotros"; s.setAttribute("aria-labelledby", "ab-t");
    s.innerHTML = '<div class="wrap"><div class="ab-grid"><div class="ab-copy"><span class="eyebrow" id="ab-k"></span><h2 id="ab-t"></h2><p class="lead" id="ab-p"></p><ul class="ab-prom" id="ab-prom"></ul><a class="btn ghost" id="ab-wa" target="_blank" rel="noopener"></a></div>' +
      '<div class="ab-people"><figure class="person"><div class="ph-person" data-person="cris"><span>C</span></div><figcaption><b>Cristofer Segura</b><span id="ab-cris"></span></figcaption></figure>' +
      '<figure class="person"><div class="ph-person" data-person="domi"><span>D</span></div><figcaption><b>Dominique Estrada</b><span id="ab-domi"></span></figcaption></figure></div></div></div>';
    tm.parentNode.insertBefore(s, tm.nextSibling);
  }
  /* Para poner las fotos de Cris y Domi: subir img/cris.webp e img/domi.webp y escribir aquí sus rutas. */
  var PEOPLE = { cris: "", domi: "" };
  function drawAbout() {
    if (!$("ab-t")) return; var t = T[L()];
    $("ab-k").textContent = t.abK; $("ab-t").textContent = t.abT; $("ab-p").textContent = t.abP;
    $("ab-cris").textContent = t.abCris; $("ab-domi").textContent = t.abDomi;
    $("ab-prom").innerHTML = t.abPromise.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    var a = $("ab-wa"); a.textContent = t.abWa; a.href = waLink(t.abMsg);
    Array.prototype.forEach.call(D.querySelectorAll(".ph-person"), function (el) {
      var src = PEOPLE[el.dataset.person]; if (src && !el.querySelector("img")) el.innerHTML = '<img src="' + src + '" alt="" loading="lazy" decoding="async">';
    });
  }

  /* ---------- 15. qué incluye cada paquete (plegado) y muestra sin compromiso ---------- */
  function drawIncludes() {
    var box = $("pkgs"); if (!box) return; var t = T[L()];
    var d = $("pk-inc"); if (!d) { d = mk("details", "pk-inc"); d.id = "pk-inc"; box.parentNode.insertBefore(d, box.nextSibling); }
    var cards = Array.prototype.slice.call(box.querySelectorAll(".opt"));
    var names = cards.map(function (c) { var n = c.querySelector(".nm"); return n ? n.textContent : ""; });
    var lis = cards.map(function (c) { return Array.prototype.map.call(c.querySelectorAll("li"), function (li) { return li.textContent; }); });
    var row = function (h, vals) { return "<tr><th scope=\"row\">" + esc(h) + "</th>" + vals.map(function (v) { return "<td>" + esc(v || "") + "</td>"; }).join("") + "</tr>"; };
    var html = "<summary>" + esc(t.incT) + '</summary><div class="inc-wrap"><table class="inc"><thead><tr><th></th>' + names.map(function (n) { return '<th scope="col">' + esc(n) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      row(t.incFor, lis.map(function (l) { return l[0]; })) + row(t.incPh, lis.map(function (l) { return l[1]; })) +
      (lis.every(function (l) { return l[2] === lis[0][2]; }) ? '<tr><th scope="row">' + esc(t.incDl) + '</th><td colspan="' + names.length + '">' + esc(lis[0][2] || "") + "</td></tr>" : row(t.incDl, lis.map(function (l) { return l[2]; }))) +
      t.incCommon.map(function (c) { return '<tr><th scope="row">' + esc(c[0]) + '</th><td colspan="' + names.length + '">' + esc(c[1]) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    var open = d.open; d.innerHTML = html; d.open = open;
    var sum = $("sum"), sm = $("pk-sample");
    if (sum && !sm) { sm = mk("a", "pk-sample"); sm.id = "pk-sample"; sm.target = "_blank"; sm.rel = "noopener"; sum.appendChild(sm); }
    if (sm) { sm.textContent = t.sample; sm.href = waLink(t.sampleMsg); }
  }

  /* ---------- 16. aviso de privacidad ---------- */
  var pv = mk("dialog", "pv"); pv.id = "pv";
  pv.innerHTML = '<div class="pv-in"><h3 id="pv-t"></h3><div id="pv-b"></div><p class="small pv-v">Oct. 2026</p><button type="button" class="btn small" id="pv-x"></button></div>';
  D.body.appendChild(pv);
  pv.querySelector("#pv-x").onclick = function () { pv.close ? pv.close() : pv.removeAttribute("open"); };
  pv.addEventListener("click", function (e) { if (e.target === pv) pv.close(); });
  function drawPrivacy() {
    var t = T[L()];
    $("pv-t").textContent = t.privT; $("pv-b").innerHTML = t.privB.map(function (x) { return "<p>" + x + "</p>"; }).join(""); $("pv-x").textContent = t.privClose;
    var c = $("f-consent"), lab = c && c.closest("label"); if (!lab) return;
    var a = $("pv-link"); if (!a) { a = mk("button", "pv-link"); a.type = "button"; a.id = "pv-link"; lab.parentNode.insertBefore(a, lab.nextSibling); a.onclick = function () { pv.showModal ? pv.showModal() : pv.setAttribute("open", ""); }; }
    a.textContent = t.priv;
  }

  /* ---------- 17. menos capas fijas en el celular: WhatsApp se esconde cuando está la barra del total ---------- */
  function watchFloat() {
    var wa = $("wa-float"), sb = $("stickybar"); if (!wa || !sb) return;
    var tick = false;
    function check() { tick = false; var vis = !sb.hidden && getComputedStyle(sb).display !== "none" && sb.getBoundingClientRect().top < innerHeight - 4 && sb.getBoundingClientRect().height > 0; wa.classList.toggle("wa-off", vis); }
    W.addEventListener("scroll", function () { if (!tick) { tick = true; W.requestAnimationFrame(check); } }, { passive: true });
    W.addEventListener("resize", check); new MutationObserver(check).observe(sb, { attributes: true }); check();
  }

  /* ---------- 18. encabezados divididos (título a la izquierda, texto a la derecha) en algunas secciones ---------- */
  function splitHeads() {
    ["portafolio", "servicios", "paquetes", "operadores"].forEach(function (id) {
      var h = D.querySelector("#" + id + " .sec-head"); if (!h || h.classList.contains("split")) return;
      var k = h.querySelector(".eyebrow"), t2 = h.querySelector("h2"); if (!k || !t2) return;
      var l = mk("div", "sh-l"); h.insertBefore(l, k); l.appendChild(k); l.appendChild(t2); h.classList.add("split");
    });
  }

  /* ---------- arranque ---------- */
  safe(applyOvr);
  safe(buildManifesto); safe(buildPortfolio); safe(buildCompare); safe(buildTestimonials); safe(buildBand); safe(buildOperators); safe(buildSocial); safe(bindExtras); safe(buildNeeds); safe(buildAbout); safe(watchFloat); safe(splitHeads);
  function drawAll() {
    safe(applyOvr); safe(drawPortfolio); safe(drawCompare); safe(drawTestimonials); safe(drawBand); safe(drawOperators); safe(decoratePkgs);
    var im = D.querySelector(".mf-pic img"); if (im) im.alt = T[L()].mfAlt;
    var ci2 = D.querySelector(".ct-pic img"); if (ci2) ci2.alt = L() === "en" ? "Pool courtyard with outdoor lounge at dusk" : "Patio con piscina y sala exterior al atardecer";
    safe(drawHeroText); safe(drawNeeds); safe(drawAbout); safe(drawIncludes); safe(drawPrivacy);
    safe(bindZoomAll);
    if (lb.open) safe(lbShow);
  }
  drawAll();
  new MutationObserver(function () { drawAll(); }).observe(H, { attributes: true, attributeFilter: ["lang"] });
  safe(autoCompare);
  var pk = $("pkgs"); if (pk) new MutationObserver(function () { safe(decoratePkgs); safe(drawIncludes); safe(bindZoomAll); }).observe(pk, { childList: true });
})();
