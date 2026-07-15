# Moujtahid — Landing Page

Static landing page for **Moujtahid**, a school-center management platform for tutoring centers in Morocco.

Built as a plain static site (HTML + CSS + vanilla JS) — no build step, no dependencies.

## Run it

Open `index.html` in a browser, or serve the folder with any static server. For example:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000`.

If placed under an XAMPP/Apache `htdocs` folder, it is served directly (e.g. `http://localhost/Moujtahid-Landing/`).

## Structure

```
index.html          Full page (video intro + landing sections)
css/style.css       All styles (landing + video intro + reveal animations)
js/script.js        Interactions: typewriter intro, scroll reveals, nav,
                    parallax, counters, FAQ, custom selects, demo form
assets/photos/      Images
assets/videos/      Intro background video
hero/               Original Angular component source (reference only)
```

## Notes

- The demo request form simulates a successful submission on the client side; no backend is wired up yet.
- Auth / login links point to `#` as placeholders.
- `hero/` contains the original Angular standalone component this static page was ported from.
