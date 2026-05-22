# GitHub Pages static export

Questa cartella è generata da `python scripts/export_static.py`.
I template originali Django non sono stati modificati: `docs/` è solo l'output statico da pubblicare con GitHub Pages.

## Pagine esportate

- `/ -> home.html`
- `/contatti/ -> contatti.html`
- `/demo/ -> demo_list.html`
- `/demo/romantico/ -> demo_romantico.html`
- `/demo/choco/ -> demo_romantico.html`
- `/demo/minimal/ -> demo_minimal.html`
- `/demo/boho/ -> demo_boho.html`
- `/demo/luxury/ -> demo_luxury.html`
- `/demo/destination/ -> demo_destination.html`
- `/demo2/ -> demo2.html`
- `/demo3/ -> demo3.html`
- `/demo4/ -> demo4.html`
- `/demo5/ -> demo5.html`
- `/demo6/ -> demo6.html`
- `/demo7/ -> demo7.html`
- `/brochure_ita/ -> brochure_ita.html`
- `/brochure_eng/ -> brochure_eng.html`
- `/partnerkit/ -> partnerkit.html`
- `/emma&james/ -> emma&james.html`
- `/charlotte&oliver/ -> charlotte&oliver.html`
- `/sara&andrea/ -> sara&andrea.html`
- `/harry&kate/ -> harry&kate.html`

## Note operative

- `demo8/` non è stata esportata perché il routing Django la dichiara, ma `templates/demo8.html` non esiste nel progetto.
- `/demo/choco/` è stata esportata come nel comportamento Django attuale: nel routing punta a `demo_romantico.html`.
- `CNAME` è impostato su `www.weddingcoding.it`; modificalo se vuoi usare il dominio apex `weddingcoding.it`.
- Alcune pagine demo contenevano riferimenti a immagini locali non incluse nello ZIP; per evitare icone rotte sono stati aggiunti placeholder nella sola cartella `docs/` senza modificare i template originali.
