# eckstein.io

A black brutalist poster: giant staggered ECK / STEIN letters that drop, overshoot and settle
on load, a dictionary micro-mark for the surname, and a numbered list of three links to
Benjamin Eckstein, freelance agentic engineer near Berlin. German at `/`, English at `/en/`,
plus Impressum and Datenschutz. Dark is the default identity on every visit, regardless of OS
preference; a manual toggle opts into the cream/paper light variant. Built with Astro, static
output, deployed to GitHub Pages.

There is no framework on the client, no tracking, no cookies and no external request of any
kind at runtime. One self-hosted serif (Literata, latin subset, 400 and 700) for the tagline
and a few literary flourishes, the system sans stack for the giant letters and UI chrome, and
vanilla JS for the theme toggle, the entrance animation (a small canvas of falling-dust
particles) and the cornerstone interaction: one stone tumbles out of the headline and settles
in the bottom right corner during the drop; a short click reveals a fourth, hidden sense,
holding brightens the faint architect grid. A machine layer (`/llms.txt`, `/benjamin.json`,
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

Accepted trade-off: the page ships roman 400 and 700 only. The tagline, dictionary mark and
link hints are set in italic, but the Literata italic subset would cost another ~20 kB and
push the page over the target, so `font-synthesis: none` guarantees no faux italic ever
renders; those lines stay upright by design, not by omission.

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
