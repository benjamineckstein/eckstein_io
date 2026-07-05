# eckstein.io

A single-page dictionary entry for the surname Eckstein, typeset like a Duden page. Three
senses: the literal corner stone, the figurative foundation, and Benjamin Eckstein, freelance
agentic engineer near Berlin. German at `/`, English at `/en/`, plus Impressum and Datenschutz.
Built with Astro, static output, deployed to GitHub Pages.

There is no framework on the client, no tracking, no cookies and no external request of any
kind at runtime. One self-hosted serif (Literata, latin subset, 400 and 700), one hand-written
stylesheet on a strict 28px baseline grid, and one small inline script for the theme toggle and
the cornerstone interaction: hold the 12px square top left to see the baseline grid; a short
click reveals a fourth, hidden dictionary sense. A machine layer (`/llms.txt`, `/benjamin.json`,
`/benjamin.vcf`, JSON-LD) serves visiting agents.

## Status

Live at https://eckstein.io on GitHub Pages. The apex is the primary domain, `www` redirects
to it, HTTPS is enforced. Every push to `main` deploys automatically via GitHub Actions, with
a page-weight gate in the pipeline. The external link check runs on demand via workflow
dispatch, there are no scheduled jobs.

## Weight budget

The whole point is weight. A page view is the HTML document (styles and script inlined), two
woff2 fonts and the favicon.

- Target: under 50 kB total transfer (what actually goes over the wire; GitHub Pages serves
  text assets compressed, woff2 already is).
- Hard CI gate: 75 kB raw, enforced by `scripts/bundle-gate.mjs` on every deploy.

Run `pnpm build && pnpm bundle-gate` to see the current numbers.

Accepted trade-off: the entry ships roman 400 and 700 only. Usage labels a dictionary would
set in italic stay roman (muted, in ‹ › guillemets); the Literata italic subset would cost
another ~20 kB and push the page over the target. `font-synthesis: none` guarantees no faux
italic or bold ever renders. The IPA line is pinned to Georgia, since Literata lacks three of
its glyphs.

## Development

```
pnpm install
pnpm dev        # local dev server
pnpm build      # static build into dist/
pnpm bundle-gate
bash scripts/linkcheck.sh   # after a build: curl every external link
```

The footer shows the short hash of the commit the build was made from (`git rev-parse`,
executed at build time in `src/lib/site.ts`, falls back to "dev").

## Future ideas

- Reserved subdomains: `cv.eckstein.io` for a machine-readable CV, `talks.eckstein.io` for
  slides and recordings.
- Mail on the domain (`mail@eckstein.io` or `post@eckstein.io`) once MX hosting is decided.
  Until then, contact stays on benjamin@codewithagents.de.
