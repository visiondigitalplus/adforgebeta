@echo off
title Meta Ads Research OS - Vision Digital
cd /d "%~dp0"
echo Abriendo en http://localhost:8080  (cierra esta ventana para detener)
start "" http://localhost:8080
python -m http.server 8080
if errorlevel 1 (
  echo.
  echo No se encontro Python. Abre directamente el archivo index.html
  pause
)
