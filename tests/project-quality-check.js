const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const failures = [];

function walk(dir, predicate) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'test-results', 'playwright-report', '.git'].includes(entry.name)) return [];
      return walk(fullPath, predicate);
    }
    return entry.isFile() && predicate(fullPath) ? [fullPath] : [];
  });
}

const htmlFiles = walk(root, (file) => file.endsWith('.html') && !file.includes(`${path.sep}referrance${path.sep}`));

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  if (/\son[a-z]+=/i.test(html)) failures.push(`${path.relative(root, file)} has inline event handlers`);
  if (/href=["']#["']/.test(html)) failures.push(`${path.relative(root, file)} has href="#"`);
  if (!html.includes('<main id="main-content">')) failures.push(`${path.relative(root, file)} is missing main landmark`);
  if (!html.includes('class="skip-link"')) failures.push(`${path.relative(root, file)} is missing skip link`);
}

const deployIgnore = fs.readFileSync(path.join(root, '.deployignore'), 'utf8');
if (!deployIgnore.includes('referrance/')) failures.push('.deployignore must exclude referrance/');

for (const image of [
  'solarheroimg.png',
  'solarheroimg-after.png',
  'solarheroimg-before.png',
  'sol1.png',
  'sol2.png',
  'sol3.png',
  'sol4.png',
  'thin-banner.png'
]) {
  const file = path.join(root, 'assets', 'image', image);
  if (fs.existsSync(file)) failures.push(`unused oversized source image remains in deployable assets: ${image}`);
}

for (const image of [
  'solarheroimg-optimized.webp',
  'solarheroimg-after-optimized.webp',
  'solarheroimg-before-optimized.webp',
  'thin-banner-optimized.webp'
]) {
  const file = path.join(root, 'assets', 'image', image);
  if (!fs.existsSync(file)) failures.push(`optimized image missing: ${image}`);
}

if (!fs.existsSync(path.join(root, 'docs', 'frontend-architecture.md'))) {
  failures.push('frontend architecture documentation is missing');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Project quality checks passed.');
