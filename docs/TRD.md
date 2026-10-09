# TRD — The Achievers Rebuild

## Stack
Vanilla HTML5 + CSS3 + JS (no framework). `css/style.css` (~7KB), `js/app.js` (~3KB, deferred). 1 Google Font (Inter, display=swap) + system fallback.

## Performance
- Budget <120KB first load, no libs, no jQuery/Bootstrap
- `loading=lazy` below fold, width/height to avoid CLS, preconnect fonts
- Sticky header, IntersectionObserver counters/reveal, native details/summary FAQ
- Cache: netlify.toml immutable for /css /js; security headers

## Structure
- Shared header/footer, `container max 1200px`, breakpoints 1000px / 640px
- JS modules: nav, active link, counters, slider, filter+search, validate, toTop
- SEO: title/description/canonical/OG per page, JSON-LD org on home, robots + sitemap
- Deploy: Netlify publish `.`, redirects /syllabus → courses#syllabus, /counselling → contact

## Test
Resize 360/768/1200, keyboard tab, Lighthouse target 95+ mobile, check all 6 links + forms.
