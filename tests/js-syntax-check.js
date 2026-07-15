const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const jsRoot = path.join(root, 'assets', 'js');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return entry.isFile() && entry.name.endsWith('.js') ? [fullPath] : [];
  });
}

for (const file of [...walk(jsRoot), __filename]) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
}

console.log('JavaScript syntax checks passed.');
