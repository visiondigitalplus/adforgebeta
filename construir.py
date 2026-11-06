#!/usr/bin/env python3
"""
Genera app-completa.html: un único archivo con todo dentro (CSS + JS + logo).
Se puede abrir con doble clic, enviar por WhatsApp o usar en cualquier servidor.
Uso:  python3 construir.py
"""
import re, pathlib, datetime

base = pathlib.Path(__file__).parent
html = (base / 'index.html').read_text(encoding='utf-8')

css = (base / 'assets/css/app.css').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="assets/css/app.css">',
                    '<style>\n' + css + '\n</style>')

def inline(match):
    src = match.group(1)
    code = (base / src).read_text(encoding='utf-8')
    return '<script>\n' + code + '\n</script>'

html = re.sub(r'<script src="([^"]+)"></script>', inline, html)

sello = '<!-- Generado por construir.py · ' + datetime.date.today().isoformat() + ' -->\n'
out = base / 'app-completa.html'
out.write_text(sello + html, encoding='utf-8')
print('Listo:', out.name, '·', round(len(html.encode())/1024), 'KB')
