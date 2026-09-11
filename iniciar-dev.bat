@echo off
setlocal
cd /d "%~dp0"
title AleJoias - Ambiente de desenvolvimento
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\dev-windows.ps1"
if errorlevel 1 (
  echo.
  echo Nao foi possivel iniciar. Confira a mensagem acima.
  pause
)
endlocal
