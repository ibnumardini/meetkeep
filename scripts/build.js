const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

const root = path.join(__dirname, '..');
const buildDir = path.join(root, 'build');
const iconsDir = path.join(buildDir, 'icons');

fs.rmSync(buildDir, { recursive: true, force: true });
fs.mkdirSync(iconsDir, { recursive: true });

async function build() {
  for (const file of fs.readdirSync(path.join(root, 'src'))) {
    const src = path.join(root, 'src', file);
    const dest = path.join(buildDir, file);

    if (file.endsWith('.js')) {
      const code = fs.readFileSync(src, 'utf-8');
      const result = await minify(code, { compress: true, mangle: true });
      fs.writeFileSync(dest, result.code);
    } else if (file.endsWith('.css')) {
      const code = fs.readFileSync(src, 'utf-8');
      const result = new CleanCSS().minify(code);
      fs.writeFileSync(dest, result.styles);
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  for (const file of fs.readdirSync(path.join(root, 'icons'))) {
    fs.copyFileSync(path.join(root, 'icons', file), path.join(iconsDir, file));
  }

  console.log('Build complete → build/');
}

build().catch(err => { console.error(err); process.exit(1); });
