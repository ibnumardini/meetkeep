const chokidar = require('chokidar');
const { execSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');

function build() {
  try {
    execSync('node scripts/build.js', { cwd: root, stdio: 'inherit' });
  } catch (e) {
    console.error('Build failed');
  }
}

build();

chokidar.watch(['src', 'icons'], { cwd: root, ignoreInitial: true }).on('all', (event, file) => {
  console.log(`${event}: ${file}`);
  build();
});

console.log('Watching src/ and icons/ ...');
