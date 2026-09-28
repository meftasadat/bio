import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.resolve(rootDir, 'dist')
const distSsrDir = path.resolve(rootDir, 'dist-ssr')
const indexPath = path.resolve(distDir, 'index.html')

console.log('⚡ Prerendering static HTML for crawlers and preview bots...')

try {
  // 1. Compile SSR bundle with Vite
  execSync('npx vite build --ssr src/prerender.jsx --outDir dist-ssr', {
    cwd: rootDir,
    stdio: 'inherit',
  })

  // 2. Import compiled SSR renderer
  const ssrBundlePath = path.resolve(distSsrDir, 'prerender.js')
  const { render } = await import(pathToFileURL(ssrBundlePath).href)

  // 3. Render HTML for root route
  const appHtml = render('/')

  // 4. Inject into dist/index.html
  if (!fs.existsSync(indexPath)) {
    throw new Error(`dist/index.html not found at ${indexPath}`)
  }

  let indexHtml = fs.readFileSync(indexPath, 'utf-8')
  indexHtml = indexHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  fs.writeFileSync(indexPath, indexHtml, 'utf-8')
  console.log(`✅ Successfully prerendered root HTML into ${indexPath} (${(Buffer.byteLength(indexHtml) / 1024).toFixed(1)} KB)`)

  // 5. Clean up dist-ssr
  fs.rmSync(distSsrDir, { recursive: true, force: true })

  // 6. Sync to backend/app/static/web if directory exists
  const backendWebDir = path.resolve(rootDir, '../backend/app/static/web')
  if (fs.existsSync(backendWebDir)) {
    fs.cpSync(distDir, backendWebDir, { recursive: true })
    console.log(`✅ Synced prerendered build to backend/app/static/web/`)
  }
} catch (error) {
  console.error('❌ Prerendering failed:', error)
  process.exit(1)
}
