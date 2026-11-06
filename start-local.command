#!/bin/bash
# Doble clic en macOS: abre la app en el navegador con un servidor local.
cd "$(dirname "$0")"
echo "Meta Ads Research OS · Visión Digital"
echo "Abriendo en http://localhost:8080  (cierra esta ventana para detener)"
( sleep 1; open "http://localhost:8080" ) &
python3 -m http.server 8080
