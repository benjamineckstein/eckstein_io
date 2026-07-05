// One-off generator for public/og-image.png (1200x630).
// Builds an HTML rendition of the dictionary entry with the site fonts
// embedded as data URIs, then screenshots it with headless Chrome.
// Run locally: node scripts/gen-og.mjs
// Not part of the build. The PNG is committed.
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const font = (f) =>
  `data:font/woff2;base64,${readFileSync(join(root, 'public/fonts', f)).toString('base64')}`

const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: Literata; font-weight: 400; src: url(${font('literata-latin-400.woff2')}) format('woff2'); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #121214; color: #f2ede3;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    padding: 60px 68px;
    position: relative;
  }
  .name { font-weight: 700; font-size: 26px; letter-spacing: 0.01em; }
  .role {
    color: #34d399; font-weight: 700; font-size: 17px; letter-spacing: 0.28em;
    text-transform: uppercase; margin-top: 6px;
  }
  h1 {
    font-weight: 900; font-size: 188px; line-height: 0.84;
    margin-top: 16px; position: relative; width: fit-content;
  }
  .row { display: flex; gap: 0.28em; }
  .row + .row { margin-top: 0.04em; }
  .dict {
    position: absolute; right: 4px; bottom: -0.5em;
    font-family: Literata, Georgia, serif; font-style: italic;
    font-size: 22px; color: #a39e93;
  }
  .tag {
    font-family: Literata, Georgia, serif; font-style: italic;
    color: #a39e93; font-size: 25px; margin-top: 26px;
  }
  .domain { position: absolute; left: 68px; bottom: 34px; font-size: 22px; color: #a39e93; }
  .stone { position: absolute; right: 0; bottom: 0; width: 56px; height: 56px; background: #059669; }
</style>
</head>
<body>
  <p class="name">Benjamin Eckstein</p>
  <p class="role">Agentic Engineer</p>
  <h1>
    <span class="row">ECK</span>
    <span class="row">STEIN</span>
    <span class="dict">der; -s, -e</span>
  </h1>
  <p class="tag">Schreibt seit zwanzig Jahren Software. Bringt es jetzt Maschinen bei.</p>
  <p class="domain">eckstein.io</p>
  <div class="stone"></div>
</body>
</html>`

const dir = mkdtempSync(join(tmpdir(), 'og-'))
const page = join(dir, 'og.html')
writeFileSync(page, html)

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const out = join(root, 'public/og-image.png')
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--force-device-scale-factor=1',
  '--window-size=1200,630',
  '--hide-scrollbars',
  `--screenshot=${out}`,
  `file://${page}`,
])
console.log(`written: ${out}`)
