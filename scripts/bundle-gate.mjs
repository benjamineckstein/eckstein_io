// Page weight gate for eckstein.io.
// Sums everything a first view of a page needs: the HTML document
// (CSS and JS are inlined), any emitted _astro assets, both woff2
// fonts and the favicon. Fails hard over LIMIT_KB, warns over TARGET_KB.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const TARGET_KB = 50
const LIMIT_KB = 75

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const isText = (f) => /\.(html|css|js|svg|txt|json)$/.test(f)

function asset(path) {
  const raw = statSync(join(dist, path)).size
  const transfer = isText(path) ? gzipSync(readFileSync(join(dist, path)), { level: 9 }).length : raw
  return { path, raw, transfer }
}

// Shared assets fetched by every page.
const shared = ['favicon.svg', 'fonts/literata-latin-400.woff2', 'fonts/literata-latin-700.woff2']
if (existsSync(join(dist, '_astro'))) {
  for (const f of readdirSync(join(dist, '_astro'))) shared.push(join('_astro', f))
}

const pages = ['index.html', 'en/index.html']
let failed = false

for (const page of pages) {
  const assets = [asset(page), ...shared.map(asset)]
  const raw = assets.reduce((s, a) => s + a.raw, 0)
  const transfer = assets.reduce((s, a) => s + a.transfer, 0)
  const kb = (n) => (n / 1024).toFixed(1)

  console.log(`\n=== /${page.replace(/index\.html$/, '')} ===`)
  for (const a of assets) {
    console.log(`  ${kb(a.raw).padStart(6)} kB raw  ${kb(a.transfer).padStart(6)} kB transfer  ${a.path}`)
  }
  console.log(`  total: ${kb(raw)} kB raw, ${kb(transfer)} kB transfer (target ${TARGET_KB} kB, limit ${LIMIT_KB} kB raw)`)

  // Hard gate on raw bytes; the 50 kB target is judged on transfer bytes,
  // since GitHub Pages serves text assets compressed and woff2 already is.
  if (raw > LIMIT_KB * 1024) {
    console.error(`  FAIL: ${kb(raw)} kB raw exceeds the ${LIMIT_KB} kB limit`)
    failed = true
  } else if (transfer > TARGET_KB * 1024) {
    console.warn(`  WARN: ${kb(transfer)} kB transfer is over the ${TARGET_KB} kB target (still under the ${LIMIT_KB} kB raw limit)`)
  }
}

process.exit(failed ? 1 : 0)
