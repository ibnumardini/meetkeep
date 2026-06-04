const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const buildDir = path.join(root, 'build');
const iconsDir = path.join(buildDir, 'icons');

fs.rmSync(buildDir, { recursive: true, force: true });
fs.mkdirSync(iconsDir, { recursive: true });

for (const file of fs.readdirSync(path.join(root, 'src'))) {
  fs.copyFileSync(path.join(root, 'src', file), path.join(buildDir, file));
}
for (const file of fs.readdirSync(path.join(root, 'icons'))) {
  fs.copyFileSync(path.join(root, 'icons', file), path.join(iconsDir, file));
}

console.log('Build complete → build/');
