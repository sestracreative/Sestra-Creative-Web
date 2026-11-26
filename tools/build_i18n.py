#!/usr/bin/env python3
"""Genera en.html (versión en inglés con su propia dirección /en) a partir de index.html
y deja escrito en el HTML el texto de cada página, para que Google lo lea sin JavaScript.

Correr desde la raíz del repo después de cambiar textos, precios o preguntas en index.html:
    python3 tools/build_i18n.py

Necesita node con Playwright y Chrome (PLAYWRIGHT_PATH, CHROME_PATH; por defecto /usr/bin/google-chrome).
La dirección base sale del <link rel="canonical"> de index.html: al conectar el dominio,
cambiar solo ese canonical (y robots.txt / sitemap.xml) y volver a correr este script.
"""
import html, json, os, re, socket, subprocess, sys, tempfile, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

src = open("index.html", encoding="utf-8").read()
BASE = re.search(r'<link rel="canonical" href="([^"]+)">', src).group(1)
if not BASE.endswith("/"):
    sys.exit("El canonical de index.html debe terminar en /")

# 1. en.html: misma página, idioma de la página en inglés
en = src.replace('<html lang="es" data-page-lang="es">', '<html lang="en" data-page-lang="en">', 1)
assert en != src, 'index.html debe empezar con <html lang="es" data-page-lang="es">'
open("en.html", "w", encoding="utf-8").write(en)

# 2. leer los textos que pone el JavaScript en cada idioma
s = socket.socket(); s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(port)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
js = r"""
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome' });
  const out = {};
  for (const [k, f] of [['es', 'index.html'], ['en', 'en.html']]) {
    const p = await (await b.newContext()).newPage();
    await p.goto('http://127.0.0.1:PORT/' + f, { waitUntil: 'networkidle' });
    out[k] = await p.evaluate(() => {
      const i18n = {}; document.querySelectorAll('[data-i18n]').forEach(e => i18n[e.getAttribute('data-i18n')] = e.textContent);
      const faq = [...document.querySelectorAll('#faq details')].map(d => [d.querySelector('summary').textContent.trim(), (d.querySelector('p,div:not(summary)') || {}).textContent.trim()]);
      return { lang: document.documentElement.lang, i18n, faq, title: document.title,
               desc: document.querySelector('meta[name="description"]').content };
    });
  }
  console.log(JSON.stringify(out)); await b.close();
})();
""".replace("PORT", str(port))
with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as t:
    t.write(js); jsf = t.name
try:
    data = json.loads(subprocess.check_output(["node", jsf], text=True))
finally:
    srv.terminate(); os.unlink(jsf)
assert data["es"]["lang"] == "es" and data["en"]["lang"] == "en", "Cada página debe abrir en su idioma"

# 3. escribir textos y cabecera de cada página
HREFLANG = ('<link rel="alternate" hreflang="es" href="%s">\n<link rel="alternate" hreflang="en" href="%sen">\n'
            '<link rel="alternate" hreflang="x-default" href="%s">' % (BASE, BASE, BASE))

def build(text, k):
    d = data[k]; url = BASE if k == "es" else BASE + "en"
    def fill(m):
        key = m.group(3); v = d["i18n"].get(key, "")
        return m.group(1) + html.escape(v, quote=False) + m.group(5) if v.strip() else m.group(0)
    text = re.sub(r'(<(\w+)\b[^>]*\sdata-i18n="([^"]+)"[^>]*>)([^<]*)(</\2>)', fill, text)
    a = lambda v: html.escape(v, quote=True)
    text = re.sub(r"<title>[^<]*</title>", "<title>%s</title>" % html.escape(d["title"], quote=False), text, count=1)
    text = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % a(d["desc"]), text, count=1)
    text = re.sub(r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="%s">' % a(d["title"]), text, count=1)
    text = re.sub(r'<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="%s">' % a(d["desc"]), text, count=1)
    text = re.sub(r'<link rel="canonical" href="[^"]*">', '<link rel="canonical" href="%s">' % url, text, count=1)
    text = re.sub(r'<meta property="og:url" content="[^"]*">', '<meta property="og:url" content="%s">' % url, text, count=1)
    text = re.sub(r'<meta property="og:image:alt" content="[^"]*">', '<meta property="og:image:alt" content="%s">' % ("Logo de Sestra Creative" if k == "es" else "Sestra Creative logo"), text, count=1)
    loc, alt = ("es_CR", "en_US") if k == "es" else ("en_US", "es_CR")
    text = re.sub(r'<meta property="og:locale" content="[^"]*">', '<meta property="og:locale" content="%s">' % loc, text, count=1)
    text = re.sub(r'<meta property="og:locale:alternate" content="[^"]*">', '<meta property="og:locale:alternate" content="%s">' % alt, text, count=1)
    text = re.sub(r'(?:<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?)+', "", text)
    text = text.replace('<link rel="canonical"', HREFLANG + '\n<link rel="canonical"', 1)
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', text, re.S)
    g = json.loads(m.group(1))
    for n in g["@graph"]:
        if n["@type"] == "ProfessionalService": n["description"] = d["desc"]
        if n["@type"] == "FAQPage":
            n["@id"] = url + "#preguntas"; n["inLanguage"] = k
            n["mainEntity"] = [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": r}} for q, r in d["faq"]]
    if k == "en":
        names = {"Fotografía inmobiliaria": ("Real estate photography", "Interior and exterior photos, magazine style or classic HDR, for vacation rentals and sales."),
                 "Video con drone": ("Drone video", "Drone video and aerial shots of properties and surroundings."),
                 "Fotos y video con drone": ("Photos and drone video", "Photography and drone video package for one property.")}
        for n in g["@graph"]:
            for o in n.get("hasOfferCatalog", {}).get("itemListElement", []):
                s2 = o["itemOffered"]
                if s2["name"] in names: s2["name"], s2["description"] = names[s2["name"]]
            if n["@type"] == "ProfessionalService": n["hasOfferCatalog"]["name"] = "Services"
    text = text[:m.start(1)] + json.dumps(g, ensure_ascii=False, separators=(",", ":")) + text[m.end(1):]
    return text

open("index.html", "w", encoding="utf-8").write(build(src, "es"))
open("en.html", "w", encoding="utf-8").write(build(en, "en"))
print("listo:", BASE, "y", BASE + "en", "-", len(data["es"]["i18n"]), "textos por idioma,", len(data["en"]["faq"]), "preguntas")
