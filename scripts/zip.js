const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const browser = process.argv.includes('-b') ? process.argv[process.argv.indexOf('-b') + 1] : 'chrome';
const { version } = require(path.join(root, 'package.json'));

execSync(`bunx wxt zip -b ${browser}`, { cwd: root, stdio: 'inherit' });

const outputDir = path.join(root, '.output');
const zipFile = `meetkeep-${version}-${browser}.zip`;
if (!fs.existsSync(path.join(outputDir, zipFile))) {
  throw new Error(`Expected zip "${zipFile}" not found in .output/`);
}

const distDir = path.join(root, 'dist');
fs.mkdirSync(distDir, { recursive: true });
fs.copyFileSync(path.join(outputDir, zipFile), path.join(distDir, zipFile));

console.log(`Copied → dist/${zipFile}`);
