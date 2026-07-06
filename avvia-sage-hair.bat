@echo off
rem Avvia Sage Hair su Windows: doppio click su questo file.
cd /d "%~dp0"
start "" cmd /c "ping -n 2 127.0.0.1 >nul & start http://localhost:8420"
where py >nul 2>nul
if %errorlevel%==0 (
  py server.py
) else (
  python server.py
)
pause
