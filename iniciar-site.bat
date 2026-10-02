@echo off
chcp 65001 >nul
title Site DJ Feh Moura
cd /d "%~dp0"
where node >/dev/null 2>nul
if errorlevel 1 (
  echo.
  echo Node.js nao encontrado. Instale a versao LTS em https://nodejs.org e rode este arquivo de novo.
  start https://nodejs.org
  pause
  exit /b
)
if not exist node_modules (
  echo Instalando dependencias, isso leva alguns minutos na primeira vez...
  call npm install
)
echo.
echo Abrindo o site em http://localhost:3000 ...
start "" cmd /c "timeout /t 8 >/dev/null && start http://localhost:3000"
call npm run dev
pause
