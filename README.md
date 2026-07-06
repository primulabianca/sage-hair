# Sage Hair 🌿 — diario dei capelli

App per tracciare la crescita e la cura naturale dei capelli. Tutto resta sui tuoi
dispositivi e sulla tua rete di casa: niente account, niente cloud.

## Funzioni

- **Calendario mensile** — tocca un giorno per vedere o aggiungere le voci.
- **Voci con note e foto** — ogni voce ha un campo note spazioso e fino a 5 foto.
- **Tipi di voce con icona** (visibili anche dal calendario):
  📏 Lunghezza (metro giallo) · 🥣 Impacco (ciotolina) · ☠️ Schiaritura (flacone col teschio) ·
  🎨 Colore (tavolozza) · ✂️ Taglio (forbice) · 🧯 Phon/piastra (estintore) · 🌿 Nota
- **Lunghezza in cm o pollici** — il bottone `cm`/`in` in alto converte tutto.
- **Statistiche** — ultima misura, crescita totale e mensile, grafico dell'andamento,
  conteggio voci, "quanto tempo è passato dall'ultimo taglio/schiaritura/…".
- **Timer** — per la posa dell'impacco, con preset, pausa e avviso sonoro.
- **Backup e sincronizzazione** — vedi sotto.

## Come avviarla sul computer

- **Mac**: doppio click su `avvia-sage-hair.command` (la prima volta: tasto destro → Apri).
- **Windows**: doppio click su `avvia-sage-hair.bat` (serve Python 3: python.org, spuntando
  "Add to PATH" durante l'installazione).

Si apre il browser su `http://localhost:8420` e parte il piccolo server che tiene la copia
condivisa dei dati (`sage-hair-data.json`, accanto all'app). La finestra del server mostra
l'indirizzo da usare dal telefono.

## Come averla sul telefono

L'app è una PWA: si installa dal browser, senza APK né Play Store. Serve pubblicarla su un
indirizzo HTTPS; la via più semplice e gratuita è GitHub Pages:

L'app è pubblicata dal repository `primulabianca/sage-hair` (il `.gitignore` esclude
`sage-hair-data.json`: i dati personali NON vengono mai pubblicati).

Sul telefono apri `https://primulabianca.github.io/sage-hair/`:
   - **Android**: Chrome → menu ⋮ → "Aggiungi a schermata Home" → Installa.
   - **iPhone**: Safari → tasto condividi → "Aggiungi a schermata Home".

## Passare i dati tra i dispositivi

Il modo principale è il **backup condiviso** (menu ⋯):

- Sul telefono, **Condividi backup** prepara un file con tutto (foto comprese) e apre il
  menu di condivisione: WhatsApp, Telegram, Drive, email… Il file ha un nome parlante con
  data e ora (es. `sage_hair_backup_2026-07-06_ore15-30.json`).
- Sull'altro dispositivo, **Importa backup** lo unisce ai dati esistenti: per ogni voce
  vince la versione più recente, niente doppioni, e importare due volte non fa danni.
- Sul computer c'è **Esporta dati** (download classico del file).

Per chi ha dimestichezza c'è anche la **Sincronizzazione WiFi** (menu ⋯ → sezione "per
utenti esperti"): col server acceso sul computer, "Sincronizza ora" allinea i due diari
in automatico sulla rete di casa. Sul computer funziona subito (indirizzo precompilato).

### Nota per il sync WiFi dal telefono

Se l'app sul telefono è installata da GitHub Pages (https), il browser potrebbe bloccare le
richieste verso il computer di casa (http): è una protezione standard chiamata "mixed
content". Prova prima "Sincronizza ora" — sui Chrome recenti può funzionare con una
richiesta di permesso. Se viene bloccata, la soluzione una-tantum su Android è:

1. Chrome → apri `chrome://flags/#unsafely-treat-insecure-origin-as-secure`
2. Nel campo scrivi l'indirizzo del computer, es. `http://192.168.1.148:8420`
3. Imposta su "Enabled" e riavvia Chrome.

(Conviene dare al computer un IP fisso nel router, così l'indirizzo non cambia.)
In alternativa, il "Condividi backup" resta sempre a portata di mano.

## Struttura

- `index.html`, `styles.css`, `app.js` — l'app
- `server.py` — server locale: serve l'app e gestisce la sincronizzazione (solo Python standard)
- `manifest.webmanifest`, `sw.js`, `icon*` — installazione PWA e uso offline
- `avvia-sage-hair.command` / `avvia-sage-hair.bat` — avvio rapido su Mac / Windows
- `sage-hair-data.json` — la copia condivisa dei dati (creata al primo sync; mai su GitHub)

Nessuna dipendenza esterna: HTML/CSS/JavaScript puro + Python standard.
