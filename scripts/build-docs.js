const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

const root = path.join(__dirname, '..');
const srcDir = path.join(root, 'src', 'docs');
const docsDir = path.join(root, 'build', 'docs');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    fs.copyFileSync(path.join(src, file), path.join(dest, file));
  }
}

async function build() {
  fs.rmSync(docsDir, { recursive: true, force: true });
  fs.mkdirSync(docsDir, { recursive: true });

  for (const file of fs.readdirSync(srcDir)) {
    const src = path.join(srcDir, file);
    const dest = path.join(docsDir, file);

    if (fs.statSync(src).isDirectory()) {
      copyDir(src, dest);
    } else if (file.endsWith('.js')) {
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

  console.log('Build complete → build/docs/');
}

build().catch(err => { console.error(err); process.exit(1); });
