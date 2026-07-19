const chokidar = require('chokidar');
const { execSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');

function buildDocs() {
  try {
    execSync('bun scripts/build-docs.js', { cwd: root, stdio: 'inherit' });
  } catch (e) {
    console.error('Docs build failed');
  }
}

buildDocs();

chokidar.watch('src/docs', { cwd: root, ignoreInitial: true }).on('all', (event, file) => {
  console.log(`${event}: ${file}`);
  buildDocs();
});

console.log('Watching src/docs ...');
