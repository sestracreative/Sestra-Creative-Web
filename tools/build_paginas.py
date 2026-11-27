#!/usr/bin/env python3
"""Genera las 4 páginas de búsqueda (fotógrafo inmobiliario / marketing para alquileres vacacionales),
en inglés y español, y actualiza sitemap.xml. Ejecutar desde la raíz del repositorio:
    python3 tools/build_paginas.py
La dirección base sale del <link rel="canonical"> de index.html, igual que build_i18n.py.
Los precios y datos del negocio salen de llms.txt: si cambian, cambiarlos aquí también."""
import json, re, html, datetime

src = open("index.html", encoding="utf-8").read()
BASE = re.search(r'<link rel="canonical" href="([^"]+)">', src).group(1)
if not BASE.endswith("/"):
    BASE += "/"
HOY = datetime.date.today().isoformat()
WA = "50687100430"
NEG = BASE + "#negocio"
AIRBNB = "https://www.airbnb.com/photography"
E = html.escape

# (archivo, idioma, página hermana)
SLUG = {
    "re_en": "real-estate-photographer-costa-rica",
    "re_es": "fotografo-inmobiliario-costa-rica",
    "vr_en": "vacation-rental-marketing-costa-rica",
    "vr_es": "marketing-alquileres-vacacionales-costa-rica",
}

UI = {
    "en": dict(lang="en", loc="en_US", home=BASE + "en", home_l="Home", wa_msg="Hi! I'd like a quote for my property in Costa Rica.",
               wa_btn="Message us on WhatsApp", prices_btn="See packages", nav_other="Español", faq_h="Frequently asked questions",
               prices_h="Prices", vat="Prices in US dollars, VAT included. The exact total is shown on the main site when you choose a package.",
               steps_h="How it works", where_h="Where we work", related_h="More from Sestra Creative", cta_btn="Message us on WhatsApp",
               foot="© 2026 Sestra Creative. Tamarindo, Guanacaste, Costa Rica.", from_="from", more="Photos from our work", sel="Services",
               contact_h="Let's talk about your property", crumb="Home", mail=""),
    "es": dict(lang="es", loc="es_CR", home=BASE, home_l="Inicio", wa_msg="¡Hola! Quisiera cotizar mi propiedad en Costa Rica.",
               wa_btn="Escríbenos por WhatsApp", prices_btn="Ver paquetes", nav_other="English", faq_h="Preguntas frecuentes",
               prices_h="Precios", vat="Precios en dólares con IVA incluido. El total exacto se ve en el sitio principal al elegir el paquete.",
               steps_h="Cómo funciona", where_h="Dónde trabajamos", related_h="Más de Sestra Creative", cta_btn="Escríbenos por WhatsApp",
               foot="© 2026 Sestra Creative. Tamarindo, Guanacaste, Costa Rica.", from_="desde", more="Fotos de nuestro trabajo", sel="Servicios",
               contact_h="Hablemos de tu propiedad", crumb="Inicio", mail=""),
}

IMGS = {
    "en": [("est-07", "Living room with floor-to-ceiling windows and sunset sea view"),
           ("est-03", "Bedroom with a wood wall and balcony doors"),
           ("est-09", "Living room with a wood ceiling and large sofa")],
    "es": [("est-07", "Sala con ventanales y vista al mar al atardecer"),
           ("est-03", "Habitación con pared de madera y puertas al balcón"),
           ("est-09", "Sala con techo de madera y sofá grande")],
}

PAGES = {}

# ------------------------------------------------------------------ Fotógrafo inmobiliario / Airbnb
PAGES["re_en"] = dict(
    lang="en", pair="re_es", other="vr_en", kind="foto",
    title="Real Estate & Airbnb Photographer in Costa Rica | Sestra Creative",
    desc="Real estate, Airbnb and drone photography in Tamarindo, Guanacaste and across Costa Rica. Photos from $350, delivered in 1 to 3 business days. VAT included.",
    eyebrow="Real estate and Airbnb photography",
    h1="Real estate and Airbnb photographer in Costa Rica",
    lead="Sestra Creative photographs villas, condos, hotels and homes for sale from Tamarindo, Guanacaste. Photos, drone video and content ready to post, with clear prices and delivery in 1 to 3 business days.",
    service="Real estate and vacation rental photography",
    blocks=[
        ("What you get", "ul", [
            "Interior and exterior photos edited in magazine style or classic HDR.",
            "Drone video and aerial photos of the property and its surroundings.",
            "Files sized for Airbnb, Booking and social media, plus high-resolution originals.",
            "Optional extras: 360° tour, 2D floor plan and aerial map of the lot.",
            "Delivery through a Google Drive link in 1 to 3 business days.",
        ]),
        ("Why professional photos matter", "p", [
            ("According to Airbnb, listings with professional photos receive on average 19% more bookings. ", "Source: Airbnb, 2025", AIRBNB),
            "For a property on sale, the photos are what buyers see first, before they decide whether to visit.",
        ]),
    ],
    prices=[("Photos", 350, "Interior and exterior photos of one property."),
            ("Drone video", 575, "Aerial video and photos."),
            ("Photos + video", 810, "The full package for one property.")],
    steps=[("Tell us about the property", "Message us on WhatsApp with the location, type of property and preferred date."),
           ("We photograph it", "We visit the property, shoot photos and, if you chose it, drone video."),
           ("You receive the files", "Edited files and the Airbnb, Booking and social versions arrive in 1 to 3 business days.")],
    where=["We work mainly in Tamarindo and surroundings and in the Greater Metropolitan Area (San José), with no travel fee.",
           "We also go anywhere else in Costa Rica: travel is quoted before booking.",
           "Cris, the photographer, has photographed more than 100 properties in Costa Rica. We work in English and Spanish."],
    faq=[("How much does a real estate photographer cost in Costa Rica?",
          "At Sestra Creative, photos start at $350 per property, drone video at $575 and photos plus video at $810. Prices are in US dollars and include VAT."),
         ("Do you photograph for Airbnb and Booking?",
          "Yes. Every delivery includes versions sized for Airbnb, Booking and social media, plus the high-resolution originals."),
         ("Do you offer drone photography?",
          "Yes. Drone video and aerial photos are available alone or together with the property photos."),
         ("Do you travel outside Tamarindo?",
          "Yes. There is no travel fee in Tamarindo and surroundings or in the Greater Metropolitan Area. Anywhere else in Costa Rica we quote travel before booking."),
         ("How long until I get my photos?",
          "Between 1 and 3 business days, through a Google Drive link."),
         ("Do you speak English?",
          "Yes. We work in English and Spanish.")],
)

PAGES["re_es"] = dict(
    lang="es", pair="re_en", other="vr_es", kind="foto",
    title="Fotógrafo inmobiliario y de Airbnb en Costa Rica | Sestra Creative",
    desc="Fotografía inmobiliaria, de Airbnb y con drone en Tamarindo, Guanacaste y todo Costa Rica. Fotos desde $350, entrega en 1 a 3 días hábiles. IVA incluido.",
    eyebrow="Fotografía inmobiliaria y de Airbnb",
    h1="Fotógrafo inmobiliario y de Airbnb en Costa Rica",
    lead="Sestra Creative fotografía villas, condominios, hoteles y casas en venta desde Tamarindo, Guanacaste. Fotos, video con drone y contenido listo para publicar, con precios claros y entrega en 1 a 3 días hábiles.",
    service="Fotografía inmobiliaria y de alquileres vacacionales",
    blocks=[
        ("Qué incluye", "ul", [
            "Fotos de interiores y exteriores editadas en estilo revista o HDR clásico.",
            "Video con drone y fotos aéreas de la propiedad y sus alrededores.",
            "Archivos con las medidas para Airbnb, Booking y redes, y los originales en alta resolución.",
            "Extras opcionales: recorrido 360°, plano 2D y mapa aéreo del lote.",
            "Entrega por un enlace de Google Drive en 1 a 3 días hábiles.",
        ]),
        ("Por qué importan las fotos profesionales", "p", [
            ("Según Airbnb, los anuncios con fotos profesionales reciben en promedio 19 % más reservas. ", "Fuente: Airbnb, 2025", AIRBNB),
            "Si la propiedad está en venta, las fotos son lo primero que ven los compradores, antes de decidir si la visitan.",
        ]),
    ],
    prices=[("Fotos", 350, "Fotos de interiores y exteriores de una propiedad."),
            ("Video con drone", 575, "Video aéreo y fotos."),
            ("Fotos + video", 810, "El paquete completo para una propiedad.")],
    steps=[("Cuéntanos de la propiedad", "Escríbenos por WhatsApp con la ubicación, el tipo de propiedad y la fecha que prefieres."),
           ("La fotografiamos", "Visitamos la propiedad, tomamos las fotos y, si lo elegiste, el video con drone."),
           ("Recibes los archivos", "Los archivos editados y las versiones para Airbnb, Booking y redes llegan en 1 a 3 días hábiles.")],
    where=["Trabajamos principalmente en Tamarindo y alrededores y en la Gran Área Metropolitana (San José), sin costo de traslado.",
           "También vamos a cualquier otra zona de Costa Rica: el traslado se cotiza antes de reservar.",
           "Cris, el fotógrafo, ha fotografiado más de 100 propiedades en Costa Rica. Trabajamos en español e inglés."],
    faq=[("¿Cuánto cuesta un fotógrafo inmobiliario en Costa Rica?",
          "En Sestra Creative, las fotos cuestan desde $350 por propiedad, el video con drone desde $575 y fotos más video desde $810. Los precios son en dólares e incluyen IVA."),
         ("¿Fotografían para Airbnb y Booking?",
          "Sí. Cada entrega incluye versiones con las medidas para Airbnb, Booking y redes, además de los originales en alta resolución."),
         ("¿Hacen fotografía con drone?",
          "Sí. El video con drone y las fotos aéreas se pueden contratar solos o junto con las fotos de la propiedad."),
         ("¿Van fuera de Tamarindo?",
          "Sí. En Tamarindo y alrededores y en la Gran Área Metropolitana no se cobra traslado. A cualquier otra zona de Costa Rica el traslado se cotiza antes de reservar."),
         ("¿En cuánto tiempo recibo las fotos?",
          "Entre 1 y 3 días hábiles, por un enlace de Google Drive."),
         ("¿Hablan inglés?",
          "Sí. Trabajamos en español e inglés.")],
)

# ------------------------------------------------------------------ Marketing para alquileres vacacionales
PAGES["vr_en"] = dict(
    lang="en", pair="vr_es", other="re_en", kind="mkt",
    title="Vacation Rental Marketing Agency in Costa Rica | Sestra Creative",
    desc="Marketing agency for vacation rentals in Guanacaste, Costa Rica: professional photos, drone video, social content and direct-booking tools for villas and small hotels.",
    eyebrow="Marketing for vacation rentals",
    h1="Marketing agency for vacation rentals in Costa Rica",
    lead="We help villa owners, property managers and small hotels in Guanacaste get noticed: professional photos and drone video, content for Instagram and TikTok, and digital tools that bring guests to you.",
    service="Marketing for vacation rentals and hotels",
    blocks=[
        ("What we do", "ul", [
            "Photos and drone video that show each property at its best.",
            "Monthly content plans for Instagram and TikTok.",
            "Direct-booking website for your villa or your company.",
            "Digital guest guide, so guests find check-in details and local tips in one place.",
            "Chatbot that answers common guest questions.",
            "Reports for property owners.",
        ]),
        ("Why direct bookings matter", "p", [
            "Booking platforms charge hosts a service fee on every reservation. A direct-booking website and your own audience (returning guests, Instagram and TikTok followers) let part of your guests book without going through a platform.",
            "We do not promise specific savings or occupancy: results depend on your property, your prices and the season. What we do is build the photos, content and tools that make direct booking possible.",
        ]),
        ("Who we work with", "ul", [
            "Property managers with several vacation rentals.",
            "Small hotels that need content for events and promotions.",
            "Owners of a single villa or condo.",
        ]),
    ],
    prices=[("Photos", 350, "Per property, one session."),
            ("Drone video", 575, "Aerial video and photos."),
            ("Photos + video", 810, "The full package for one property.")],
    prices_note="Monthly content plans and digital services are quoted for each property or portfolio.",
    steps=[("We talk about your properties", "Message us on WhatsApp: how many properties you manage, where they are and what you need."),
           ("We propose a plan", "We suggest what to do first, with prices, so you can decide at your own pace."),
           ("We produce and deliver", "We photograph, film, publish content and set up the tools you chose.")],
    where=["We are based in Tamarindo, Guanacaste, and work mainly in Tamarindo and surroundings and in the Greater Metropolitan Area (San José).",
           "We also work anywhere else in Costa Rica, with travel quoted.",
           "We work in English and Spanish."],
    faq=[("What does a vacation rental marketing agency do?",
          "It handles what attracts guests to a property: photos and video, social media content, and the digital tools around the listing. At Sestra Creative that means photography, drone video, content plans, direct-booking sites, guest guides, chatbots and owner reports."),
         ("Do you manage my reservations or my guests?",
          "No. We are a marketing and content agency, not a property manager. We make the photos, content and tools; you or your manager keep running the bookings."),
         ("Do you work with a single property or only with portfolios?",
          "Both. We work with managers who handle several properties, small hotels and owners of one property."),
         ("How much does it cost?",
          "Photos start at $350 per property, drone video at $575 and photos plus video at $810, VAT included. Monthly content plans and digital services are quoted for each case."),
         ("Where do you work?",
          "Mainly in Tamarindo and surroundings and in the Greater Metropolitan Area, with no travel fee. Anywhere else in Costa Rica, with travel quoted."),
         ("Can you make a direct-booking website for my villa?",
          "Yes. Direct-booking sites are part of our digital services. Message us with your property and we will quote it.")],
)

PAGES["vr_es"] = dict(
    lang="es", pair="vr_en", other="re_es", kind="mkt",
    title="Agencia de marketing para alquileres vacacionales | Sestra Creative",
    desc="Agencia de marketing para alquileres vacacionales en Guanacaste, Costa Rica: fotos profesionales, video con drone, contenido en redes y herramientas de reserva directa.",
    eyebrow="Marketing para alquileres vacacionales",
    h1="Agencia de marketing para alquileres vacacionales en Costa Rica",
    lead="Ayudamos a dueños de villas, administradores de propiedades y hoteles pequeños de Guanacaste a destacar: fotos profesionales y video con drone, contenido para Instagram y TikTok, y herramientas digitales que llevan a los huéspedes hacia ti.",
    service="Marketing para alquileres vacacionales y hoteles",
    blocks=[
        ("Qué hacemos", "ul", [
            "Fotos y video con drone que muestran cada propiedad en su mejor versión.",
            "Planes mensuales de contenido para Instagram y TikTok.",
            "Sitio de reserva directa para tu villa o tu empresa.",
            "Guía digital del huésped, para que encuentre en un solo lugar la entrada y los consejos de la zona.",
            "Chatbot que responde las preguntas frecuentes de los huéspedes.",
            "Reportes para los dueños de las propiedades.",
        ]),
        ("Por qué importan las reservas directas", "p", [
            "Las plataformas de reserva cobran a los anfitriones una comisión por cada reserva. Un sitio de reserva directa y tu propia audiencia (huéspedes que vuelven, seguidores en Instagram y TikTok) permiten que parte de tus huéspedes reserve sin pasar por una plataforma.",
            "No prometemos ahorros ni ocupación específicos: los resultados dependen de tu propiedad, tus precios y la temporada. Lo que sí hacemos es construir las fotos, el contenido y las herramientas que hacen posible la reserva directa.",
        ]),
        ("Con quién trabajamos", "ul", [
            "Administradores con varios alquileres vacacionales.",
            "Hoteles pequeños que necesitan contenido para eventos y promociones.",
            "Dueños de una sola villa o condominio.",
        ]),
    ],
    prices=[("Fotos", 350, "Por propiedad, una sesión."),
            ("Video con drone", 575, "Video aéreo y fotos."),
            ("Fotos + video", 810, "El paquete completo para una propiedad.")],
    prices_note="Los planes mensuales de contenido y los servicios digitales se cotizan por propiedad o por portafolio.",
    steps=[("Hablamos de tus propiedades", "Escríbenos por WhatsApp: cuántas propiedades administras, dónde están y qué necesitas."),
           ("Te proponemos un plan", "Te sugerimos qué hacer primero, con precios, para que decidas a tu ritmo."),
           ("Producimos y entregamos", "Fotografiamos, grabamos, publicamos contenido y armamos las herramientas que elegiste.")],
    where=["Estamos en Tamarindo, Guanacaste, y trabajamos principalmente en Tamarindo y alrededores y en la Gran Área Metropolitana (San José).",
           "También trabajamos en cualquier otra zona de Costa Rica, con el traslado cotizado.",
           "Trabajamos en español e inglés."],
    faq=[("¿Qué hace una agencia de marketing para alquileres vacacionales?",
          "Se encarga de lo que atrae huéspedes a una propiedad: fotos y video, contenido en redes y las herramientas digitales alrededor del anuncio. En Sestra Creative eso significa fotografía, video con drone, planes de contenido, sitios de reserva directa, guías del huésped, chatbots y reportes para dueños."),
         ("¿Administran mis reservas o a mis huéspedes?",
          "No. Somos una agencia de marketing y contenido, no administradores de propiedades. Nosotros hacemos las fotos, el contenido y las herramientas; tú o tu administrador siguen manejando las reservas."),
         ("¿Trabajan con una sola propiedad o solo con portafolios?",
          "Con ambos. Trabajamos con administradores de varias propiedades, hoteles pequeños y dueños de una sola propiedad."),
         ("¿Cuánto cuesta?",
          "Las fotos cuestan desde $350 por propiedad, el video con drone desde $575 y fotos más video desde $810, con IVA incluido. Los planes mensuales de contenido y los servicios digitales se cotizan en cada caso."),
         ("¿Dónde trabajan?",
          "Principalmente en Tamarindo y alrededores y en la Gran Área Metropolitana, sin costo de traslado. En cualquier otra zona de Costa Rica, con el traslado cotizado."),
         ("¿Pueden hacer un sitio de reserva directa para mi villa?",
          "Sí. Los sitios de reserva directa son parte de nuestros servicios digitales. Escríbenos con los datos de tu propiedad y te cotizamos.")],
)


def url_of(key):
    return BASE + SLUG[key]


def render(key, p):
    u = UI[p["lang"]]
    lang = p["lang"]
    wa = "https://wa.me/%s?text=%s" % (WA, re.sub(r"%20", "%20", __import__("urllib.parse", fromlist=["quote"]).quote(u["wa_msg"])))
    me, pair = url_of(key), url_of(p["pair"])
    es_url = me if lang == "es" else pair
    en_url = me if lang == "en" else pair
    pt = p["title"]
    # --- datos estructurados
    offers = []
    for name, pr, _d in p["prices"]:
        offers.append({"@type": "Offer", "name": name, "priceCurrency": "USD",
                       "priceSpecification": {"@type": "PriceSpecification", "minPrice": pr, "priceCurrency": "USD"}})
    graph = [
        {"@type": "Service", "@id": me + "#servicio", "name": p["service"], "serviceType": p["service"],
         "description": p["desc"], "url": me, "inLanguage": lang,
         "provider": {"@id": NEG},
         "areaServed": [{"@type": "Place", "name": "Tamarindo"}, {"@type": "AdministrativeArea", "name": "Guanacaste"},
                        {"@type": "Country", "name": "Costa Rica"}],
         "offers": offers},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": u["crumb"], "item": u["home"]},
            {"@type": "ListItem", "position": 2, "name": p["h1"], "item": me}]},
        {"@type": "FAQPage", "@id": me + "#preguntas", "inLanguage": lang,
         "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in p["faq"]]},
    ]
    ld = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, separators=(",", ":"))
    # --- bloques
    body = []
    for h, kind, items in p["blocks"]:
        if kind == "ul":
            inner = "<ul class=\"ticks\">" + "".join("<li>%s</li>" % E(i) for i in items) + "</ul>"
        else:
            parts = []
            for it in items:
                if isinstance(it, tuple):
                    parts.append('<p>%s<a href="%s" target="_blank" rel="noopener">%s</a></p>' % (E(it[0]), it[2], E(it[1])))
                else:
                    parts.append("<p>%s</p>" % E(it))
            inner = "".join(parts)
        body.append('<section class="blk"><div class="wrap"><h2>%s</h2>%s</div></section>' % (E(h), inner))
    cards = "".join('<div class="card"><h3>%s</h3><p class="price"><small>%s</small>$%d</p><p>%s</p></div>'
                    % (E(n), u["from_"], pr, E(d)) for n, pr, d in p["prices"])
    note = p.get("prices_note")
    body.append('<section class="blk" id="precios"><div class="wrap"><h2>%s</h2><div class="grid g3">%s</div><p class="src">%s%s</p></div></section>'
                % (E(u["prices_h"]), cards, E(u["vat"]), (" " + E(note)) if note else ""))
    steps = "".join("<li><h3>%s</h3><p>%s</p></li>" % (E(a), E(b)) for a, b in p["steps"])
    body.append('<section class="blk"><div class="wrap"><h2>%s</h2><ol class="steps">%s</ol></div></section>' % (E(u["steps_h"]), steps))
    imgs = "".join('<img src="/img/%s-1200.webp" alt="%s" width="1200" height="900" loading="lazy" decoding="async">' % (n, E(a)) for n, a in IMGS[lang])
    body.append('<section class="blk"><div class="wrap"><h2>%s</h2><div class="photos">%s</div></div></section>' % (E(u["more"]), imgs))
    body.append('<section class="blk"><div class="wrap"><h2>%s</h2>%s</div></section>'
                % (E(u["where_h"]), "".join("<p>%s</p>" % E(x) for x in p["where"])))
    faq = "".join("<details><summary>%s</summary><p>%s</p></details>" % (E(q), E(a)) for q, a in p["faq"])
    body.append('<section class="blk" id="preguntas"><div class="wrap"><h2>%s</h2>%s</div></section>' % (E(u["faq_h"]), faq))
    rel = [("<a href=\"%s\">%s</a>" % (url_of(p["other"]), E(PAGES[p["other"]]["h1"]))),
           ("<a href=\"%s\">%s</a>" % (u["home"], E({"en": "Sestra Creative: packages, portfolio and booking", "es": "Sestra Creative: paquetes, portafolio y reservas"}[lang])))]
    body.append('<section class="blk"><div class="wrap"><h2>%s</h2><ul class="related">%s</ul></div></section>'
                % (E(u["related_h"]), "".join("<li>%s</li>" % r for r in rel)))
    cta = ('<section class="band"><div class="wrap"><h2>%s</h2><p>%s</p><a class="btn" href="%s" target="_blank" rel="noopener">%s</a></div></section>'
           % (E(u["contact_h"]), E({"en": "Tell us where the property is and what you need. We reply on WhatsApp with a clear quote.",
                                    "es": "Cuéntanos dónde está la propiedad y qué necesitas. Te respondemos por WhatsApp con una cotización clara."}[lang]),
              wa, E(u["cta_btn"])))
    menu = ('<nav class="menu" aria-label="%s"><a href="%s">%s</a><a href="%s">%s</a><a href="%s" hreflang="%s" lang="%s">%s</a>'
            '<a class="btn" href="%s" target="_blank" rel="noopener">WhatsApp</a></nav>'
            % (E(u["sel"]), u["home"], E(u["home_l"]), url_of(p["other"]), E({"en": "Vacation rentals" if p["kind"] == "foto" else "Photography",
                                                                               "es": "Alquileres vacacionales" if p["kind"] == "foto" else "Fotografía"}[lang]),
               pair, "es" if lang == "en" else "en", "es" if lang == "en" else "en", u["nav_other"], wa))
    return f"""<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(pt)}</title>
<meta name="description" content="{E(p['desc'])}">
<link rel="canonical" href="{me}">
<link rel="alternate" hreflang="es" href="{es_url}">
<link rel="alternate" hreflang="en" href="{en_url}">
<link rel="alternate" hreflang="x-default" href="{es_url}">
<meta property="og:site_name" content="Sestra Creative">
<meta property="og:locale" content="{u['loc']}">
<meta property="og:type" content="website">
<meta property="og:title" content="{E(pt)}">
<meta property="og:description" content="{E(p['desc'])}">
<meta property="og:url" content="{me}">
<meta property="og:image" content="{BASE}img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/img/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="preload" href="/fonts/montserrat-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/poppins-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/pagina.css?v=1126f">
<script type="application/ld+json">{ld}</script>
</head>
<body>
<header class="top"><div class="wrap">
<a class="brand" href="{u['home']}" aria-label="Sestra Creative"><img src="/img/favicon-192.png" alt="" width="28" height="28"><span>Sestra Creative</span></a>
{menu}
</div></header>
<main>
<section class="hero"><div class="wrap hero-grid"><div>
<p class="eyebrow">{E(p['eyebrow'])}</p>
<h1>{E(p['h1'])}</h1>
<p class="lead">{E(p['lead'])}</p>
<div class="acts"><a class="btn" href="{wa}" target="_blank" rel="noopener">{E(u['wa_btn'])}</a><a class="btn ghost" href="#precios">{E(u['prices_btn'])}</a></div>
</div><img class="hero-img" src="/img/{IMGS[lang][0][0]}-1200.webp" alt="{E(IMGS[lang][0][1])}" width="1200" height="900" fetchpriority="high" decoding="async"></div></section>
{chr(10).join(body)}
{cta}
</main>
<footer><div class="wrap"><span>{E(u['foot'])}</span><span><a href="https://www.instagram.com/sestracreative" target="_blank" rel="noopener">Instagram</a> · <a href="https://www.tiktok.com/@sestra_creative" target="_blank" rel="noopener">TikTok</a></span></div></footer>
</body>
</html>
"""


for key, p in PAGES.items():
    open(SLUG[key] + ".html", "w", encoding="utf-8").write(render(key, p))

# ---- sitemap: se reescribe el bloque de estas páginas
sm = open("sitemap.xml", encoding="utf-8").read()
sm = re.sub(r"\n?  <!-- páginas de búsqueda -->.*?<!-- /páginas de búsqueda -->", "", sm, flags=re.S)
blk = ["  <!-- páginas de búsqueda -->"]
for key in PAGES:
    p = PAGES[key]
    me, pair = url_of(key), url_of(p["pair"])
    es_u = me if p["lang"] == "es" else pair
    en_u = me if p["lang"] == "en" else pair
    blk.append("  <url>\n    <loc>%s</loc>\n    <lastmod>%s</lastmod>\n"
               '    <xhtml:link rel="alternate" hreflang="es" href="%s"/>\n'
               '    <xhtml:link rel="alternate" hreflang="en" href="%s"/>\n'
               '    <xhtml:link rel="alternate" hreflang="x-default" href="%s"/>\n  </url>' % (me, HOY, es_u, en_u, es_u))
blk.append("  <!-- /páginas de búsqueda -->")
sm = sm.replace("</urlset>", "\n".join(blk) + "\n</urlset>")
open("sitemap.xml", "w", encoding="utf-8").write(sm)
print("listo:", ", ".join(SLUG[k] + ".html" for k in PAGES))
