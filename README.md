# WeddingCollab (Django) – pronto per VSCode + Render

Questo progetto è un sito Django semplice con:
- Home
- Contatti
- Demo (lista di 5 demo) + 5 pagine demo cliccabili

## Avvio in locale (Windows/macOS/Linux)
1) Crea e attiva un virtualenv
2) Installa le dipendenze:
   ```bash
   pip install -r requirements.txt
   ```
3) Applica le migrazioni e avvia:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
4) Apri: http://127.0.0.1:8000

## Deploy su Render (consigliato)
- Carica questa cartella su GitHub.
- Su Render: **New -> Web Service -> collegalo al repo**.
- Render userà `render.yaml` (Blueprint) per configurare tutto.
  In alternativa, imposta:
  - Build Command: `./build.sh`
  - Start Command: `gunicorn weddingcollab.wsgi:application`

Variabili d'ambiente minime:
- `SECRET_KEY` (Render la crea automaticamente dal blueprint)
- `DEBUG` (di default false in Render)

## Struttura
- `weddingcollab/` progetto Django
- `website/` app con views, urls, template
- `templates/` base + pagine
- `static/` asset (minimi) + CSS
