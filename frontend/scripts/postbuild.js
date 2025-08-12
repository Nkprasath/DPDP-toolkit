// Copy dist/index.html to dist/404.html for SPA fallback on GitHub Pages
// And create a .nojekyll file to avoid Jekyll processing
const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'dist');
const indexHtml = path.join(dist, 'index.html');
const notFoundHtml = path.join(dist, '404.html');
const noJekyll = path.join(dist, '.nojekyll');

if (!fs.existsSync(dist)) {
  console.error('[postbuild] dist folder not found:', dist);
  process.exit(0);
}

try {
  if (fs.existsSync(indexHtml)) {
    fs.copyFileSync(indexHtml, notFoundHtml);
    console.log('[postbuild] 404.html created');
  } else {
    console.warn('[postbuild] index.html not found, skipping 404 copy');
  }
  fs.writeFileSync(noJekyll, '');
  console.log('[postbuild] .nojekyll created');
} catch (err) {
  console.error('[postbuild] error:', err);
  process.exit(1);
}
