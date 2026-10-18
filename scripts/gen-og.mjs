import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { extname, join, sep } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

const OG_WIDTH = 1200
const OG_HEIGHT = 630
const READY_TIMEOUT_MS = 15_000
const POLL_MS = 100
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const END_SCREEN_SHOWN =
  "document.getElementById('end') !== null && getComputedStyle(document.getElementById('end')).visibility === 'visible'"

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.vcf': 'text/vcard; charset=utf-8',
}

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const target = join(root, 'public/og-image.png')
const unanswered = []

async function serveFromDist(req, res) {
  const { pathname } = new URL(req.url, 'http://127.0.0.1')
  const file = join(dist, pathname.replace(/\/$/, '/index.html'))
  const type = MIME_TYPES[extname(file)]
  const body = type && file.startsWith(dist + sep) ? await readFile(file).catch(() => null) : null
  if (body === null) {
    unanswered.push(pathname)
    res.writeHead(404).end()
    return
  }
  res.writeHead(200, { 'content-type': type }).end(body)
}

function connectToDevtools(url) {
  const socket = new WebSocket(url)
  const replies = new Map()
  const eventListeners = []
  const opened = new Promise((resolve, reject) => {
    socket.onopen = resolve
    socket.onerror = () => reject(new Error(`could not connect to DevTools at ${url}`))
  })
  let lastId = 0
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data)
    if (message.id === undefined) {
      eventListeners.forEach((listener) => listener(message))
      return
    }
    replies.get(message.id)(message)
    replies.delete(message.id)
  }
  async function send(method, params = {}, sessionId) {
    await opened
    const id = ++lastId
    const reply = new Promise((resolve) => replies.set(id, resolve))
    socket.send(JSON.stringify({ id, method, params, sessionId }))
    const { result, error } = await reply
    if (error) throw new Error(`${method} failed: ${error.message}`)
    return result
  }
  return { send, eventListeners, close: () => socket.close() }
}

async function launchChrome(profile) {
  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      `--user-data-dir=${profile}`,
      '--hide-scrollbars',
      '--force-prefers-reduced-motion',
      '--remote-debugging-port=0',
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  )
  const devtoolsUrl = await new Promise((resolve, reject) => {
    let log = ''
    chrome.stderr.on('data', (chunk) => {
      log += chunk
      const match = log.match(/DevTools listening on (ws:\/\/\S+)/)
      if (match) resolve(match[1])
    })
    chrome.once('exit', (code) => reject(new Error(`Chrome exited with ${code} before DevTools was up`)))
  })
  return { chrome, devtoolsUrl }
}

async function waitFor(condition, what) {
  const deadline = Date.now() + READY_TIMEOUT_MS
  while (Date.now() < deadline) {
    if (await condition()) return
    await sleep(POLL_MS)
  }
  throw new Error(`timed out waiting for ${what}`)
}

async function captureEndScreen(origin, devtoolsUrl) {
  const browser = connectToDevtools(devtoolsUrl)
  const pageErrors = []
  browser.eventListeners.push(({ method, params }) => {
    if (method === 'Runtime.exceptionThrown') {
      pageErrors.push(params.exceptionDetails.exception?.description ?? params.exceptionDetails.text)
    }
    if (method === 'Runtime.consoleAPICalled' && params.type === 'error') {
      pageErrors.push(params.args.map((arg) => arg.value ?? arg.description).join(' '))
    }
  })
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true })
  const page = (method, params) => browser.send(method, params, sessionId)
  const evaluate = async (expression) =>
    (await page('Runtime.evaluate', { expression, returnByValue: true })).result.value

  await page('Runtime.enable')
  await page('Emulation.setDeviceMetricsOverride', {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await page('Page.navigate', { url: `${origin}/` })
  await waitFor(() => evaluate(END_SCREEN_SHOWN), 'the end screen to show')

  const [width, height] = await evaluate('[innerWidth, innerHeight]')
  if (width !== OG_WIDTH || height !== OG_HEIGHT) {
    throw new Error(`the film measured a ${width}x${height} viewport, not ${OG_WIDTH}x${OG_HEIGHT}`)
  }
  const { data } = await page('Page.captureScreenshot', { format: 'png' })
  browser.close()
  return { png: Buffer.from(data, 'base64'), pageErrors }
}

if (!existsSync(join(dist, 'index.html'))) {
  console.error('run pnpm build first')
  process.exit(1)
}

const server = createServer(serveFromDist)
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const profile = mkdtempSync(join(tmpdir(), 'og-'))
let chrome

try {
  const launched = await launchChrome(profile)
  chrome = launched.chrome
  const origin = `http://127.0.0.1:${server.address().port}`
  const { png, pageErrors } = await captureEndScreen(origin, launched.devtoolsUrl)
  if (unanswered.length > 0) {
    throw new Error(`the page asked for files dist/ does not serve: ${unanswered.join(', ')}`)
  }
  if (pageErrors.length > 0) {
    throw new Error(`the page logged errors: ${pageErrors.join(' | ')}`)
  }
  writeFileSync(target, png)
} finally {
  if (chrome && chrome.exitCode === null && chrome.signalCode === null) {
    chrome.kill()
    await once(chrome, 'exit')
  }
  server.close()
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
}

console.log(`written: ${target}`)
