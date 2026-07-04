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
  @font-face { font-family: Literata; font-weight: 700; src: url(${font('literata-latin-700.woff2')}) format('woff2'); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #f6f1e7; color: #211d15;
    font-family: Literata, Georgia, serif;
    padding: 84px 96px;
  }
  .stone { width: 24px; height: 24px; background: #211d15; margin-bottom: 44px; }
  h1 { font-size: 84px; line-height: 1; font-weight: 700; letter-spacing: -0.01em; }
  h1 span { font-weight: 400; font-size: 52px; color: #6f6553; }
  .gram { margin-top: 20px; font-size: 30px; color: #6f6553; }
  .rule { margin: 40px 0 36px; height: 1px; background: #d9d1c0; }
  .senses { list-style: none; font-size: 31px; line-height: 52px; }
  .senses b { color: #9a3b1e; font-weight: 700; }
  .senses i { font-style: normal; color: #6f6553; }
  .domain { position: absolute; left: 96px; bottom: 40px; font-size: 26px; color: #6f6553; }
</style>
</head>
<body>
  <div class="stone"></div>
  <h1>Eck·stein, <span>der</span></h1>
  <p class="gram">[ˈɛkˌʃtaɪ̯n] · Substantiv, maskulin</p>
  <div class="rule"></div>
  <ol class="senses">
    <li><b>1.</b> Stein an der Ecke eines Bauwerks</li>
    <li><b>2.</b> <i>⟨übertragen⟩</i> Grundlage, auf der alles Weitere aufbaut</li>
    <li><b>3.</b> <i>⟨hier⟩</i> Benjamin Eckstein, Agentic Engineer</li>
  </ol>
  <p class="domain">eckstein.io</p>
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
