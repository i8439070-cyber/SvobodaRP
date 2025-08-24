@echo off
title Svoboda RP - alt:V Server
echo =====================================
echo   Svoboda RP (Windows) - Start Script
echo =====================================
if not exist altv-server.exe (
  echo [ERROR] altv-server.exe не знайдено. Скопіюй файл з офіційного дистрибутиву alt:V у цей каталог.
  pause
  exit /b 1
)
altv-server.exe
pause