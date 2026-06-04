const { ZipArchive } = require('archiver');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src', 'manifest.json'), 'utf-8'));
const version = manifest.version;

const distDir = path.join(root, 'dist');
fs.mkdirSync(distDir, { recursive: true });

const zipName = `meetkeep-v${version}.zip`;
const output = fs.createWriteStream(path.join(distDir, zipName));
const archive = new ZipArchive({ zlib: { level: 9 } });

output.on('close', () => console.log(`dist/${zipName} created (${archive.pointer()} bytes)`));
archive.on('error', (err) => { throw err; });

archive.pipe(output);
archive.directory(path.join(root, 'build'), false);
archive.finalize();
