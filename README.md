# eckstein.io

A single-page dictionary entry for the surname Eckstein, typeset like a Duden page. Three
senses: the literal corner stone, the figurative foundation, and Benjamin Eckstein, freelance
agentic engineer near Berlin. German at `/`, English at `/en/`, plus Impressum and Datenschutz.
Built with Astro, static output, deployed to GitHub Pages.

There is no framework on the client, no tracking, no cookies and no external request of any
kind at runtime. One self-hosted serif (Literata, latin subset, 400 and 700), one hand-written
stylesheet on a strict 28px baseline grid, and one small inline script for the theme toggle and
the cornerstone interaction: hold the 12px square top left to see the baseline grid, click it
short to open the first public commit. A machine layer (`/llms.txt`, `/benjamin.json`,
`/benjamin.vcf`, JSON-LD) serves visiting agents.

## Weight budget

The whole point is weight. A page view is the HTML document (styles and script inlined), two
woff2 fonts and the favicon.

- Target: under 50 kB total.
- Hard CI gate: 75 kB raw, enforced by `scripts/bundle-gate.mjs` on every deploy.

Run `pnpm build && pnpm bundle-gate` to see the current numbers.

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

## DNS cutover checklist (GitHub Pages)

1. Apex `eckstein.io`: A records to 185.199.108.153, 185.199.109.153, 185.199.110.153,
   185.199.111.153 and AAAA records to 2606:50c0:8000::153, 2606:50c0:8001::153,
   2606:50c0:8002::153, 2606:50c0:8003::153.
2. `www.eckstein.io`: CNAME to `benjamineckstein.github.io`.
3. Repo settings: Pages custom domain `eckstein.io` (matches `public/CNAME`), wait for the
   certificate, then enforce HTTPS.
4. After cutover: verify canonical URLs resolve, add the property in Google Search Console,
   submit the sitemap, let the IndexNow step in the deploy workflow ping Bing.
5. Verify nothing still depends on the old 301 from eckstein.io to codewithagents.de: check
   old inbound links, mail signatures and profiles that used the redirect.
