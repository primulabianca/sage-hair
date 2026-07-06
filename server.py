#!/usr/bin/env python3
"""Server di Sage Hair.

Serve l'app e tiene la copia condivisa dei dati (sage-hair-data.json,
accanto a questo file) per la sincronizzazione WiFi tra dispositivi.
Solo libreria standard: funziona identico su macOS e Windows.

Avvio:  python3 server.py   (oppure doppio click sugli script "avvia-sage-hair")
"""
import json
import os
import socket
import tempfile
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 8420
BASE = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE, "sage-hair-data.json")
MAX_BODY = 512 * 1024 * 1024  # 512 MB: tante foto ci stanno comode
os.chdir(BASE)


class SageHairHandler(SimpleHTTPRequestHandler):
    def _send_cors(self):
        # l'app può girare anche da un altro indirizzo (es. GitHub Pages):
        # accettiamo le richieste e rispondiamo ai preflight del browser
        self.send_header("Access-Control-Allow-Origin", self.headers.get("Origin", "*") or "*")
        self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        if self.headers.get("Access-Control-Request-Private-Network") == "true":
            self.send_header("Access-Control-Allow-Private-Network", "true")

    def _send_json(self, code, body_bytes):
        self.send_response(code)
        self._send_cors()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body_bytes)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body_bytes)

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors()
        self.end_headers()

    def do_GET(self):
        if self.path.split("?")[0] == "/api/data":
            if os.path.exists(DATA_FILE):
                with open(DATA_FILE, "rb") as f:
                    self._send_json(200, f.read())
            else:
                self._send_json(200, b"{}")
            return
        super().do_GET()

    def do_POST(self):
        if self.path.split("?")[0] != "/api/data":
            self._send_json(404, b'{"error": "not found"}')
            return
        length = int(self.headers.get("Content-Length", 0))
        if length <= 0 or length > MAX_BODY:
            self._send_json(400, b'{"error": "dimensione non valida"}')
            return
        body = self.rfile.read(length)
        try:
            json.loads(body)  # dev'essere JSON valido, il contenuto non ci riguarda
        except ValueError:
            self._send_json(400, b'{"error": "JSON non valido"}')
            return
        # scrittura atomica: mai un file dati a metà, nemmeno se salta la corrente
        fd, tmp = tempfile.mkstemp(dir=BASE, suffix=".tmp")
        with os.fdopen(fd, "wb") as f:
            f.write(body)
        os.replace(tmp, DATA_FILE)
        self._send_json(200, b'{"ok": true}')

    def log_message(self, fmt, *args):
        pass  # niente rumore in console


def lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))  # nessun dato inviato: serve solo a scoprire l'IP locale
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return None


if __name__ == "__main__":
    print("🌿 Sage Hair — server avviato", flush=True)
    print(f"   Su questo computer:  http://localhost:{PORT}", flush=True)
    ip = lan_ip()
    if ip:
        print(f"   Dal telefono (stessa WiFi):  http://{ip}:{PORT}", flush=True)
        print(f"   → nell'app, in Impostazioni → Sincronizzazione WiFi, usa: http://{ip}:{PORT}", flush=True)
    print("   Per fermarlo: chiudi questa finestra (o Ctrl+C).", flush=True)
    try:
        ThreadingHTTPServer(("0.0.0.0", PORT), SageHairHandler).serve_forever()
    except KeyboardInterrupt:
        print("\nServer fermato. A presto!", flush=True)
