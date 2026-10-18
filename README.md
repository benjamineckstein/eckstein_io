# eckstein.io

Personal site of Benjamin Eckstein, freelance agentic engineer near Berlin: a 46-second film
over a real HTML end screen that holds three links. German at `/`, English at `/en/`, plus
Impressum and Datenschutz. Built with Astro, static output, deployed to GitHub Pages.

The film plays on every visit. Any tap, click, scroll or key press skips to the end screen, and
a button there plays it again. Reduced motion and `?end=1` go straight to the end screen (the
DE / EN switch and the legal pages' back links use `?end=1`, so they never replay the film).
Without JavaScript the end screen is all there is. It is rendered from `src/lib/copy.ts`; the
film is a canvas drawn over it that reads its copy and positions from the page itself.

There is no framework on the client, no tracking, no cookies, no storage and no external
request of any kind at runtime. Epilogue and Fragment Mono are self-hosted under the OFL
(`public/fonts`). A machine layer (`/llms.txt`, `/benjamin.json`, `/benjamin.vcf`, JSON-LD)
serves visiting agents.

## Status

Live at https://www.eckstein.io on GitHub Pages. The Pages custom domain is `www.eckstein.io`;
the apex 301s to it and HTTPS is enforced. Every push to `main` deploys automatically via
GitHub Actions, with a page-weight gate in the pipeline. The external link check runs on
demand via workflow dispatch, there are no scheduled jobs.

## Weight budget

A page view is the HTML document (styles and the film script inlined), two woff2 fonts and the
favicon.

- Target: under 105 kB total transfer (what actually goes over the wire; GitHub Pages serves
  text assets compressed, woff2 already is).
- Hard CI gate: 180 kB raw, enforced by `scripts/bundle-gate.mjs` on every deploy.
- Measured: about 157 kB raw and 92 kB transfer per page. The HTML is 107 kB raw, 43 kB
  gzipped; the two fonts are 50 kB.

Run `pnpm build && pnpm bundle-gate` to see the current numbers.

## Development

```
pnpm install
pnpm dev                    # local dev server
pnpm build                  # static build into dist/
pnpm bundle-gate            # after a build: page weight against the budget
node scripts/gen-og.mjs     # after a build: regenerate public/og-image.png
bash scripts/linkcheck.sh   # after a build: curl every external link
```

The film's source is `src/film/*.js`, seven parts that `src/components/Film.astro` joins into
one inline script. `pnpm dev` and `FILM_DEV=1 pnpm build` switch on the review hooks
(`?t=<seconds>` seeks, `?perf=1`, `window.__m`); the plain build that CI runs leaves them out.

The footer of the legal pages and the 404 page shows the short hash of the commit the build
was made from (`git rev-parse`, executed at build time in `src/lib/site.ts`, falls back to
"dev").

## Future ideas

- Reserved subdomains: `cv.eckstein.io` for a machine-readable CV, `talks.eckstein.io` for
  slides and recordings.
