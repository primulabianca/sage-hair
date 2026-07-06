#!/bin/zsh
# Avvia Sage Hair sul Mac: doppio click su questo file dal Finder.
cd "$(dirname "$0")"
PORT=8420
if lsof -i :$PORT >/dev/null 2>&1; then
  # server già attivo: apri solo il browser
  open "http://localhost:$PORT"
else
  ( sleep 1; open "http://localhost:$PORT" ) &
  exec python3 server.py
fi
