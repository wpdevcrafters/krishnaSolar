const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const calculatorsDir = path.join(root, 'calculators');
const calculatorJsDir = path.join(root, 'assets', 'js', 'calculator-js');

const pages = fs.readdirSync(calculatorsDir)
  .filter((file) => file.endsWith('.html'))
  .sort();

const failures = [];

for (const page of pages) {
  const pagePath = path.join(calculatorsDir, page);
  const html = fs.readFileSync(pagePath, 'utf8');
  const jsName = page.replace(/\.html$/, '.js');
  const jsPath = path.join(calculatorJsDir, jsName);

  if (!html.includes('<main id="main-content">')) {
    failures.push(`${page}: missing main landmark`);
  }

  if (/\son[a-z]+=/i.test(html)) {
    failures.push(`${page}: contains inline event handler`);
  }

  const hasInteractiveResult = /<form\b|id="calc-results"|id="result-box"|id="result-section"/i.test(html);

  if (hasInteractiveResult && !/aria-live="polite"/.test(html)) {
    failures.push(`${page}: missing polite result live region`);
  }

  if (fs.existsSync(jsPath)) {
    require('child_process').execFileSync(process.execPath, ['--check', jsPath], { stdio: 'pipe' });
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Calculator smoke checks passed for ${pages.length} pages.`);
